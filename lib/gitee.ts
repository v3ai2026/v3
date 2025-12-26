export class GiteeService {
  private token: string;
  private baseUrl = 'https://gitee.com/api/v5';

  constructor(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}access_token=${this.token}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Gitee API error: ${response.statusText}`);
    }

    return response.json();
  }

  async createRepo(name: string, description: string, isPrivate: boolean = false) {
    return this.request('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      }),
    });
  }

  async getRepos() {
    return this.request('/user/repos?sort=pushed&direction=desc');
  }

  async getRepo(owner: string, repo: string) {
    return this.request(`/repos/${owner}/${repo}`);
  }

  async deleteRepo(owner: string, repo: string) {
    return this.request(`/repos/${owner}/${repo}`, { method: 'DELETE' });
  }

  async createFile(owner: string, repo: string, path: string, content: string, message: string) {
    return this.request(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'POST',
      body: JSON.stringify({
        content: btoa(unescape(encodeURIComponent(content))),
        message,
      }),
    });
  }

  async enablePages(owner: string, repo: string) {
    return this.request(`/repos/${owner}/${repo}/pages`, {
      method: 'POST',
      body: JSON.stringify({
        source: {
          branch: 'master',
          path: '/'
        }
      }),
    });
  }

  async getPagesInfo(owner: string, repo: string) {
    return this.request(`/repos/${owner}/${repo}/pages`);
  }

  async addCollaborator(owner: string, repo: string, username: string, permission: 'pull' | 'push' | 'admin' = 'push') {
    return this.request(`/repos/${owner}/${repo}/collaborators/${username}`, {
      method: 'PUT',
      body: JSON.stringify({ permission }),
    });
  }

  async createWebhook(owner: string, repo: string, url: string, events: string[] = ['push']) {
    return this.request(`/repos/${owner}/${repo}/hooks`, {
      method: 'POST',
      body: JSON.stringify({
        url,
        content_type: 'json',
        events,
        active: true,
      }),
    });
  }
}
