"use client";

import { useState } from "react";

import useDisclosure from "lib/useDisclosure";
import { Config, LocalDriverConfig, S3DriverConfig } from "types/config";

import IconChevronDown from "assets/icons/icon_chevron-down.svg";
import IconChevronUp from "assets/icons/icon_chevron-up.svg";
import axios from "axios";
import { equals } from "lib/utils";
import { useRouter } from "next/navigation";

type Props = {
  config: Config;
};

function validImageConfig(config: Config["image"]) {
  if (config.driver.name === "local") {
    return true;
  } else if (config.driver.name === "s3") {
    return (
      config.driver.accessKeyId !== "" &&
      config.driver.secretAccessKey !== "" &&
      config.driver.region !== "" &&
      config.driver.bucket !== ""
    );
  }

  return false;
}

export default function ImageForm({ config }: Props) {
  const router = useRouter();

  const [image, setImage] = useState(config.image);

  const { isOpen, onToggle } = useDisclosure();

  const onSubmit = async () => {
    try {
      await axios.post("/api/config", { ...config, image });
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
        <h3 className="text-xl font-semibold text-gray-900">Image</h3>
        <div className="flex-1" />
        {isOpen ? (
          <IconChevronUp className="w-5 h-5" />
        ) : (
          <IconChevronDown className="w-5 h-5" />
        )}
      </div>
      <div className={isOpen ? "block" : "hidden"}>
        <h4 className="mt-6 text-lg font-semibold text-gray-800">Driver</h4>
        <div className="mt-3">
          <p className="text-gray-600">Type</p>
          <select
            onChange={(e) => {
              if (e.target.value === image.driver.name) {
                return;
              }

              if (e.target.value === "local") {
                setImage({
                  ...image,
                  driver: {
                    name: "local",
                    basePath: "data",
                  },
                });
              } else if (e.target.value === "s3") {
                setImage({
                  ...image,
                  driver: {
                    name: "s3",
                    accessKeyId: "",
                    secretAccessKey: "",
                    region: "",
                    bucket: "",
                    prefix: "",
                    endpoint: null,
                  },
                });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="local">Local</option>
            <option value="s3">S3</option>
          </select>
        </div>
        {image.driver.name === "local" && (
          <>
            <div className="mt-3">
              <p className="text-gray-600">Base Path</p>
              <input
                type="text"
                value={image.driver.basePath}
                onChange={(e) =>
                  setImage({
                    ...image,
                    driver: {
                      ...(image.driver as LocalDriverConfig),
                      basePath: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
        {image.driver.name === "s3" && (
          <>
            <div className="mt-3">
              <p className="text-gray-600">Region</p>
              <input
                type="text"
                value={image.driver.region}
                placeholder="Region"
                onChange={(e) =>
                  setImage({
                    ...image,
                    driver: {
                      ...(image.driver as S3DriverConfig),
                      region: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-3">
              <p className="text-gray-600">Access Key ID</p>
              <input
                type="text"
                value={image.driver.accessKeyId}
                placeholder="Access Key ID"
                onChange={(e) =>
                  setImage({
                    ...image,
                    driver: {
                      ...(image.driver as S3DriverConfig),
                      accessKeyId: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-3">
              <p className="text-gray-600">Secret Access Key</p>
              <input
                type="password"
                value={image.driver.secretAccessKey}
                placeholder="Secret Access Key"
                onChange={(e) =>
                  setImage({
                    ...image,
                    driver: {
                      ...(image.driver as S3DriverConfig),
                      secretAccessKey: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-3">
              <p className="text-gray-600">Bucket</p>
              <input
                type="text"
                value={image.driver.bucket}
                placeholder="Bucket"
                onChange={(e) =>
                  setImage({
                    ...image,
                    driver: {
                      ...(image.driver as S3DriverConfig),
                      bucket: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-3">
              <p className="text-gray-600">Prefix</p>
              <input
                type="text"
                value={image.driver.prefix}
                placeholder="Prefix"
                onChange={(e) =>
                  setImage({
                    ...image,
                    driver: {
                      ...(image.driver as S3DriverConfig),
                      prefix: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mt-3">
              <p className="text-gray-600">Endpoint (Optional)</p>
              <input
                type="text"
                value={image.driver.endpoint || ""}
                placeholder="Endpoint"
                onChange={(e) =>
                  setImage({
                    ...image,
                    driver: {
                      ...(image.driver as S3DriverConfig),
                      endpoint: e.target.value,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="mt-3 rounded-md px-4 py-2 bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
            disabled={equals(config.image, image) || !validImageConfig(image)}
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
