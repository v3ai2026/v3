
/**
 * Figma REST API Service
 * Handles file retrieval and image exports for design-to-code orchestration.
 */
export class FigmaService {
  private baseUrl = 'https://api.figma.com/v1';

  constructor(private token: string) {
    if (!token) throw new Error("Figma Personal Access Token is required");
  }

  private getHeaders() {
    return {
      'X-Figma-Token': this.token,
    };
  }

  /**
   * Fetch file metadata including layers and components.
   */
  async getFile(fileKey: string) {
    const response = await fetch(`${this.baseUrl}/files/${fileKey}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Figma API Error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Export specific nodes as images for AI multimodal analysis.
   */
  async getImages(fileKey: string, ids: string) {
    const response = await fetch(`${this.baseUrl}/images/${fileKey}?ids=${ids}&format=png`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Figma Image Export Error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.images; // Map of ID to URL
  }
}
