import React, { useState } from "react";
import type { StudyMaterial } from "../types/Homework.types";
import { MATERIAL_TYPE_CONFIG, SUBJECT_LABELS } from "../utils/Homework.utils";

interface Props {
  materials: StudyMaterial[];
  onDownload: (id: string, fileName: string) => void;
  downloadingId: string | null;
}

const StudyMaterialsGrid: React.FC<Props> = ({ materials, onDownload, downloadingId }) => {
  const [query, setQuery] = useState("");

  const filtered = materials.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    SUBJECT_LABELS[m.subject].toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Search + Filter bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search materials..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
          ⚙️ Filter
        </button>
        <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors">
          ↕️ Latest
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No materials found for "{query}"
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((material) => {
            const typeConfig = MATERIAL_TYPE_CONFIG[material.type];
            const isExternal = material.isExternal;
            const isDownloading = downloadingId === material.id;

            return (
              <div
                key={material.id}
                className={`bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 ${
                  isExternal
                    ? "border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50"
                    : "border-gray-100"
                }`}
              >
                {/* Type badge */}
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <span className="text-xl">{typeConfig.icon}</span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      isExternal
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {typeConfig.label}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 leading-tight">
                    {isExternal ? material.externalLabel : material.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {material.className} • {SUBJECT_LABELS[material.subject]}
                  </p>
                </div>

                {/* Upload date */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>📅</span>
                  <span>
                    {isExternal ? "Added" : "Uploaded"}{" "}
                    {new Date(material.uploadedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Action button */}
                {isExternal ? (
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Open Link
                  </a>
                ) : (
                  <button
                    onClick={() => onDownload(material.id, material.title)}
                    disabled={isDownloading}
                    className="w-full py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isDownloading ? "Downloading…" : "Download"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudyMaterialsGrid;