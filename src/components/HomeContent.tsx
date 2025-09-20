"use client"

import { useSearchParams } from "next/navigation";

export function SearchParamsWrapper({ children }: { children: (searchParams: URLSearchParams) => React.ReactNode }) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}