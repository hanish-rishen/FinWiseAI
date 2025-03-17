"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                  Meet Your AI Branch Manager
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Apply for loans through video conversations with our AI Branch
                  Manager. No forms, no branch visits, just seamless digital
                  banking.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/sign-up">
                  <Button className="px-8 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" className="px-8 py-2 rounded-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[80%] h-[80%] bg-white dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <div className="absolute top-0 left-0 right-0 h-10 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="mt-10 p-4">
                        <div className="animate-pulse flex flex-col space-y-4">
                          <div className="w-2/3 h-4 bg-blue-100 dark:bg-blue-800 rounded"></div>
                          <div className="w-full h-24 bg-blue-50 dark:bg-blue-900/50 rounded"></div>
                          <div className="flex space-x-2">
                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-800 rounded-full"></div>
                            <div className="flex-1 py-1 space-y-2">
                              <div className="h-4 bg-blue-100 dark:bg-blue-800 rounded w-3/4"></div>
                              <div className="h-4 bg-blue-50 dark:bg-blue-900 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900"
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Digital Banking Made{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Personal
                </span>
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                FinWiseAI brings the branch experience to your device with our
                cutting-edge AI Branch Manager
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl">{feature.icon}</div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
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
        className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Simple steps to apply for a loan through our AI Branch Manager
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 py-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
                  <span className="text-2xl font-bold">{step.step}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-8 text-center text-white">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Banking Experience?
              </h2>
              <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join FinWiseAI and experience the future of digital banking
                today.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link href="/auth/sign-up">
                <Button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all duration-200">
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
