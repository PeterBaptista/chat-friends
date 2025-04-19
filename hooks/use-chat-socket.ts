import { useEffect, useRef } from "react";

export const useChatSocket = (onMessage: (msg: any) => void) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      onMessage(event.data);
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = (message: any) => {
    ws.current?.send(JSON.stringify(message));
  };

  return { sendMessage };
};
