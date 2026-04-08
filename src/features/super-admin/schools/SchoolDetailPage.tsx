import { useParams } from "react-router-dom";
import { useSchool, useUpdateSchool, useSuspendSchool, useActivateSchool } from "../hooks/useSchools";
import { SchoolDetailCard } from "../components";

export default function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: school, isLoading } = useSchool(id!);
  const updateSchool = useUpdateSchool();
  const suspendSchool = useSuspendSchool();
  const activateSchool = useActivateSchool();

  if (isLoading) return <div>Loading...</div>;
  if (!school) return <div>School not found</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">School Details</h1>
        <div className="flex gap-2">
          {school.status === "active" ? (
            <button className="btn btn-warning" onClick={() => suspendSchool.mutate(school.id)}>Suspend</button>
          ) : (
            <button className="btn btn-success" onClick={() => activateSchool.mutate(school.id)}>Activate</button>
          )}
        </div>
      </div>
      <SchoolDetailCard school={school} />
    </div>
  );
}
