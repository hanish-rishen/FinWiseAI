import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Link from "next/link";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "FinWiseAI - AI-Powered Branch Manager",
  description:
    "Apply for loans through video conversations with our AI Branch Manager. No forms, no branch visits, just seamless digital banking.",
};

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <Header />
            {children}

            <footer className="w-full border-t border-t-foreground/10 py-12 md:py-16">
              <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <Link href="/" className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                        <span className="font-bold text-white">F</span>
                      </div>
                      <span className="text-xl font-bold">FinWiseAI</span>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Apply for loans through video conversations with our AI
                      Branch Manager. No forms, no branch visits, just seamless
                      digital banking.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/#features"
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Features
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/#how-it-works"
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          How It Works
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/about"
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          About
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/privacy"
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/terms"
                          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          Terms of Service
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} FinWiseAI. All rights
                    reserved.
                  </p>
                  <div className="mt-4 md:mt-0">
                    <ThemeSwitcher />
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
