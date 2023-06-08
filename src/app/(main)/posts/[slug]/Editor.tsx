"use client";

import { default as BaseEditor } from "components/editor";

type Props = {
  title: string;
  description: string;
  content: string;
};

export default function Editor({ title, description, content }: Props) {
  const set = () => {};

  return (
    <BaseEditor
      title={title}
      setTitle={set}
      description={description}
      setDescription={set}
      content={content}
      setContent={set}
      save={set}
      disabled={true}
    />
  );
}
