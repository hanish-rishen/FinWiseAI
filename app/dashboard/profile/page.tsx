"use client";

import { useState, useEffect } from "react";
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
import { useUser } from "../dashboard-client-wrapper";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { user } = useUser();
  const supabase = createClient();
  const [isDirty, setIsDirty] = useState(false);

  // User data state - initialize with authenticated user data
  const [userData, setUserData] = useState({
    name: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || "",
    dateOfBirth: user?.user_metadata?.dateOfBirth || "",
    panNumber: user?.user_metadata?.panNumber || "",
    aadhaarNumber: user?.user_metadata?.aadhaarNumber || "",
    occupation: user?.user_metadata?.occupation || "",
    incomeRange: user?.user_metadata?.incomeRange || "",
    isEmailVerified: !!user?.email_confirmed_at,
    isPhoneVerified: !!user?.phone_confirmed_at,
  });

  // Local editable copy
  const [localUserData, setLocalUserData] = useState({ ...userData });

  // Update localUserData when userData changes
  useEffect(() => {
    setLocalUserData({ ...userData });
  }, [userData]);

  // Add this at the beginning of your component
  useEffect(() => {
    console.log("User context:", user);
  }, [user]);

  // Add a state to track if the data has been loaded
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch profile data only once on initial load
  useEffect(() => {
    const fetchProfileData = async () => {
      // Skip if already loaded or no user
      if (dataLoaded || !user) {
        return;
      }

      try {
        console.log("Fetching profile for user:", user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id);

        // Check if we got any data
        if (error) {
          console.error("Error fetching profile:", error);
          if (error.code !== "PGRST116") {
            toast({
              title: "Error fetching profile data",
              description: error.message,
              variant: "destructive",
            });
          }
          return;
        }

        // If we got data, update the state with it
        if (data && data.length > 0) {
          setUserData((prev) => ({
            ...prev,
            name: data[0].full_name || prev.name,
            phone: data[0].phone || prev.phone,
            address: data[0].address || prev.address,
            dateOfBirth: data[0].date_of_birth || prev.dateOfBirth,
            panNumber: data[0].pan_number || prev.panNumber,
            aadhaarNumber: data[0].aadhaar_number || prev.aadhaarNumber,
            occupation: data[0].occupation || prev.occupation,
            incomeRange: data[0].income_range || prev.incomeRange,
          }));
        } else {
          // If no profile exists, create one
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Error creating profile:", insertError);
          }
        }

        // Mark data as loaded
        setDataLoaded(true);
      } catch (error: any) {
        console.error("Error in profile function:", error);
        setDataLoaded(true); // Mark as loaded even on error to prevent infinite retries
      }
    };

    fetchProfileData();
  }, [user, supabase, toast, dataLoaded]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Check if user exists
      if (!user || !user.id) {
        throw new Error("User not authenticated");
      }

      // First, ensure the date format is correct - use null if invalid
      const formattedDate = localUserData.dateOfBirth
        ? new Date(localUserData.dateOfBirth).toISOString().split("T")[0]
        : null;

      // Update user metadata in auth
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: localUserData.name,
          phone: localUserData.phone,
          address: localUserData.address,
        },
      });

      if (authError) {
        console.error("Auth update error details:", authError);
        throw new Error(authError.message || "Failed to update user auth data");
      }

      // Break down the upsert operation for better error handling
      const profileData = {
        id: user.id,
        full_name: localUserData.name,
        phone: localUserData.phone,
        address: localUserData.address,
        date_of_birth: formattedDate,
        pan_number: localUserData.panNumber,
        aadhaar_number: localUserData.aadhaarNumber,
        occupation: localUserData.occupation,
        income_range: localUserData.incomeRange,
        updated_at: new Date().toISOString(),
      };

      // Perform the upsert
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData);

      if (profileError) {
        console.error("Profile upsert error details:", profileError);
        throw new Error(
          profileError.message || "Failed to update profile data"
        );
      }

      // Success - update main userData state
      setUserData(localUserData);
      setIsDirty(false);

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description:
          "There was a problem saving your profile: " +
          (error.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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
                      {localUserData.name && localUserData.name.trim()
                        ? localUserData.name
                            .split(" ")
                            .filter((n: string) => n) // Add explicit string type
                            .map((n: string) => n[0]) // Add explicit string type
                            .join("")
                            .toUpperCase()
                        : localUserData.email
                          ? localUserData.email[0].toUpperCase()
                          : "U"}
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {localUserData.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Customer ID: FW12345678
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {localUserData.email}
                    </span>
                    {localUserData.isEmailVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {localUserData.phone}
                    </span>
                    {localUserData.isPhoneVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">
                      {localUserData.address}
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
                  <form
                    onSubmit={handleSaveProfile}
                    key={`personal-form-${user?.id || "new"}`}
                  >
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            value={localUserData.name}
                            onChange={(e) => {
                              setLocalUserData({
                                ...localUserData,
                                name: e.target.value,
                              });
                              setIsDirty(true);
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={localUserData.email}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={localUserData.phone}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
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
                            value={localUserData.dateOfBirth}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
                                dateOfBirth: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={localUserData.address}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
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
                  <form
                    onSubmit={handleSaveProfile}
                    key={`financial-form-${user?.id || "new"}`}
                  >
                    <CardContent className="space-y-6 pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <Input
                            id="occupation"
                            value={localUserData.occupation}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
                                occupation: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="incomeRange">Annual Income</Label>
                          <select
                            id="incomeRange"
                            value={localUserData.incomeRange}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
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
                            value={localUserData.panNumber}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
                                panNumber: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
                          <Input
                            id="aadhaarNumber"
                            value={localUserData.aadhaarNumber}
                            onChange={(e) =>
                              setLocalUserData({
                                ...localUserData,
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
