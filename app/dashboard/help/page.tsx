"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";

// FAQs data structure
const faqs = [
  {
    category: "account",
    questions: [
      {
        id: "account-1",
        question: "How do I change my password?",
        answer:
          "You can change your password in the Settings section. Navigate to Profile > Settings > Security and follow the instructions to update your password.",
      },
      {
        id: "account-2",
        question: "How do I update my contact information?",
        answer:
          "To update your contact information, go to Profile > Personal Information. You can edit your email, phone number, and address there.",
      },
      {
        id: "account-3",
        question: "How can I delete my account?",
        answer:
          "For account deletion, please contact our customer support team. This action cannot be reversed and all your data will be permanently removed.",
      },
    ],
  },
  {
    category: "loans",
    questions: [
      {
        id: "loans-1",
        question: "What documents do I need for a loan application?",
        answer:
          "For most loan applications, you'll need to provide ID proof (Aadhaar/PAN), address proof, income proof (salary slips or IT returns), and bank statements for the last 6 months.",
      },
      {
        id: "loans-2",
        question: "How long does the loan approval process take?",
        answer:
          "Our AI-powered system typically processes loan applications within 24-48 hours after all required documents are submitted and verified.",
      },
      {
        id: "loans-3",
        question: "Can I pay off my loan early?",
        answer:
          "Yes, you can make prepayments or foreclose your loan at any time. Some loan products may have nominal prepayment charges, which will be disclosed during the application process.",
      },
      {
        id: "loans-4",
        question: "How is my loan interest calculated?",
        answer:
          "We use a reducing balance method for calculating interest. This means that interest is calculated on the outstanding principal, which reduces with every EMI payment.",
      },
    ],
  },
  {
    category: "technical",
    questions: [
      {
        id: "technical-1",
        question: "My video call is not working. What should I do?",
        answer:
          "First, check your camera and microphone permissions in your browser settings. Ensure you have a stable internet connection. Try using a different browser or refreshing the page.",
      },
      {
        id: "technical-2",
        question: "Why can't I upload documents?",
        answer:
          "Make sure your documents are in the supported formats (JPG, PNG, PDF) and within the size limits (usually 5MB per file). If problems persist, try using a different browser.",
      },
      {
        id: "technical-3",
        question: "The app is running slow. How can I fix this?",
        answer:
          "Try clearing your browser cache and cookies. Close unnecessary tabs and applications running in the background. A stable internet connection is also essential for optimal performance.",
      },
    ],
  },
];

export default function HelpAndSupport() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Filter FAQs based on search query
  const filteredFAQs =
    searchQuery.trim() === ""
      ? faqs
      : faqs
          .map((category) => ({
            category: category.category,
            questions: category.questions.filter(
              (q) =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          }))
          .filter((category) => category.questions.length > 0);

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "account":
        return "Account & Profile";
      case "loans":
        return "Loans & Applications";
      case "technical":
        return "Technical Support";
      default:
        return category;
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
              Help & Support
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Support options */}
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>We're here to help you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Live Chat</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Available 24/7
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                  >
                    <Phone className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Call Support</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        1800-123-4567 (Toll-free)
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto py-3"
                  >
                    <Mail className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Email Us</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        support@finwiseai.com
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="/dashboard/documents"
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Document Guidelines
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>

                <Link
                  href="#"
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Terms & Conditions
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>

                <Link
                  href="#"
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Privacy Policy
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>

                <Link
                  href="#"
                  className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    Security Information
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right column - FAQs, Searching */}
          <div className="md:col-span-2 space-y-6">
            {/* Search */}
            <Card className="bg-white dark:bg-gray-900">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-9 pr-4 py-2"
                    placeholder="Search help topics or FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery("loan application")}
                  >
                    loan application
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery("password")}
                  >
                    password
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery("documents")}
                  >
                    documents
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => setSearchQuery("video")}
                  >
                    video
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <div className="p-6">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-10">
                    <HelpCircle className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      We couldn't find any FAQs matching your search. Try
                      different keywords or contact support.
                    </p>
                  </div>
                ) : (
                  <Tabs defaultValue={filteredFAQs[0]?.category || "account"}>
                    <TabsList className="mb-4">
                      {filteredFAQs.map((category) => (
                        <TabsTrigger
                          key={category.category}
                          value={category.category}
                        >
                          {getCategoryTitle(category.category)}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {filteredFAQs.map((category) => (
                      <TabsContent
                        key={category.category}
                        value={category.category}
                        className="space-y-4"
                      >
                        {category.questions.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-gray-500 dark:text-gray-400">
                              No questions found in this category.
                            </p>
                          </div>
                        ) : (
                          category.questions.map((faq, index) => (
                            <motion.div
                              key={faq.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
                            >
                              <button
                                className="flex w-full items-center justify-between p-4 text-left focus:outline-none"
                                onClick={() => toggleFAQ(faq.id)}
                              >
                                <h3 className="font-medium">{faq.question}</h3>
                                <div
                                  className={`transform transition-transform ${expandedFAQ === faq.id ? "rotate-180" : ""}`}
                                >
                                  <ArrowRight className="h-4 w-4 rotate-90" />
                                </div>
                              </button>

                              {expandedFAQ === faq.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="px-4 pb-4 pt-0 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
                                >
                                  <p>{faq.answer}</p>
                                </motion.div>
                              )}
                            </motion.div>
                          ))
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                )}
              </div>
            </Card>

            {/* Submit a ticket */}
            <Card className="bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle>Can't Find What You're Looking For?</CardTitle>
                <CardDescription>
                  Submit a support ticket and we'll get back to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please describe your issue in detail..."
                    ></textarea>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <Button>Submit Ticket</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
