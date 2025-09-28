import { Outlet } from "react-router";
import { SidebarMenu } from "~/components/SidebarMenu";
import { useNavigate } from "react-router";
import { useStepStore } from "~/store/stepStore";
import { useEffect } from "react";

export function MainLayout() {
  const navigate = useNavigate();
  const setNavigate = useStepStore((state) => state.setNavigate); 

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

  return (
    <div className="min-h-screen bg-[#F8F3F5]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid sm:grid-cols-4 gap-6 flex-row">
          {/* Sidebar Menu */}
          <div className="sm:block col-span-full md:col-span-1">
            <SidebarMenu />

          </div>

          {/* Main Content */}
          <main className="space-y-6 col-span-full sm:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}