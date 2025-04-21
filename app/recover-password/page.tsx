"use client";

import { LoginForm } from "@/components/login-form";
import { RecoverForm } from "@/components/recover-form";

export default function RecoverPasswordPage() {
  return (
    <div className="grid min-h-screen place-items-center">
        <RecoverForm></RecoverForm>
    </div>
  );
}
