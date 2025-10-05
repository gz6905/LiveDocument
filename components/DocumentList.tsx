"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { DeleteModal } from "@/components/DeleteModal";
import { dateConverter } from "@/lib/utils";
import AddDocumentBtn from "@/components/AddDocumentBtn";

interface DocumentData {
  id: string;
  metadata: {
    title: string;
  };
  createdAt: string;
}

interface DocumentListProps {
  documents: DocumentData[];
  clerkUser: {
    id: string;
    email: string;
  };
}

const DocumentList = ({ documents, clerkUser }: DocumentListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter documents based on search query
  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents;
    }

    return documents.filter((doc) =>
      doc.metadata.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documents, searchQuery]);

  return (
    <div className="document-list-container">
      <div className="document-list-title">
        <h3 className="text-28-semibold">All Documents</h3>
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-dark-300 border-dark-400 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            {/* Clear search button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
          {/* Add Document Button */}
          <AddDocumentBtn userId={clerkUser.id} email={clerkUser.email} />
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-dark-300 rounded-lg border border-dark-400">
          <p className="text-sm text-blue-200 font-medium">
            {filteredDocuments.length} result
            {filteredDocuments.length !== 1 ? "s" : ""} for &quot;{searchQuery}
            &quot;
          </p>
          {filteredDocuments.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              No documents match your search. Try different keywords or check
              your spelling.
            </p>
          )}
        </div>
      )}

      {/* Document List */}
      {filteredDocuments.length > 0 ? (
        <ul className="document-ul">
          {filteredDocuments.map((doc) => (
            <li key={doc.id} className="document-list-item">
              <Link
                href={`/documents/${doc.id}`}
                className="flex flex-1 items-center gap-4"
              >
                <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                  <Image
                    src="/assets/icons/doc.svg"
                    alt="Document icon"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="space-y-1">
                  <p className="line-clamp-1 text-lg">
                    {/* Highlight search term */}
                    {searchQuery ? (
                      <HighlightedText
                        text={doc.metadata.title}
                        query={searchQuery}
                      />
                    ) : (
                      doc.metadata.title
                    )}
                  </p>
                  <p className="text-sm font-light text-blue-100">
                    Created about {dateConverter(doc.createdAt)}
                  </p>
                </div>
              </Link>
              <DeleteModal roomId={doc.id} />
            </li>
          ))}
        </ul>
      ) : searchQuery ? (
        // Empty search results
        <div className="document-list-empty">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              We couldn&apos;t find any documents matching &quot;
              <span className="text-blue-400 font-medium">{searchQuery}</span>
              &quot;. Try searching with different keywords.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-dark-400 text-gray-300 rounded-md hover:bg-dark-300 transition-colors"
              >
                Clear search
              </button>
              <AddDocumentBtn userId={clerkUser.id} email={clerkUser.email} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Helper component to highlight search terms
const HighlightedText = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span
            key={index}
            className="bg-yellow-500 bg-opacity-30 text-yellow-200 px-1 py-0.5 rounded font-medium"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

export default DocumentList;
