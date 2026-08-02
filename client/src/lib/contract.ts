export async function getContractEscrow(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SIDRA_API_URL || "http://localhost:3001/api"}/contract/escrow/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contract escrow");
  }

  return response.json();
}
