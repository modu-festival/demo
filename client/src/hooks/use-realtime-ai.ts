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
      console.log(`[Realtime] Starting call for language: ${lang}`);

      // 1. [중요] 안드로이드 권한 이슈 해결을 위해 마이크 요청과 토큰 요청을 병렬 시작
      // 사용자의 클릭 이벤트 컨텍스트가 사라지기 전에 마이크 권한을 요청해야 함
      const streamPromise = navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      const tokenPromise = fetch(`/session/${lang}`).then((res) => res.json());

      // 2. 두 요청이 모두 완료될 때까지 대기
      const [stream, data] = await Promise.all([streamPromise, tokenPromise]);

      // 오디오 안정화 (모바일)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        // 마이크 스트림을 얻은 후 잠시 대기 (선택사항, 필요 없으면 제거 가능)
        // await new Promise((r) => setTimeout(r, 500));
      }

      const EPHEMERAL_KEY: string | undefined = data?.client_secret?.value;
      if (!EPHEMERAL_KEY)
        throw new Error("No ephemeral key received from server");

      // 3. [중요] Audio Element를 DOM에 강제 부착 (안드로이드 재생 정책 우회)
      let audioEl = audioRef.current;
      if (!audioEl) {
        audioEl = document.createElement("audio");
        audioEl.autoplay = true;
        // 화면에는 보이지 않게 처리
        audioEl.style.display = "none";
        document.body.appendChild(audioEl);
        audioRef.current = audioEl;
      }

      // WebRTC Peer
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
        bundlePolicy: "max-bundle",
        rtcpMuxPolicy: "require",
      });
      peerRef.current = pc;

      // 오디오 트랙 수신 시 재생
      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (audioEl && remoteStream) {
          audioEl.srcObject = remoteStream;
          audioEl.play().catch((e) => console.warn("Audio play failed:", e));
        }
      };

      pc.onconnectionstatechange = () => {
        console.log("[Realtime] Connection state:", pc.connectionState);
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "disconnected"
        ) {
          endCall();
        }
      };

      // 획득한 마이크 스트림을 PeerConnection에 추가
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // ====== DataChannel ======
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
            input_audio_transcription: {
              model: "whisper-1",
            },
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
                        ? "通话已连接。准备好后…"
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
        } catch (error) {
          console.error("[Realtime] Data channel message error:", error);
        }
      };

      // ====== SDP Offer / Answer ======
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // ICE Gathering 대기 (필요시)
      await waitForIceGatheringComplete(pc);

      const model = "gpt-4o-realtime-preview-2025-06-03";

      const sdpResponse = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };

      await pc.setRemoteDescription(answer);

      setIsConnected(true);
      console.log("[Realtime] Connected successfully");
    } catch (error) {
      console.error("[Realtime] startCall error:", error);
      endCall();
    } finally {
      setIsConnecting(false);
    }
  }

  /** ===============================
   * 📞 END CALL
   * =============================== */
  function endCall() {
    console.log("[Realtime] Ending call…");

    try {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }

      if (peerRef.current) {
        peerRef.current.getSenders().forEach((s) => s.track?.stop());
        peerRef.current.close();
        peerRef.current = null;
      }

      // [중요] 오디오 엘리먼트 정리 및 DOM 제거
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject = null;
        if (audioRef.current.parentNode) {
          audioRef.current.parentNode.removeChild(audioRef.current);
        }
        audioRef.current = null;
      }
    } catch (err) {
      console.warn("[Realtime] endCall cleanup error:", err);
    }

    setIsConnected(false);
    setIsConnecting(false);
  }

  return { startCall, endCall, isConnecting, isConnected };
}

/** ICE Gathering 완료 대기 */
function waitForIceGatheringComplete(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    const check = () => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", check);
        resolve();
      }
    };
    pc.addEventListener("icegatheringstatechange", check);
  });
}
