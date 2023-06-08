import { useState } from "react";

export default function useDisclosure() {
	const [isOpen, setOpen] = useState(false);

	return {
		isOpen,
		onOpen: () => setOpen(true),
		onClose: () => setOpen(false),
		onToggle: () => setOpen(!isOpen),
	};
}
