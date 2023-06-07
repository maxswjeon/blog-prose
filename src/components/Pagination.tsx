"use client";

import { NumberParam, useQueryParam, withDefault } from "use-query-params";

import IconCaretLeft from "assets/icons/icon_caret-left.svg";
import IconCaretRight from "assets/icons/icon_caret-right.svg";

type Props = {
	className?: string;
	total: number;
	perPage?: number;
};

export default function Pagination({ className, total, perPage = 10 }: Props) {
	const [page, setPage] = useQueryParam("page", withDefault(NumberParam, 1));

	const totalpages = Math.ceil(total / perPage);
	const currentBlock = Math.floor(page / 10) + 1;

	const startPage = (currentBlock - 1) * 10 + 1;
	const endPage = Math.min(currentBlock * 10, totalpages);

	return (
		<nav>
			<ul className={`inline-flex items-center -space-x-px ${className}`}>
				<li>
					<button
						type="button"
						onClick={() => setPage(startPage - 1)}
						disabled={startPage === 1}
						className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
					>
						<IconCaretLeft className="w-5 h-5" />
					</button>
				</li>
				{Array.from({ length: endPage - startPage + 1 }).map((_, index) => (
					<li key={startPage + index}>
						<button
							type="button"
							onClick={() => setPage(startPage + index)}
							className={`px-3 py-2 leading-tight border border-gray-300 hover:bg-gray-100 hover:text-gray-700 ${
								startPage + index === page
									? "text-blue-500 bg-blue-100"
									: "text-gray-500 bg-white"
							}`}
						>
							{startPage + index}
						</button>
					</li>
				))}
				<li>
					<button
						type="button"
						onClick={() => setPage(endPage + 1)}
						disabled={endPage === totalpages}
						className="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
					>
						<IconCaretRight className="w-5 h-5" />
					</button>
				</li>
			</ul>
		</nav>
	);
}
