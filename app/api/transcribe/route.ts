// r:\FinWiseAI\fin-wise-ai\app\api\transcribe\route.ts

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Get the audio file from the request
    const formData = await req.formData();
    const audioFile = formData.get("file") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log(
      `Processing audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`
    );

    // Check if file size is too small (potentially corrupted)
    if (audioFile.size < 100) {
      return NextResponse.json(
        { error: "Audio file is too small or corrupted" },
        { status: 400 }
      );
    }

    // Create a new FormData object for the API request
    const apiFormData = new FormData();

    // Add the file to the form data with explicit type
    apiFormData.append(
      "file",
      new Blob([await audioFile.arrayBuffer()], { type: "audio/webm" }),
      "recording.webm"
    );
    apiFormData.append("model", "whisper-large-v3");

    console.log("Sending request to Groq API using axios...");

    // Use axios to send the request with proper FormData handling
    const response = await axios.post(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      apiFormData,
      {
        headers: {
          // Make sure we're using NEXT_PUBLIC_GROQ_API_KEY rather than GROQ_API_KEY
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "multipart/form-data", // Let axios set the boundary
        },
      }
    );

    console.log("Transcription successful:", response.data);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error in transcribe API route:", error);

    // Better error handling for axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "API response error:",
        error.response.status,
        error.response.data
      );
      return NextResponse.json(
        {
          error: `API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
        },
        { status: error.response.status }
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API no response:", error.request);
      return NextResponse.json(
        { error: "No response from transcription API" },
        { status: 500 }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return NextResponse.json(
        { error: error.message || "Failed to transcribe audio" },
        { status: 500 }
      );
    }
  }
}
