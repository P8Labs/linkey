import React from "react";
import CreateLinkForm from "../components/dash/CreateLinkForm";
import LinksList from "../components/dash/LinksList";
import TopBar from "../components/dash/TopBar";
import { fetchlinks } from "@/lib/data";

export default async function Dashboard() {
  const links = await fetchlinks();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D1E9F6]/30 via-[#F6EACB]/20 to-[#F1D3CE]/30 dark:from-[#2a4d5a]/30 dark:via-[#5a4d2a]/20 dark:to-[#5a3d2a]/30 dark:bg-slate-900">
      <TopBar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <CreateLinkForm />
        <LinksList links={links} />
      </div>
    </div>
  );
}
