"use client";

import ResetForm from "@/components/reset-password-form";
import { Suspense } from 'react'


export default function RecoverPasswordPage() {
  return (
    <div className="grid min-h-screen place-items-center">
        <Suspense>
          <ResetForm/>
        </Suspense>
    </div>
  );
}
