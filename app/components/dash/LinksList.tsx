"use client";

import { SHORTEN_DOMAIN, tags } from "@/lib/utils";
import { ShortUrl } from "@prisma/client";
import { Copy, Edit, Eye, LinkIcon, Trash } from "lucide-react";
import React, { useState } from "react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LinksList({ links }: { links: ShortUrl[] }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [editForm, setEditForm] = useState({
    longUrl: "",
    tag: "",
    customTag: "",
  });

  const filters = [
    { value: "all", label: "All Links", count: links.length },
    {
      value: "personal",
      label: "Personal",
      count: links.filter((l) => l.tag === "personal").length,
    },
    {
      value: "social",
      label: "Social",
      count: links.filter((l) => l.tag === "social").length,
    },
    {
      value: "projects",
      label: "Projects",
      count: links.filter((l) => l.tag === "projects").length,
    },
  ];

  const getTagColor = (tag: string) => {
    const tagInfo = tags.find((t) => t.value === tag);
    return tagInfo
      ? tagInfo.color
      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const startEdit = (link: ShortUrl) => {
    setEditingId(link.id);
    setEditForm({ longUrl: link.longUrl, tag: link.tag, customTag: "" });
  };

  const saveEdit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        id: editingId,
        longUrl: editForm.longUrl,
        tag: editForm.tag === "custom" ? editForm.customTag : editForm.tag,
      };

      const res = await fetch("/api/v1/shorten", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error creating link:", errorData);
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Link created successfully:", data);
    } catch (error) {
      console.error("Error creating link:", error);
    } finally {
      setEditingId(null);
      router.refresh(); // Refresh the page to show the new link
      setEditForm({ longUrl: "", tag: "", customTag: "" });
      setIsLoading(false);
      setSelectedFilter("all"); // Reset filter to show all links after edit
    }
  };

  const deleteLink = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/shorten`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting link:", errorData);
        setIsLoading(false);
        return;
      }

      console.log("Link deleted successfully");
      router.refresh(); // Refresh the page to show updated links
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLinks =
    selectedFilter === "all"
      ? links
      : links.filter((link) => link.tag === selectedFilter);

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-palette-yellow rounded-lg flex items-center justify-center mr-3">
            <LinkIcon className="h-5 w-5 text-palette-yellow" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Links
          </h2>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredLinks.length} links
        </span>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedFilter === filter.value
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {filter.label}
            {filter.count > 0 && (
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  selectedFilter === filter.value
                    ? "bg-palette-blue text-palette-blue"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {filter.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <LinkIcon
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
              size={48}
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No links found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create your first short link to get started.
            </p>
          </div>
        ) : (
          filteredLinks.map((link) => (
            <div
              key={link.id}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <Link
                      href={`${SHORTEN_DOMAIN}/${link.shorten}`}
                      target="_blank"
                      className="text-lg font-medium text-palette-blue font-mono hover:underline truncate"
                    >
                      {SHORTEN_DOMAIN}/{link.shorten}
                    </Link>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTagColor(link.tag)}`}
                    >
                      {link.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                    {link.longUrl}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1 text-gray-400 dark:text-gray-500" />
                      {link.clicks} clicks
                    </span>
                    <span>Created {moment(link.createdAt).fromNow()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() =>
                      copyToClipboard(`${SHORTEN_DOMAIN}/${link.shorten}`)
                    }
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-palette-blue hover:bg-palette-blue/10 rounded-lg transition-all duration-200"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => startEdit(link)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-palette-pink hover:bg-palette-pink/10 rounded-lg transition-all duration-200"
                    title="Edit link"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 hover:bg-red-600/10 rounded-lg transition-all duration-200"
                    title="Delete link"
                  >
                    <Trash className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              {editingId === link.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Long URL
                      </label>
                      <input
                        disabled={isLoading}
                        type="url"
                        value={editForm.longUrl}
                        onChange={(e) =>
                          setEditForm({ ...editForm, longUrl: e.target.value })
                        }
                        className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-3 py-2 text-sm focus:border-palette-blue focus:outline-none focus:ring-4 focus:ring-[#D1E9F6]/30 dark:focus:ring-[#2a4d5a]/30 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tag
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((tag) => (
                          <button
                            disabled={isLoading}
                            key={tag.value}
                            type="button"
                            onClick={() =>
                              setEditForm({ ...editForm, tag: tag.value })
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                              editForm.tag === tag.value
                                ? "ring-2 ring-offset-1 dark:ring-offset-slate-800 ring-[#D1E9F6] dark:ring-[#2a4d5a] " +
                                  tag.color
                                : tag.color + " hover:scale-105"
                            }`}
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>

                      {editForm.tag === "custom" && (
                        <input
                          disabled={isLoading}
                          type="text"
                          value={editForm.customTag}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              customTag: e.target.value,
                            })
                          }
                          placeholder="Enter custom tag"
                          className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-3 py-2 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:border-palette-blue focus:outline-none focus:ring-4 focus:ring-[#D1E9F6]/30 dark:focus:ring-[#2a4d5a]/30 transition-all duration-200"
                        />
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        disabled={isLoading}
                        onClick={saveEdit}
                        className="px-4 py-2 bg-palette-blue text-palette-blue text-sm font-medium rounded-lg hover:bg-[#C1D9E6] dark:hover:bg-[#3a5d6a] transition-all duration-200"
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
