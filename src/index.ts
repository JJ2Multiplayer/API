import { config } from "./static";
import { JJ2ApiError } from "./types";
import type { Clan, Game, GamesPage, GamesQuery, JJ2ClientOptions, Player } from "./types";

export * from "./types";
export * from "./static";

type Params = Record<string, string | number | undefined>;

export class JJ2Client {
  private baseUrl: string;
  private fetcher: typeof fetch;
  private signal?: AbortSignal;

  constructor(options: JJ2ClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? config.site.baseUrl).replace(/\/+$/, "");
    this.fetcher = options.fetch ?? fetch.bind(globalThis);
    this.signal = options.signal;
  }

  private async get<T>(path: string, params: Params = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}/${path}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
    const signal = this.signal ?? AbortSignal.timeout(config.site.timeoutMs);
    const res = await this.fetcher(url.toString(), { signal });
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      throw new JJ2ApiError(res.status, `Invalid response from ${path}`);
    }
    if (!res.ok) {
      throw new JJ2ApiError(res.status, (body as { error?: string })?.error ?? res.statusText);
    }
    return body as T;
  }

  getGames(query: GamesQuery = {}): Promise<GamesPage> {
    return this.get<GamesPage>(config.endpoints.games, { ...query, detail: query.detail ? 1 : undefined });
  }

  getGame(id: number): Promise<Game> {
    return this.get<Game>(config.endpoints.games, { id });
  }

  async *iterateGames(query: Omit<GamesQuery, "page"> = {}): AsyncGenerator<Game> {
    let page = 1;
    while (true) {
      const res = await this.getGames({ ...query, page });
      for (const game of res.games) yield game;
      if (page >= res.pages) return;
      page++;
    }
  }

  getPlayers(season?: number): Promise<Player[]> {
    return this.get<Player[]>(config.endpoints.players, { season });
  }

  async getPlayer(name: string, season?: number): Promise<Player | null> {
    const res = await this.get<Player[]>(config.endpoints.players, { name, season });
    return res[0] ?? null;
  }

  searchPlayers(name: string, count: number = config.limits.searchCount.default): Promise<string[]> {
    return this.get<string[]>(config.endpoints.playerSearch, { name, count });
  }

  getClans(): Promise<Clan[]> {
    return this.get<Clan[]>(config.endpoints.clans);
  }

  async getClan(name: string): Promise<Clan | null> {
    const res = await this.get<Clan[]>(config.endpoints.clans, { name });
    return res[0] ?? null;
  }

  searchClans(name: string, count: number = config.limits.searchCount.default): Promise<string[]> {
    return this.get<string[]>(config.endpoints.clanSearch, { name, count });
  }
}

export const jj2 = new JJ2Client();
