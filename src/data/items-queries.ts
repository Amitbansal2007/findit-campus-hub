import { queryOptions } from "@tanstack/react-query";
import { getItemDetail, listItems } from "./items.functions";

export const itemsQueryOptions = () =>
  queryOptions({
    queryKey: ["items", "list"],
    queryFn: () => listItems(),
    staleTime: 30_000,
  });

export const itemDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["items", "detail", id],
    queryFn: () => getItemDetail({ data: { id } }),
    staleTime: 30_000,
  });
