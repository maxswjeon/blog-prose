"use client";

import { useState } from "react";

import useDisclosure from "lib/useDisclosure";
import { Config } from "types/config";

import IconChevronDown from "assets/icons/icon_chevron-down.svg";
import IconChevronUp from "assets/icons/icon_chevron-up.svg";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  config: Config;
};

export default function MetadataForm({ config }: Props) {
  const router = useRouter();

  const [metadata, setMetadata] = useState(config.metadata);

  const { isOpen, onToggle } = useDisclosure();

  const onSubmit = async () => {
    try {
      await axios.post("/api/config", { ...config, metadata });
      router.refresh();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mt-3 w-full rounded-xl shadow-xl p-6">
      <div
        className="flex items-center cursor-pointer"
        onClick={onToggle}
        onKeyDown={onToggle}
      >
        <h3 className="text-xl font-semibold text-gray-900">Metadata</h3>
        <div className="flex-1" />
        {isOpen ? (
          <IconChevronUp className="w-5 h-5" />
        ) : (
          <IconChevronDown className="w-5 h-5" />
        )}
      </div>
      <div className={isOpen ? "block" : "hidden"}>
        <div className="mt-3">
          <p className="text-gray-600">Name</p>
          <input
            type="text"
            value={metadata.name}
            onChange={(e) =>
              setMetadata({
                ...metadata,
                name: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-3">
          <p className="text-gray-600">Description</p>
          <input
            type="text"
            value={metadata.description}
            onChange={(e) =>
              setMetadata({
                ...metadata,
                description: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="mt-3 rounded-md px-4 py-2 bg-gray-200 hover:bg-gray-300 mr-3"
            onClick={() => setMetadata(config.metadata)}
          >
            Reset
          </button>
          <button
            type="button"
            className="mt-3 rounded-md px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
