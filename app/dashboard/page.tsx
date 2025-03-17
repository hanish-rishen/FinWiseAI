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
  Camera,
  FileVideo,
  ClipboardCheck,
  Globe2,
  BarChart3,
  Wallet,
  PiggyBank,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const quickActions = [
  {
    title: "Start Loan Application",
    description: "Begin a video conversation with our AI Branch Manager",
    icon: <FileVideo className="h-5 w-5" />,
    href: "/dashboard/video-banker",
    color: "bg-blue-500",
  },
  {
    title: "Upload Documents",
    description: "Submit Aadhaar, PAN, or income proof via camera or upload",
    icon: <Camera className="h-5 w-5" />,
    href: "/dashboard/documents",
    color: "bg-green-500",
  },
  {
    title: "Check Eligibility",
    description: "See if you qualify for our loan products",
    icon: <ClipboardCheck className="h-5 w-5" />,
    href: "/dashboard/eligibility",
    color: "bg-purple-500",
  },
  {
    title: "Financial Planning",
    description: "Get personalized financial advice and planning",
    icon: <PiggyBank className="h-5 w-5" />,
    href: "/dashboard/planning",
    color: "bg-amber-500",
  },
];

const loanProducts = [
  {
    title: "Personal Loan",
    apr: "From 10.99% APR",
    max: "Up to ₹15,00,000",
    description: "Flexible funding for any personal need",
  },
  {
    title: "Home Loan",
    apr: "From 8.50% APR",
    max: "Up to ₹75,00,000",
    description: "Purchase your dream home today",
  },
  {
    title: "Business Loan",
    apr: "From 12.75% APR",
    max: "Up to ₹50,00,000",
    description: "Grow your business with flexible capital",
  },
  {
    title: "Education Loan",
    apr: "From 9.25% APR",
    max: "Up to ₹25,00,000",
    description: "Fund your higher education dreams",
  },
  {
    title: "Vehicle Loan",
    apr: "From 7.99% APR",
    max: "Up to ₹20,00,000",
    description: "Finance your new car or two-wheeler",
  },
  {
    title: "Gold Loan",
    apr: "From 7.50% APR",
    max: "Up to ₹30,00,000",
    description: "Quick loans against your gold assets",
  },
];

const notifications = [
  {
    id: 1,
    title: "Document verification complete",
    message: "Your PAN card has been successfully verified.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    title: "Video interview reminder",
    message: "Your scheduled video interview is in 2 hours.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    title: "Loan application update",
    message: "Additional information needed for your loan application.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 4,
    title: "Welcome to FinWiseAI",
    message: "Thank you for joining our video-based loan platform.",
    time: "3 days ago",
    read: true,
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([3, 4]);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const markAsRead = (id: number) => {
    if (!readNotifications.includes(id)) {
      setReadNotifications([...readNotifications, id]);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !readNotifications.includes(notification.id)
  ).length;

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
                href="/dashboard/video-banker"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FileVideo className="h-5 w-5" />
                <span>AI Branch Manager</span>
              </Link>
              <Link
                href="/dashboard/documents"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FileText className="h-5 w-5" />
                <span>My Documents</span>
              </Link>
              <Link
                href="/dashboard/applications"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <DollarSign className="h-5 w-5" />
                <span>Loan Applications</span>
              </Link>
              <Link
                href="/dashboard/planning"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <PiggyBank className="h-5 w-5" />
                <span>Financial Planning</span>
              </Link>
              <Link
                href="/dashboard/language"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Globe2 className="h-5 w-5" />
                <span>Language Settings</span>
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
                href="/dashboard/video-banker"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileVideo className="h-5 w-5" />
                <span>AI Branch Manager</span>
              </Link>
              <Link
                href="/dashboard/documents"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>My Documents</span>
              </Link>
              <Link
                href="/dashboard/applications"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DollarSign className="h-5 w-5" />
                <span>Loan Applications</span>
              </Link>
              <Link
                href="/dashboard/planning"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PiggyBank className="h-5 w-5" />
                <span>Financial Planning</span>
              </Link>
              <Link
                href="/dashboard/language"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Globe2 className="h-5 w-5" />
                <span>Language Settings</span>
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
                Welcome to FinWiseAI
              </h1>
              <p className="text-gray-600 dark:text-gray-400">{currentDate}</p>
            </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="p-0 focus:bg-transparent"
                      onSelect={() => markAsRead(notification.id)}
                    >
                      <div
                        className={`w-full px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${!readNotifications.includes(notification.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="font-medium">
                            {notification.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {notification.time}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="justify-center">
                    <Button variant="ghost" size="sm">
                      View all notifications
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                RK
              </div>
            </div>
          </header>

          {/* Welcome Banner for AI Branch Manager */}
          <motion.div
            className="mb-8 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white relative overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4"></div>
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Meet Your AI Branch Manager
              </h2>
              <p className="text-lg opacity-90 mb-6 md:max-w-lg">
                Apply for loans through video conversations without the hassle
                of paperwork or branch visits.
              </p>
              <Link href="/dashboard/video-banker">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  Start Video Conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

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
            {loanProducts.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {product.apr}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {product.max}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                      icon: <FileVideo className="h-5 w-5 text-green-500" />,
                      title: "AI Branch Manager session",
                      description: "Video conversation about home loan options",
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

          {/* Financial Insights Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Financial Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Credit Health</CardTitle>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <span className="font-medium">742</span>
                          <span className="text-sm text-green-600">Good</span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: "74%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Poor</span>
                          <span>Average</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View Credit Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Budget Tracker</CardTitle>
                      <Wallet className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Monthly Income</span>
                        <span className="font-medium">₹85,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Expenses</span>
                        <span className="font-medium">₹52,340</span>
                      </div>
                      <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-800"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Available</span>
                        <span className="font-medium text-green-500">
                          ₹32,660
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">EMI Calculator</CardTitle>
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <span className="text-2xl font-bold">₹18,450</span>
                        <p className="text-xs text-gray-500">Monthly EMI</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center">
                          <div className="font-medium">5 Lakh</div>
                          <div className="text-gray-500">Principal</div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center">
                          <div className="font-medium">10.5%</div>
                          <div className="text-gray-500">Interest</div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center">
                          <div className="font-medium">3 Years</div>
                          <div className="text-gray-500">Tenure</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Recalculate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
