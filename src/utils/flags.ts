export function getCountryCode(countryName?: string): string | null {
  if (!countryName) return null;

  const map: Record<string, string> = {
    // Europe
    "Austria": "AT",
    "Belgium": "BE",
    "Croatia": "HR",
    "Czech Republic": "CZ",
    "Denmark": "DK",
    "Estonia": "EE",
    "Finland": "FI",
    "France": "FR",
    "Germany": "DE",
    "Greece": "GR",
    "Hungary": "HU",
    "Iceland": "IS",
    "Ireland": "IE",
    "Italy": "IT",
    "Latvia": "LV",
    "Lithuania": "LT",
    "Luxembourg": "LU",
    "Malta": "MT",
    "Netherlands": "NL",
    "Norway": "NO",
    "Poland": "PL",
    "Portugal": "PT",
    "Romania": "RO",
    "Serbia": "RS",
    "Slovakia": "SK",
    "Slovenia": "SI",
    "Spain": "ES",
    "Sweden": "SE",
    "Switzerland": "CH",
    "United Kingdom": "GB",
    "Ukraine": "UA",
    "Russia": "RU",

    // South America
    "Argentina": "AR",
    "Bolivia": "BO",
    "Brazil": "BR",
    "Chile": "CL",
    "Colombia": "CO",
    "Ecuador": "EC",
    "Paraguay": "PY",
    "Peru": "PE",
    "Uruguay": "UY",
    "Venezuela": "VE",

    // North America
    "Mexico": "MX",
    "United States": "US",
    "Canada": "CA",

    // Asia / Middle East
    "China": "CN",
    "India": "IN",
    "Japan": "JP",
    "South Korea": "KR",
    "Thailand": "TH",
    "Philippines": "PH",
    "Vietnam": "VN",
    "Indonesia": "ID",
    "Malaysia": "MY",
    "Singapore": "SG",
    "Israel": "IL",
    "Turkey": "TR",
    "United Arab Emirates": "AE",
    "Kazakhstan": "KZ",

    // Oceania
    "Australia": "AU",
    "New Zealand": "NZ",
  };

  const code = map[countryName.trim()];
  return code ? code.toLowerCase() : null;
}
