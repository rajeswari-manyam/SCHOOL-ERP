import { Outlet } from "react-router-dom";
import ParentTopNavBar from "../features/parent/dashboard/components/ParentTopNavBar";

const ParentLayout = () => {
  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <ParentTopNavBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ParentLayout;