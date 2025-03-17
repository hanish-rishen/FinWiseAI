export type DocumentType = {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number;
};

export type Document = {
  id: string;
  documentType: string;
  fileName: string;
  uploadDate: string; // Use string format for dates to avoid hydration issues
  status: "verified" | "pending" | "rejected";
  url: string;
};
