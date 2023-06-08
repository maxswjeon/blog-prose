import { prisma } from "lib/prisma";
import { redirect } from "next/navigation";
import Editor from "./Editor";

type Props = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params: { slug } }: Props) {
  const post = await prisma.post.findUnique({
    where: {
      slug: decodeURIComponent(slug),
    },
  });

  if (!post) {
    redirect(process.env.BASE_URL);
  }

  console.log(post);
  console.log(post.content);

  return (
    <div>
      <Editor {...post} />
    </div>
  );
}
