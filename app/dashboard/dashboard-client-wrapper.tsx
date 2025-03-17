"use client";

import { useToast } from "@/components/ui/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import { useState } from "react";

export function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toasts } = useToast();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  const handleClose = (id: string) => {
    setVisibleToasts((prev) => prev.filter((toastId) => toastId !== id));
  };

  return (
    <>
      {children}
      <ToastProvider toasts={toasts} onClose={handleClose} />
    </>
  );
}
