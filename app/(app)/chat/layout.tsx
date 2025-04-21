import { ChatFallback } from "@/components/chat-fallback";
import { PropsWithChildren, Suspense } from "react";

export default function ChatLayout({ children }: PropsWithChildren) {
  return <Suspense fallback={<ChatFallback />}>{children}</Suspense>;
}
