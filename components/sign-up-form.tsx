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

const signUpSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Por favor, insira um email válido.",
    }),
    password: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(8, {
      message: "A senha deve ter pelo menos 8 caracteres.",
    }),
  })
  .superRefine((values, ctx) => {
    if (values.confirmPassword !== values.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
      });
    }
  });

export default function SignUpForm() {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (values: z.infer<typeof signUpSchema>) => {
      await authClient.signUp.email(
        {
          email: values.email,
          password: values.password,
          name: values.name,
        },
        {
          onError: (error) => {
            toast.error(`Erro ao fazer se cadastrar: ${error.error.message}`);
          },
          onSuccess() {
            router.push("/login");
          },
        }
      );
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signUpSchema>) {
    mutate(values);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center w-full">
        <h1 className="text-2xl font-bold">Registrar uma conta</h1>
        <p className="text-muted-foreground text-sm w-full flex-grow">
          Preencha os campos abaixo para ter acesso ao nosso serviço!
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o seu nome completo" {...field} />
                </FormControl>
                {/* <FormDescription>
                    This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Digite o meu email</FormLabel>
                <FormControl>
                  <Input placeholder="example@email.com" {...field} />
                </FormControl>
                {/* <FormDescription>
                    This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite uma senha"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                    This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Repita a senha"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription>
                    This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
}
