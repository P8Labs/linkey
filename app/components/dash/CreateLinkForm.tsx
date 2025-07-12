"use client";

import { SHORTEN_DOMAIN, tags } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SHORTEN_LEN = 6;

export default function CreateLinkForm() {
  const [longUrl, setLongUrl] = useState("");
  const [shortPart, setShortPart] = useState("");
  const [selectedTag, setSelectedTag] = useState("social");
  const [customTag, setCustomTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const generateRandomShort = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
    let result = "";
    for (let i = 0; i < SHORTEN_LEN; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setShortPart(result);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl,
          shortPart,
          tag: selectedTag === "custom" ? customTag : selectedTag,
        }),
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
      // Reset form
      setLongUrl("");
      setShortPart("");
      setCustomTag("");
      setIsLoading(false);
      router.refresh(); // Refresh the page to show the new link
    }
  };

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-palette-blue rounded-lg flex items-center justify-center mr-3">
          <svg
            className="w-4 h-4 text-palette-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Create New Link
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="longUrl"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Long URL
          </label>
          <input
            type="url"
            id="longUrl"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            required
            className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:border-palette-blue focus:outline-none focus:ring-4 focus:ring-[#D1E9F6]/30 dark:focus:ring-[#2a4d5a]/30 transition-all duration-200"
          />
        </div>

        <div>
          <label
            htmlFor="shortPart"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Custom Short Part
          </label>
          <div className="flex space-x-3">
            <input
              type="text"
              id="shortPart"
              value={shortPart}
              onChange={(e) =>
                setShortPart(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              placeholder="my-link"
              className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:border-palette-blue focus:outline-none focus:ring-4 focus:ring-[#D1E9F6]/30 dark:focus:ring-[#2a4d5a]/30 transition-all duration-200"
            />
            <button
              type="button"
              onClick={generateRandomShort}
              className="px-4 py-3 bg-palette-yellow hover:bg-[#F0DE9B] dark:hover:bg-[#6a5d3a] text-palette-yellow rounded-xl border border-palette-yellow transition-all duration-200 font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
          {shortPart && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Preview:{" "}
              <span className="font-mono text-palette-blue">
                {SHORTEN_DOMAIN}/{shortPart}
              </span>
            </p>
          )}
        </div>

        {/* Tag Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tag
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => setSelectedTag(tag.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  selectedTag === tag.value
                    ? "ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-[#D1E9F6] dark:ring-[#2a4d5a] " +
                      tag.color
                    : tag.color + " hover:scale-105"
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {selectedTag === "custom" && (
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Enter custom tag"
              className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:border-palette-blue focus:outline-none focus:ring-4 focus:ring-[#D1E9F6]/30 dark:focus:ring-[#2a4d5a]/30 transition-all duration-200"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!longUrl || !shortPart || isLoading}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#5A9BD4] to-[#4A8BC2] hover:from-[#4A8BC2] hover:to-[#3A7BB2] dark:from-[#4A8BC2] dark:to-[#3A7BB2] dark:hover:from-[#3A7BB2] dark:hover:to-[#2A6BA2] focus:outline-none focus:ring-4 focus:ring-[#D1E9F6]/50 dark:focus:ring-[#2a4d5a]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="-ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
            {isLoading ? "Creating..." : "Create Link"}
          </button>
        </div>
      </form>
    </div>
  );
}
