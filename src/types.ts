export interface Player {
  PlayerID: number;
  PlayerName: string;
  PlayerClan: string | null;
  PlayerFullClanName: string | null;
  PlayerClanPicture: string | null;
  JoinDate: number | null;
  RecentActivity: number | null;
  Banned: boolean | null;
  TotalGames: number | null;
  TotalPlayTime: number | null;
  CharacterCount: string;
  RecentFurColor: string;
  MainCharacter: number | null;
  Wins: number | null;
  Losses: number | null;
  Ties: number | null;
  Leaves: number | null;
  TotalKills: number | null;
  TotalDeaths: number | null;
  TotalSuicides: number | null;
  Active: boolean;
  Rank: number;
  SeasonGames: number | null;
  SeasonPlayTime: number | null;
  ModeTotalGames: number | null;
  AvgPoints: number | null;
  Elo: number | null;
  Modes: PlayerMode[];
}

export interface ClanMemberCount {
  owners: number;
  staff: number;
  members: number;
  total: number;
}

export interface ClanMember {
  name: string;
  role: string | number | null;
}

export interface ClanContribution {
  PlayerName: string;
  TotalGames: number;
  Wins: number;
  Losses: number;
  Ties: number;
  WinRate: number;
  Kills: number;
  Deaths: number;
  Suicides: number;
  CarrierKills: number;
  Scores: number;
  SoloScores: number;
  ScoreAssists: number;
  Captures: number;
  Drops: number;
  Streetfights: number;
  BulletShoots: number;
  Points: number;
  TotalPlayTime: number;
  HighestKillStreak: number;
  RecentActivity: number | null;
  MvpCount: number;
}

export interface Clan {
  ClanID: number | string;
  ClanName: string;
  ClanFullName: string;
  ClanPicture: string;
  ClanBanner: string;
  ClanLeader: string;
  CreateDate: number | null;
  RecentActivity: number | null;
  Active: boolean;
  TotalGames: number;
  TotalPlayTime: number;
  Points: number;
  Rank: number;
  Wins: number;
  Losses: number;
  Ties: number;
  WinRate: number;
  Members: ClanMember[];
  MemberCount: ClanMemberCount;
  PlayerContributions: ClanContribution[];
}

export interface GamePlayerDetail {
  PlayerName: string;
  PlayerNumber: number;
  Team: number;
  Character: string;
  Kills: number;
  Deaths: number;
  Suicides: number;
  CarrierKills: number;
  Scores: number;
  SoloScores: number;
  ScoreAssists: number;
  Captures: number;
  Drops: number;
  KeyDrops: number;
  HighestKillStreak: number;
  AvgLatency: number;
  Place: number;
  Mvp: boolean;
  MvpPoints: number;
  Points: number;
  NewElo: number;
  EloChange: number;
  WeaponBulletShoots?: number[];
  PUWeaponBulletShoots?: number[];
  KillsDetails?: KillDetail[];
  NewTotalPoints: number;
  Streetfights: number;
  BulletShoots: number;
  FurColor: string;
}

export interface KillDetail {
  Victim: string | null;
  VictimNumber: number;
  Kills: number;
}

export interface GameScore {
  Number: number;
  Time: number;
  TimeFormatted: string;
  Team: number;
  ScoreGain: number;
  TeamTotal: number;
  Scorer: string | null;
  ScorerNumber: number;
  Assist: string | null;
  Solo: boolean;
  FailedAttempts: number;
}

export interface FlagDrop {
  Time: number;
  TimeFormatted: string;
  FlagOfTeam: number;
  Carrier: string | null;
  CarrierNumber: number;
  CarrierTeam: number | null;
}

export interface PowerUpTeam {
  Team: number;
  Total: number;
  TopPlayer: string | null;
  TopUsage: number;
  Share: number;
}

export interface PowerUpControl {
  PowerUp: number;
  Gun: string;
  Total: number;
  TopPlayer: string;
  TopUsage: number;
  Teams: PowerUpTeam[];
  ControllingTeam: number;
}

export interface GameLogEntry {
  Time: string;
  Message: string;
}

export interface PlayerMode {
  ModeCode: number;
  DisplayName: string | null;
  ShortDisplayName: string | null;
  GameMode: number | null;
  CustomMode: number | null;
  Games: number;
  Wins: number;
  Losses: number;
  Ties: number;
  Leaves: number;
  Elo: number;
  AvgPoints: number;
  Placed: boolean;
}

export type GameType = "Ranked" | "Ladder" | "JDC";

export interface Game {
  GameID: number;
  SeasonID: number;
  LevelName: string;
  GameMode: number;
  CustomMode: number;
  GameModeName: string;
  ServerName: string;
  Host: string;
  PlayersCount: number;
  Players: string[];
  Mvp: string[];
  PlayerDetails: GamePlayerDetail[];
  Winner: number;
  WinnerName: string;
  GameDate: number;
  Result: string;
  MaxScore: number;
  EnabledTeams: number;
  GameTime: number;
  TimeLimit: number;
  WeaponBulletShoots: number[];
  PUWeaponBulletShoots: number[];
  Ranked: boolean;
  Dropped: boolean;
  Type: GameType;
  Clan1: string | null;
  Clan2: string | null;
  Detailed: boolean;
  ResultInt: number[];
  TeamKills: number[];
  Scores: GameScore[];
  FlagDrops: FlagDrop[];
  PowerUpControl: PowerUpControl[];
  GameLog: GameLogEntry[];
}

export interface GamesPage {
  page: number;
  limit: number;
  total: number;
  pages: number;
  games: Game[];
}

export interface GamesQuery {
  page?: number;
  limit?: number;
  player?: string;
  mode?: number;
  detail?: boolean;
}

export interface JJ2ClientOptions {
  baseUrl?: string;
  fetch?: typeof fetch;
  signal?: AbortSignal;
}

export class JJ2ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "JJ2ApiError";
  }
}
