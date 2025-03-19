"use client";

import { useToast } from "@/components/ui/use-toast";
import { ToastProvider } from "@/components/ui/toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

export function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleClose = (id: string) => {
    setVisibleToasts((prev) => prev.filter((toastId) => toastId !== id));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!session) {
          router.replace("/sign-in");
          return;
        }

        setUser(session.user);
      } catch (error) {
        console.error("Error checking auth:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem verifying your account",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, toast]);

  // Create a context provider for the user data
  return (
    <>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Provide user data to all child components */}
          <UserContext.Provider value={{ user }}>
            {children}
          </UserContext.Provider>
          <Toaster />
        </>
      )}
    </>
  );
}

// Create a context for the user
import { createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";

export interface UserContextType {
  user: User | null;
}

export const UserContext = createContext<UserContextType>({ user: null });

export const useUser = () => useContext(UserContext);
