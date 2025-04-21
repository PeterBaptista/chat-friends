"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Send, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { v4 as uuid } from "uuid";
import { authClient } from "@/lib/auth-client";
import type { User } from "better-auth/types";
import { Message, MessageList } from "@/components/message-list";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useSidebar } from "@/components/ui/sidebar";

// Mock data for users

// Mock data for messages

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const { sendMessage } = useChatSocket(userId, (newMessage: string) => {
    const message = JSON.parse(newMessage);

    setMessages((prev) => {
      return [...prev, message];
    });
  });

  const handleSendMessage = (
    e: React.FormEvent,
    newMessage: string,
    setNewMessage: (value: string) => void
  ) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedUser) return;

    const newMsg = {
      id: uuid(),
      sendAt: new Date().toISOString(),
      userFromId: userId!,
      userToId: selectedUser?.id,
      content: newMessage,
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
        <MessageList
          selectedUser={selectedUser}
          userId={userId!}
          messages={messages}
          setMessages={setMessages}
        />

        {/* Message input */}
        <MessageInput
          handleSendMessage={handleSendMessage}
          disabled={!selectedUser}
        />
      </div>
    </div>
  );
}
