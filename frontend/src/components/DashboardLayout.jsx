import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-[1600px]">
      <Sidebar />
      <main className="min-h-[calc(100vh-73px)] flex-1">
        <Outlet />
      </main>
    </div>
  );
}