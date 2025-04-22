"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const forgetPasswordSchema = z.object({
  email: z.string().email({
    message: "Coloque um email valido",
  }),
});

export function RecoverForm() {
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationKey: ["forget-password"],
    mutationFn: async (values: z.infer<typeof forgetPasswordSchema>) => {
      await authClient.forgetPassword(
        {
          email: values.email,
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
        },
        {
          onError: (error) => {
            toast.error(`Erro ao enviar email: ${error.error.message}`);
          },
          onSuccess() {
            toast.success("Email enviado com sucesso");
          },
        }
      );
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof forgetPasswordSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Recuperar senha</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Não se preocupe ! Essas coisas acontecem...
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          enviar email de recuperação
        </Button>
      </form>
    </Form>
  );
}
