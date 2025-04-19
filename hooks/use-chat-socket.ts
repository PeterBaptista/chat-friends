import "dotenv/config";
import { useEffect, useRef } from "react";

export const useChatSocket = (
  userId?: string,
  onMessage?: (msg: string) => void
) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;
    ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");

      // Send register message with userId
      ws.current?.send(
        JSON.stringify({
          type: "register",
          userId,
        })
      );
    };

    ws.current.onmessage = (event) => {
      onMessage?.(event.data);
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, [userId]);

  const sendMessage = (message: any) => {
    ws.current?.send(JSON.stringify(message));
  };

  return { sendMessage };
};
