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

const loginSchema = z.object({
  email: z.string().email({
    message: "Coloque um email valido",
  }),
  password: z.string().min(6, {
    message: "Coloque uma senha com no minimo 6 caracteres",
  }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
 
  const signIn = async () => {
      const data = await authClient.signIn.social({
          provider: "google", 
          callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/chat`
      })
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: z.infer<typeof loginSchema>) => {
      await authClient.signIn.email(
        {
          email: values.email,
          password: values.password,
        },
        {
          onError: (error) => {
            toast.error(`Erro ao fazer login: ${error.error.message}`);
          },
          onSuccess() {
            toast.success("Bem-vindo de volta");
            router.push("/chat");
          },
        }
      );
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginSchema>) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Logue na sua conta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Insira seu email abaixo para fazer login
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right text-sm">
            <a href="/forget-password" className="underline underline-offset-4">
              Esqueceu a senha? 
            </a>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          Login
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continue com
          </span>
        </div>
        <Button variant="outline" className="w-full" type="button" onClick={signIn}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
        </svg>
          Entrar com Google
        </Button>

        <div className="text-center text-sm">
          Ainda não tem uma conta?
          <a href="/sign-up" className="underline underline-offset-4">
            Registre-se
          </a>
        </div>

      </form>
    </Form>
  );
}
