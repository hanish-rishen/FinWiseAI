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
import { useLanguage } from "@/context/language-context";
import { useUser } from "./dashboard-client-wrapper";

const quickActions = [
  {
    titleKey: "start_loan_application",
    descriptionKey: "loan_application_description",
    icon: <FileVideo className="h-5 w-5" />,
    href: "/dashboard/video-banker",
    color: "bg-blue-500",
  },
  {
    titleKey: "upload_documents",
    descriptionKey: "upload_documents_description",
    icon: <Camera className="h-5 w-5" />,
    href: "/dashboard/documents",
    color: "bg-green-500",
  },
  {
    titleKey: "check_eligibility",
    descriptionKey: "check_eligibility_description",
    icon: <ClipboardCheck className="h-5 w-5" />,
    href: "/dashboard/eligibility",
    color: "bg-purple-500",
  },
];

const loanProducts = [
  {
    titleKey: "personal_loan",
    descriptionKey: "personal_loan_description",
    aprKey: "personal_loan_apr",
    maxKey: "personal_loan_max",
  },
  {
    titleKey: "home_loan",
    descriptionKey: "home_loan_description",
    aprKey: "home_loan_apr",
    maxKey: "home_loan_max",
  },
  {
    titleKey: "business_loan",
    descriptionKey: "business_loan_description",
    aprKey: "business_loan_apr",
    maxKey: "business_loan_max",
  },
  {
    titleKey: "education_loan",
    descriptionKey: "education_loan_description",
    aprKey: "education_loan_apr",
    maxKey: "education_loan_max",
  },
  {
    titleKey: "vehicle_loan",
    descriptionKey: "vehicle_loan_description",
    aprKey: "vehicle_loan_apr",
    maxKey: "vehicle_loan_max",
  },
  {
    titleKey: "gold_loan",
    descriptionKey: "gold_loan_description",
    aprKey: "gold_loan_apr",
    maxKey: "gold_loan_max",
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

// Add this helper function to get user initials
function getUserInitials(
  user: { email?: string; user_metadata?: { full_name?: string } } | null
): string {
  if (!user) return "?"; // Default for no user

  // If user has full name, use initials
  if (user.user_metadata?.full_name) {
    const names = user.user_metadata.full_name.trim().split(" ");
    if (names.length === 0 || !names[0]) return "?";

    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }

  // Fallback to email initial if available
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }

  // Final fallback
  return "U";
}

export default function Dashboard() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<number[]>([3, 4]);
  const { t } = useLanguage();
  const { user } = useUser();

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
              {t("main_menu")}
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>{t("dashboard")}</span>
              </Link>
              <Link
                href="/dashboard/video-banker"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FileVideo className="h-5 w-5" />
                <span>{t("ai_branch_manager")}</span>
              </Link>
              <Link
                href="/dashboard/documents"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FileText className="h-5 w-5" />
                <span>{t("upload_documents")}</span>
              </Link>
              <Link
                href="/dashboard/applications"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <DollarSign className="h-5 w-5" />
                <span>{t("loan_applications")}</span>
              </Link>
              <Link
                href="/dashboard/language"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Globe2 className="h-5 w-5" />
                <span>{t("language_settings")}</span>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {t("personal")}
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Home className="h-5 w-5" />
                <span>{t("profile")}</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Settings className="h-5 w-5" />
                <span>{t("settings")}</span>
              </Link>
              <Link
                href="/dashboard/help"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <HelpCircle className="h-5 w-5" />
                <span>{t("help_support")}</span>
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
              {t("sign_out")}
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
              {t("main_menu")}
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>{t("dashboard")}</span>
              </Link>
              <Link
                href="/dashboard/video-banker"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileVideo className="h-5 w-5" />
                <span>{t("ai_branch_manager")}</span>
              </Link>
              <Link
                href="/dashboard/documents"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>{t("upload_documents")}</span>
              </Link>
              <Link
                href="/dashboard/applications"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <DollarSign className="h-5 w-5" />
                <span>{t("loan_applications")}</span>
              </Link>
              <Link
                href="/dashboard/language"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Globe2 className="h-5 w-5" />
                <span>{t("language_settings")}</span>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {t("personal")}
            </h2>
            <div className="space-y-1">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>{t("profile")}</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>{t("settings")}</span>
              </Link>
              <Link
                href="/dashboard/help"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5" />
                <span>{t("help_support")}</span>
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
              {t("sign_out")}
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
                {t("welcome")}
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
                  <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
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
                      {t("view_all_notifications")}
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                {getUserInitials(user)}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.user_metadata?.full_name || user?.email}
              </span>
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
                {t("ai_branch_manager")}
              </h2>
              <p className="text-lg opacity-90 mb-6 md:max-w-lg">
                {t("branch_manager_description")}
              </p>
              <Link href="/dashboard/video-banker">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  {t("start_conversation")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                        {t(action.titleKey)}
                        <ArrowUpRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                      <CardDescription>
                        {t(action.descriptionKey)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Loan Products Section with Improved Heading */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-8 w-1 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full"></div>
              <h2 className="text-xl font-bold ml-3">{t("loan_types")}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Loan product cards remain the same */}
              {loanProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="h-full hover:shadow-md transition-shadow border-t-4"
                    style={{
                      borderTopColor:
                        index % 3 === 0
                          ? "#3b82f6"
                          : index % 3 === 1
                            ? "#0ea5e9"
                            : "#06b6d4",
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {t(product.titleKey)}
                      </CardTitle>
                      <CardDescription>
                        {t(product.descriptionKey)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t(product.aprKey)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {t(product.maxKey)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t("recent_activity")}</CardTitle>
                <CardDescription>{t("latest_interactions")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      icon: <FileText className="h-5 w-5 text-blue-500" />,
                      titleKey: "loan_application_started",
                      descriptionKey: "personal_loan_progress",
                      time: "Today, 9:30 AM",
                    },
                    {
                      icon: <FileVideo className="h-5 w-5 text-green-500" />,
                      titleKey: "ai_branch_session",
                      descriptionKey: "home_loan_conversation",
                      time: "Yesterday, 2:45 PM",
                    },
                    {
                      icon: <DollarSign className="h-5 w-5 text-amber-500" />,
                      titleKey: "eligibility_check",
                      descriptionKey: "pre_qualified",
                      time: "Apr 15, 2023",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium">
                            {t(activity.titleKey)}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {t(activity.descriptionKey)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <Button variant="ghost" size="sm" className="ml-auto">
                  {t("view_all_activity")}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Financial Insights Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">
              {t("financial_insights")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {t("credit_health")}
                      </CardTitle>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <span className="font-medium">742</span>
                          <span className="text-sm text-green-600">
                            {t("good")}
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: "74%" }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{t("poor")}</span>
                          <span>{t("average")}</span>
                          <span>{t("good")}</span>
                          <span>{t("excellent")}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        {t("view_credit_report")}
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
                      <CardTitle className="text-lg">
                        {t("budget_tracker")}
                      </CardTitle>
                      <Wallet className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>{t("monthly_income")}</span>
                        <span className="font-medium">₹85,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t("expenses")}</span>
                        <span className="font-medium">₹52,340</span>
                      </div>
                      <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-800"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t("available")}</span>
                        <span className="font-medium text-green-500">
                          ₹32,660
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        {t("view_details")}
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
                      <CardTitle className="text-lg">
                        {t("emi_calculator")}
                      </CardTitle>
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-center mb-2">
                        <span className="text-2xl font-bold">₹18,450</span>
                        <p className="text-xs text-gray-500">
                          {t("monthly_emi")}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center">
                          <div className="font-medium">{t("5_lakh")}</div>
                          <div className="text-gray-500">{t("principal")}</div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center">
                          <div className="font-medium">10.5%</div>
                          <div className="text-gray-500">{t("interest")}</div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-center">
                          <div className="font-medium">{t("3_years")}</div>
                          <div className="text-gray-500">{t("tenure")}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                      >
                        {t("recalculate")}
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
