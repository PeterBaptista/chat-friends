"use client";

import type React from "react";

import { Message, MessageList } from "@/components/message-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import axiosClient from "@/lib/axios-client";
import { useWSContext } from "@/modules/chat/context/ws-context";
import shadcnAvatar from "@/public/shadcn-avatar.png";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, Send } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";


function MessageInput({
  handleSendMessage,
  disabled = false,
}: {
  handleSendMessage: (
    e: React.FormEvent,
    newMessage: string,
    setNewMessage: (value: string) => void
  ) => void;
  disabled?: boolean;
}) {
  const [newMessage, setNewMessage] = useState("");
  return (
    <div className="p-4 border-t z-20 bg-white dark:bg-neutral-900">
      <form
        onSubmit={(e) => handleSendMessage(e, newMessage, setNewMessage)}
        className="flex space-x-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1"
          disabled={disabled}
        />
        <Button type="submit" size="icon" disabled={disabled}>
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const searchParams = useSearchParams();

  const userIdParam = searchParams.get("userId");

  const { sendMessage, ws, wsMessage } = useWSContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (
      wsMessage?.type === "message" &&
      wsMessage.userToId === userId &&
      wsMessage.userFromId === userIdParam
    ) {
      setMessages((prev) => {
        return [...prev, wsMessage];
      });
      queryClient.invalidateQueries({ queryKey: ["messages-query"] });
    }

    if (wsMessage?.type === "message-cancel") {
      setMessages((prev) => {
        return prev.filter((msg) => msg.id !== wsMessage.id);
      });
      queryClient.invalidateQueries({ queryKey: ["messages-query"] });
    }
  }, [wsMessage]);

  const userQuery = useQuery({
    queryKey: ["user", userIdParam],
    queryFn: async () => {
      const { data } = await axiosClient.get(`/users/${userIdParam}`);
      return data ?? [];
    },
    enabled: !!userIdParam,
  });

  const [messages, setMessages] = useState<Message[]>([]);

  const isMobile = useIsMobile();

  const handleSendMessage = (
    e: React.FormEvent,
    newMessage: string,
    setNewMessage: (value: string) => void
  ) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !userIdParam) return;

    const newMsg = {
      id: uuid(),
      sendAt: new Date().toISOString(),
      userFromId: userId!,
      userToId: userIdParam!,
      content: newMessage,
      type: "message",
    };

    // The sendMessage is now handled in the MessageList component
    // We just need to send the message to the server
    sendMessage(newMsg);
    setMessages((prev) => {
      return [...prev, newMsg];
    });
    setNewMessage("");
  };
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex body-height bg-transparent  ">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b bg-white z-20 flex items-center dark:bg-neutral-900">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => {
              toggleSidebar();
            }}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={userQuery.data?.image || "/placeholder.svg"}
              alt={userQuery.data?.name || ""}
            />
            <AvatarFallback className="overflow-hidden">
              <Image
                src={shadcnAvatar}
                alt="Shadcn Avatar"
                sizes="100%"
                className="overflow-hidden "
              />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{userQuery.data?.name || ""}</h3>
          </div>
        </div>

        {/* Messages area */}
        <MessageList
          selectedUser={userQuery.data}
          userId={userId!}
          messages={messages}
          setMessages={setMessages}
        />

        {/* Message input */}
        <MessageInput
          handleSendMessage={handleSendMessage}
          disabled={!userQuery.data}
        />
      </div>
    </div>
  );
}
