"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { NodeModel, Tree } from "@minoru/react-dnd-treeview";
import axios from "axios";

import { equals } from "lib/utils";

import CategoryEdit from "./CategoryEdit";
import { CategoryItem } from "./page";

import IconChevronRight from "assets/icons/icon_chevron-right.svg";
import IconChevronUp from "assets/icons/icon_chevron-up.svg";

type Props = {
  categories: CategoryItem[];
};

export default function ClientContent({ categories: serverCategories }: Props) {
  const router = useRouter();

  const [categories, setCategories] = useState(serverCategories);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const treeData = categories
    .map((category) => ({
      id: category.id,
      parent: category.parentId || "root",
      droppable: true,
      text: category.name,
      data: category,
    }))
    .filter((node) => node.id !== "default"); // Remove default category

  const onDrop = (tree: NodeModel<CategoryItem>[]) => {
    const newCategory = tree
      .map((node) => {
        if (!node.data) {
          return null;
        }

        const category = node.data;
        category.parentId =
          node.parent === "root" ? null : (node.parent as string);
        return category;
      })
      .filter(Boolean);

    setCategories(newCategory as CategoryItem[]);
  };

  const selectedCategory =
    selectedId === "default"
      ? serverCategories[0]
      : categories.find((category) => category.id === selectedId);

  const setSelectedCategory = (category?: CategoryItem) => {
    let newCategories: CategoryItem[];
    if (!category) {
      setSelectedId(null);
      newCategories = categories.filter((c) => c.id !== selectedId);
    } else {
      newCategories = categories.map((c) => {
        if (c.id === category.id) {
          return category;
        }
        return c;
      });
    }
    setCategories(newCategories);
  };

  const addCategory = () => {
    const newCategory = {
      id: crypto.randomUUID(),
      name: "New category",
      description: "",
      parentId: "root",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      _count: {
        posts: 0,
      },
    } as CategoryItem;

    setSelectedId(newCategory.id);
    setCategories([newCategory, ...categories]);
  };

  const saveCategories = async () => {
    try {
      setLoading(true);

      const rawCategories = categories
        .map((category) => {
          const { _count, createdAt, updatedAt, deletedAt, ...rest } = category;

          if (rest.parentId === "root") {
            rest.parentId = null;
          }

          return rest;
        })
        .filter((category) => category.id !== "default");

      await axios.post("/api/categories", rawCategories);
      router.refresh();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-2xl font-bold shrink-0">Categories</h2>
        <div className="flex-1" />
        <button
          type="button"
          className="mt-3 rounded-md px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 mr-3"
          disabled={loading || equals(categories, serverCategories)}
          onClick={() => setCategories(serverCategories)}
        >
          Reset
        </button>
        <button
          type="button"
          disabled={loading || equals(categories, serverCategories)}
          onClick={saveCategories}
          className="mt-3 rounded-md px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white"
        >
          Save
        </button>
      </div>
      <div className="flex flex-col sm:flex-row w-full mt-3">
        <div className="flex-1">
          <div className="border border-gray-300 max-h-[600px] overflow-y-auto">
            <div
              className={`mt-6 mx-6 flex items-center p-3 border border-gray-300 ${
                selectedId === "default" ? "bg-blue-100" : "bg-white"
              }`}
              onClick={() => setSelectedId("default")}
              onKeyDown={() => setSelectedId("default")}
            >
              <div className="w-3 h-3 mr-3" />
              <p>
                Default&nbsp;
                <span className="text-gray-600">
                  ({serverCategories[0]._count.posts})
                </span>
              </p>
            </div>
            <Tree
              tree={treeData}
              rootId="root"
              onDrop={onDrop}
              render={(node, { depth, isOpen, onToggle, hasChild }) => (
                <TreeItem
                  node={node}
                  depth={depth}
                  isOpen={isOpen}
                  onToggle={onToggle}
                  hasChild={hasChild}
                  isSelected={selectedId === node.id}
                  onClick={() => setSelectedId(node.id as string)}
                />
              )}
              initialOpen={true}
              classes={{
                root: "p-6 pt-0",
                draggingSource: "opacity-30",
                dropTarget: "bg-blue-100",
              }}
            />
          </div>
          <button
            type="button"
            className="mt-3 rounded-md px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={addCategory}
          >
            Add
          </button>
        </div>
        <div className="w-6 h-6" />
        <div className="flex-1">
          <h3 className="text-2xl font-bold shrink-0">Category Settings</h3>
          <CategoryEdit
            key={selectedId}
            category={selectedCategory}
            setCategory={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
}

type ItemProps = {
  node: NodeModel<CategoryItem>;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  hasChild: boolean;
  isSelected: boolean;
  onClick: () => void;
};

const BlankIcon = ({ onClick }: { onClick: () => void }) => (
  <div className="w-3 h-3 mr-3" onClick={onClick} onKeyDown={onClick} />
);

function TreeItem({
  node,
  depth,
  isOpen,
  onToggle,
  hasChild,
  isSelected,
  onClick,
}: ItemProps) {
  const Icon = hasChild
    ? isOpen
      ? IconChevronUp
      : IconChevronRight
    : BlankIcon;

  return (
    <div
      style={{ marginLeft: depth * 12 }}
      className={`flex items-center p-3 border border-gray-300 ${
        isSelected ? "bg-blue-100" : "bg-white"
      }`}
      onClick={onClick}
      onKeyDown={onClick}
    >
      <Icon
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          onToggle();
        }}
        className="w-3 h-3 mr-3"
      />
      <p>
        {node.text}&nbsp;
        <span className="text-gray-600">({node.data?._count.posts || 0})</span>
      </p>
    </div>
  );
}
