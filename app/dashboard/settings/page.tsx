"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Shield,
  Lock,
  LogOut,
  Loader2,
  Globe,
  UserCog,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { signOutAction } from "@/app/actions";

// Define interfaces for settings state
interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appNotifications: boolean;
  marketingEmails: boolean;
  newLoanProducts: boolean;
  applicationUpdates: boolean;
  securityAlerts: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  usageAnalytics: boolean;
  locationServices: boolean;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Notification settings
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      smsNotifications: true,
      appNotifications: true,
      marketingEmails: false,
      newLoanProducts: true,
      applicationUpdates: true,
      securityAlerts: true,
    });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: false,
    usageAnalytics: true,
    locationServices: false,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    }, 1500);
  };

  const toggleSetting = (
    settingType: string,
    settingName: string,
    value: boolean
  ) => {
    if (settingType === "notification") {
      setNotificationSettings({
        ...notificationSettings,
        [settingName]: value,
      });
    } else if (settingType === "privacy") {
      setPrivacySettings({
        ...privacySettings,
        [settingName]: value,
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    setChangingPassword(true);

    // Simulate API call
    setTimeout(() => {
      setChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>
          <Button onClick={handleSaveSettings} disabled={saving} size="sm">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Categories */}
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardContent className="p-6">
                <nav className="space-y-1">
                  {[
                    {
                      name: "Appearance",
                      icon: <Moon className="h-5 w-5" />,
                      href: "#appearance",
                    },
                    {
                      name: "Notifications",
                      icon: <Bell className="h-5 w-5" />,
                      href: "#notifications",
                    },
                    {
                      name: "Privacy & Security",
                      icon: <Shield className="h-5 w-5" />,
                      href: "#privacy",
                    },
                    {
                      name: "Language",
                      icon: <Globe className="h-5 w-5" />,
                      href: "/dashboard/language",
                    },
                    {
                      name: "Profile",
                      icon: <UserCog className="h-5 w-5" />,
                      href: "/dashboard/profile",
                    },
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <span className="text-gray-500 dark:text-gray-400 mr-3">
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
              <CardContent className="p-6">
                <h3 className="text-base font-medium text-red-800 dark:text-red-400 mb-4 flex items-center">
                  <LogOut className="h-5 w-5 mr-2" />
                  Account Actions
                </h3>
                <div className="space-y-4">
                  <form action={signOutAction}>
                    <Button variant="destructive" className="w-full">
                      Sign Out
                    </Button>
                  </form>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Deactivate Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Settings */}
          <div className="md:col-span-2 space-y-6">
            {/* Appearance Settings */}
            <Card id="appearance">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sun className="h-5 w-5 mr-2" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how FinWiseAI looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card id="notifications">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="font-medium">Notification Channels</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-2" />
                        <Label htmlFor="emailNotifications">Email</Label>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting(
                            "notification",
                            "emailNotifications",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-500 mr-2" />
                        <Label htmlFor="smsNotifications">SMS</Label>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting(
                            "notification",
                            "smsNotifications",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 text-gray-500 mr-2" />
                        <Label htmlFor="appNotifications">
                          In-app Notifications
                        </Label>
                      </div>
                      <Switch
                        id="appNotifications"
                        checked={notificationSettings.appNotifications}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting(
                            "notification",
                            "appNotifications",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-500 mr-2" />
                        <Label htmlFor="marketingEmails">
                          Marketing Emails
                        </Label>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting(
                            "notification",
                            "marketingEmails",
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="font-medium">Notification Types</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Loan Product Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Get notified about new loan products and offers
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.newLoanProducts}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting(
                            "notification",
                            "newLoanProducts",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Application Updates</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Status changes on your loan applications
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.applicationUpdates}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting(
                            "notification",
                            "applicationUpdates",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Security Alerts</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Suspicious activity and security updates
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.securityAlerts}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting(
                            "notification",
                            "securityAlerts",
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy and Security */}
            <Card id="privacy">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your security preferences and data sharing options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <p className="font-medium">Data and Privacy</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Data Sharing with Partners</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow us to share your data with trusted partners
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.dataSharing}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting("privacy", "dataSharing", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Usage Analytics</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Help us improve by collecting anonymous usage data
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.usageAnalytics}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting("privacy", "usageAnalytics", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p>Location Services</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow access to your location information
                        </p>
                      </div>
                      <Switch
                        checked={privacySettings.locationServices}
                        onCheckedChange={(checked: boolean) =>
                          toggleSetting("privacy", "locationServices", checked)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <p className="font-medium">Security</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p>Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last changed 3 months ago
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      Change
                    </Button>
                  </div>

                  {showPasswordForm && (
                    <form
                      onSubmit={handlePasswordChange}
                      className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="Enter your current password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm({
                              ...passwordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      {passwordError && (
                        <div className="text-sm text-red-500 dark:text-red-400">
                          {passwordError}
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPasswordForm({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setShowPasswordForm(false);
                            setPasswordError("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={changingPassword}>
                          {changingPassword && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Update Password
                        </Button>
                      </div>
                    </form>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p>Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enhanced security for your account
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-gray-500 mr-2" />
                      <div>
                        <p>Login Sessions</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Manage your active login sessions
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
