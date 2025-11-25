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
   *  📞 START CALL
   * =============================== */
  async function startCall(lang: string = "ko") {
    if (isConnecting || isConnected) return;
    setIsConnecting(true);

    try {
      console.log(`[Realtime] Starting call for language: ${lang}`);

      // 오디오 안정화
      const audioContext = new AudioContext();
      await audioContext.resume();
      console.log("[Realtime] AudioContext resumed");

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        console.log("[Realtime] Waiting for audio stabilization…");
        await new Promise((r) => setTimeout(r, 1500));
      }

      // 서버에서 ephemeral key 가져오기
      const tokenRes = await fetch(`/session/${lang}`);
      const data = await tokenRes.json();
      const EPHEMERAL_KEY: string | undefined = data?.client_secret?.value;

      if (!EPHEMERAL_KEY)
        throw new Error("No ephemeral key received from server");

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

      // ====== 오디오 출력 ======
      const audio = new Audio();
      audio.autoplay = true;
      audio.volume = 0.9;
      audioRef.current = audio;

      pc.ontrack = (event) => {
        const stream = event.streams[0];
        if (stream) {
          audio.srcObject = stream;
          audio.play().catch((e) => console.warn("Audio play failed:", e));
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

      // ====== 마이크 입력 ======
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // 브라우저 지원 가능할 때만 적용됨
          // @ts-ignore
          voiceIsolation: true,
          channelCount: 1,
        },
      });

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // ====== DataChannel ======
      const ch = pc.createDataChannel("response");
      channelRef.current = ch;

      ch.onopen = () => {
        console.log("[Realtime] Data channel open");

        /** =========================
         *  — 서버 VAD 설정 둔감하게
         *  — Whisper transcription 활성화
         *  — tools 등록 포함
         * ========================= */
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

        // ====== AI 인사 메시지 & 초기 응답 (현재 너 로직 유지) ======
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

      // ====== AI → function_call 처리 ======
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
   *  📞 END CALL
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

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.srcObject = null;
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
