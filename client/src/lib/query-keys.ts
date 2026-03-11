export const queryKeys = {
  tokens: {
    all: ["tokens"] as const,
    list: () => [...queryKeys.tokens.all, "list"] as const,
    detail: (id: string) => [...queryKeys.tokens.all, "detail", id] as const,
    price: (id: string) => [...queryKeys.tokens.all, "price", id] as const,
    prices: () => [...queryKeys.tokens.all, "prices"] as const,
  },
  portfolio: {
    all: ["portfolio"] as const,
    summary: () => [...queryKeys.portfolio.all, "summary"] as const,
    holdings: () => [...queryKeys.portfolio.all, "holdings"] as const,
  },
} as const;