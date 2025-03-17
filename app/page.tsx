"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Home() {
  // Define step data outside to avoid issues
  const steps = [
    {
      step: "1",
      title: "Start a Video Conversation",
      description:
        "Connect with our AI Branch Manager who guides you through the process",
    },
    {
      step: "2",
      title: "Share Your Information",
      description:
        "Record video responses to financial questions and upload required documents",
    },
    {
      step: "3",
      title: "Get Your Decision",
      description: "Receive instant feedback on your loan application status",
    },
  ];

  const features = [
    {
      title: "Virtual AI Branch Manager",
      description:
        "Pre-recorded video assistant that mimics a real-life bank manager",
      icon: "👨‍💼",
    },
    {
      title: "Video-Based Interaction",
      description: "Record video responses instead of filling lengthy forms",
      icon: "🎥",
    },
    {
      title: "Smart Document Processing",
      description: "Upload and automatically extract data from your documents",
      icon: "📄",
    },
    {
      title: "Instant Loan Decisions",
      description: "Get real-time feedback on your loan application",
      icon: "✅",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_40%)]"></div>
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_70%_80%,rgba(45,212,191,0.1),transparent_40%)]"></div>
        </div>
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              className="flex flex-col justify-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                Financial Technology Reimagined
              </span>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                  Banking Made{" "}
                  <span className="text-blue-600 dark:text-blue-500">
                    Personal
                  </span>{" "}
                  Again
                </h1>
                <p className="max-w-[600px] text-lg text-gray-600 dark:text-gray-400">
                  Apply for loans through video conversations with our AI Branch
                  Manager. No forms, no branch visits, just seamless digital
                  banking.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-6 h-auto"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-md px-6 py-6 h-auto"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-${i * 100} dark:bg-gray-${900 - i * 100}`}
                    ></div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Trusted by <span className="font-medium">3,000+</span>{" "}
                  customers
                </p>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-900">
                <div className="absolute top-0 left-0 right-0 h-12 bg-gray-50 dark:bg-gray-800 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-8 mt-12">
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16 10L12 14L8 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">FinWise AI Branch Manager</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          How can I help with your loan application today?
                        </p>
                      </div>
                    </div>

                    <div className="ml-16 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg rounded-tl-none">
                      <p className="text-sm">
                        I'd like to apply for a small business loan to expand my
                        online store.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16 10L12 14L8 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">FinWise AI Branch Manager</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Great! I'd be happy to help with your business loan.
                          Could you tell me about your business growth over the
                          past year?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                      <span className="block h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                      <span className="text-sm font-medium">
                        AI is responding...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="w-full py-12 border-y border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              TRUSTED BY INNOVATIVE COMPANIES
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 grayscale opacity-60">
              {["Microsoft", "Google", "Slack", "Shopify", "Spotify"].map(
                (company) => (
                  <div key={company} className="flex items-center">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {company}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Experience banking like never before
              </h2>
              <p className="max-w-[900px] text-xl text-gray-600 dark:text-gray-400">
                FinWiseAI brings the branch experience to your device with
                cutting-edge AI technology
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex gap-5 p-6 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/30 text-2xl">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="w-full py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50"
      >
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                Process
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-xl text-gray-600 dark:text-gray-400">
                Simple steps to apply for a loan through our AI Branch Manager
              </p>
            </div>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-12 w-full h-1 bg-gray-200 dark:bg-gray-800 hidden md:block" />
                )}
                <div className="relative flex flex-col items-center text-center gap-4 z-10">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white dark:bg-gray-900 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400">
                    <span className="text-3xl font-bold">{step.step}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <motion.div
            className="p-8 md:p-12 rounded-2xl bg-blue-600 text-white overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-blue-500 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4"></div>

            <div className="relative max-w-3xl mx-auto text-center space-y-8">
              <div className="flex justify-center">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-2 border-blue-600 bg-blue-500 flex items-center justify-center text-white font-medium"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl font-medium">
                "FinWiseAI transformed our lending experience. The video
                conversation format made sharing my business information feel
                natural and personal, without the usual form-filling hassle."
              </blockquote>

              <div className="flex flex-col items-center">
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-blue-100">
                  Small Business Owner
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                FAQ
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-xl text-gray-600 dark:text-gray-400">
                Everything you need to know about our AI Branch Manager
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                question: "Is my data secure with FinWiseAI?",
                answer:
                  "Absolutely. We use bank-level encryption and strict data protection protocols to ensure your personal and financial information stays secure at all times.",
              },
              {
                question: "How long does it take to get a loan decision?",
                answer:
                  "Most applicants receive an initial decision within minutes of completing their video conversation with our AI Branch Manager.",
              },
              {
                question: "Can I save my progress and continue later?",
                answer:
                  "Yes, you can pause at any point in the process and return later. Your information will be securely saved.",
              },
              {
                question: "What types of loans can I apply for?",
                answer:
                  "We offer personal loans, small business loans, mortgages, and auto loans through our AI Branch Manager.",
              },
              {
                question: "What if I need to speak with a human?",
                answer:
                  "While our AI is designed to handle most inquiries, you can easily request a human representative at any point in the process.",
              },
              {
                question: "Are there any fees to use FinWiseAI?",
                answer:
                  "No, using our AI Branch Manager to apply for loans is completely free. Standard loan fees may apply based on the loan product.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6 mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
            <div className="w-full md:w-1/2">
              <motion.div
                className="relative h-96 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600">
                  <div className="w-full h-full bg-opacity-50 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.2)_0%,transparent_70%)]"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-8 text-white text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <h3 className="text-2xl font-bold mb-2">Video Banking</h3>
                    <p className="mb-6">
                      Experience the future of financial services
                    </p>

                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full bg-white"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="w-full md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to transform your banking experience?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Join thousands of customers already using FinWiseAI to simplify
                their financial journey.
              </p>

              <div className="space-y-4">
                {[
                  "No more paperwork or branch visits",
                  "Apply for loans on your schedule",
                  "Secure, private video conversations",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    <p>{point}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-6 py-6 h-auto"
                  >
                    Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
