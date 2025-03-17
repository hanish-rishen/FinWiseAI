"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadDocument(file: File, documentType: string) {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Unauthorized: Please log in to upload documents");
  }

  const userId = userData.user.id;
  const fileExtension = file.name.split(".").pop();
  const fileName = `${documentType}_${Date.now()}.${fileExtension}`;
  const filePath = `${userId}/${fileName}`;

  // Convert the file to an ArrayBuffer for upload
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`);
  }

  // Check if the table has the required columns
  const { data: tableInfo, error: tableError } = await supabase
    .from("documents")
    .select("*")
    .limit(1);

  if (tableError) {
    console.error("Error checking table structure:", tableError);
  }

  // Save document metadata
  const { data: insertData, error: dbError } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      file_path: filePath,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      document_type: documentType, // Make sure this matches your DB column name
      status: "pending", // Add a default status
    })
    .select("*");

  if (dbError) {
    // If the metadata insertion fails, we should delete the uploaded file
    await supabase.storage.from("documents").remove([filePath]);
    throw new Error(`Error saving document metadata: ${dbError.message}`);
  }

  revalidatePath("/dashboard/documents");

  // Return the first inserted document
  if (insertData && insertData.length > 0) {
    const doc = insertData[0];
    return {
      id: doc.id,
      documentType: doc.document_type,
      fileName: doc.file_name,
      uploadDate: new Date(doc.created_at).toISOString().split("T")[0],
      status: doc.status || "pending",
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      ...doc,
    };
  }

  return { success: true, filePath };
}

export async function getDocuments() {
  const supabase = await createClient();

  // Get the current user
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Unauthorized: Please log in to view documents");
  }

  const userId = userData.user.id;

  // Fetch all documents for the current user
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    throw new Error(`Error fetching documents: ${error.message}`);
  }

  return data;
}

export async function deleteDocument(documentId: string) {
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
}

export async function fetchDocuments() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new Error("Unauthorized: Please log in to view documents");
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Error fetching documents: ${error.message}`);
  }

  // Get signed URLs for each document
  const documentsWithUrls = await Promise.all(
    data.map(async (doc) => {
      const { data: urlData } = await supabase.storage
        .from("documents")
        .createSignedUrl(doc.file_path, 60 * 60); // 1 hour expiry

      return {
        id: doc.id,
        documentType: doc.document_type || "unknown",
        fileName: doc.file_name,
        uploadDate: doc.created_at
          ? new Date(doc.created_at).toISOString().split("T")[0]
          : "",
        status: doc.status || "pending",
        url: urlData?.signedUrl || "",
        // Keep original fields for compatibility
        ...doc,
      };
    })
  );

  return documentsWithUrls;
}
