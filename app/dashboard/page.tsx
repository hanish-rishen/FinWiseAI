"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOutAction } from "@/app/actions";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  PieChart,
  ArrowUpRight,
  LayoutDashboard,
  CreditCard,
  ArrowRight,
  FileText,
  Calendar,
  MessageSquare,
  DollarSign,
  Home,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";

const quickActions = [
  {
    title: "Apply for Loan",
    description: "Start a new loan application",
    icon: <DollarSign className="h-5 w-5" />,
    href: "/dashboard/loans/apply",
    color: "bg-blue-500",
  },
  {
    title: "Check Eligibility",
    description: "See what products you pre-qualify for",
    icon: <FileText className="h-5 w-5" />,
    href: "/dashboard/eligibility",
    color: "bg-green-500",
  },
  {
    title: "Schedule Meeting",
    description: "Book a video call with our team",
    icon: <Calendar className="h-5 w-5" />,
    href: "/dashboard/schedule",
    color: "bg-purple-500",
  },
  {
    title: "Chat with AI Advisor",
    description: "Get instant financial advice",
    icon: <MessageSquare className="h-5 w-5" />,
    href: "/dashboard/chat",
    color: "bg-amber-500",
  },
];

const loanProducts = [
  {
    title: "Personal Loan",
    apr: "From 5.99% APR",
    max: "Up to $50,000",
    description: "Flexible funding for any purpose",
  },
  {
    title: "Home Mortgage",
    apr: "From 3.25% APR",
    max: "Up to $1,000,000",
    description: "Find your dream home today",
  },
  {
    title: "Auto Loan",
    apr: "From 3.49% APR",
    max: "Up to $100,000",
    description: "Get on the road with confidence",
  },
  {
    title: "Business Loan",
    apr: "From 6.75% APR",
    max: "Up to $250,000",
    description: "Grow your business with flexible capital",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex h-16 items-center justify-center px-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <span className="font-bold text-white">F</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              FinWiseAI
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Main
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/loans"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <DollarSign className="h-5 w-5" />
                <span>Loans</span>
              </Link>
              <Link
                href="/dashboard/accounts"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <CreditCard className="h-5 w-5" />
                <span>Accounts</span>
              </Link>
              <Link
                href="/dashboard/chat"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <MessageSquare className="h-5 w-5" />
                <span>AI Assistant</span>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Personal
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Home className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <Link
                href="/dashboard/help"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form action={signOutAction}>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 dark:text-red-400"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white dark:bg-gray-900"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-gray-800/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 transform ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800`}
      >
        <div className="flex h-16 items-center justify-center px-4 border-b border-gray-200 dark:border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
              <span className="font-bold text-white">F</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              FinWiseAI
            </span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          {/* Same navigation items as desktop */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Main
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/loans"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DollarSign className="h-5 w-5" />
                <span>Loans</span>
              </Link>
              <Link
                href="/dashboard/accounts"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CreditCard className="h-5 w-5" />
                <span>Accounts</span>
              </Link>
              <Link
                href="/dashboard/chat"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MessageSquare className="h-5 w-5" />
                <span>AI Assistant</span>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Personal
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <Link
                href="/dashboard/help"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Help & Support</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <form action={signOutAction}>
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 dark:text-red-400"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{currentDate}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                JD
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={action.href}>
                  <Card className="h-full hover:shadow-md transition-shadow group">
                    <CardHeader className="pb-2">
                      <div
                        className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mb-3`}
                      >
                        {action.icon}
                      </div>
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors flex items-center">
                        {action.title}
                        <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Loan Products</CardTitle>
                    <CardDescription>
                      Find the right financing option for your needs
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/loans/compare">
                    <Button variant="ghost" className="text-sm" size="sm">
                      Compare All
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {loanProducts.map((product, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
                      >
                        <h3 className="font-medium mb-1">{product.title}</h3>
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>{product.apr}</span>
                          <span>{product.max}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Financial Snapshot</CardTitle>
                  <CardDescription>
                    Your current financial status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Credit Score</span>
                      <span className="font-medium">742</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: "74%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pre-qualified for
                      </p>
                      <p className="text-lg font-bold">$25,000</p>
                    </div>
                    <Link href="/dashboard/eligibility">
                      <Button size="sm">Check Eligibility</Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Debt
                      </span>
                      <span>$12,450</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly Income
                      </span>
                      <span>$4,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Debt-to-Income
                      </span>
                      <span>23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest interactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: <FileText className="h-5 w-5 text-blue-500" />,
                      title: "Loan application started",
                      description: "Personal loan application in progress",
                      time: "Today, 9:30 AM",
                    },
                    {
                      icon: (
                        <MessageSquare className="h-5 w-5 text-green-500" />
                      ),
                      title: "Chat with AI Assistant",
                      description: "Discussion about mortgage rates",
                      time: "Yesterday, 2:45 PM",
                    },
                    {
                      icon: <DollarSign className="h-5 w-5 text-amber-500" />,
                      title: "Eligibility check completed",
                      description: "Pre-qualified for multiple products",
                      time: "Apr 15, 2023",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button variant="ghost" size="sm" className="ml-auto">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
