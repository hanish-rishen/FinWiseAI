"use client";

import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export default function Signup() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const message = searchParams.get("message");

  if (message && type === "success") {
    return (
      <div className="flex min-h-screen w-full items-center justify-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
          <Link href="/sign-in">
            <motion.button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Return to Sign In
            </motion.button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <motion.div
        className="w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <span className="font-bold text-xl text-white">F</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            Create an Account
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Join FinWiseAI and unlock a new banking experience
          </p>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Input
                  name="email"
                  id="email"
                  placeholder="you@example.com"
                  required
                  className="pl-10 h-12 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Create a strong password"
                  minLength={6}
                  required
                  className="pl-10 h-12 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <SubmitButton
                formAction={signUpAction}
                pendingText="Creating your account..."
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-base font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Create Account
              </SubmitButton>
            </motion.div>

            {type && message && type !== "success" && (
              <FormMessage message={{ type, message }} />
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
