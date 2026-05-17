const RIOT_API_KEY = process.env.RIOT_API_KEY;
const HENRIK_API_KEY = process.env.HENRIK_API_KEY;

// Verifica que la cuenta Riot existe y devuelve el PUUID
export async function verifyRiotAccount(gameName: string, tagLine: string) {
  if (!RIOT_API_KEY) throw new Error("RIOT_API_KEY no configurado");

  const res = await fetch(
    `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
    { headers: { "X-Riot-Token": RIOT_API_KEY } }
  );

  if (!res.ok) {
    if (res.status === 404) throw new Error("Cuenta no encontrada");
    throw new Error("Error al verificar la cuenta");
  }

  const data = await res.json();
  return { puuid: data.puuid as string, gameName: data.gameName as string, tagLine: data.tagLine as string };
}

// Obtiene el rango de LoL por PUUID (requiere saber el servidor)
export async function getLoLRank(puuid: string, server: string) {
  if (!RIOT_API_KEY) return null;

  const serverMap: Record<string, string> = {
    LAS: "la2", LAN: "la1", NA: "na1", EUW: "euw1",
    EUNE: "eun1", KR: "kr", BR: "br1", OCE: "oc1", TR: "tr1",
  };

  const region = serverMap[server.toUpperCase()] ?? "la2";

  try {
    const summonerRes = await fetch(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );
    if (!summonerRes.ok) return null;

    const summoner = await summonerRes.json();

    const rankRes = await fetch(
      `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );
    if (!rankRes.ok) return null;

    const entries = await rankRes.json();
    const solo = entries.find((e: { queueType: string }) => e.queueType === "RANKED_SOLO_5x5");
    if (!solo) return null;

    return `${solo.tier} ${solo.rank}`;
  } catch {
    return null;
  }
}

// Obtiene el rango de Valorant via Henrik Dev API (no oficial)
export async function getValorantRank(gameName: string, tagLine: string) {
  if (!HENRIK_API_KEY) return null;

  try {
    const res = await fetch(
      `https://api.henrikdev.xyz/valorant/v2/mmr/latam/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      { headers: { Authorization: HENRIK_API_KEY } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    return data.data?.currenttierpatched ?? null;
  } catch {
    return null;
  }
}
