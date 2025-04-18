"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Send, Menu } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

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
]

// Mock data for messages
const mockMessages = [
  {
    id: 1,
    userId: 1,
    text: "Olá, tudo bem?",
    timestamp: "10:30",
    isMe: false,
  },
  {
    id: 2,
    userId: 1,
    text: "Estou precisando de ajuda com um projeto.",
    timestamp: "10:31",
    isMe: false,
  },
  {
    id: 3,
    userId: 1,
    text: "Sim, claro! Em que posso ajudar?",
    timestamp: "10:32",
    isMe: true,
  },
  {
    id: 4,
    userId: 1,
    text: "Preciso de algumas ideias para um novo design.",
    timestamp: "10:33",
    isMe: false,
  },
  {
    id: 5,
    userId: 1,
    text: "Posso te mostrar alguns exemplos que fiz recentemente.",
    timestamp: "10:34",
    isMe: true,
  },
]

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState(users[0])
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useIsMobile()

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    const newMsg = {
      id: messages.length + 1,
      userId: selectedUser.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  const filteredMessages = messages.filter((message) => message.userId === selectedUser.id)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for user selection */}
      <div
        className={cn(
          "bg-white border-r w-80 flex-shrink-0 transition-all duration-300 ease-in-out",
          isMobile && !sidebarOpen ? "-ml-80" : "ml-0",
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
                selectedUser.id === user.id && "bg-gray-100",
              )}
              onClick={() => {
                setSelectedUser(user)
                if (isMobile) setSidebarOpen(false)
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
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
                <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
              </div>
              <span className="text-xs text-gray-500">{user.lastMessageTime}</span>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b bg-white flex items-center">
          {isMobile && (
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
            <AvatarFallback>
              {selectedUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p className="text-xs text-gray-500">{selectedUser.online ? "Online" : "Offline"}</p>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <div key={message.id} className={cn("flex", message.isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg p-3",
                    message.isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800",
                  )}
                >
                  <p>{message.text}</p>
                  <p className={cn("text-xs mt-1", message.isMe ? "text-blue-100" : "text-gray-500")}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
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
      </div>
    </div>
  )
}
