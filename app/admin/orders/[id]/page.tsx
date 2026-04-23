import { redirect } from "next/navigation";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  redirect("/admin");
}
