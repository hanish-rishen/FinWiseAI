"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  FilePlus,
  FileText,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/components/ui/use-toast";
import { uploadDocument, deleteDocument, fetchDocuments } from "./actions";
import Image from "next/image";
import { Document, DocumentType } from "./types";
import { useLanguage } from "@/context/language-context";

// Document types and their requirements
const documentTypes = [
  {
    id: "id-proof",
    name: "ID Proof",
    description: "Government issued ID (Aadhaar, PAN, Passport, etc.)",
    required: true,
    acceptedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  {
    id: "address-proof",
    name: "Address Proof",
    description: "Utility bill, bank statement, etc. (less than 3 months old)",
    required: true,
    acceptedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  {
    id: "income-proof",
    name: "Income Proof",
    description: "Salary slips or income tax returns",
    required: true,
    acceptedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  {
    id: "property-documents",
    name: "Property Documents",
    description: "For secured loans (property papers, etc.)",
    required: false,
    acceptedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  {
    id: "bank-statements",
    name: "Bank Statements",
    description: "Last 6 months statements",
    required: false,
    acceptedFormats: ["image/jpeg", "image/png", "application/pdf"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
];

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDocType, setCurrentDocType] = useState<DocumentType>(
    documentTypes[0]
  );
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const getDocuments = async () => {
      try {
        const docs = await fetchDocuments();
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Failed to load documents",
          description: "There was an error loading your documents.",
          variant: "destructive",
        });
      }
    };

    getDocuments();
  }, [toast]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Check if file type is allowed
      if (!currentDocType.acceptedFormats.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `Please upload a valid ${currentDocType.acceptedFormats.join(", ")} file.`,
          variant: "destructive",
        });
        return;
      }

      // Check file size
      if (file.size > currentDocType.maxSize) {
        toast({
          title: "File too large",
          description: `File size must be less than ${currentDocType.maxSize / (1024 * 1024)}MB.`,
          variant: "destructive",
        });
        return;
      }

      // Show preview (only for images)
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      setUploading(true);

      try {
        // Upload the file
        const result = await uploadDocument(file, currentDocType.id);

        // Update documents list
        setDocuments((prev) => [
          ...prev,
          {
            id: Date.now().toString(), // temporary ID, replace with actual ID from backend
            documentType: currentDocType.id,
            fileName: file.name,
            uploadDate: new Date().toISOString().split("T")[0], // Use ISO format date string
            status: "pending",
            url: URL.createObjectURL(file), // temporary URL, replace with actual URL from backend
          },
        ]);

        toast({
          title: "Document uploaded successfully",
          description:
            "Your document has been uploaded and is pending verification.",
        });
      } catch (error) {
        console.error("Error uploading document:", error);
        toast({
          title: "Failed to upload document",
          description:
            "There was an error uploading your document. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        setPreviewImage(null);
      }
    },
    [currentDocType, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": currentDocType.acceptedFormats.filter((type) =>
        type.startsWith("image/")
      ),
      "application/pdf": currentDocType.acceptedFormats.includes(
        "application/pdf"
      )
        ? [".pdf"]
        : [],
    },
    maxFiles: 1,
  });

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(documentId);
        setDocuments(documents.filter((doc) => doc.id !== documentId));
        toast({
          title: "Document deleted",
          description: "The document has been removed successfully.",
        });
      } catch (error) {
        console.error("Error deleting document:", error);
        toast({
          title: "Failed to delete document",
          description: "There was an error deleting the document.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDocument = (documentUrl: string) => {
    window.open(documentUrl, "_blank");
  };

  // Format date consistently with a helper function
  const formatDate = (dateString: string) => {
    // Format as YYYY-MM-DD which is consistent between server and client
    return dateString;
  };

  const getDocumentStatusClass = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "rejected":
        return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800";
      default:
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Document Management
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left panel - Document types */}
          <div className="md:col-span-1 space-y-4">
            <Card className="p-5 bg-white dark:bg-gray-900 overflow-hidden">
              <h2 className="text-lg font-medium mb-4">Document Types</h2>
              <div className="space-y-2">
                {documentTypes.map((docType) => (
                  <Button
                    key={docType.id}
                    variant={
                      currentDocType.id === docType.id ? "default" : "outline"
                    }
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => setCurrentDocType(docType)}
                  >
                    <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                    <div className="flex flex-col items-start">
                      <span>{docType.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {docType.required ? "Required" : "Optional"}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-medium mb-2">Need Help?</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If you're having trouble uploading documents, our support team
                is here to assist you.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Card>
          </div>

          {/* Right panel - Upload area and document list */}
          <div className="md:col-span-2 space-y-6">
            {/* Document upload area */}
            <Card className="p-5 bg-white dark:bg-gray-900">
              <h2 className="text-lg font-medium mb-2">
                {currentDocType.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {currentDocType.description}
              </p>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30"
                    : "border-gray-300 dark:border-gray-700"
                } cursor-pointer text-center`}
              >
                <input {...getInputProps()} />

                {previewImage ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-4">
                      <Image
                        src={previewImage}
                        alt="Document preview"
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Click or drop another file to replace this image
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />

                    {isDragActive ? (
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        Drop the file here...
                      </p>
                    ) : (
                      <div>
                        <p className="font-medium mb-1">
                          Drag and drop your {currentDocType.name.toLowerCase()}
                          , or{" "}
                          <span className="text-blue-600 dark:text-blue-400">
                            browse
                          </span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Accepted formats:{" "}
                          {currentDocType.acceptedFormats
                            .map((format) =>
                              format
                                .replace("image/", "")
                                .replace("application/", "")
                            )
                            .join(", ")}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Max size: {currentDocType.maxSize / (1024 * 1024)}MB
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  All documents are encrypted and securely stored
                </div>

                <Button
                  disabled={uploading || !previewImage}
                  onClick={() => onDrop([])}
                >
                  {uploading ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </Card>

            {/* Uploaded documents */}
            <Card className="bg-white dark:bg-gray-900">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-medium">Uploaded Documents</h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {documents.length === 0 ? (
                  <div className="p-5 text-center text-gray-500 dark:text-gray-400">
                    <FilePlus className="h-12 w-12 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
                    <p>No documents uploaded yet.</p>
                    <p className="text-sm">
                      Start by uploading your first document.
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => {
                    // Find the document type info
                    const docTypeInfo = documentTypes.find(
                      (d) => d.id === doc.documentType
                    );

                    return (
                      <div
                        key={doc.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
                            <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {docTypeInfo?.name || doc.documentType}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {doc.fileName}
                            </p>
                            <div className="flex items-center mt-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full border ${getDocumentStatusClass(doc.status)}`}
                              >
                                {doc.status
                                  ? doc.status.charAt(0).toUpperCase() +
                                    doc.status.slice(1)
                                  : "Pending"}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {formatDate(doc.uploadDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(doc.url)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
