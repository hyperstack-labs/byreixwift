export async function getContractEscrow(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contract/escrow/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch contract escrow");
  }

  return response.json();
}
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
