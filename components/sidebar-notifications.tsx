"use client";

import type React from "react";

import { Bell, Check, Mail, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/lib/axios-client";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";

import shadcnAvatar from "@/public/shadcn-avatar.png";
import { useWSContext } from "@/modules/chat/context/ws-context";

function Content() {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const invitesQuery = useQuery({
    queryKey: ["invites-query"],
    queryFn: async () => {
      const response = await axiosClient.get<any[]>("/invites");
      return response.data;
    },
  });
  const { sendMessage } = useWSContext();

  const respondToInviteMutation = useMutation({
    mutationFn: async ({
      inviteId,
      status,
    }: {
      inviteId: string;
      status: "accepted" | "rejected";
    }) => {
      return axiosClient.post(`/invites/${inviteId}/respond`, { status });
    },
    onMutate: (variables) => {
      setProcessingId(variables.inviteId);
    },
    onSuccess: (_, variables) => {
      const action = variables.status === "accepted" ? "aceito" : "rejeitado";
      toast(`Convite ${action} com sucesso!`);
      sendMessage({
        type: "invite-confirm",
        inviteId: variables.inviteId,
        status: variables.status,
      });
      queryClient.invalidateQueries({ queryKey: ["invites-query"] });
      queryClient.invalidateQueries({ queryKey: ["friends-users-query"] });
    },
    onError: (error) => {
      toast(`Erro ao processar convite. Tente novamente.`);
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const handleResponse = (
    inviteId: string,
    status: "accepted" | "rejected"
  ) => {
    respondToInviteMutation.mutate({ inviteId, status });
  };

  if (invitesQuery.isLoading) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        Carregando convites...
      </div>
    );
  }

  if (invitesQuery.error) {
    return (
      <div className="py-6 text-center text-destructive">
        Erro ao carregar convites. Tente novamente.
      </div>
    );
  }

  return (
    <div className="space-y-3 py-2">
      {invitesQuery.data?.map((item) => {
        const isProcessing = processingId === item.invites.id;

        return (
          <Card key={item.invites.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={item?.user?.image || "/placeholder.svg"}
                      alt={item?.user?.name || ""}
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
                  <p className="font-medium">{item?.user?.name ?? "--"}</p>
                </div>
              </div>
            </CardContent>
            {item?.invites?.status === "pending" && (
              <CardFooter className="flex justify-end gap-2 p-3 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse(item.invites.id, "rejected")}
                  disabled={isProcessing}
                >
                  <X className="mr-1 h-4 w-4" />
                  Rejeitar
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleResponse(item.invites.id, "accepted")}
                  disabled={isProcessing}
                >
                  <Check className="mr-1 h-4 w-4" />
                  Aceitar
                </Button>
              </CardFooter>
            )}
          </Card>
        );
      })}
      {invitesQuery.data?.length === 0 && (
        <div className="flex justify-center items-center gap-2 border border-dashed rounded-md py-6 text-muted-foreground">
          <X className="h-4 w-4" />
          Nenhum convite encontrado
        </div>
      )}
    </div>
  );
}

export function NotificationsDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convites</DialogTitle>
          <DialogDescription>
            Gerencie seus convites pendentes.
          </DialogDescription>
        </DialogHeader>
        <Content />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SidebarNotifications() {
  const { data: invites } = useQuery({
    queryKey: ["invites-query"],
    queryFn: async () => {
      const response = await axiosClient.get<any[]>("/invites");
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  const { ws, wsMessage } = useWSContext();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("invite", wsMessage);
    if (wsMessage?.type === "invite")
      queryClient.invalidateQueries({ queryKey: ["invites-query"] });
    if (wsMessage?.type === "invite-confirm")
      queryClient.invalidateQueries({ queryKey: ["friends-users-query"] });
  }, [wsMessage]);

  const pendingCount =
    invites?.filter((item) => item.invites.status === "pending").length || 0;

  return (
    <NotificationsDialog>
      <div className="relative">
        <Button
          variant="outline"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-fit cursor-pointer rounded-full"
        >
          <Mail className="h-4 w-4" />
        </Button>
        {pendingCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {pendingCount}
          </span>
        )}
      </div>
    </NotificationsDialog>
  );
}
