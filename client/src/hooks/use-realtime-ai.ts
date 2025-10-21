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

      const rect = el.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;

      const offset = elementTop - window.innerHeight / 2 + elementHeight / 2; // 화면 중앙 정렬

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });

      return { success: true, section };
    },
  };

  async function startCall() {
    setIsConnecting(true);

    // 연결 사운드
    const ring = new Audio("/ring.mp3");
    ring.loop = true;
    ring.play().catch((err) => console.warn("Ring sound play failed:", err));
    ringRef.current = ring;

    try {
      const tokenRes = await fetch("/session");
      const data = await tokenRes.json();
      const EPHEMERAL_KEY: string | undefined = data?.client_secret?.value;
      if (!EPHEMERAL_KEY)
        throw new Error("No ephemeral key received from server");

      const pc = new RTCPeerConnection();
      peerRef.current = pc;

      const audio = new Audio();
      audio.autoplay = true;
      pc.ontrack = (event) => {
        audio.srcObject = event.streams[0];
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          ring.pause();
          ring.currentTime = 0;
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const ch = pc.createDataChannel("response");
      channelRef.current = ch;

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

  function endCall() {
    peerRef.current?.close();
    ringRef.current?.pause();
    setIsConnected(false);
  }

  return { startCall, endCall, isConnecting, isConnected };
}

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
