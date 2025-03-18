"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  X,
  Paperclip,
  Send,
  Volume2,
  VolumeX,
  ChevronRight,
  ChevronLeft,
  Clock,
  ArrowLeft,
  Upload,
  FileText,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import {
  loadFaceLandmarkModel,
  loadFaceRecognitionModel,
  loadSsdMobilenetv1Model,
  TinyFaceDetectorOptions,
  euclideanDistance,
  detectSingleFace,
  loadTinyFaceDetectorModel,

} from "face-api.js";
export default function AiBranchManager() {
  const { t } = useLanguage();
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  //Face recognition states
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] = useState<Float32Array | null>(null);
  const [isSamePerson, setIsSamePerson] = useState(true);
  const [identityCheckActive, setIdentityCheckActive] = useState(false);
  const identityCheckInterval = useRef<NodeJS.Timeout | null>(null);



  // Refs for video elements
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);


  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Specify the models directory
        const MODEL_URL = '/models';
        //load models
        await loadSsdMobilenetv1Model(MODEL_URL);
        await loadFaceLandmarkModel(MODEL_URL);
        await loadFaceRecognitionModel(MODEL_URL);
        await loadTinyFaceDetectorModel(MODEL_URL);

        console.log('Face-api models loaded successfully');
        setFaceApiLoaded(true);
      } catch (error) {
        console.error('Error loading face-api models:', error);
      }
    };

    loadModels();
  }, []);

  // Function to get face descriptor
  const getFaceDescriptor = async (video: HTMLVideoElement) => {
    if (!video || !faceApiLoaded) return null;

    try {
      // Detect face with landmarks and descriptors
      const detections = await detectSingleFace(video,
        new TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        console.log("face detected")
        return detections.descriptor;
      }

      return null;
    } catch (error) {
      console.error('Error getting face descriptor:', error);
      return null;
    }
  };

  // Function to verify if same person
  const verifyIdentity = async () => {
    if (!userVideoRef.current || !faceApiLoaded || !cameraEnabled) return;

    try {
      const currentDescriptor = await getFaceDescriptor(userVideoRef.current);

      // If no reference descriptor yet, set this as reference
      if (!referenceDescriptor && currentDescriptor) {
        setReferenceDescriptor(currentDescriptor);
        setIsSamePerson(true);
        return;
      }

      // If we have both descriptors, compare them
      if (referenceDescriptor && currentDescriptor) {
        const distance = euclideanDistance(referenceDescriptor, currentDescriptor);

        // Threshold for determining if same person (adjust as needed)
        const SAME_PERSON_THRESHOLD = 0.6;
        const isSame = distance < SAME_PERSON_THRESHOLD;

        setIsSamePerson(isSame);

        if (!isSame) {
          console.log('Different person detected!', distance);
        }
      } else if (referenceDescriptor && !currentDescriptor) {
        // No face detected now, but we had one before
        setIsSamePerson(false);
      }
    } catch (error) {
      console.error('Error verifying identity:', error);
    }
  };

  // Start identity check when video is available and models are loaded
  useEffect(() => {
    const startIdentityCheck = async () => {
      if (!faceApiLoaded || !userVideoRef.current || !cameraEnabled) {
        if (identityCheckActive) {
          setIdentityCheckActive(false);
        }
        return;
      }

      // Clear any existing interval
      if (identityCheckInterval.current) {
        clearInterval(identityCheckInterval.current);
      }

      // Get initial reference descriptor
      const initialDescriptor = await getFaceDescriptor(userVideoRef.current);
      if (initialDescriptor) {
        setReferenceDescriptor(initialDescriptor);
        setIsSamePerson(true);

        // Set up interval to check identity every 5 seconds
        identityCheckInterval.current = setInterval(verifyIdentity, 5000);
        setIdentityCheckActive(true);
      } else {
        // Keep trying to get reference descriptor
        setTimeout(startIdentityCheck, 2000);
      }
    };

    if (faceApiLoaded && userVideoRef.current && cameraEnabled) {
      startIdentityCheck();
    }

    return () => {
      if (identityCheckInterval.current) {
        clearInterval(identityCheckInterval.current);
        identityCheckInterval.current = null;
      }
    };
  }, [faceApiLoaded, cameraEnabled]);
  // Check if on mobile device
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Handle webcam setup and cleanup
  useEffect(() => {
    // Function to start webcam and audio processing
    const startWebcam = async () => {
      if (!cameraEnabled) {
        if (userVideoRef.current && userVideoRef.current.srcObject) {
          userVideoRef.current.srcObject = null;
        }

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        // Stop audio analysis
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        setIsSpeaking(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: micEnabled,
        });

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        mediaStreamRef.current = stream;
        setStreamError(null);

        // Update audio tracks based on mic state
        stream.getAudioTracks().forEach((track) => {
          track.enabled = micEnabled;
        });

        // Set up audio analysis if microphone is enabled
        if (micEnabled && stream.getAudioTracks().length > 0) {
          setupAudioAnalysis(stream);
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
        setStreamError("Could not access webcam. Please check permissions.");
        setCameraEnabled(false);
      }
    };

    startWebcam();

    // Cleanup when component unmounts
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraEnabled, micEnabled]);

  // Set up audio analysis for voice activity detection
  const setupAudioAnalysis = (stream: MediaStream) => {
    // Clean up previous audio context
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    try {
      // Create new audio context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create analyser
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      // Connect stream to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Buffer for analyser data
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Function to analyze audio levels
      const analyzeAudio = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalizedLevel = average / 255; // Normalize to 0-1 range
        setAudioLevel(normalizedLevel);

        // Determine if speaking based on threshold
        const isSpeakingNow = normalizedLevel > 0.05;
        setIsSpeaking(isSpeakingNow);

        // Continue analyzing
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      };

      // Start analyzing
      analyzeAudio();
    } catch (err) {
      console.error("Error setting up audio analysis:", err);
    }
  };

  // Update microphone state
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = micEnabled;
      });

      // Set up or tear down audio analysis based on mic state
      if (micEnabled) {
        if (mediaStreamRef.current && !analyserRef.current) {
          setupAudioAnalysis(mediaStreamRef.current);
        }
      } else {
        setIsSpeaking(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }
    }
  }, [micEnabled]);

  // Auto-hide controls on mobile after inactivity
  useEffect(() => {
    if (!isMobile) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isMobile, currentQuestion, micEnabled, cameraEnabled, audioEnabled]);

  // Add touch/click handling to show controls
  useEffect(() => {
    const handleInteraction = () => {
      if (isMobile) {
        setShowControls(true);
      }
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [isMobile]);

  // Sample questions from the AI Branch Manager
  const questions = [
    "Hello! I'm Priya, your AI Branch Manager. How can I help you today with your financial needs?",
    "Could you tell me about the purpose of the loan you're looking for?",
    "What is your current employment status and monthly income?",
    "Do you have any existing loans or financial commitments?",
    "Would you like me to explain the different loan options that might be suitable for your needs?",
  ];

  // Toggle functions
  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    setShowControls(true);
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    setShowControls(true);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    setShowControls(true);
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    setShowControls(true);
  };

  // Navigation functions
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowControls(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowControls(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold leading-none">
              {t("ai_branch_manager")}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t("video_conversation")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
          >
            <Clock className="h-3 w-3" />
            <span>12:05</span>
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            {t("end_session")}
          </Button>
        </div>
      </div>

      {/* Main content area - Fixed height calculation to fit viewport */}
      <div className="flex flex-1 h-[calc(100vh-49px)] overflow-hidden">
        {/* Video area - left side with fixed width for large screens */}
        <div
          className={`${chatOpen ? "w-full lg:w-[65%]" : "w-full"
            } h-full flex flex-col transition-all duration-300`}
        >
          {/* Main video container */}
          <div className="flex-1 relative bg-black rounded-none lg:rounded-xl overflow-hidden m-0 lg:m-2 mt-0">
            {/* AI Branch Manager video */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {/* Placeholder for AI Branch Manager video */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-4xl">👩‍💼</span>
                  </div>
                  <p className="text-lg">AI Branch Manager Video</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Video will appear here during the conversation
                  </p>
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

              {/* Session info */}
              <div className="absolute top-4 left-4 flex items-center">
                <div className="bg-black/50 backdrop-blur-md rounded-full py-1 px-3 flex items-center text-white text-xs">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span>Live Session</span>
                </div>
              </div>

              {/* User's video feed (picture-in-picture) */}
              <div
                className={`absolute top-4 right-4 w-32 md:w-48 aspect-[16/10] rounded-lg overflow-hidden ${isSpeaking
                  ? "ring-4 ring-green-500 transition-all"
                  : "border-2 border-white"
                  } shadow-xl`}
              >
                {cameraEnabled ? (
                  <div className="w-full h-full bg-gray-800 relative">
                    {streamError ? (
                      <div className="absolute inset-0 flex items-center justify-center flex-col p-2">
                        <VideoOff className="h-4 w-4 md:h-6 md:w-6 text-red-400 mb-1" />
                        <span className="text-xs text-center text-red-400">
                          {streamError}
                        </span>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={userVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        {micEnabled && (
                          <div className="absolute bottom-1 right-1 flex items-center justify-center">
                            <div className="relative h-6 w-6 bg-black/60 rounded-full flex items-center justify-center">
                              {isSpeaking ? (
                                <Mic className="h-3 w-3 text-green-500" />
                              ) : (
                                <Mic className="h-3 w-3 text-white/70" />
                              )}
                              {isSpeaking && (
                                <span
                                  className="absolute inset-0 rounded-full bg-green-500 animate-ping"
                                  style={{
                                    transform: `scale(${1 + audioLevel})`,
                                    opacity: 0.3 + audioLevel * 0.5,
                                  }}
                                ></span>
                              )}
                            </div>
                          </div>
                        )}
                        {/* Identity verification indicator */}
                        {identityCheckActive && !isSamePerson && (
                          <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 rounded flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            <span>different person detected</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <VideoOff className="h-4 w-4 md:h-6 md:w-6 text-white" />
                  </div>
                )}
              </div>

              {/* Question display */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 md:p-6"
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-white text-base md:text-xl font-medium drop-shadow-md">
                  {questions[currentQuestion]}
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Controls */}
          <div
            className={`bg-white dark:bg-gray-900 transition-all duration-300 ${isMobile && !showControls
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
              } mx-0 lg:mx-2 mb-0 lg:mb-2 rounded-none lg:rounded-xl shadow-md`}
          >
            <div className="w-full flex flex-wrap items-center justify-between p-2 gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMic}
                  className={
                    !micEnabled
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                      : "bg-gray-100 dark:bg-gray-800"
                  }
                >
                  {micEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleCamera}
                  className={
                    !cameraEnabled
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                      : "bg-gray-100 dark:bg-gray-800"
                  }
                >
                  {cameraEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudio}
                  className="bg-gray-100 dark:bg-gray-800"
                >
                  {audioEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant={chatOpen ? "secondary" : "outline"}
                  size="sm"
                  onClick={toggleChat}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span className="text-xs">Chat</span>
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                  Question {currentQuestion + 1} of {questions.length}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="bg-gray-100 dark:bg-gray-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    className="bg-gray-100 dark:bg-gray-800"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div >

        {/* Chat area - right side with fixed width */}
        {
          chatOpen && (
            <div className="hidden lg:block w-[35%] h-full">
              <Card className="h-[calc(100vh-65px)] border-0 lg:border m-0 lg:mx-2 lg:my-2 rounded-none lg:rounded-xl shadow-none lg:shadow overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Header with close button */}
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-3">
                    <h2 className="font-medium text-sm">Chat & Resources</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={toggleChat}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tabs for chat, documents, info */}
                  <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-3 bg-transparent p-0 border-b border-gray-100 dark:border-gray-800">
                      <TabsTrigger
                        value="chat"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                      >
                        Chat
                      </TabsTrigger>
                      <TabsTrigger
                        value="documents"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                      >
                        Documents
                      </TabsTrigger>
                      <TabsTrigger
                        value="info"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                      >
                        Info
                      </TabsTrigger>
                    </TabsList>

                    {/* Chat content */}
                    <TabsContent
                      value="chat"
                      className="flex-1 flex flex-col m-0 p-0 mt-0 data-[state=active]:border-0 overflow-hidden"
                    >
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="/ai-avatar.png"
                              alt="AI Assistant"
                            />
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                            <p className="text-sm">
                              Hello! How can I assist you with your loan
                              application today?
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                              10:30 AM
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 flex-row-reverse">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs">
                              You
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg p-3 max-w-[85%]">
                            <p className="text-sm">
                              I'm interested in a home loan. Can you tell me about
                              the available options?
                            </p>
                            <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 block">
                              10:32 AM
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="/ai-avatar.png"
                              alt="AI Assistant"
                            />
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                            <p className="text-sm">
                              Sure! We offer several home loan options with
                              competitive rates:
                            </p>
                            <ul className="list-disc ml-4 my-1 text-sm">
                              <li>Standard Home Loan: 8.5% APR</li>
                              <li>First-Time Homebuyer: 7.9% APR</li>
                              <li>Premium Home Loan: 9.2% APR</li>
                            </ul>
                            <p className="text-sm mt-1">
                              Would you like me to explain the eligibility
                              criteria for each?
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                              10:34 AM
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chat input */}
                      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 h-9 w-9 bg-gray-100 dark:bg-gray-800"
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <Button size="sm" className="shrink-0 h-9">
                            <Send className="h-4 w-4 mr-1" />
                            <span className="text-xs">Send</span>
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Documents content */}
                    <TabsContent
                      value="documents"
                      className="flex-1 m-0 p-0 mt-0 data-[state=active]:border-0 overflow-auto"
                    >
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                            <Upload className="h-5 w-5" />
                          </div>
                          <h3 className="font-medium mb-1">Upload Documents</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs text-center">
                            Upload identification and income proof documents
                            required for your loan application
                          </p>
                          <Button size="sm" className="text-xs mb-6">
                            <Upload className="h-3 w-3 mr-1" />
                            Select Files
                          </Button>

                          <div className="w-full border-t border-gray-100 dark:border-gray-800 pt-4">
                            <h4 className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Required Documents
                            </h4>
                            <div className="space-y-2">
                              {[
                                "Government ID (Aadhaar/PAN)",
                                "Income Proof (Last 3 months)",
                                "Address Proof",
                                "Property Documents (for secured loans)",
                                "Bank Statements (last 6 months)",
                              ].map((doc, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span>{doc}</span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${i < 3 ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"}`}
                                  >
                                    {i < 3 ? "Required" : "Optional"}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Info content */}
                    <TabsContent
                      value="info"
                      className="flex-1 m-0 p-0 mt-0 data-[state=active]:border-0 overflow-auto"
                    >
                      <div className="p-4 h-full overflow-y-auto">
                        <h3 className="font-medium mb-3">Loan Information</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                            <h4 className="font-medium text-sm mb-2">
                              Home Loan
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Interest Rate
                                </span>
                                <span>8.5% - 12.5%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Loan Amount
                                </span>
                                <span>Up to ₹75,00,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Tenure
                                </span>
                                <span>Up to 30 years</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Processing Fee
                                </span>
                                <span>0.5% - 1%</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                            <h4 className="font-medium text-sm mb-2">
                              Personal Loan
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Interest Rate
                                </span>
                                <span>10.5% - 18%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Loan Amount
                                </span>
                                <span>Up to ₹20,00,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Tenure
                                </span>
                                <span>Up to 5 years</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Processing Fee
                                </span>
                                <span>1% - 2%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Eligibility Criteria
                            </h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-800 dark:text-gray-200">
                              <li>Age between 21-65 years</li>
                              <li>Minimum monthly income of ₹25,000</li>
                              <li>CIBIL score above 700</li>
                              <li>1+ years of work experience</li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Required Documents
                            </h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-800 dark:text-gray-200">
                              <li>Identity proof (Aadhaar/PAN)</li>
                              <li>Address proof (Utility bill/Passport)</li>
                              <li>Income proof (Salary slips, IT returns)</li>
                              <li>Employment details verification</li>
                              <li>Property documents (for home loans)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )
        }

        {/* Mobile Chat Overlay */}
        {
          isMobile && chatOpen && (
            <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-2">
              <Card className="h-[calc(100vh-16px)] border rounded-xl shadow overflow-hidden">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Header with close button for mobile */}
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-3">
                    <h2 className="font-medium text-sm">Chat & Resources</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={toggleChat}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Tabs for chat, documents, info */}
                  <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-3 bg-transparent p-0 border-b border-gray-100 dark:border-gray-800">
                      <TabsTrigger
                        value="chat"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                      >
                        Chat
                      </TabsTrigger>
                      <TabsTrigger
                        value="documents"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                      >
                        Documents
                      </TabsTrigger>
                      <TabsTrigger
                        value="info"
                        className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                      >
                        Info
                      </TabsTrigger>
                    </TabsList>

                    {/* Chat content */}
                    <TabsContent
                      value="chat"
                      className="flex-1 flex flex-col m-0 p-0 mt-0 data-[state=active]:border-0 overflow-hidden"
                    >
                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="/ai-avatar.png"
                              alt="AI Assistant"
                            />
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                            <p className="text-sm">
                              Hello! How can I assist you with your loan
                              application today?
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                              10:30 AM
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3 flex-row-reverse">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs">
                              You
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg p-3 max-w-[85%]">
                            <p className="text-sm">
                              I'm interested in a home loan. Can you tell me about
                              the available options?
                            </p>
                            <span className="text-xs text-blue-600 dark:text-blue-400 mt-1 block">
                              10:32 AM
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src="/ai-avatar.png"
                              alt="AI Assistant"
                            />
                            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[85%]">
                            <p className="text-sm">
                              Sure! We offer several home loan options with
                              competitive rates:
                            </p>
                            <ul className="list-disc ml-4 my-1 text-sm">
                              <li>Standard Home Loan: 8.5% APR</li>
                              <li>First-Time Homebuyer: 7.9% APR</li>
                              <li>Premium Home Loan: 9.2% APR</li>
                            </ul>
                            <p className="text-sm mt-1">
                              Would you like me to explain the eligibility
                              criteria for each?
                            </p>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                              10:34 AM
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Chat input */}
                      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 h-9 w-9 bg-gray-100 dark:bg-gray-800"
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              className="w-full px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <Button size="sm" className="shrink-0 h-9">
                            <Send className="h-4 w-4 mr-1" />
                            <span className="text-xs">Send</span>
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Mobile Documents content */}
                    <TabsContent
                      value="documents"
                      className="flex-1 m-0 p-0 mt-0 data-[state=active]:border-0 overflow-auto"
                    >
                      <div className="p-4 flex flex-col h-full">
                        <div className="flex flex-col items-center justify-center mb-4">
                          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-3">
                            <Upload className="h-5 w-5" />
                          </div>
                          <h3 className="font-medium mb-1">Upload Documents</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs text-center">
                            Upload identification and income proof documents
                            required for your loan application
                          </p>
                          <Button size="sm" className="text-xs">
                            <Upload className="h-3 w-3 mr-1" />
                            Select Files
                          </Button>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                          <h4 className="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Required Documents
                          </h4>
                          <div className="space-y-2">
                            {[
                              "Government ID (Aadhaar/PAN)",
                              "Income Proof (Last 3 months)",
                              "Address Proof",
                              "Property Documents (for secured loans)",
                              "Bank Statements (last 6 months)",
                            ].map((doc, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between text-sm py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span>{doc}</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${i < 3 ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800" : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"}`}
                                >
                                  {i < 3 ? "Required" : "Optional"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Mobile Info content */}
                    <TabsContent
                      value="info"
                      className="flex-1 m-0 p-0 mt-0 data-[state=active]:border-0 overflow-auto"
                    >
                      <div className="p-4">
                        <h3 className="font-medium mb-3">Loan Information</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                            <h4 className="font-medium text-sm mb-2">
                              Home Loan
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Interest Rate
                                </span>
                                <span>8.5% - 12.5%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Loan Amount
                                </span>
                                <span>Up to ₹75,00,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Tenure
                                </span>
                                <span>Up to 30 years</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Processing Fee
                                </span>
                                <span>0.5% - 1%</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                            <h4 className="font-medium text-sm mb-2">
                              Personal Loan
                            </h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Interest Rate
                                </span>
                                <span>10.5% - 18%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Loan Amount
                                </span>
                                <span>Up to ₹20,00,000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Tenure
                                </span>
                                <span>Up to 5 years</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Processing Fee
                                </span>
                                <span>1% - 2%</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Eligibility Criteria
                            </h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-800 dark:text-gray-200">
                              <li>Age between 21-65 years</li>
                              <li>Minimum monthly income of ₹25,000</li>
                              <li>CIBIL score above 700</li>
                              <li>1+ years of work experience</li>
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium text-sm mb-2">
                              Required Documents
                            </h4>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-800 dark:text-gray-200">
                              <li>Identity proof (Aadhaar/PAN)</li>
                              <li>Address proof (Utility bill/Passport)</li>
                              <li>Income proof (Salary slips, IT returns)</li>
                              <li>Employment details verification</li>
                              <li>Property documents (for home loans)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )
        }
      </div >

      {/* Mobile chat toggle button - Always visible when chat is closed */}
      {
        isMobile && !chatOpen && (
          <Button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg bg-blue-600 hover:bg-blue-700 p-0 z-30"
          >
            <MessageSquare className="h-5 w-5 text-white" />
          </Button>
        )
      }
    </div >
  );
}
