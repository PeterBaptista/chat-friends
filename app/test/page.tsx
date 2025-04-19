"use client";
import { useState, useEffect } from "react";

import { useChatSocket } from "@/hooks/use-chat-socket";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function MessageInput({ handleSend }: { handleSend: (input: string) => void }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        onClick={() => {
          handleSend(input);

          setInput("");
        }}
      >
        Enviar
      </Button>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  // Carrega as mensagens iniciais só uma vez
  const { data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await axiosClient.get(`messages`);

      return data ?? [];
    },
  });

  useEffect(() => {
    setMessages(data);
  }, [data]);
  // Atualiza localmente sem invalidar a query
  const { sendMessage } = useChatSocket((newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  });

  const handleSend = (input: string) => {
    if (input.trim()) {
      sendMessage(input);
    }
  };

  return (
    <div className="flex flex-col min-h-96">
      <div>
        {messages?.map((msg) => (
          <p key={msg.id}>{msg.content}</p>
        ))}
      </div>
      <MessageInput handleSend={handleSend} />
    </div>
  );
}
