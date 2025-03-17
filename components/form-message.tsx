import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";

export type Message = {
  type?: string;
  message?: string;
};

export function FormMessage({ message }: { message: Message }) {
  if (!message || (!message.type && !message.message)) {
    return null;
  }

  const isError = message.type === "error";
  const isSuccess = message.type === "success";

  return (
    <div
      className={cn(
        "flex p-3 text-sm rounded-md items-center",
        isError &&
          "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
        isSuccess &&
          "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400"
      )}
    >
      {isError && (
        <ExclamationTriangleIcon className="h-4 w-4 mr-2" aria-hidden="true" />
      )}
      {isSuccess && (
        <CheckCircleIcon className="h-4 w-4 mr-2" aria-hidden="true" />
      )}
      {message.message}
    </div>
  );
}
