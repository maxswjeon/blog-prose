import { redirect } from "next/navigation";

export default function NoPage() {
	redirect(`${process.env.BASE_URL}/admin/drafts`);
}
