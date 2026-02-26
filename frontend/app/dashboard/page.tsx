'use client';
import ProtectedRoute from "../Wrappers/ProtectedRoute";
import Navbar from "../components/Navbar";

import { useUserStore } from "../stores/user.store";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <main className="w-screen h-screen flex items-center justify-start">
        <Navbar/>
      </main>
    </ProtectedRoute>
  );
};

export default Dashboard;
