import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateEscrowPayload,
  EscrowActionPayload,
  EscrowDetailResponse,
  EscrowEventRecord,
  EscrowRecord,
} from "@/types/escrow";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const ESCROW_QUERY_KEY = ["escrows"];

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed";
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (Array.isArray(body.message)) {
        message = body.message.join(", ");
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      // Fall back to the default error when the response body is not JSON.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function useEscrows() {
  return useQuery({
    queryKey: ESCROW_QUERY_KEY,
    queryFn: () => request<EscrowRecord[]>("/api/escrows"),
    refetchInterval: 10_000,
  });
}

export function useEscrowEvents(id: string | null) {
  return useQuery({
    queryKey: [...ESCROW_QUERY_KEY, id, "events"],
    queryFn: () => request<EscrowEventRecord[]>(`/api/escrows/${id}/events`),
    enabled: Boolean(id),
    refetchInterval: 10_000,
  });
}

export function useCreateEscrow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEscrowPayload) =>
      request<EscrowDetailResponse>("/api/escrows", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ESCROW_QUERY_KEY });
    },
  });
}

function createEscrowActionMutation(pathFactory: (id: string) => string) {
  return function useEscrowAction() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: EscrowActionPayload }) =>
        request<EscrowDetailResponse>(pathFactory(id), {
          method: "POST",
          body: JSON.stringify(payload),
        }),
      onSuccess: (_, variables) => {
        void queryClient.invalidateQueries({ queryKey: ESCROW_QUERY_KEY });
        void queryClient.invalidateQueries({
          queryKey: [...ESCROW_QUERY_KEY, variables.id, "events"],
        });
      },
    });
  };
}

export const useLockEscrow = createEscrowActionMutation((id) => `/api/escrows/${id}/lock`);
export const useReleaseEscrow = createEscrowActionMutation((id) => `/api/escrows/${id}/release`);
export const useRefundEscrow = createEscrowActionMutation((id) => `/api/escrows/${id}/refund`);
