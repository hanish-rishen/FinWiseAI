"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useState, useEffect } from "react";
import { MenuIcon, XIcon } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show the header on auth pages or dashboard pages
  if (pathname?.startsWith("/auth/") || pathname?.startsWith("/dashboard")) {
    return null;
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-sm transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-950/90 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
            <span className="font-bold text-white">F</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            FinWiseAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/#features"
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          <div className="hidden md:flex items-center gap-2">
            <Link href="/sign-in">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                size="sm"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-5 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href="/auth/sign-in"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
