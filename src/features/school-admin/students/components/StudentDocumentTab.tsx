import type { StudentDocument } from "../types/student.types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
                  <Button variant="ghost" size="sm" className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </Button>
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