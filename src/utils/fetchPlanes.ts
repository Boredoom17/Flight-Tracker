export async function fetchLivePlanes() {
  const response = await fetch("https://opensky-network.org/api/states/all");

  if (!response.ok) {
    throw new Error("Failed to fetch flight data");
  }

  const data = await response.json();
  return data.states;
}
