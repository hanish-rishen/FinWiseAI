"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import type { UploadResult } from "./types";

// Upload document with extracted text
export async function uploadDocument(
  file: File,
  documentType: string,
  extractedText?: string
): Promise<UploadResult> {
  try {
    const supabaseClient = createServerActionClient({ cookies });

    // Check authentication first
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error("User not authenticated");
    }

    const userId = sessionData.session.user.id;

    // Rest of your upload function...

    // Return a properly typed result
    return {
      id: "document-id", // Replace with actual ID
      public_url: "document-url", // Replace with actual URL
      success: true,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      id: "",
      public_url: "",
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

// Fix the fetchDocuments function
export async function fetchDocuments() {
  try {
    const supabaseClient = createServerComponentClient({ cookies });

    // Get current session
    const { data: sessionData } = await supabaseClient.auth.getSession();

    // If no session, return empty array instead of throwing error
    if (!sessionData?.session?.user) {
      console.log(
        "No authenticated session found, returning empty document list"
      );
      return [];
    }

    const user = sessionData.session.user;

    // Get documents with extracted_text
    const { data, error } = await supabaseClient
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error fetching documents:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in fetchDocuments:", error);
    return []; // Return empty array instead of throwing
  }
}

// Alias getDocuments to fetchDocuments for backwards compatibility
export const getDocuments = fetchDocuments;

// Delete a document
export async function deleteDocument(documentId: string) {
  try {
    const supabaseClient = createServerActionClient({ cookies });

    // Check authentication first
    const { data: sessionData } = await supabaseClient.auth.getSession();
    if (!sessionData?.session?.user) {
      throw new Error("User not authenticated");
    }

    const userId = sessionData.session.user.id;

    // Delete the document
    const { error } = await supabaseClient
      .from("documents")
      .delete()
      .eq("id", documentId)
      .eq("user_id", userId); // Ensure user can only delete their own documents

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Delete document error:", error);
    throw error;
  }
}
