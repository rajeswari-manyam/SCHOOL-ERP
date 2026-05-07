import { useStudent, useDownload } from "./hooks/useProfile";

// Components
import ProfileCard from "./components/ProfileCard";
import AcademicInfoCard from "./components/AcademicInfoCard";
import PersonalInfoCard from "./components/PersonalInfoCard";
import QuickDownloads from "./components/QuickDownloads";

const ProfilePage = () => {
  const { student, loading } = useStudent();
  const { handleDownload, downloading } = useDownload();

  if (loading || !student) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <ProfileCard student={student} />
          <AcademicInfoCard academic={student.academic} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <PersonalInfoCard personal={student.personal} />

          <QuickDownloads
        downloads={student.quickDownloads}
            onDownload={handleDownload}
            downloadingId={downloading}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;