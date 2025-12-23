import { useRef, useState } from "react";

type FnMap = {
  navigateSection: (args: { section: string }) => {
    success: boolean;
    section?: string;
  };
};

export function useRealtimeAI() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fns: FnMap = {
    navigateSection: ({ section }) => {
      const el = document.getElementById(section);
      if (!el) return { success: false };

      const rect = el.getBoundingClientRect();
      const offset =
        rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2;

      window.scrollTo({ top: offset, behavior: "smooth" });

      return { success: true, section };
    },
  };

  /** ===============================
   * 📞 START CALL
   * =============================== */
  async function startCall(lang: string = "ko") {
    if (isConnecting || isConnected) return;
    setIsConnecting(true);

    try {
      console.log(`[Realtime] 1. Starting call for language: ${lang}`);

      // 1. 마이크 권한 요청 & 토큰 발급 병렬 시작 (제스처 유효 시간 확보)
      const streamPromise = navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      const tokenPromise = fetch(`/session/${lang}`).then((res) => res.json());

      console.log("[Realtime] 2. Waiting for permissions and token...");

      // 2. 대기
      const [stream, data] = await Promise.all([streamPromise, tokenPromise]);

      console.log("[Realtime] 3. Permissions granted & Token received");

      const EPHEMERAL_KEY: string | undefined = data?.client_secret?.value;
      if (!EPHEMERAL_KEY)
        throw new Error("No ephemeral key received from server");

      // 3. Audio Element DOM 부착 (안드로이드 정책 우회)
      let audioEl = audioRef.current;
      if (!audioEl) {
        audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        audioEl.style.display = "none";
        document.body.appendChild(audioEl);
        audioRef.current = audioEl;
      }

      // WebRTC Peer 생성
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
      });
      peerRef.current = pc;

      // 트랙 수신 시 재생
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (audioEl && remoteStream) {
          console.log("[Realtime] Audio track received");
          audioEl.srcObject = remoteStream;
          audioEl.play().catch((e) => console.warn("Audio play failed:", e));
        }
      };

      // 마이크 트랙 추가
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // DataChannel 설정
      const ch = pc.createDataChannel("response");
      channelRef.current = ch;

      ch.onopen = () => {
        console.log("[Realtime] Data channel open");

        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            turn_detection: {
              type: "server_vad",
              threshold: 0.7,
              prefix_padding_ms: 300,
              silence_duration_ms: 800,
            },
            input_audio_transcription: { model: "whisper-1" },
            tools: [
              {
                type: "function",
                name: "navigateSection",
                description:
                  "Scroll page smoothly to a section (info, announcements, gallery, food, location, program, goods)",
                parameters: {
                  type: "object",
                  properties: {
                    section: {
                      type: "string",
                      enum: [
                        "info",
                        "announcements",
                        "gallery",
                        "food",
                        "location",
                        "program",
                        "goods",
                      ],
                    },
                  },
                  required: ["section"],
                },
              },
            ],
          },
        };
        ch.send(JSON.stringify(sessionUpdateEvent));

        setTimeout(() => {
          ch.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "system",
                content: [
                  {
                    type: "input_text",
                    text:
                      lang === "en"
                        ? "The call is connected. After preparing your initial response, please say 'Hello! How can I help you with the Siheung Gaetgol Festival?'"
                        : lang === "ja"
                        ? "通話が接続されました。準備が完了したら…"
                        : lang === "zh"
                        ? "通话已连接。请打招呼。"
                        : "통화가 연결되었습니다. 초기 응답 준비 후 인사해주세요.",
                  },
                ],
              },
            })
          );
          ch.send(JSON.stringify({ type: "response.create" }));
        }, 700);
      };

      ch.onmessage = async (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (
            msg.type === "response.function_call_arguments.done" &&
            msg.name in fns
          ) {
            const fn = fns[msg.name as keyof FnMap];
            const args = JSON.parse(msg.arguments);
            const result = fn(args);
            ch.send(
              JSON.stringify({
                type: "conversation.item.create",
                item: {
                  type: "function_call_output",
                  call_id: msg.call_id,
                  output: JSON.stringify(result),
                },
              })
            );
            ch.send(JSON.stringify({ type: "response.create" }));
          }
        } catch (e) {
          console.error(e);
        }
      };

      // SDP Offer 생성
      console.log("[Realtime] 4. Creating Offer...");
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("[Realtime] 5. Waiting for ICE Candidates...");

      // ✅ [핵심] ICE Gathering 타임아웃 적용 (최대 2초 대기)
      await waitForIceGatheringComplete(pc);

      console.log("[Realtime] 6. Sending SDP to OpenAI...");

      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2025-06-03";

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        throw new Error(`Server responded with ${sdpResponse.status}`);
      }

      console.log("[Realtime] 7. Received Answer SDP");
      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setIsConnected(true);
      console.log("[Realtime] ✅ Connected successfully!");
    } catch (error) {
      console.error("[Realtime] startCall error:", error);
      alert(
        `연결 오류: ${error instanceof Error ? error.message : "알 수 없음"}`
      );
      endCall();
    } finally {
      setIsConnecting(false);
    }
  }

  function endCall() {
    console.log("[Realtime] Ending call…");
    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.getSenders().forEach((s) => s.track?.stop());
      peerRef.current.close();
      peerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
      if (audioRef.current.parentNode) {
        audioRef.current.parentNode.removeChild(audioRef.current);
      }
      audioRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }

  return { startCall, endCall, isConnecting, isConnected };
}

/** * ICE Gathering 완료 대기 함수 (타임아웃 추가 버전)
 */
function waitForIceGatheringComplete(pc: RTCPeerConnection): Promise<void> {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") {
      resolve();
      return;
    }

    const check = () => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", check);
        resolve();
      }
    };

    pc.addEventListener("icegatheringstatechange", check);

    // ⏳ 2초가 지나도 완료 안 되면 강제 진행
    setTimeout(() => {
      if (pc.iceGatheringState !== "complete") {
        console.warn(
          "[Realtime] ICE gathering timed out, proceeding anyway..."
        );
        pc.removeEventListener("icegatheringstatechange", check);
        resolve();
      }
    }, 2000);
  });
}
