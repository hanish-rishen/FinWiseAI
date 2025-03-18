"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Upload document with extracted text
export async function uploadDocument(
  file: File,
  documentType: string,
  extractedText?: string
) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log(
      "Uploading with extracted text (length):",
      extractedText?.length
    );

    // Create a unique file name
    const fileName = `${documentType}_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

    // Upload the file to storage
    const { data: fileData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(`${user.id}/${fileName}`, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = await supabase.storage
      .from("documents")
      .getPublicUrl(`${user.id}/${fileName}`);

    // Create the document record - simplified to avoid any issues
    const insertData = {
      user_id: user.id,
      document_type: documentType,
      file_name: file.name,
      file_path: fileData.path,
      status: "pending",
      public_url: publicUrl,
      extracted_text: extractedText || null, // Make sure this is explicitly set
    };

    console.log(
      "Insert data with extracted_text field:",
      !!insertData.extracted_text
    );

    // Insert document record directly - no try/catch here to avoid complexity
    const { data: documentData, error: documentError } = await supabase
      .from("documents")
      .insert(insertData)
      .select()
      .single();

    if (documentError) {
      console.error("Error inserting document:", documentError);
      throw documentError;
    }

    console.log(
      "Document inserted successfully with extracted text:",
      !!documentData.extracted_text
    );
    return documentData;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

// Fetch all documents for the current user
export async function fetchDocuments() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get documents with extracted_text
    const { data, error } = await supabase
      .from("documents")
      .select(
        "id, document_type, file_name, created_at, status, public_url, extracted_text, file_path"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Map to the expected format
    return data.map((doc) => ({
      id: doc.id,
      documentType: doc.document_type,
      fileName: doc.file_name,
      uploadDate: doc.created_at.split("T")[0],
      status: doc.status,
      url: doc.public_url || "",
      extractedText: doc.extracted_text || "",
    }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

// Alias getDocuments to fetchDocuments for backwards compatibility
export const getDocuments = fetchDocuments;

// Delete a document
export async function deleteDocument(documentId: string) {
  try {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error("Unauthorized: Please log in to delete documents");
    }

    // Get document details first
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("file_path, user_id")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      throw new Error("Document not found");
    }

    // Check if the user owns this document
    if (document.user_id !== userData.user.id) {
      throw new Error("Unauthorized: You do not own this document");
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.file_path]);

    if (storageError) {
      throw new Error(`Error deleting file: ${storageError.message}`);
    }

    // Delete metadata
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (dbError) {
      throw new Error(`Error deleting document record: ${dbError.message}`);
    }

    revalidatePath("/dashboard/documents");

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
