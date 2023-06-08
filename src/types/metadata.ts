import { Metadata, ResolvingMetadata } from "next";

export type GenerateMetadata<
  P extends Record<string, string> = {},
  SP extends Record<string, string> = {}
> = (
  props: { params: P; searchParams: SP },
  parent: ResolvingMetadata
) => Promise<Metadata>;
