"use client";

import { useRef } from "react";

import { Session } from "next-auth";

import { Config } from "@prisma/client";
import { signOut } from "next-auth/react";

import useDisclosure from "lib/useDisclosure";
import useOutsideClick from "lib/useOutsideClick";

import IconGear from "assets/icons/icon_gear.svg";

type Props = {
	session: Session;
	config: Config | null;
};

export default function Header({ session, config }: Props) {
	const { isOpen, onToggle, onClose } = useDisclosure();

	const dropdownRef = useRef<HTMLDivElement>(null);
	useOutsideClick(dropdownRef, onClose);

	const { name } = JSON.parse(config?.config || "{}");

	return (
		<header className="flex flex-col md:flex-row items-center p-6 shadow-sm">
			<a
				href="/admin"
				className="text-2xl font-bold text-center break-keep md:text-left"
			>
				{name || "Prose CMS"} Admin
			</a>
			<div className="flex-1" />
			<a
				href="/admin/config"
				className="block px-2 py-2 mr-2 rounded-md text-left text-sm text-gray-700 hover:bg-gray-100"
			>
				<IconGear className="inline-block w-5 h-5 fill-current" />
			</a>
			<div className="relative">
				<p className="cursor-pointer" onClick={onToggle} onKeyDown={onToggle}>
					Welcome {session.user?.name || "Admin"}!
				</p>
				<div
					ref={dropdownRef}
					className={`absolute right-0 z-10 w-48 mt-2 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
						isOpen ? "block" : "hidden"
					}`}
				>
					<button
						type="button"
						onClick={() => signOut()}
						className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					>
						Logout
					</button>
				</div>
			</div>
		</header>
	);
}
