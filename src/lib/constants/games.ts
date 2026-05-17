export const GAMES_CONFIG = {
  "League of Legends": {
    ranks: ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Esmeralda", "Diamante", "Maestro", "Gran Maestro", "Desafiante"],
    roles: ["Top", "Jungla", "Mid", "ADC", "Support"],
    servers: ["LAS", "LAN", "NA", "EUW", "EUNE", "KR", "BR", "OCE"],
  },
  Valorant: {
    ranks: ["Hierro", "Bronce", "Plata", "Oro", "Platino", "Diamante", "Ascendente", "Inmortal", "Radiante"],
    roles: ["Duelista", "Iniciador", "Centinela", "Controlador"],
    servers: ["Santiago", "Bogotá", "Miami", "Chicago", "Ciudad de México"],
  },
} as const;

export type GameName = keyof typeof GAMES_CONFIG;
export const GAME_NAMES = Object.keys(GAMES_CONFIG) as GameName[];
export const LOL_SERVERS = GAMES_CONFIG["League of Legends"].servers as unknown as string[];

export const SERVER_TO_REGION: Record<string, string> = {
  LAS: "la2", LAN: "la1", NA: "na1", EUW: "euw1",
  EUNE: "eun1", KR: "kr", BR: "br1", OCE: "oc1", TR: "tr1",
};

// Íconos usados para verificación (free, disponibles para todos los jugadores)
export const VERIFICATION_ICONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

export function getVerificationIconId(userId: string): number {
  const hash = userId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return VERIFICATION_ICONS[hash % VERIFICATION_ICONS.length];
}

export function getIconImageUrl(iconId: number): string {
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${iconId}.jpg`;
}
