import type { StudentDocument } from "../types/student.types";

const StudentDocumentsTab = ({ documents }: { documents: StudentDocument[] }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h4 className="font-bold text-gray-800">Documents</h4>
        </div>
        <div>
          {documents && documents.length > 0 ? (
            documents.map((doc, i) => (
              <div key={doc.id} className={`flex items-center gap-4 px-5 py-3.5 ${i < documents.length - 1 ? "border-b border-gray-50" : ""} hover:bg-gray-50/50 transition-colors`}>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-400">{doc.type.toUpperCase()} • {doc.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  {doc.verified && (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">✓ Verified</span>
                  )}
                  <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              <p className="text-sm">No documents uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDocumentsTab;