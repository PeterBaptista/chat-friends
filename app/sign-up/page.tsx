"use client";

import { Icons } from "@/components/icons";

import SignUpForm from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-primary-foreground relative hidden lg:block">
        <Icons.logo className="fill-primary absolute bottom-0 right-0 h-full w-full max-w-none  text-muted-foreground/20" />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div> */}

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
