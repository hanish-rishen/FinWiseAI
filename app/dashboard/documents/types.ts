export interface Document {
  id: string;
  name?: string;
  type?: string;
  url: string;
  created_at?: string;
  user_id: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  status: string;
  extractedText?: string;
}

export interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  acceptedFormats: string[];
  maxSize: number;
}

// Add this type to the types.ts file
export type UploadResult = {
  id: string;
  public_url: string;
  success: boolean;
  error?: string;
};
