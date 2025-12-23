
import { GeneratedFile } from "../types";

/**
 * Google Cloud Storage API Service
 * Reference: https://cloud.google.com/storage/docs/json_api
 */
export class GCSService {
  private baseUrl = 'https://storage.googleapis.com/storage/v1';
  private uploadUrl = 'https://storage.googleapis.com/upload/storage/v1';

  constructor(private token: string) {
    if (!token) throw new Error("GCS Access Token is required");
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * List buckets for a given project ID
   */
  async listBuckets(projectId: string) {
    const response = await fetch(`${this.baseUrl}/b?project=${projectId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GCS List Buckets Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  /**
   * Upload a single file to a specific bucket
   */
  async uploadFile(bucket: string, path: string, content: string) {
    // Media upload requires special URL and query param
    const url = `${this.uploadUrl}/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(path)}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'text/plain', // Adjust based on file type if needed
      },
      body: content,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GCS Upload Error (${path}): ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Batch upload files to a bucket
   */
  async uploadProject(bucket: string, files: GeneratedFile[], prefix: string = '') {
    const results = [];
    for (const file of files) {
      const fullPath = prefix ? `${prefix}/${file.path}` : file.path;
      const res = await this.uploadFile(bucket, fullPath, file.content);
      results.push(res);
    }
    return results;
  }
}
