
/**
 * GitHub API Service
 * Handles repository creation, file initialization, and code pushing.
 */
export class GitHubService {
  private baseUrl = 'https://api.github.com';

  constructor(private token: string) {
    if (!token) throw new Error("GitHub Token is required");
  }

  /**
   * Headers for authenticated requests
   */
  private getHeaders() {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  }

  /**
   * Encodes a string into base64 safely for GitHub API, supporting UTF-8.
   */
  private encodeContent(content: string): string {
    const bytes = new TextEncoder().encode(content);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binString);
  }

  /**
   * Create a new repository for the authenticated user.
   */
  async createRepository(name: string, isPrivate: boolean = true) {
    const response = await fetch(`${this.baseUrl}/user/repos`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name,
        private: isPrivate,
        auto_init: false, // We handle initialization manually to control files
        description: 'Synchronized via Studio Agent Core',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub Create Repo Error: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Upsert a file in a repository.
   * Note: For new repositories, the first push initializes the branch.
   */
  async pushFile(owner: string, repo: string, path: string, content: string, message: string, sha?: string) {
    const contentBase64 = this.encodeContent(content);

    const body: any = {
      message,
      content: contentBase64,
    };

    if (sha) {
      body.sha = sha;
    }

    const response = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`GitHub Push File Error (${path}): ${error.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Initialize a repository with a set of files.
   */
  async initializeAndPush(owner: string, repo: string, files: { path: string; content: string }[]) {
    const results = [];
    for (const file of files) {
      // For a high-performance studio agent, we synchronize files sequentially 
      // to ensure state consistency during the initial commit.
      const res = await this.pushFile(owner, repo, file.path, file.content, `Initialize [NeuralProtocol]: ${file.path}`);
      results.push(res);
    }
    return results;
  }
}
