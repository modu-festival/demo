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
  const ringRef = useRef<HTMLAudioElement | null>(null);

  /**
   * ✅ AI가 호출 가능한 함수 (scroll 보정 포함)
   */
  const fns: FnMap = {
    navigateSection: ({ section }) => {
      const el = document.getElementById(section);
      if (!el) return { success: false };

      // 화면 중앙 정렬 스크롤
      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;
      const offset = elementTop - window.innerHeight / 2 + elementHeight / 2;

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });

      return { success: true, section };
    },
  };

  /**
   * ✅ AI 상담 연결 시작 (WebRTC)
   */
  async function startCall() {
    setIsConnecting(true);

    // 🔊 연결 사운드 시작
    const ring = new Audio("/ring.mp3");
    ring.loop = true;
    ring.play().catch((err) => console.warn("Ring sound play failed:", err));
    ringRef.current = ring;

    try {
      // 서버에서 ephemeral key 발급
      const tokenRes = await fetch("/session");
      const data = await tokenRes.json();
      const EPHEMERAL_KEY: string | undefined = data?.client_secret?.value;
      if (!EPHEMERAL_KEY)
        throw new Error("No ephemeral key received from server");

      // WebRTC 연결 준비
      const pc = new RTCPeerConnection();
      peerRef.current = pc;

      // AI 오디오 출력용
      const audio = new Audio();
      audio.autoplay = true;
      pc.ontrack = (event) => {
        audio.srcObject = event.streams[0];
      };

      /**
       * ✅ 연결 성공 시 링음 정지 + 인사 멘트 전송
       */
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          ring.pause();
          ring.currentTime = 0;

          // 👋 인사 멘트 전송 (음성 + 텍스트 동시 출력)
          const greeting =
            "안녕하세요. 20주년 시흥갯골축제에 대해 궁금한 게 있으신가요?";
          channelRef.current?.send(
            JSON.stringify({
              type: "response.create",
              response: {
                instructions: greeting,
              },
            })
          );
        }
      };

      // 🎙️ 마이크 오디오 추가
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 데이터 채널 생성
      const ch = pc.createDataChannel("response");
      channelRef.current = ch;

      /**
       * ✅ 세션 설정 전송
       */
      ch.onopen = () => {
        ch.send(
          JSON.stringify({
            type: "session.update",
            session: {
              modalities: ["audio", "text"],
              voice: "alloy",
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
          })
        );
      };

      /**
       * ✅ 함수 호출 처리
       */
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

            // 함수 실행 결과 전달
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

            // 다음 응답 트리거
            ch.send(JSON.stringify({ type: "response.create" }));
          }
        } catch (error) {
          console.error("Data channel error:", error);
        }
      };

      /**
       * Offer → Answer 교환
       */
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGatheringComplete(pc);

      const apiUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      const sdpResponse = await fetch(`${apiUrl}?model=${model}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpResponse.text(),
      };
      await pc.setRemoteDescription(answer);

      setIsConnected(true);
    } catch (error) {
      console.error("startCall error:", error);
      ring.pause();
    } finally {
      setIsConnecting(false);
    }
  }

  /**
   * ✅ 통화 종료
   */
  function endCall() {
    peerRef.current?.close();
    ringRef.current?.pause();
    ringRef.current = null;
    channelRef.current = null;
    setIsConnected(false);
  }

  return { startCall, endCall, isConnecting, isConnected };
}

/**
 * ICE Gathering 완료 대기
 */
function waitForIceGatheringComplete(pc: RTCPeerConnection): Promise<void> {
  if (pc.iceGatheringState === "complete") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const checkState = () => {
      if (pc.iceGatheringState === "complete") {
        pc.removeEventListener("icegatheringstatechange", checkState);
        resolve();
      }
    };
    pc.addEventListener("icegatheringstatechange", checkState);
  });
}
