"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";
import { ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers( {children }: ProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === "development" && (<ReactQueryDevtools initialIsOpen={false} />)}
        </QueryClientProvider>
    )
}

