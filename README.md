# jj2mp-api

Typed TypeScript client for the [jj2multiplayer.com](https://jj2multiplayer.com) API. Games, players and clans, with full types.

## Setup

```
npm install
npm start -- games
```

Examples: `games`, `players`, `clans`, `advanced`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm start -- <example>` | Bundles and runs an example with `node` |
| `npm run example <example>` | Runs an example with `tsx` (no bundling) |
| `npm run typecheck` | Typechecks `src` and `examples` |
| `npm run build` | Bundles the library to `dist/index.js` |

## Usage

```ts
import { jj2, JJ2Client } from "./src";

const page = await jj2.getGames({ limit: 10 });
const game = await jj2.getGame(page.games[0].GameID);
const player = await jj2.getPlayer("Name");
const clan = await jj2.getClan("Tag");
```

Custom client:

```ts
const client = new JJ2Client({
  baseUrl: "https://jj2multiplayer.com/api",
  signal: AbortSignal.timeout(15000),
});
```

## API

### Games

| Method | Endpoint | Notes |
| --- | --- | --- |
| `getGames({ page, limit, player, mode, detail })` | `rankedgames` | Paginated. `limit` max 100 (20 with `detail`) |
| `getGame(id)` | `rankedgames?id=` | Always includes full detail |
| `iterateGames(query)` | `rankedgames` | Async iterator over every page |

A game includes: map, mode, host, server, winner, result, times, `Players`, `Mvp`, `PlayersCount`, per-player stats (`PlayerDetails`), team kills and results.

Extra data only returned for a single game or with `detail: true`:

- `PlayerDetails[].WeaponBulletShoots` and `PUWeaponBulletShoots`
- `PlayerDetails[].KillsDetails` (who killed who, and how many times)
- `Scores` (scorer, assist, time, failed attempts)
- `FlagDrops`
- `PowerUpControl` (top shooter and controlling team per power-up)
- `GameLog`

`Detailed` tells you whether the extra data was loaded.

### Players

| Method | Endpoint | Notes |
| --- | --- | --- |
| `getPlayers(season?)` | `playerquery` | Whole leaderboard |
| `getPlayer(name, season?)` | `playerquery?name=` | Returns `null` if not found |
| `searchPlayers(name, count?)` | `playersearch` | Name suggestions, max 20 |

Each player has `Modes`: games, wins, losses, ties, leaves, Elo and average points per mode.

### Clans

| Method | Endpoint | Notes |
| --- | --- | --- |
| `getClans()` | `clanquery` | All active clans |
| `getClan(name)` | `clanquery?name=` | Returns `null` if not found |
| `searchClans(name, count?)` | `clansearch` | Name suggestions, max 20 |

## Errors

Failed requests throw `JJ2ApiError` with `status` and `message`.

```ts
try {
  await jj2.getGame(999999999);
} catch (e) {
  if (e instanceof JJ2ApiError) console.log(e.status, e.message);
}
```

## Configuration

Site URL, timeout, endpoint names, limits and static data (game modes, characters, guns, teams, clan roles) live in `src/data/config.json`. Change them there.

Helpers in `src/static.ts`: `gameModeName`, `characterName`, `gunName`, `teamName`, `teamColor`, `clanRoleName`, `formatDuration`, `toDate`, `parseResult`.

## Project layout

```
src/
  index.ts        client and exports
  types.ts        response types and error class
  static.ts       helpers using config.json
  data/config.json
examples/
  examples.ts
```

## Notes

- Dates are Unix timestamps in seconds. Use `toDate()` to convert.
- Times in `Scores`, `FlagDrops` and `GameTime` are milliseconds.
- Use `npm start` or `tsx` to run code. Plain `tsc` output can't be run with `node` directly.