"use client";

import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { useChatSocket } from "@/hooks/use-chat-socket";
import type { User } from "better-auth/types";

export interface Message {
  id: string;
  sendAt: string;
  userFromId: string;
  userToId: string;
  content: string;
}

interface MessageListProps {
  selectedUser?: User;
  userId: string;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export function MessageList({
  selectedUser,
  userId,
  messages,
  setMessages,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["messages", selectedUser?.id],
    queryFn: async () => {
      if (!selectedUser) return [];
      const { data } = await axiosClient.get(`messages`);
      return data ?? [];
    },
    staleTime: Infinity,
    enabled: !!selectedUser,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  // Atualiza localmente sem invalidar a query

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedUser) {
    return (
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Nenhum usuário selecionado</p>
            <p className="text-sm">
              Selecione um usuário para iniciar uma conversa
            </p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  if (isLoading) {
    return (
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">Carregando mensagens...</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.userFromId === userId ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-lg p-3",
                message.userFromId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              )}
            >
              <p>{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-1",
                  message.userFromId === userId
                    ? "text-blue-100"
                    : "text-gray-500"
                )}
              >
                {message.sendAt}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
