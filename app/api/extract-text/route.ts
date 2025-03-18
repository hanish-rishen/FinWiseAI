import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing" },
        { status: 500 }
      );
    }

    // Get the form data with the image
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert the file to a Uint8Array
    const imageBytes = await imageFile.arrayBuffer();
    const imageUint8Array = new Uint8Array(imageBytes);

    // Create a model instance with the ability to process images
    // Use gemini-1.5-flash if available, or fallback to other versions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the image part for the Gemini API
    const imagePart = {
      inlineData: {
        data: Buffer.from(imageUint8Array).toString("base64"),
        mimeType: imageFile.type,
      },
    };

    // Create the prompt parts including text instruction and image
    const promptParts = [
      {
        text: "Extract all text from this image. Return only the extracted text, without any additional comments.",
      },
      imagePart,
    ];

    // Generate content from the image
    const result = await model.generateContent({
      contents: [{ role: "user", parts: promptParts }],
    });

    const response = result.response;
    const text = response.text();

    console.log(
      "Successfully extracted text from image:",
      text.substring(0, 100) + "..."
    );

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image" },
      { status: 500 }
    );
  }
}
