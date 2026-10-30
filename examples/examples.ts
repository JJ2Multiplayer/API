import { jj2, JJ2Client, JJ2ApiError, config, gunName, characterName, clanRoleName, formatDuration, toDate } from "../src";

async function games() {
  const page = await jj2.getGames({ limit: 5 });
  console.log(`${page.total} games, page ${page.page}/${page.pages}`);
  for (const g of page.games) {
    console.log(
      `#${g.GameID} ${g.GameModeName} on ${g.LevelName} | ${g.Type} | ${g.PlayersCount} players | ` +
        `winner: ${g.WinnerName} | MVP: ${g.Mvp.join(", ") || "-"} | ${formatDuration(g.GameTime)} | ${toDate(g.GameDate)?.toISOString()}`
    );
  }
  const game = await jj2.getGame(page.games[0].GameID);
  for (const p of game.PlayerDetails) {
    console.log(`${p.Place}. ${p.PlayerName} (${p.Character}) K:${p.Kills} D:${p.Deaths} Elo:${p.NewElo} (${p.EloChange})`);
  }
}

async function players() {
  const matches = await jj2.searchPlayers("Jazz", 5);
  console.log("Matches:", matches);
  const player = await jj2.getPlayer(matches[0]);
  if (player) {
    console.log(`${player.PlayerName} | rank ${player.Rank} | elo ${player.Elo ?? "-"}`);
    console.log(`main: ${characterName(player.MainCharacter ?? -1)} | clan: ${player.PlayerClan ?? "none"}`);
    console.log(`last seen: ${toDate(player.RecentActivity)?.toISOString()}`);
  }
  (await jj2.getPlayers()).slice(0, 10).forEach((p) => console.log(`${p.Rank}. ${p.PlayerName} ${p.Elo}`));
}

async function clans() {
  const names = await jj2.searchClans("a", 5);
  console.log("Clans:", names);
  const clan = await jj2.getClan(names[0]);
  if (!clan) return;
  console.log(`${clan.ClanFullName} [${clan.ClanName}] rank ${clan.Rank} | ${clan.Points} pts | win rate ${clan.WinRate}%`);
  console.log(`members: ${clan.MemberCount.total} (owners ${clan.MemberCount.owners}, staff ${clan.MemberCount.staff})`);
  clan.Members.forEach((m) => console.log(` - ${m.name}: ${clanRoleName(m.role)}`));
  clan.PlayerContributions.slice(0, 5).forEach((c) =>
    console.log(` * ${c.PlayerName}: ${c.TotalGames} games, ${c.WinRate}% wins, ${c.MvpCount} MVPs`)
  );
}

async function advanced() {
  const client = new JJ2Client({ baseUrl: config.site.baseUrl, signal: AbortSignal.timeout(config.site.timeoutMs) });
  try {
    await client.getGame(999999999);
  } catch (e) {
    if (e instanceof JJ2ApiError) console.log(`API error ${e.status}: ${e.message}`);
  }
  let ladder = 0;
  for await (const g of client.iterateGames({ player: "Jazz", limit: config.limits.gamesPerPage.max })) {
    if (g.Type === "Ladder") ladder++;
  }
  console.log("Ladder games:", ladder);
  (await client.getGame(1)).WeaponBulletShoots.forEach((shots, i) => console.log(`${gunName(i)}: ${shots}`));
  console.log(config.teams.map((t) => `${t.name} ${t.color}`).join(" | "));
}

const examples: Record<string, () => Promise<void>> = { games, players, clans, advanced };
const name = process.argv[2] ?? "games";
if (!examples[name]) {
  console.log(`Usage: tsx examples/examples.ts <${Object.keys(examples).join("|")}>`);
  process.exit(1);
}
await examples[name]();
