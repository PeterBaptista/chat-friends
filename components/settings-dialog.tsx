import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const loginSchema = z.object({
  name: z.string().min(2, {
    message: "Coloque um nome com no minimo 2 caracteres",
  }),
  email: z.string().email({
    message: "Coloque um nome com no minimo 2 caracteres",
  }),
  imageUrl: z.string().min(4, {
    message: "Coloque uma url com no minimo 4 caracteres",
  })
});

export function SettingsDialog({ open, setOpen }: { open: boolean, setOpen: (value: boolean) => void }) {

  const { data: session } = authClient.useSession();

  console.log(session)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: useMemo(() => {
      return { imageUrl: session?.user.image ?? "", name: session?.user.name ?? "", email: session?.user.email ?? "" };
    }, [session]),
  });

  useEffect(() => {
    console.log("Reset");
    form.reset({ imageUrl: session?.user.image ?? "", name: session?.user.name ?? "", email: session?.user.email ?? "" });
  }, [session?.user]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["setting-dialog"],
    mutationFn: async (values: z.infer<typeof loginSchema>) => {

      authClient.updateUser({

        name: values.name,
        image: values.imageUrl

      },
        {
          onSuccess: () => {

            toast.success("Usuario atualizado com sucesso");

          },
          onError: () => {

            toast.error("Falha ao atualizar o usuário");

          }
        }
      );

      return;

    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar configurações do usuário</DialogTitle>
          <DialogDescription>
            Altera as informações do seu cadastro. Ao concluir, clique em 'Salvar alterações'
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="user-settings-form" className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              disabled
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Url da imagem de perfil</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="user-settings-form" disabled={isPending}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
