// LATAM primero, luego resto del mundo
export const COUNTRIES = [
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "MX", name: "México", flag: "🇲🇽" },
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "BR", name: "Brasil", flag: "🇧🇷" },
  { code: "ES", name: "España", flag: "🇪🇸" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "CA", name: "Canadá", flag: "🇨🇦" },
  { code: "GB", name: "Reino Unido", flag: "🇬🇧" },
  { code: "DE", name: "Alemania", flag: "🇩🇪" },
  { code: "FR", name: "Francia", flag: "🇫🇷" },
  { code: "IT", name: "Italia", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "KR", name: "Corea del Sur", flag: "🇰🇷" },
  { code: "JP", name: "Japón", flag: "🇯🇵" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "OTHER", name: "Otro", flag: "🌍" },
] as const;

export type CountryCode = typeof COUNTRIES[number]["code"];

export function getCountry(code: string) {
  return COUNTRIES.find((c) => c.code === code);
}

export const LOOKING_FOR_OPTIONS = [
  { value: "duo",    label: "Duo",    description: "Busco alguien para jugar" },
  { value: "pareja", label: "Pareja", description: "Busco algo romántico" },
  { value: "ambos",  label: "Ambos",  description: "Abierto a cualquiera" },
  { value: "no_se",  label: "No sé",  description: "Ya veré qué pasa" },
] as const;

export type LookingForValue = typeof LOOKING_FOR_OPTIONS[number]["value"];
