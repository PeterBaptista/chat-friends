"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import axiosClient from "@/lib/axios-client";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { User } from "better-auth/types";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";

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
      const { data } = await axiosClient.get(`messages/${selectedUser.id}`);
      return data ?? [];
    },
    staleTime: Infinity,
    enabled: !!selectedUser?.id,
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  // Atualiza localmente sem invalidar a query

  if (!selectedUser?.id) {
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
    <div className="space-y-4 flex flex-1 flex-col-reverse overflow-auto px-4 max-w-[100vw] ">
      {messages
        .sort(
          (a, b) => new Date(b.sendAt).getTime() - new Date(a.sendAt).getTime()
        )
        .map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.userFromId === userId ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg p-3",
                message.userFromId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              )}
            >
              <p className="wrap-break-word">{message.content}</p>
              <p
                className={cn(
                  "text-xs mt-1 flex justify-between gap-4",
                  message.userFromId === userId
                    ? "text-blue-100"
                    : "text-gray-500"
                )}
              >

                <span>

                    
                  {(() => {
                    const date = new Date(message.sendAt);
                    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
                  })()}

                </span>
                <span>

                  
                  {(() => {
                    const date = new Date(message.sendAt);
                    return date.getDay().toString().padStart(2, '0') + '/' + date.getMonth().toString().padStart(2, '0') + '/' + date.getFullYear().toString().padStart(2, '0');
                  })()}

                </span>

              </p>
            </div>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
