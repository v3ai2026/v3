
import { GeneratedFile } from "../types";

export class GitHubService {
  private baseUrl = 'https://api.github.com';

  constructor(private token: string) {
    if (!token) throw new Error("GitHub SCM Protocol requires a valid access token.");
  }

  private getHeaders() {
    return {
      'Authorization': `token ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
  }

  private encodeContent(content: string): string {
    const bytes = new TextEncoder().encode(content);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binString);
  }

  /**
   * 自动为项目注入 GitHub Actions 工作流
   */
  async injectCIWorkflow(owner: string, repo: string) {
    const workflowContent = `name: Vercel Deployment Optimization
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Neural Audit
        run: echo "AI-Agent auditing shards..."
      - name: Deploy to Vercel
        run: echo "Triggering production build..."`;
    
    return this.pushAtomicUpdate(owner, repo, [
      { path: '.github/workflows/main.yml', content: workflowContent }
    ], 'chore: inject neural CI/CD workflow');
  }

  async getAuthenticatedUser() {
    const response = await fetch(`${this.baseUrl}/user`, { headers: this.getHeaders() });
    if (!response.ok) throw new Error(`User Fetch Error: ${response.statusText}`);
    return response.json();
  }

  async provisionProject(name: string, description: string, isPrivate: boolean = true) {
    const user = await this.getAuthenticatedUser();
    const response = await fetch(`${this.baseUrl}/user/repos`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, description, private: isPrivate, auto_init: true }),
    });
    if (!response.ok) throw new Error("Provisioning Error");
    return response.json();
  }

  async pushAtomicUpdate(owner: string, repo: string, files: { path: string; content: string }[], message: string = 'Update project shards') {
    const refResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/refs/heads/main`, { headers: this.getHeaders() });
    const refData = await refResponse.json();
    const latestCommitSha = refData.object.sha;

    const commitResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, { headers: this.getHeaders() });
    const commitData = await commitResponse.json();
    const baseTreeSha = commitData.tree.sha;

    const treeEntries = await Promise.all(files.map(async (file) => {
      const blobResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST', headers: this.getHeaders(),
        body: JSON.stringify({ content: this.encodeContent(file.content), encoding: 'base64' }),
      });
      const blobData = await blobResponse.json();
      return { path: file.path, mode: '100644', type: 'blob', sha: blobData.sha };
    }));

    const newTreeResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/trees`, {
      method: 'POST', headers: this.getHeaders(),
      body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }),
    });
    const newTreeData = await newTreeResponse.json();

    const newCommitResponse = await fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/commits`, {
      method: 'POST', headers: this.getHeaders(),
      body: JSON.stringify({ message, tree: newTreeData.sha, parents: [latestCommitSha] }),
    });
    const newCommitData = await newCommitResponse.json();

    return fetch(`${this.baseUrl}/repos/${owner}/${repo}/git/refs/heads/main`, {
      method: 'PATCH', headers: this.getHeaders(),
      body: JSON.stringify({ sha: newCommitData.sha, force: false }),
    });
  }
}
