import { fetchLinkByShorten, logClick } from "@/lib/data";
import { notFound, redirect } from "next/navigation";

export default async function ShortenRedirector({
  params,
}: {
  params: Promise<{ shorten: string }>;
}) {
  const { shorten } = await params;
  const link = await fetchLinkByShorten(shorten);

  if (link) {
    await logClick(link.id);
    redirect(link.longUrl);
  } else {
    // If the link is not found, redirect to a default page or handle it accordingly
    notFound();
  }
}
