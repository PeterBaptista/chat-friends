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
import { useChatSocket } from "@/hooks/use-chat-socket";

// Mock data for users
const users = [
  {
    id: 1,
    name: "João Silva",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
    lastMessage: "Olá, tudo bem?",
    lastMessageTime: "10:30",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
    lastMessage: "Vamos marcar uma reunião?",
    lastMessageTime: "09:15",
  },
  {
    id: 3,
    name: "Pedro Santos",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    lastMessage: "Obrigado pela ajuda!",
    lastMessageTime: "Ontem",
  },
  {
    id: 4,
    name: "Ana Costa",
    avatar: "/placeholder.svg?height=40&width=40",
    online: true,
    lastMessage: "Já enviei o documento.",
    lastMessageTime: "08:45",
  },
  {
    id: 5,
    name: "Carlos Ferreira",
    avatar: "/placeholder.svg?height=40&width=40",
    online: false,
    lastMessage: "Vamos conversar amanhã.",
    lastMessageTime: "Ontem",
  },
];

// Mock data for messages
const mockMessages = [
  {
    id: "new",
    userId: "pp6nEJlR1XMcyxULQNEcSsFsIDLwITRw",
    content: "Olá, tudo bem?",
    sendAt: new Date(),
    isMe: false,
  },
  {
    id: "new1",
    userId: "pp6nEJlR1XMcyxULQNEcSsFsIDLwITRw",
    content: "Estou precisando de ajuda com um projeto.",
    sendAt: new Date(),
    isMe: false,
  },
  {
    id: "new3",
    userId: "pp6nEJlR1XMcyxULQNEcSsFsIDLwITRw",
    content: "Sim, claro! Em que posso ajudar?",
    sendAt: new Date(),
    isMe: true,
  },
  {
    id: "new4",
    userId: "pp6nEJlR1XMcyxULQNEcSsFsIDLwITRw",
    content: "Preciso de algumas ideias para um novo design.",
    sendAt: new Date(),
    isMe: false,
  },
  {
    id: "new5",
    userId: "pp6nEJlR1XMcyxULQNEcSsFsIDLwITRw",
    content: "Posso te mostrar alguns exemplos que fiz recentemente.",
    sendAt: new Date(),
    isMe: true,
  },
];

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
  const [selectedUser, setSelectedUser] = useState(users[0]);
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
  const { sendMessage } = useChatSocket((newMessage) => {
    console.log("newMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]);
  });

  console.log("renderizei");

  const handleSendMessage = (
    e: React.FormEvent,
    newMessage: string,
    setNewMessage: (value: string) => void
  ) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      sendAt: new Date(),
      userFromId: "pp6nEJlR1XMcyxULQNEcSsFsIDLwITRw",
      userToId: "iJSWyzhGoaDAeoPtvgCmSETbRFbdoXAJ",
      content: newMessage,
    };
    sendMessage(newMsg);

    setNewMessage("");
  };

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
          {users.map((user) => (
            <div
              key={user.id}
              className={cn(
                "p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-100",
                selectedUser.id === user.id && "bg-gray-100"
              )}
              onClick={() => {
                setSelectedUser(user);
                if (isMobile) setSidebarOpen(false);
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {user.lastMessage}
                </p>
              </div>
              <span className="text-xs text-gray-500">
                {user.lastMessageTime}
              </span>
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
              src={selectedUser.avatar || "/placeholder.svg"}
              alt={selectedUser.name}
            />
            <AvatarFallback>
              {selectedUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p className="text-xs text-gray-500">
              {selectedUser.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message?.isMe ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    message?.isMe
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  )}
                >
                  <p>{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message?.isMe ? "text-blue-100" : "text-gray-500"
                    )}
                  >
                    {message.sendAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <MessageInput handleSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
