import { useState } from "react";

// This is a utility function to handle the text extraction with better state management
export function useTextExtraction() {
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  // This function returns a Promise that resolves with the extracted text
  const extractTextFromImage = async (file: File): Promise<string> => {
    if (!file.type.startsWith("image/")) {
      const message = "Text extraction is only supported for images.";
      setExtractedText(message);
      return message;
    }

    setExtracting(true);
    setExtractedText("Extracting text using Gemini AI...");

    try {
      // Create a FormData object to send the image
      const formData = new FormData();
      formData.append("image", file);

      // Send the image to our API route
      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to extract text");
      }

      const data = await response.json();
      setExtractedText(data.text);
      return data.text; // Return the extracted text directly
    } catch (error) {
      console.error("Error extracting text:", error);
      const errorMessage = "Failed to extract text from image.";
      setExtractedText(errorMessage);
      return errorMessage;
    } finally {
      setExtracting(false);
    }
  };

  return { extractedText, extracting, setExtractedText, extractTextFromImage };
}
