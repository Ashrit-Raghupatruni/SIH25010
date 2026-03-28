import { Outlet } from "react-router-dom";
import AppHeader from "../AppHeader";
import Sidebar from "../Sidebar";
import AgriBot from "../AgriBot";

const SaaSLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8">
          <div className="mx-auto max-w-7xl animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
      <AgriBot />
    </div>
  );
};

export default SaaSLayout;
