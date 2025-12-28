export async function fetchCountrySummary(countryName: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    countryName
  )}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch Wikipedia data");

  return res.json();
}
