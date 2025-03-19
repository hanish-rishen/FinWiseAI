"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { Card, CardContent } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
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
  PlayCircle,
  PauseCircle,
  StopCircle,
  Square,
  RefreshCw,
  CheckCircle,
  User,
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

// Import the custom hook at the top
import { useGroqSpeechRecognition } from "@/lib/groq-speech-recognition";

// Add TypeScript declarations for Speech Recognition API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

// Add constructor types
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

interface DatabaseResult {
  success: boolean;
  data: any;
  message?: string;
  updated?: boolean;
  inserted?: boolean;
  noChanges?: boolean;
  error?: string;
  localData?: any;
}

// Make TypeScript aware of these browser globals
declare global {
  var SpeechRecognition: SpeechRecognitionConstructor | undefined;
  var webkitSpeechRecognition: SpeechRecognitionConstructor | undefined;
}

// Replace the current Supabase initialization with this

import { createClient } from "@/utils/supabase/client";

// Update the initialization part of your component
export default function AiBranchManager() {
  const { t } = useLanguage();
  const router = useRouter();

  // Replace the existing supabase initialization with this
  const [supabaseClient] = useState(() => createClient());
  const [authStatus, setAuthStatus] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    userId: string | null;
    error: string | null;
  }>({
    isLoading: true,
    isAuthenticated: false,
    userId: null,
    error: null,
  });

  // Add this effect to check authentication status early
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user session
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        if (session?.user) {
          console.log("User authenticated:", session.user.id);
          setAuthStatus({
            isLoading: false,
            isAuthenticated: true,
            userId: session.user.id,
            error: null,
          });
        } else {
          console.warn("No authenticated user found");
          setAuthStatus({
            isLoading: false,
            isAuthenticated: false,
            userId: null,
            error: "User not authenticated",
          });

          // Redirect unauthenticated users to login
          router.push(
            `/sign-in?redirectedFrom=${encodeURIComponent("/dashboard/video-banker")}`
          );
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setAuthStatus({
          isLoading: false,
          isAuthenticated: false,
          userId: null,
          error: String(error),
        });
      }
    };

    checkAuth();
  }, [supabaseClient, router]);

  // Add an auth status indicator in your UI
  const AuthStatusIndicator = () => (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 ${
        authStatus.isAuthenticated
          ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
          : authStatus.isLoading
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
      }`}
    >
      <User className="h-3 w-3" />
      <span>
        {authStatus.isLoading
          ? "Checking..."
          : authStatus.isAuthenticated
            ? "Signed In"
            : "Guest"}
      </span>
    </Badge>
  );

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

  // New state variables for recording and conversation
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ question: string; response: string }>
  >([]);

  // Add this state for manual input
  const [showManualInput, setShowManualInput] = useState(false);

  //Face recognition states
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] =
    useState<Float32Array | null>(null);
  const [isSamePerson, setIsSamePerson] = useState(true);
  const [identityCheckActive, setIdentityCheckActive] = useState(false);
  const identityCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClientComponentClient();
  // Refs for video elements
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const aiVideoRef = useRef<HTMLVideoElement>(null);

  // Add these states for better error handling and debugging
  const [recognitionState, setRecognitionState] = useState("idle");
  const [recognitionRetries, setRecognitionRetries] = useState(0);
  const MAX_RETRIES = 3;

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Specify the models directory
        const MODEL_URL = "/models";
        //load models
        await loadSsdMobilenetv1Model(MODEL_URL);
        await loadFaceLandmarkModel(MODEL_URL);
        await loadFaceRecognitionModel(MODEL_URL);
        await loadTinyFaceDetectorModel(MODEL_URL);

        console.log("Face-api models loaded successfully");
        setFaceApiLoaded(true);
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };

    loadModels();
  }, []);

  // Function to get face descriptor
  const getFaceDescriptor = async (video: HTMLVideoElement) => {
    if (!video || !faceApiLoaded) return null;

    try {
      // Detect face with landmarks and descriptors
      const detections = await detectSingleFace(
        video,
        new TinyFaceDetectorOptions()
      )
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        console.log("face detected");
        return detections.descriptor;
      }

      return null;
    } catch (error) {
      console.error("Error getting face descriptor:", error);
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
        const distance = euclideanDistance(
          referenceDescriptor,
          currentDescriptor
        );

        // Threshold for determining if same person (adjust as needed)
        const SAME_PERSON_THRESHOLD = 0.6;
        const isSame = distance < SAME_PERSON_THRESHOLD;

        setIsSamePerson(isSame);

        if (!isSame) {
          console.log("Different person detected!", distance);
        }
      } else if (referenceDescriptor && !currentDescriptor) {
        // No face detected now, but we had one before
        setIsSamePerson(false);
      }
    } catch (error) {
      console.error("Error verifying identity:", error);
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

  // Update the Questions array to remove options from the main questions
  const questions = [
    "Hello! I'm FinWiseAI, your AI Branch Manager. How can I help you today with your financial needs?",
    "What is your monthly income?",
    "What is your employment type?",
    "Do you have a credit history (CIBIL Score)?",
    "What loan amount are you applying for?",
    "What is the loan tenure (repayment period) you are looking for?",
    "Do you have any existing loans or EMIs?",
    "Do you have collateral to offer for the loan?",
    "What is your current residence type?",
    "How long have you been residing at your current address?",
    "Have you ever been associated with any of the following?",
    "What was the outcome of the field investigation at your residence?",
    "What was the outcome of the field investigation at your workplace/business?",
    "Was the applicant reachable during tele-verification?",
    "Did the applicant confirm all details accurately during tele-verification?",
  ];

  // Add options for each question
  const questionOptions = [
    // Question 0 - Introduction
    [],
    // Question 1 - Monthly income
    [
      "Less than ₹10,000",
      "₹10,000 - ₹30,000",
      "₹30,000 - ₹50,000",
      "More than ₹50,000",
    ],
    // Question 2 - Employment type
    [
      "Salaried (Government Employee)",
      "Salaried (Private Sector)",
      "Self-employed (Business Owner/Freelancer)",
      "Unemployed",
    ],
    // Question 3 - Credit history
    [
      "Yes, and my CIBIL score is above 750",
      "Yes, and my CIBIL score is between 650-750",
      "Yes, but my CIBIL score is below 650",
      "No, I do not have a credit history",
    ],
    // Question 4 - Loan amount
    [
      "Less than ₹50,000",
      "₹50,000 - ₹2,00,000",
      "₹2,00,000 - ₹10,00,000",
      "More than ₹10,00,000",
    ],
    // Question 5 - Loan tenure
    ["Less than 1 year", "1 - 3 years", "3 - 5 years", "More than 5 years"],
    // Question 6 - Existing loans
    [
      "No existing loans or EMIs",
      "Yes, but I have been paying on time",
      "Yes, but I have missed a few payments",
      "Yes, and I have defaulted on loans",
    ],
    // Question 7 - Collateral
    [
      "Yes, I have high-value property (House, Land, etc.)",
      "Yes, I have a vehicle or gold as collateral",
      "No, but I have a guarantor",
      "No, I do not have any collateral",
    ],
    // Question 8 - Residence type
    [
      "Own House",
      "Rental House",
      "Government Quarters",
      "Company Provided Accommodation",
    ],
    // Question 9 - Duration at address
    ["Less than 1 year", "1–3 years", "3–5 years", "More than 5 years"],
    // Question 10 - Associations
    [
      "Police Case (FIR/Legal Issues)",
      "Advocate (Frequent legal disputes)",
      "Political Party (Active role in politics)",
      "None of the above",
    ],
    // Question 11 - Field investigation residence
    [
      "Verified – Residence Confirmed",
      "Not Verified – Address Not Found",
      "Address Mismatch",
      "Under Further Investigation",
    ],
    // Question 12 - Field investigation workplace
    [
      "Verified – Business Exists & Operational",
      "Verified – Salaried Employee at Given Workplace",
      "Business Closed/Not Found",
      "Mismatched Information",
    ],
    // Question 13 - Tele-verification reachability
    [
      "Yes",
      "No (Number Switched Off/Not Reachable)",
      "Incorrect Contact Details",
    ],
    // Question 14 - Tele-verification accuracy
    [
      "Yes – Fully Matched with Documents",
      "No – Partial Mismatch",
      "No – Major Discrepancies Found",
    ],
  ];

  // Update questionTimestamps array with correct timings
  const questionTimestamps = [
    { start: 0, end: 3 }, // Question 1 intro (not shown)
    { start: 0, end: 3 }, // Question 2 (updated to start at 0:00)
    { start: 3, end: 8 }, // Question 3
    { start: 9, end: 14 }, // Question 4
    { start: 14, end: 17 }, // Question 5
    { start: 18, end: 24 }, // Question 6
    { start: 25, end: 30 }, // Question 7
    { start: 32, end: 37 }, // Question 8
    { start: 38, end: 42 }, // Question 9
    { start: 43, end: 48 }, // Question 10
    { start: 49, end: 54 }, // Question 11
    { start: 55, end: 60 }, // Question 12
    { start: 61, end: 67 }, // Question 13
    { start: 68, end: 72 }, // Question 14
    { start: 73, end: 80 }, // Question 15
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
      // Stop recording if in progress
      if (isRecording) {
        stopRecording();
      }
      setCurrentQuestion(currentQuestion + 1);
      setShowControls(true);
      // The video will be controlled by the useEffect that watches currentQuestion
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      // Stop recording if in progress
      if (isRecording) {
        stopRecording();
      }
      setCurrentQuestion(currentQuestion - 1);
      setShowControls(true);
      // The video will be controlled by the useEffect that watches currentQuestion
    }
  };

  // Function to toggle video playback state
  const toggleVideoPlayback = () => {
    if (aiVideoRef.current) {
      if (isVideoPaused) {
        aiVideoRef.current.play();
      } else {
        aiVideoRef.current.pause();
      }
      setIsVideoPaused(!isVideoPaused);
    }
  };

  // Replace your existing speech recognition states with this:
  const {
    isListening,
    isProcessing,
    transcript,
    error: speechError,
    startListening,
    stopListening,
    cancelListening,
    resetTranscript,
  } = useGroqSpeechRecognition();

  // Keep these states
  const [isRecording, setIsRecording] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");

  // Replace the startRecording function with this
  const startRecording = () => {
    if (isRecording) return; // Already recording

    setIsRecording(true);
    setCurrentResponse("");

    // Start Groq speech recognition
    startListening()
      .then(() => {
        console.log("Speech recognition started successfully");
      })
      .catch((err) => {
        console.error("Failed to start listening:", err);
        // Even if speech recognition fails, we're still in recording mode,
        // so users can type their response
      });
  };

  // Update the stopRecording function - triggered by Submit button
  const stopRecording = async () => {
    // Always save the response, even if it's empty
    const newConversation = [...conversation];
    newConversation.push({
      question: questions[currentQuestion],
      response: currentResponse || "No response recorded",
    });

    setConversation(newConversation);

    // Stop Groq speech recognition if it's running
    if (isListening || isProcessing) {
      stopListening(); // Use the imported hook function
    }

    // Save the response to database
    try {
      const result = await saveResponsesToDatabase();

      if (result.success) {
        console.log("Response saved to database successfully");
      } else {
        console.warn(
          "Database save returned unsuccessful but didn't throw:",
          result.message
        );
        // Don't show an alert here - we'll handle messaging in saveResponsesToDatabase
      }
    } catch (error) {
      console.error("Failed to save response to database:", error);
      // Don't show an alert here - we'll handle messaging in saveResponsesToDatabase
    }

    resetTranscript();
    setIsRecording(false);

    // Move to next question if available
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setCurrentResponse("");
        // Video will be controlled by the question change effect
      }, 500);
    } else {
      setCurrentResponse("");
      // Handle end of questions - show completion state or redirect
      showCompletionMessage();
    }
  };

  // Update transcript when it changes from Groq API
  useEffect(() => {
    if (transcript) {
      setCurrentResponse(transcript);
    }
  }, [transcript]);

  // Update recognition state based on errors
  useEffect(() => {
    if (speechError) {
      setRecognitionState(`error-${speechError}`);
    }
  }, [speechError]);

  // Add effect to automatically pause at specific timestamps
  useEffect(() => {
    if (aiVideoRef.current) {
      // Set up event listener for time updates
      const handleTimeUpdate = () => {
        if (aiVideoRef.current) {
          // This is a placeholder - in a real implementation, you'd have specific timestamps
          // For example, pause at 10 seconds, 30 seconds, etc.
          const pauseTimestamps = [
            10, 30, 60, 90, 120, 150, 180, 210, 240, 270,
          ];
          const currentTime = Math.floor(aiVideoRef.current.currentTime);

          if (pauseTimestamps.includes(currentTime) && !isVideoPaused) {
            aiVideoRef.current.pause();
            setIsVideoPaused(true);
            // Remove this line to prevent auto-recording:
            // startRecording();
          }
        }
      };

      aiVideoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        if (aiVideoRef.current) {
          aiVideoRef.current.removeEventListener(
            "timeupdate",
            handleTimeUpdate
          );
        }
      };
    }
  }, [isVideoPaused]);

  // Add this state at the top of your component
  const [sessionStarted, setSessionStarted] = useState(false);

  // Add this function to your component
  const playQuestionVideo = (questionIndex: number) => {
    // Skip for the first question
    if (questionIndex === 0 || isRecording) return;

    // Get the correct timestamps for this question
    const timestamps = questionTimestamps[questionIndex];
    if (!timestamps) return;

    // Get video element - Fix the type to HTMLVideoElement
    const videoElement = document.getElementById("aiVideo") as HTMLVideoElement; // Changed from HTMLIFrameElement
    if (!videoElement) return;

    try {
      console.log(
        `Playing question ${questionIndex} video from ${timestamps.start} to ${timestamps.end}`
      );

      // Seek to the correct position
      videoElement.currentTime = timestamps.start;
      setIsVideoPaused(false);

      // Play the video and handle any issues
      videoElement
        .play()
        .then(() => {
          console.log("Video playback started successfully");
        })
        .catch((error: Error) => {
          // Add explicit type for error
          console.error("Error playing video:", error);
          // User interaction may be needed to play video
          setIsVideoPaused(true);
        });
    } catch (error: unknown) {
      // Fix the implicit any type
      console.error("Error controlling video:", error);
      setIsVideoPaused(true);
    }
  };

  // Replace the existing useEffect for video timeupdate
  useEffect(() => {
    // Function to handle question changes and video control
    const handleQuestionChange = () => {
      // Skip for question 0 (intro)
      if (currentQuestion === 0) return;

      // If currently recording, don't play video
      if (isRecording) return;

      // Get timestamps for current question
      const timestamps = questionTimestamps[currentQuestion];
      if (!timestamps) return;

      // Play the video segment for this question
      playQuestionVideo(currentQuestion);
    };

    // Control video when current question changes
    handleQuestionChange();

    // Set up time update listener for the video
    const videoElement = document.getElementById("aiVideo") as HTMLVideoElement;
    if (videoElement && currentQuestion > 0) {
      const handleTimeUpdate = () => {
        const timestamps = questionTimestamps[currentQuestion];
        if (timestamps && videoElement.currentTime >= timestamps.end) {
          videoElement.pause();
          setIsVideoPaused(true);

          // REMOVED: No longer automatically start recording
          // if (!isRecording) {
          //   startRecording();
          // }
        }
      };

      // Add the listener
      videoElement.addEventListener("timeupdate", handleTimeUpdate);

      // Clean up
      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [currentQuestion, isRecording]);

  // Update the useEffect for timeupdate to only pause the video when the question ends
  useEffect(() => {
    if (aiVideoRef.current && currentQuestion > 0) {
      // Set up event listener for time updates
      const handleTimeUpdate = () => {
        const videoElement = aiVideoRef.current;
        if (!videoElement) return;

        // Get timestamps for current question
        const timestamps = questionTimestamps[currentQuestion];
        if (timestamps && videoElement.currentTime >= timestamps.end) {
          videoElement.pause();
          setIsVideoPaused(true);
          // Removed automatic recording completely
        }
      };

      // Add the listener
      aiVideoRef.current.addEventListener("timeupdate", handleTimeUpdate);

      // Clean up
      return () => {
        if (aiVideoRef.current) {
          aiVideoRef.current.removeEventListener(
            "timeupdate",
            handleTimeUpdate
          );
        }
      };
    }
  }, [currentQuestion, isVideoPaused]);

  // Update the saveResponsesToDatabase function

  const saveResponsesToDatabase = async (): Promise<DatabaseResult> => {
    try {
      console.log("Starting database save operation...");

      // Use the pre-fetched auth status for reliability
      const userId = authStatus.userId;

      // If we have a user ID from our auth check
      if (userId) {
        console.log("Using authenticated user:", userId);

        // Format responses for easier DB access - adjust indices to match conversation
        interface ApplicationData {
          [key: string]: any; // Add index signature to allow string indexing
          user_id: string;
          updated_at: string;
          intro_response: string;
          monthly_income: string;
          employment_type: string;
          credit_history: string;
          loan_amount: string;
          loan_tenure: string;
          existing_loans: string;
          collateral: string;
          residence_type: string;
          residence_duration: string;
          associations: string;
          field_investigation_residence: string;
          field_investigation_workplace: string;
          tele_verification_reachable: string;
          tele_verification_accuracy: string;
          identity_verification_passed: boolean;
          application_complete: boolean;
          created_at?: string; // Make this optional
        }

        const applicationData: ApplicationData = {
          user_id: userId,
          updated_at: new Date().toISOString(),

          // Note: intro_response will typically be empty
          intro_response: "", // This should be empty as users don't answer intro

          // Conversation[0] corresponds to Question 1 (monthly income)
          monthly_income: conversation[0]?.response || "",
          employment_type: conversation[1]?.response || "",
          credit_history: conversation[2]?.response || "",
          loan_amount: conversation[3]?.response || "",
          loan_tenure: conversation[4]?.response || "",
          existing_loans: conversation[5]?.response || "",
          collateral: conversation[6]?.response || "",
          residence_type: conversation[7]?.response || "",
          residence_duration: conversation[8]?.response || "",
          associations: conversation[9]?.response || "",
          field_investigation_residence: conversation[10]?.response || "",
          field_investigation_workplace: conversation[11]?.response || "",
          tele_verification_reachable: conversation[12]?.response || "",
          tele_verification_accuracy: conversation[13]?.response || "",
          identity_verification_passed: isSamePerson,
          application_complete: currentQuestion >= questions.length - 1,
        };

        // Get application_id from localStorage if available (for updates)
        const savedData = localStorage.getItem("videobanker_application");
        let applicationId = null;

        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            applicationId = parsedData.application_id;
          } catch (e) {
            console.warn("Could not parse saved application data", e);
          }
        }

        console.log("Application ID from storage:", applicationId);

        let result: DatabaseResult = { success: false, data: null };
        let hasChanges = false;

        // If we have an application ID, try to update that record
        if (applicationId) {
          console.log(
            "Checking if update is needed for application:",
            applicationId
          );

          try {
            // Try to get the current data first
            const { data: existingData, error: fetchError } = await supabase
              .from("application")
              .select("*")
              .eq("application_id", applicationId)
              .maybeSingle();

            if (fetchError) {
              console.warn("Error fetching existing data:", fetchError);
              // Continue with update
              hasChanges = true;
            } else if (!existingData) {
              console.warn("No existing record found, will insert new one");
              // Application ID no longer exists, we'll insert a new record
              applicationId = null;
            } else {
              // Check for changes in important fields
              hasChanges = false;

              // Fields that should trigger an update if changed
              const keyFields = [
                "monthly_income",
                "employment_type",
                "credit_history",
                "loan_amount",
                "loan_tenure",
                "existing_loans",
                "collateral",
                "residence_type",
                "residence_duration",
                "associations",
                "field_investigation_residence",
                "field_investigation_workplace",
                "tele_verification_reachable",
                "tele_verification_accuracy",
                "application_complete",
              ];

              for (const field of keyFields) {
                if (existingData[field] !== applicationData[field]) {
                  console.log(
                    `Field '${field}' changed from '${existingData[field]}' to '${applicationData[field]}'`
                  );
                  hasChanges = true;
                  break;
                }
              }
            }

            // Update if we have an ID and there are changes
            if (applicationId && hasChanges) {
              console.log("Updating application with changes");

              // Perform update
              const { error: updateError } = await supabase
                .from("application")
                .update(applicationData)
                .eq("application_id", applicationId);

              if (updateError) throw updateError;

              // Now fetch the updated data
              const { data: updatedData, error: fetchUpdatedError } =
                await supabase
                  .from("application")
                  .select("*")
                  .eq("application_id", applicationId)
                  .single();

              if (fetchUpdatedError) {
                console.warn("Error fetching updated data:", fetchUpdatedError);
                result = {
                  success: true,
                  data: { application_id: applicationId },
                  updated: true,
                };
              } else {
                result = { success: true, data: updatedData, updated: true };
              }

              console.log("Update successful, fetched data:", updatedData);
            } else if (applicationId) {
              console.log("No changes detected, skipping update");

              // Just fetch the current data for consistency
              const { data: currentData } = await supabase
                .from("application")
                .select("*")
                .eq("application_id", applicationId)
                .single();

              result = {
                success: true,
                data: currentData,
                updated: false,
                noChanges: true,
              };
            }
          } catch (err) {
            console.error("Error during update flow:", err);
            // If update fails for any reason, try insert as fallback
            applicationId = null;
          }
        }

        // If we don't have an ID or update failed, insert a new record
        if (!applicationId) {
          console.log("Creating new application record");

          // Add created_at for new records
          applicationData.created_at = new Date().toISOString();

          // Perform insert
          const { data: insertedData, error: insertError } = await supabase
            .from("application")
            .insert([applicationData])
            .select();

          if (insertError) throw insertError;

          console.log("Insert successful, data:", insertedData);
          applicationId = insertedData?.[0]?.application_id;
          result = { success: true, data: insertedData?.[0], inserted: true };
        }

        // Update localStorage with application_id
        localStorage.setItem(
          "videobanker_application",
          JSON.stringify({
            timestamp: new Date().toISOString(),
            user_id: userId,
            application_id:
              applicationId || (result.data as any)?.application_id,
            conversation: conversation,
            currentQuestion,
          })
        );

        // Show feedback to the user
        const actionType = result.inserted
          ? "created"
          : result.updated
            ? "updated"
            : "unchanged";

        setNotification({
          show: true,
          message: `Application ${actionType} successfully`,
          type: "success",
        });

        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setNotification((prev) => ({ ...prev, show: false }));
        }, 3000);

        console.log("Database operation complete:", {
          success: result.success,
          action: actionType,
          applicationId: applicationId || (result.data as any)?.application_id,
          dataLength: Array.isArray(result.data)
            ? result.data.length
            : result.data
              ? 1
              : 0,
          data: result.data,
        });

        return result;
      } else {
        console.warn(
          "No authenticated user found - saving to localStorage only"
        );

        // Format the data consistently
        const localData = {
          timestamp: new Date().toISOString(),
          conversation: conversation,
          currentQuestion: currentQuestion,
        };

        localStorage.setItem(
          "videobanker_application",
          JSON.stringify(localData)
        );

        return {
          success: false,
          message: "Not authenticated - application saved locally",
          localData,
          data: null, // Add this line to fix the error
        };
      }
    } catch (error) {
      console.error("Failed to save application data:", error);

      // Always save to localStorage as backup
      const backupData = {
        timestamp: new Date().toISOString(),
        conversation: conversation,
        currentQuestion: currentQuestion,
        error: String(error),
      };

      localStorage.setItem(
        "videobanker_application",
        JSON.stringify(backupData)
      );

      // Show error notification
      setNotification({
        show: true,
        message: `Error saving data: ${String(error).substring(0, 50)}`,
        type: "error",
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 5000);

      return {
        success: false,
        error: String(error),
        localData: backupData,
        data: null, // Add this line to fix the error
      };
    }
  };

  // Add this function to your component
  const handleEndSession = async () => {
    // Stop any active recording
    if (isListening || isProcessing) {
      stopListening();
    }

    // Save all data to database
    try {
      await saveResponsesToDatabase();

      // Show a success message or toast
      alert("Session ended and responses saved successfully!");

      // Redirect to dashboard
      router.push("/dashboard?status=completed");
    } catch (error) {
      console.error("Error saving session data:", error);

      // Show error message
      alert("There was an error saving your responses. Please try again.");
    }
  };

  // Add these refs at the top of your component, with your other refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Add this function to show completion message
  const showCompletionMessage = () => {
    // You could implement a modal or toast notification here
    alert("Application completed! Thank you for your responses.");

    // Or redirect to a completion page
    setTimeout(() => {
      router.push("/dashboard?status=completed");
    }, 1500);
  };

  // Improved initialization with error handling
  const supabaseWithRetry = (() => {
    try {
      return createClientComponentClient();
    } catch (e) {
      console.error("Error creating Supabase client:", e);
      // Try a different initialization approach as fallback
      return createClientComponentClient({
        cookieOptions: {
          path: "/",
          name: "sb-auth-token",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax", // Add this property
          domain: "", // Add this property (empty string for current domain)
        },
      });
    }
  })();

  // Add this function to your Video Banker component
  const loadExistingApplication = async () => {
    try {
      // Check localStorage first for application_id
      const savedData = localStorage.getItem("videobanker_application");
      let applicationId = null;

      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          applicationId = parsedData.application_id;
        } catch (e) {
          console.warn("Could not parse saved application data", e);
        }
      }

      const userId = authStatus.userId;
      if (!userId) return null;

      // Query options
      const queryOptions = applicationId
        ? { application_id: applicationId }
        : { user_id: userId, application_complete: false };

      console.log("Loading application with query:", queryOptions);

      // Fetch the most recent incomplete application for this user
      let query = supabaseClient.from("application").select("*");

      // Add filters based on available info
      if (applicationId) {
        query = query.eq("application_id", applicationId);
      } else {
        query = query
          .eq("user_id", userId)
          .eq("application_complete", false)
          .order("created_at", { ascending: false })
          .limit(1);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        console.log("Found existing application:", data[0]);

        // Save the application_id to localStorage
        localStorage.setItem(
          "videobanker_application",
          JSON.stringify({
            timestamp: new Date().toISOString(),
            user_id: userId,
            application_id: data[0].application_id,
            lastQuestion: determineLastAnsweredQuestion(data[0]),
          })
        );

        return data[0];
      }

      return null;
    } catch (error) {
      console.error("Error loading application:", error);
      return null;
    }
  };

  // Update around line 1471
  const determineLastAnsweredQuestion = (
    applicationData: Record<string, any>
  ) => {
    const questionFields = [
      "intro_response",
      "monthly_income",
      "employment_type",
      "credit_history",
      "loan_amount",
      "loan_tenure",
      "existing_loans",
      "collateral",
      "residence_type",
      "residence_duration",
      "associations",
      "field_investigation_residence",
      "field_investigation_workplace",
      "tele_verification_reachable",
      "tele_verification_accuracy",
    ];

    // Find the last field that has a value
    let lastAnsweredIndex = -1;

    questionFields.forEach((field, index) => {
      if (applicationData[field]) {
        lastAnsweredIndex = index;
      }
    });

    return lastAnsweredIndex;
  };

  // Add this to your main useEffect in the component
  useEffect(() => {
    const checkAuth = async () => {
      // Your existing auth code...

      // After authentication is successful, try to load existing application
      if (authStatus.isAuthenticated) {
        const existingApplication = await loadExistingApplication();

        if (existingApplication) {
          // If there's an existing incomplete application, load its data
          const lastAnsweredQuestion =
            determineLastAnsweredQuestion(existingApplication);

          // Only restore if we found any answered questions
          if (lastAnsweredQuestion >= 0) {
            console.log(
              `Restoring application from question ${lastAnsweredQuestion}`
            );

            // Restore conversation data
            const restoredConversation = [...conversation];

            // Map database fields to conversation responses
            const fieldToQuestionMap = {
              // Don't include intro_response as it's not answered
              monthly_income: 0,
              employment_type: 1,
              credit_history: 2,
              loan_amount: 3,
              loan_tenure: 4,
              existing_loans: 5,
              collateral: 6,
              residence_type: 7,
              residence_duration: 8,
              associations: 9,
              field_investigation_residence: 10,
              field_investigation_workplace: 11,
              tele_verification_reachable: 12,
              tele_verification_accuracy: 13,
            };

            // Restore each answer
            Object.entries(fieldToQuestionMap).forEach(([field, index]) => {
              if (
                existingApplication[field] &&
                index < restoredConversation.length
              ) {
                restoredConversation[index].response =
                  existingApplication[field];
              }
            });

            // Update state with restored data
            setConversation(restoredConversation);

            // Set question to the next unanswered question
            setCurrentQuestion(
              Math.min(lastAnsweredQuestion + 1, questions.length - 1)
            );

            // Show a notification
            setNotification({
              show: true,
              message: "Restored your previous application progress",
              type: "info",
            });
          }
        }
      }
    };

    checkAuth();
  }, [authStatus.isAuthenticated]);

  // Add this to your Video Banker component state
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error" | "info";
  }>({
    show: false,
    message: "",
    type: "info",
  });

  // Update the handleNextQuestion function
  const handleNextQuestion = async () => {
    if (currentQuestion === questions.length - 1) {
      // Handle end of questions
      return;
    }

    // Save the current state to database
    const saveResult = await saveResponsesToDatabase();
    console.log("Save result:", saveResult);

    // Move to next question
    setCurrentQuestion((prev) => prev + 1);

    // Show notification for first save
    if (saveResult?.inserted) {
      setNotification({
        show: true,
        message: "Application created successfully!",
        type: "success",
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  // Map question indices to database fields correctly
  function mapQuestionToField(index: number): string {
    const fieldMap: Record<number, string> = {
      0: "intro_response", // This will be empty/null as users don't answer intro
      1: "monthly_income",
      2: "employment_type",
      3: "credit_history",
      4: "loan_amount",
      5: "loan_tenure",
      6: "existing_loans",
      7: "collateral",
      8: "residence_type",
      9: "residence_duration",
      10: "associations",
      11: "field_investigation_residence",
      12: "field_investigation_workplace",
      13: "tele_verification_reachable",
      14: "tele_verification_accuracy",
    };

    return fieldMap[index] || "";
  }

  // And the reverse mapping for restoration
  function mapFieldToQuestionIndex(field: string): number {
    const indexMap: Record<string, number> = {
      intro_response: -1, // Special case - not in conversation array
      monthly_income: 0,
      employment_type: 1,
      credit_history: 2,
      loan_amount: 3,
      loan_tenure: 4,
      existing_loans: 5,
      collateral: 6,
      residence_type: 7,
      residence_duration: 8,
      associations: 9,
      field_investigation_residence: 10,
      field_investigation_workplace: 11,
      tele_verification_reachable: 12,
      tele_verification_accuracy: 13,
    };

    return indexMap[field] !== undefined ? indexMap[field] : -1;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="mr-2">
            <ArrowLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-sm font-medium">{t("ai_branch_manager")}</h1>
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
            onClick={handleEndSession}
          >
            {t("end_session")}
          </Button>
          <AuthStatusIndicator />
        </div>
      </div>

      {/* Main content area - Fixed height calculation to fit viewport */}
      <div className="flex flex-1 h-[calc(100vh-49px)] overflow-hidden">
        {/* Video area - left side with fixed width for large screens */}
        <div
          className={`${
            chatOpen ? "w-full lg:w-[65%]" : "w-full"
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
              {/* Conditional rendering based on current question */}
              {currentQuestion === 0 ? (
                /* First question - Show welcome screen only */
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <div className="w-32 h-32 mx-auto bg-blue-500/30 border-2 border-blue-400 rounded-full mb-4 flex items-center justify-center">
                      <span className="text-5xl">👩‍💼</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Questions 2+ - Show video */
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <video
                    id="aiVideo"
                    ref={aiVideoRef}
                    className="w-full h-full object-contain"
                    src="/videos/Loan Application Video Process (English).mp4"
                    controls={false}
                    preload="auto"
                  ></video>
                </div>
              )}

              {/* The rest of your video content elements */}
              {/* ... */}
            </motion.div>

            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-16 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center animate-pulse">
                <span className="mr-2 h-2 w-2 bg-white rounded-full inline-block"></span>
                Recording...
              </div>
            )}

            {/* Playback controls for AI video */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full py-1 px-3 flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/20"
                onClick={toggleVideoPlayback}
              >
                {isVideoPaused ? (
                  <PlayCircle className="h-5 w-5" />
                ) : (
                  <PauseCircle className="h-5 w-5" />
                )}
              </Button>

              {isRecording && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 rounded-full p-0 text-red-500 hover:bg-white/20"
                  onClick={stopRecording}
                >
                  <StopCircle className="h-5 w-5" />
                </Button>
              )}
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
              className={`absolute top-4 right-4 w-32 md:w-48 aspect-[16/10] rounded-lg overflow-hidden ${
                isSpeaking
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

              {/* Start button on first question */}
              {currentQuestion === 0 && !sessionStarted && (
                <Button
                  size="lg"
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setSessionStarted(true);
                    setCurrentQuestion(1);
                  }}
                >
                  Start Interview
                </Button>
              )}

              {/* Current response display */}
              {/* Update this section to show recognition state and response */}
              {isRecording && (
                <div className="mt-2 p-2 bg-white/10 backdrop-blur-sm rounded-md text-white text-sm">
                  <div className="flex justify-between mb-1">
                    <p className="font-semibold">Your response:</p>
                    {isListening && (
                      <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        {isProcessing ? "Transcribing..." : "Listening..."}
                      </span>
                    )}
                  </div>

                  {/* Always display current response, even if it's empty */}
                  <div className="min-h-[40px] mb-2">
                    {currentResponse ? (
                      <p className="text-white">{currentResponse}</p>
                    ) : (
                      <p className="text-white/60 italic">
                        {isListening
                          ? "Speak now... transcription will appear here"
                          : "No response yet - type below"}
                      </p>
                    )}
                  </div>

                  {/* Always show manual input for reliability */}
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      className="flex-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your response here..."
                    />
                    <Button
                      size="sm"
                      onClick={stopRecording}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Submit
                    </Button>
                  </div>

                  {/* Add cancel button */}
                  {isListening && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-red-500/20 hover:bg-red-500/30 text-white"
                      onClick={() => {
                        cancelListening();
                        setIsRecording(false);
                      }}
                    >
                      Restart Recording ?
                    </Button>
                  )}
                </div>
              )}
            </motion.div>

            {/* Update the response display section in page.tsx */}
            {isVideoPaused && (
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <div className="mt-2 p-3 bg-white/10 backdrop-blur-sm rounded-md text-white">
                  <h3 className="text-lg font-medium mb-2">Your Response</h3>

                  {/* Display area for transcribed text */}
                  <div className="min-h-[80px] bg-black/20 rounded-md p-3 mb-3">
                    {isProcessing ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                          <p className="mt-2 text-sm text-white/70">
                            Transcribing audio...
                          </p>
                        </div>
                      </div>
                    ) : currentResponse ? (
                      <p className="text-white">{currentResponse}</p>
                    ) : (
                      <p className="text-white/50 italic">
                        {isListening
                          ? "Speak clearly... your response will appear here"
                          : "No response yet - press 'Start Recording' when ready"}
                      </p>
                    )}
                  </div>

                  {/* Recording status indicator */}
                  {isListening && (
                    <div className="flex items-center bg-red-500/20 py-1 px-2 rounded mb-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                      <span className="text-sm">Recording in progress...</span>
                    </div>
                  )}

                  {/* Manual text input */}
                  <div className="mb-3">
                    <input
                      type="text"
                      value={currentResponse}
                      onChange={(e) => setCurrentResponse(e.target.value)}
                      className="w-full bg-white/20 text-white px-3 py-2 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Type your response here..."
                      disabled={isProcessing}
                    />
                  </div>

                  {/* Three Button Controls */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Start Recording Button */}
                    <Button
                      className={`${
                        isListening
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } flex items-center justify-center`}
                      onClick={startListening}
                      disabled={isListening || isProcessing}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Start
                    </Button>

                    {/* Stop Recording Button */}
                    <Button
                      className={`${
                        !isListening
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      } flex items-center justify-center`}
                      onClick={stopListening}
                      disabled={!isListening || isProcessing}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>

                    {/* Submit Response Button */}
                    <Button
                      className="bg-green-600 hover:bg-green-700 flex items-center justify-center"
                      onClick={stopRecording}
                      disabled={isProcessing}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>

                  {/* Instructions */}
                  <div className="mt-3 text-xs text-white/70 text-center">
                    <p>1. Press "Start" to begin recording your response</p>
                    <p>2. Press "Stop" when finished speaking</p>
                    <p>3. Press "Submit" to confirm your answer</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div
            className={`bg-white dark:bg-gray-900 transition-all duration-300 ${
              isMobile && !showControls
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
                  <span className="text-xs">Quick Access</span>
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
        </div>

        {/* Chat area - right side with fixed width */}
        {chatOpen && (
          <div className="hidden lg:block w-[35%] h-full">
            <Card className="h-[calc(100vh-65px)] border-0 lg:border m-0 lg:mx-2 lg:my-2 rounded-none lg:rounded-xl shadow-none lg:shadow overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Header with close button */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-3">
                  <h2 className="font-medium text-sm">Quick Access</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tabs for chat, documents, info, conversation */}
                <Tabs defaultValue="examples" className="flex-1 flex flex-col">
                  <TabsList className="grid grid-cols-3 bg-transparent p-0 border-b border-gray-100 dark:border-gray-800">
                    <TabsTrigger
                      value="examples"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                    >
                      Example Responses
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                    >
                      Documents
                    </TabsTrigger>
                    <TabsTrigger
                      value="conversation"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-sm font-medium"
                    >
                      Conversation
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value="examples"
                    className="flex-1 flex flex-col m-0 p-0 mt-0 data-[state=active]:border-0 overflow-hidden"
                  >
                    <div className="flex-1 overflow-y-auto p-4">
                      <h3 className="font-medium mb-3 text-blue-600 dark:text-blue-400">
                        Example Responses for Question {currentQuestion + 1}
                      </h3>

                      {questionOptions[currentQuestion] &&
                      questionOptions[currentQuestion].length > 0 ? (
                        <div className="space-y-2">
                          {questionOptions[currentQuestion].map(
                            (option, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer transition-colors"
                                onClick={() => {
                                  setCurrentResponse(option);
                                }}
                              >
                                <div className="flex items-start gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium shrink-0">
                                    {String.fromCharCode(97 + idx)}
                                  </div>
                                  <p className="text-sm">{option}</p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          {currentQuestion === 0
                            ? "This is an introduction question. Feel free to respond naturally."
                            : "No example responses available for this question."}
                        </p>
                      )}

                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                        <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400">
                          How to use examples
                        </h4>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          Click any example to automatically enter it as your
                          response, or speak your own answer when prompted.
                        </p>
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
                                  className={`text-xs ${
                                    i < 3
                                      ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                      : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                  }`}
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

                  {/* New Conversation content */}
                  <TabsContent
                    value="conversation"
                    className="flex-1 m-0 p-0 mt-0 data-[state=active]:border-0 overflow-auto"
                  >
                    <div className="p-4 h-full overflow-y-auto">
                      <h3 className="font-medium mb-3">
                        Application Conversation
                      </h3>
                      {conversation.length > 0 ? (
                        <div className="space-y-4">
                          {conversation.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 dark:bg-gray-800 rounded-md p-3"
                            >
                              <h4 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">
                                Q{index + 1}: {item.question}
                              </h4>
                              <div className="text-sm border-l-2 border-green-400 pl-3 py-1">
                                <p className="text-gray-800 dark:text-gray-200">
                                  {item.response || "No response recorded"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.response
                                    ? "Transcribed from speech"
                                    : "No speech detected"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                          <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                          <p>No conversation recorded yet.</p>
                          <p className="text-sm">
                            Responses will appear here as you answer questions
                          </p>
                        </div>
                      )}
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
        )}

        {/* Mobile Chat Overlay */}
        {isMobile && chatOpen && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-2">
            <Card className="h-[calc(100vh-16px)] border rounded-xl shadow overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                {/* Header with close button for mobile */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 p-3">
                  <h2 className="font-medium text-sm">Quick Access</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={toggleChat}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tabs for chat, documents, info, conversation (mobile) */}
                <Tabs defaultValue="examples" className="flex-1 flex flex-col">
                  <TabsList className="grid grid-cols-3 bg-transparent p-0 border-b border-gray-100 dark:border-gray-800">
                    <TabsTrigger
                      value="examples"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-xs font-medium"
                    >
                      Example Responses
                    </TabsTrigger>
                    <TabsTrigger
                      value="documents"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-xs font-medium"
                    >
                      Documents
                    </TabsTrigger>
                    <TabsTrigger
                      value="conversation"
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent py-2 text-xs font-medium"
                    >
                      Conversation
                    </TabsTrigger>
                  </TabsList>

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
                                className={`text-xs ${
                                  i < 3
                                    ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                                    : "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
                                }`}
                              >
                                {i < 3 ? "Required" : "Optional"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Mobile Conversation content */}
                  <TabsContent
                    value="conversation"
                    className="flex-1 m-0 p-0 mt-0 data-[state=active]:border-0 overflow-auto"
                  >
                    <div className="p-4 h-full overflow-y-auto">
                      <h3 className="font-medium mb-3">
                        Application Conversation
                      </h3>
                      {conversation.length > 0 ? (
                        <div className="space-y-4">
                          {conversation.map((item, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 dark:bg-gray-800 rounded-md p-3"
                            >
                              <h4 className="font-medium text-sm mb-2 text-blue-600 dark:text-blue-400">
                                Q{index + 1}: {item.question}
                              </h4>
                              <div className="text-sm border-l-2 border-green-400 pl-3 py-1">
                                <p className="text-gray-800 dark:text-gray-200">
                                  {item.response || "No response recorded"}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.response
                                    ? "Transcribed from speech"
                                    : "No speech detected"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                          <MessageSquare className="h-12 w-12 mb-2 opacity-50" />
                          <p>No conversation recorded yet.</p>
                          <p className="text-sm">
                            Responses will appear here as you answer questions
                          </p>
                        </div>
                      )}
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
        )}

        {/* Mobile chat toggle button - Always visible when chat is closed */}
        {isMobile && !chatOpen && (
          <Button
            onClick={toggleChat}
            className="fixed bottom-4 right-4 rounded-full h-12 w-12 shadow-lg bg-blue-600 hover:bg-blue-700 p-0 z-30"
          >
            <MessageSquare className="h-5 w-5 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
}
