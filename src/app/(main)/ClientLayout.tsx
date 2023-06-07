"use client";

import { ReactNode, useRef } from "react";

import { DocSearch } from "@docsearch/react";

import { Config } from "types/config";

import "@docsearch/css";
import IconBars from "assets/icons/icon_bars.svg";
import IconHome from "assets/icons/icon_home.svg";
import IconList from "assets/icons/icon_list.svg";
import IconTags from "assets/icons/icon_tags.svg";
import useDisclosure from "lib/useDisclosure";
import useOutsideClick from "lib/useOutsideClick";

type Props = {
  children: ReactNode;
  config: Config;
};

export default function ClientLayout({ children, config }: Props) {
  const { isOpen, onToggle, onClose } = useDisclosure();

  const sidebarRef = useRef<HTMLDivElement>(null);
  useOutsideClick(sidebarRef, onClose);

  return (
    <main className="w-full min-h-full overflow-hidden">
      <section
        ref={sidebarRef}
        className={`${
          isOpen ? "translate-x-0" : "translate-x-[-320px]"
        } md:block bg-gray-100 w-[320px] h-full px-6 py-12 fixed top-0 left-0 transform transition-transform ease-in-out duration-500`}
      >
        <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-500 w-[120px] h-[120px]" />
        <h1 className="mt-12 font-bold text-2xl">{config.metadata.name}</h1>
        <p className="mt-3 text-gray-600">{config.metadata.description}</p>
        <ul className="mt-12">
          <li className="py-3">
            <a href="/" className="flex items-center">
              <IconHome className="hidden md:block w-5 h-5 mr-3 fill-gray-600" />
              <p className="hidden md:block text-gray-600">Home</p>
            </a>
          </li>
          <li className="py-3">
            <a href="/categories" className="flex items-center">
              <IconList className="hidden md:block w-5 h-5 mr-3 fill-gray-600" />
              <p className="hidden md:block text-gray-600">Categories</p>
            </a>
          </li>
          <li className="py-3">
            <a href="/categories" className="flex items-center">
              <IconTags className="hidden md:block w-5 h-5 mr-3 fill-gray-600" />
              <p className="hidden md:block text-gray-600">Tags</p>
            </a>
          </li>
        </ul>
      </section>
      <section
        className={`${
          isOpen ? "translate-x-[320px]" : "translate-x-0"
        } transform transition-transform ease-in-out duration-500`}
      >
        <header className="w-full flex items-center p-6">
          <div className="flex-1 flex justify-start items-center">
            <p className="hidden md:block text-gray-600">Home</p>
            <IconBars
              className="block md:hidden w-5 h-5 cursor-pointer"
              onClick={onToggle}
            />
          </div>
          <div className="flex-1 flex justify-center items-center md:hidden">
            {config.metadata.name}
          </div>
          <div className="flex-1 flex justify-end items-center">
            {config.algolia && (
              <DocSearch
                appId={config.algolia.appId}
                apiKey={config.algolia.apiKey}
                indexName={config.algolia.indexName}
              />
            )}
          </div>
        </header>
        <div>{children}</div>
      </section>
    </main>
  );
}
