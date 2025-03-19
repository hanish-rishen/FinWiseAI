import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for speech recognition with live transcription
 */
export function useGroqSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Store media recorder and chunks
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const processingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start recording and processing audio in chunks
  const startListening = async () => {
    try {
      setError(null);
      setTranscript("");
      audioChunksRef.current = [];

      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      console.log("Creating media recorder...");
      // Force a specific audio format that's widely supported
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/mp4")
            ? "audio/mp4"
            : "audio/webm",
        audioBitsPerSecond: 128000, // Set a reasonable bitrate
      });
      mediaRecorderRef.current = mediaRecorder;

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log(`Added audio chunk: ${event.data.size} bytes`);
        }
      };

      // Start recording in 2-second chunks
      mediaRecorder.start(2000);
      setIsListening(true);

      console.log("Started recording with continuous processing");

      // Set up interval to process audio chunks every few seconds
      processingIntervalRef.current = setInterval(async () => {
        if (audioChunksRef.current.length === 0) return;

        // Process the chunks we have so far without stopping the recording
        const chunksToProcess = [...audioChunksRef.current];
        audioChunksRef.current = []; // Clear for new chunks

        setIsProcessing(true);
        try {
          const audioBlob = new Blob(chunksToProcess, {
            type: mediaRecorder.mimeType,
          });

          console.log(
            `Processing ${chunksToProcess.length} audio chunks (${audioBlob.size} bytes)`
          );

          const text = await transcribeAudio(audioBlob);
          if (text) {
            setTranscript((prev) => {
              // Append new text
              const newText = prev ? `${prev} ${text}` : text;
              return newText;
            });
          }
        } catch (err) {
          // Don't set error here, just log it - we want to continue recording
          console.warn("Error processing audio chunk:", err);
        } finally {
          setIsProcessing(false);
        }
      }, 4000); // Process every 4 seconds
    } catch (err: any) {
      console.error("Failed to start recording:", err);
      setError(err.message || "Failed to access microphone");
      setIsListening(false);
      cleanup();
    }
  };

  // Stop recording and process any remaining audio
  const stopListening = async () => {
    if (!mediaRecorderRef.current || !mediaStreamRef.current) {
      return;
    }

    // Clear the processing interval
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }

    try {
      setIsProcessing(true);

      // Stop the media recorder if it's active
      if (mediaRecorderRef.current.state !== "inactive") {
        // Capture the final chunk with stop event
        const finalChunkPromise = new Promise<void>((resolve) => {
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.onstop = () => resolve();
            mediaRecorderRef.current.stop();
          } else {
            resolve();
          }
        });

        // Wait for final chunk
        await finalChunkPromise;
      }

      // Process any remaining audio chunks
      if (audioChunksRef.current.length > 0) {
        console.log(
          `Processing final ${audioChunksRef.current.length} audio chunks`
        );

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorderRef.current.mimeType,
        });

        const text = await transcribeAudio(audioBlob);
        if (text) {
          setTranscript((prev) => {
            // Append final text
            return prev ? `${prev} ${text}` : text;
          });
        }
      }
    } catch (err: any) {
      console.error("Error in final audio processing:", err);
      setError(err.message || "Error processing audio");
    } finally {
      setIsProcessing(false);
      setIsListening(false);
      cleanup();
    }
  };

  // Clean up resources
  const cleanup = () => {
    // Stop all tracks in the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    mediaRecorderRef.current = null;

    // Clear interval if it exists
    if (processingIntervalRef.current) {
      clearInterval(processingIntervalRef.current);
      processingIntervalRef.current = null;
    }
  };

  // Update the transcribeAudio function:

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    try {
      // Convert to WAV format with proper parameters before sending
      const formData = new FormData();

      // Make sure we're sending a properly formatted audio file
      // The API expects specific audio formats
      const processedAudioBlob = new Blob([audioBlob], {
        type: "audio/wav",
      });

      formData.append("file", processedAudioBlob, "recording.wav");
      formData.append("model", "whisper-large-v3");
      formData.append("language", "en"); // Specify language explicitly

      console.log("Sending audio file size:", processedAudioBlob.size, "bytes");

      // Add explicit timeout of 30 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        "https://api.groq.com/openai/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
            // Remove content-type header to let the browser set it correctly with the boundary
          },
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error details:", errorText);

        // Log more details about the request that failed
        console.error("Failed request details:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          audioSize: processedAudioBlob.size,
        });

        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return result.text;
    } catch (error: unknown) {
      console.error("Transcription error:", error);
      // Provide a more user-friendly error message
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Transcription request timed out. Please try again.");
      }
      throw error;
    }
  };

  // Cancel recording without processing
  const cancelListening = () => {
    cleanup();
    setIsListening(false);
    setIsProcessing(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Fix for the handleRecordingStop function with correct variable references

  const handleRecordingStop = async () => {
    if (audioChunksRef.current.length === 0) {
      console.warn("No audio recorded");
      setIsProcessing(false);
      setIsListening(false);
      return;
    }

    try {
      setIsProcessing(true);

      // Create blob with proper MIME type for audio recording
      // Using the correct variable name audioChunksRef instead of audioChunks
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm;codecs=opus",
      });

      console.log("Audio blob created:", audioBlob.size, "bytes");

      // Log blob details
      console.log("Blob type:", audioBlob.type);

      // Convert to a format Groq can accept if needed (depends on their API)
      // For now, using the webm format which should work

      // Transcribe audio
      const transcription = await transcribeAudio(audioBlob);
      console.log("Transcription received:", transcription);

      // Update transcript
      setTranscript(transcription);
    } catch (error: unknown) {
      console.error("Error processing recording:", error);
      // Fix the error type issue by checking if it's an Error object
      if (error instanceof Error) {
        setError(`Failed to process recording: ${error.message}`);
      } else {
        setError("Failed to process recording: Unknown error");
      }
    } finally {
      // Fix the variable reference here too
      audioChunksRef.current = [];
      setIsProcessing(false);
      setIsListening(false);
    }
  };

  return {
    isListening,
    isProcessing,
    transcript,
    error,
    startListening,
    stopListening,
    cancelListening,
    resetTranscript: () => setTranscript(""),
  };
}
