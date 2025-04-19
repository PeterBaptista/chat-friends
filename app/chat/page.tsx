"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import type React from "react";

import { useEffect, useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { v4 as uuid } from "uuid";
import { authClient } from "@/lib/auth-client";
import type { User } from "better-auth/types";

// Mock data for users

// Mock data for messages

function MessageInput({
  handleSendMessage,
}: {
  handleSendMessage: (
    e: React.FormEvent,
    newMessage: string,
    setNewMessage: (value: string) => void
  ) => void;
}) {
  const [newMessage, setNewMessage] = useState("");
  return (
    <div className="p-4 border-t bg-white">
      <form
        onSubmit={(e) => handleSendMessage(e, newMessage, setNewMessage)}
        className="flex space-x-2"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/users", {
        params: {
          userId: userId,
        },
      });
      return data ?? [];
    },
    enabled: !!userId,
  });
  const [selectedUser, setSelectedUser] = useState<User>();

  const [messages, setMessages] = useState<any[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const { data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await axiosClient.get(`messages`);
      console.log("query", data);
      return data ?? [];
    },
  });

  useEffect(() => {
    console.log("data", data);
    setMessages(data ?? []);
  }, [data]);
  // Atualiza localmente sem invalidar a query
  const { sendMessage } = useChatSocket(userId!, (newMessage: string) => {
    const message = JSON.parse(newMessage);
    console.log("newMessage");
    setMessages((prev) => {
      return [...prev, message];
    });
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (
    e: React.FormEvent,
    newMessage: string,
    setNewMessage: (value: string) => void
  ) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: uuid(),
      sendAt: new Date().toISOString(),
      userFromId: userId!,
      userToId: selectedUser?.id,
      content: newMessage,
    };
    console.log("newMessage", newMsg);
    setMessages((prev) => {
      return [...prev, newMsg];
    });

    console.log("newMsg", newMsg);
    sendMessage(newMsg);

    setNewMessage("");
  };

  console.log("messages", messages);
  console.log("userId", userId);
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for user selection */}
      <div
        className={cn(
          "bg-white border-r w-80 flex-shrink-0 transition-all duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-ml-80" : "ml-0"
        )}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Conversas</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-65px)]">
          {usersQuery.data?.map((user: User) => (
            <div
              key={user.id}
              className={cn(
                "p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-100",
                selectedUser?.id === user.id && "bg-gray-100"
              )}
              onClick={() => {
                setSelectedUser(user);
                if (isMobile) setSidebarOpen(false);
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b bg-white flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src={selectedUser?.image || "/placeholder.svg"}
              alt={selectedUser?.name || ""}
            />
            <AvatarFallback>
              {selectedUser?.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{selectedUser?.name || ""}</h3>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message?.userFromId === userId
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    message?.userFromId === userId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  )}
                >
                  <p>{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message?.userFromId === userId
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

        {/* Message input */}
        <MessageInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
