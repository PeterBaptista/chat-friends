"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Send,
  UserPlus,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { useWSContext } from "@/modules/chat/context/ws-context";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import Image from "next/image";
import shadcnAvatar from "@/public/shadcn-avatar.png";
import { authClient } from "@/lib/auth-client";

// Mock user data

export function FriendInviteDialog({
  filteredUsers,
  setFilteredUsers,
  users,
}: {
  users: any[];
  filteredUsers: any[];
  setFilteredUsers: (users: any[]) => void;
}) {
  const [sentInvites, setSentInvites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session } = authClient.useSession();

  const { sendMessage } = useWSContext();

  const usersPerPage = 5;

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }
    const filtered = users?.filter((user: any) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const handleSendInvite = (userId: number) => {
    if (!sentInvites.includes(userId)) {
      setSentInvites([...sentInvites, userId]);

      sendMessage({
        type: "invite",
        userFromId: session?.user?.id,
        userToId: userId,
        status: "pending",
        createdAt: new Date(),
      });
      // In a real app, you would make an API call here to send the invite
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuButton className="gap-2">
          <UserPlus className="h-4 w-4" />
          Encontrar Amigos
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Convites de Amizade</DialogTitle>
          <DialogDescription>
            Convide pessoas para se conectar com você como amigos.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome ou @username"
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="max-h-[50vh] pr-4 ">
          <div className="space-y-4 pb-4">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden">
                  <CardContent className="px-4 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage
                            src={user?.image || "/placeholder.svg"}
                            alt={user?.name || ""}
                          />
                          <AvatarFallback className="overflow-hidden">
                            <Image
                              src={shadcnAvatar}
                              alt="Shadcn Avatar"
                              width={24}
                              height={24}
                              className="overflow-hidden"
                            />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="text-sm font-medium">{user.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.username}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={
                          sentInvites.includes(user.id) ? "outline" : "default"
                        }
                        onClick={() => handleSendInvite(user.id)}
                        disabled={sentInvites.includes(user.id)}
                        className="gap-1.5"
                      >
                        {sentInvites.includes(user.id) ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Enviado
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Convidar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado para "{searchTerm}"
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between mt-4 border-t pt-4">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function SidebarMenuInvite() {
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const { data: users } = useQuery({
    queryKey: ["users-invite-query"],
    queryFn: async () => {
      const response = await axiosClient.get("/users");
      setFilteredUsers(response.data);
      return response.data;
    },
    initialData: [],
  });

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <FriendInviteDialog
            users={users}
            filteredUsers={filteredUsers}
            setFilteredUsers={setFilteredUsers}
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
