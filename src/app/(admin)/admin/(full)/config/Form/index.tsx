"use client";

import { Config } from "types/config";

import ImageForm from "./image";
import MetadataForm from "./metadata";

type Props = {
  config: Config;
};

export default function Form({ config }: Props) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Configuration</h2>
      <MetadataForm config={config} />
      <ImageForm config={config} />
    </div>
  );
}
