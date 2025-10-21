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

  async function startCall() {
    setIsConnecting(true);
    try {
      // ✅ 서버에서 session 생성
      const tokenRes = await fetch("/session");
      const data = await tokenRes.json();
      const EPHEMERAL_KEY: string | undefined = data?.client_secret?.value;
      if (!EPHEMERAL_KEY)
        throw new Error("No ephemeral key received from server");

      const pc = new RTCPeerConnection();
      peerRef.current = pc;

      // 🎧 오디오 출력 설정
      const audio = new Audio();
      audio.autoplay = true;
      pc.ontrack = (event) => (audio.srcObject = event.streams[0]);

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          console.log("✅ 연결 성공");
        }
      };

      // 🎙️ 마이크 스트림 추가
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // 💬 데이터 채널 생성
      const ch = pc.createDataChannel("response");
      channelRef.current = ch;

      ch.onopen = () => {
        console.log("✅ 데이터 채널 open");

        // ✅ 서버의 instructions, voice는 그대로 두고 tools만 추가
        ch.send(
          JSON.stringify({
            type: "session.update",
            session: {
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

        // 약간 지연 후 직접 인사 멘트 요청 (AI에게 “말해라”)
        setTimeout(() => {
          ch.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: "통화가 연결되었습니다. 사용자에게 밝은톤으로 '안녕하세요. 20주년 시흥갯골축제에 대해 궁금한 게 있으신가요?' 라고 인사해주세요.",
                  },
                ],
              },
            })
          );

          ch.send(JSON.stringify({ type: "response.create" }));
        }, 800); // 0.8초 지연
      };

      // ✅ 함수 호출 처리
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
          console.error("Data channel error:", error);
        }
      };

      // 🔄 Offer/Answer 교환
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await waitForIceGatheringComplete(pc);

      const model = "gpt-4o-realtime-preview-2024-12-17";
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
    } catch (error) {
      console.error("startCall error:", error);
    } finally {
      setIsConnecting(false);
    }
  }

  function endCall() {
    peerRef.current?.close();
    channelRef.current = null;
    setIsConnected(false);
  }

  return { startCall, endCall, isConnecting, isConnected };
}

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
