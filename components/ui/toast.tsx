import React, { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  visible: boolean;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  title,
  description,
  variant = "default",
  visible,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      // Small delay to trigger animation
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [visible]);

  return (
    <div
      className={cn(
        "fixed right-4 max-w-sm transition-all duration-300 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        variant === "destructive"
          ? "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800"
          : "bg-white dark:bg-gray-800",
        "rounded-lg border shadow-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5"
      )}
      style={{ top: "5rem", zIndex: 1000 }}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            {variant === "destructive" ? (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div className="ml-3 flex-1">
            {title && (
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex">
        <button
          onClick={() => onClose(id)}
          className="rounded-md p-1 m-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({
  toasts,
  onClose,
}: {
  toasts: any[];
  onClose: (id: string) => void;
}) {
  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </>
  );
}
