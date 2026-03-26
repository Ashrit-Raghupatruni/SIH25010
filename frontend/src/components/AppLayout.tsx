import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const AppLayout = () => (
  <div className="min-h-screen bg-background">
    <AppHeader />
    <main className="container py-6">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
