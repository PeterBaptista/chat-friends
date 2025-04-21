import { Skeleton } from "@/components/ui/skeleton";

export function ChatFallback() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b p-4 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-5 w-48" />
        <div className="ml-auto">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Generate multiple message skeletons */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`flex ${
              index % 2 === 0 ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[80%] ${
                index % 2 === 0 ? "mr-auto" : "ml-auto"
              }`}
            >
              <div
                className={`rounded-lg p-4 ${
                  index % 2 === 0 ? "bg-muted" : "bg-primary/10"
                }`}
              >
                <Skeleton className="h-4 w-full mb-2" />
                {index % 2 === 0 && <Skeleton className="h-4 w-3/4" />}
              </div>
              <div className="mt-1 text-xs">
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}

        {/* Long message skeleton */}
        <div className="flex justify-start">
          <div className="max-w-[80%] mr-auto">
            <div className="rounded-lg p-4 bg-muted">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="mt-1 text-xs">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t p-4 flex items-center gap-2">
        <Skeleton className="h-10 flex-1 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
