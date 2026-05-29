import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateEscrowPayload,
  EscrowActionPayload,
  EscrowDetailResponse,
  EscrowEventRecord,
  EscrowRecord,
} from "@/types/escrow";

import axios from "axios";
import { api } from "@/lib/api";

const ESCROW_QUERY_KEY = ["escrows"];

async function request<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const method = init?.method?.toLowerCase() || "get";
  const requestData = typeof init?.body === "string" ? JSON.parse(init.body) : init?.body;

  try {
    const response = await api.request<T>({
      url: path,
      method,
      data: requestData,
    });
    return response.data;
  } catch (error: unknown) {
    let message = "Request failed";
    if (axios.isAxiosError(error)) {
      const bodyMessage = error.response?.data?.message;
      if (Array.isArray(bodyMessage)) {
        message = bodyMessage.join(", ");
      } else if (typeof bodyMessage === "string") {
        message = bodyMessage;
      } else if (error.message) {
        message = error.message;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
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
