"use client";
import { createContext } from "@/lib/react-utils";
import { PropsWithChildren, useState } from "react";
import "dotenv/config";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

export function useWSController() {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const session = authClient.useSession();
  const userId = session.data?.user?.id;
  const queryClient = useQueryClient();
  const [wsMessage, setWsMessage] = useState<any>(null);

  const connectWebSocket = () => {
    if (!userId) return;

    ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    ws.current.onopen = () => {
      console.log("✅ WebSocket connected");
      queryClient.invalidateQueries({ queryKey: ["messages-query"] });

      // Send register message with userId
      ws.current?.send(
        JSON.stringify({
          type: "register",
          userId,
        })
      );
    };

    ws.current.onmessage = (event) => {
      console.log("📨 Message received:", event.data);
      setWsMessage(JSON.parse(event.data));
    };

    ws.current.onclose = () => {
      console.log("❌ WebSocket disconnected. Reconnecting in 5 seconds...");

      // Clear any existing reconnect timers
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }

      // Retry connection in 5 seconds
      reconnectTimer.current = setTimeout(() => {
        connectWebSocket();
      }, 5000);
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      ws.current?.close();
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, [userId]);

  const sendMessage = (message: any) => {
    ws.current?.send(JSON.stringify(message));
  };

  return { sendMessage, ws, wsMessage, setWsMessage };
}

const [Context, useWSContext] =
  createContext<ReturnType<typeof useWSController>>();

export function WSProvider({ children }: PropsWithChildren) {
  return <Context value={useWSController()}>{children}</Context>;
}

export { useWSContext };
