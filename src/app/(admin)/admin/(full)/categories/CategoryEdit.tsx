"use client";

import { CategoryItem } from "./page";

type Props = {
  category: CategoryItem | undefined;
  setCategory: (category?: CategoryItem) => void;
};

export default function CategoryEdit({ category, setCategory }: Props) {
  if (!category) {
    return null;
  }

  if (category.id === "default") {
    return (
      <div className="mt-3">
        <p className="text-gray-800">Default category cannot be edited.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-3">
        <p className="text-gray-800">Name</p>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={category.name}
          onChange={(e) =>
            setCategory({
              ...category,
              name: e.target.value,
            })
          }
        />
      </div>
      <div className="mt-3">
        <p className="text-gray-800">Description</p>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={category.description}
          onChange={(e) =>
            setCategory({
              ...category,
              description: e.target.value,
            })
          }
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          className="mt-3 rounded-md px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
          onClick={() => {
            setCategory(undefined);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
