"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Mock user data - in a real app, this would come from your user context or API
  const [userData, setUserData] = useState({
    name: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    phone: "+91 98765 43210",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    dateOfBirth: "1985-04-15",
    panNumber: "ABCDE1234F",
    aadhaarNumber: "1234 5678 9012",
    occupation: "Software Engineer",
    incomeRange: "₹10,00,000 - ₹15,00,000",
    isEmailVerified: true,
    isPhoneVerified: true,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
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
              Profile
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Profile card and stats */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile photo card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-24"></div>
              <div className="px-6 pb-6">
                <div className="flex justify-center -mt-12">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-600 dark:text-gray-300">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {userData.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer ID: FW12345678
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {userData.email}
                    </span>
                    {userData.isEmailVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {userData.phone}
                    </span>
                    {userData.isPhoneVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {userData.address}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account stats card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Account Status
                  </span>
                  <span className="text-sm font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-0.5 px-2 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Member Since
                  </span>
                  <span className="text-sm">Jan 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Active Applications
                  </span>
                  <span className="text-sm">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Completed Applications
                  </span>
                  <span className="text-sm">1</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Profile forms */}
          <div className="md:col-span-2">
            <Card>
              <Tabs defaultValue="personal">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <CardTitle>Profile Information</CardTitle>
                    <TabsList className="bg-gray-100 dark:bg-gray-800">
                      <TabsTrigger value="personal">Personal</TabsTrigger>
                      <TabsTrigger value="financial">Financial</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>

                <TabsContent value="personal">
                  <form onSubmit={handleSaveProfile}>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={userData.name}
                            onChange={(e) =>
                              setUserData({ ...userData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userData.email}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={userData.phone}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={userData.dateOfBirth}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                dateOfBirth: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={userData.address}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                      <Button type="submit" disabled={saving}>
                        {saving && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Changes
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>

                <TabsContent value="financial">
                  <form onSubmit={handleSaveProfile}>
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            value={userData.occupation}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                occupation: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="incomeRange">Annual Income</Label>
                          <select
                            id="incomeRange"
                            value={userData.incomeRange}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                incomeRange: e.target.value,
                              })
                            }
                            className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option>Less than ₹5,00,000</option>
                            <option>₹5,00,000 - ₹10,00,000</option>
                            <option>₹10,00,000 - ₹15,00,000</option>
                            <option>₹15,00,000 - ₹25,00,000</option>
                            <option>Above ₹25,00,000</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="panNumber">PAN Number</Label>
                          <Input
                            id="panNumber"
                            value={userData.panNumber}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                panNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                          <Input
                            id="aadhaarNumber"
                            value={userData.aadhaarNumber}
                            onChange={(e) =>
                              setUserData({
                                ...userData,
                                aadhaarNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                      <Button type="submit" disabled={saving}>
                        {saving && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Financial Information
                      </Button>
                    </CardFooter>
                  </form>
                </TabsContent>

                <TabsContent value="documents">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-medium mb-2">
                        Manage your documents
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                        Access and manage your uploaded documents. You can view,
                        upload or update your identity and financial documents.
                      </p>
                      <Link href="/dashboard/documents">
                        <Button>Go to Document Center</Button>
                      </Link>
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
