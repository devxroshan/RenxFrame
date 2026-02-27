'use client';
import ProtectedRoute from "../Wrappers/ProtectedRoute";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

import { useUserStore } from "../stores/user.store";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <main className="w-screen h-screen flex items-start justify-start">
        <Navbar/>
        <Topbar/>
      </main>
    </ProtectedRoute>
  );
};

export default Dashboard;
