
/**
 * TMDB Intelligence Shard
 * Used for fetching cinematic metadata to ground video generation prompts.
 */
export class TMDBService {
  private baseUrl = 'https://api.themoviedb.org/3';

  constructor(private apiKey: string) {}

  private getUrl(path: string, params: Record<string, string> = {}) {
    const queryParams = new URLSearchParams({ ...params, api_key: this.apiKey }).toString();
    return `${this.baseUrl}${path}?${queryParams}`;
  }

  async searchContent(query: string) {
    const response = await fetch(this.getUrl('/search/multi', { query }));
    if (!response.ok) throw new Error('TMDB Search Shard failed');
    const data = await response.json();
    return data.results;
  }

  async getTrending() {
    const response = await fetch(this.getUrl('/trending/all/day'));
    if (!response.ok) throw new Error('TMDB Trending Shard failed');
    const data = await response.json();
    return data.results;
  }

  async getDetails(id: number, type: 'movie' | 'tv') {
    const response = await fetch(this.getUrl(`/${type}/${id}`));
    if (!response.ok) throw new Error('TMDB Detail Shard failed');
    return response.json();
  }
}
