"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  children: React.ReactNode;
  pendingText?: string;
  formAction?: (formData: FormData) => Promise<void>;
  className?: string;
}

export function SubmitButton({
  children,
  pendingText,
  formAction,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      formAction={formAction}
      disabled={pending}
      className={className}
      type="submit"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText || "Please wait..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
