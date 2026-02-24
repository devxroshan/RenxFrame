'use client';

import { Monitor, AlertTriangle } from "lucide-react";

const NotAvailable = () => {
  return (
    <div className="md:hidden flex items-center justify-center min-h-screen bg-linear-to-br from-[#0f0f0f] via-[#111827] to-black text-white px-6">
      <div className="max-w-md text-center space-y-6">

        {/* Icon Section */}
        <div className="flex justify-center">
          <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
            <Monitor size={48} className="text-blue-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold tracking-tight">
          Screen Too Small
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-sm leading-relaxed">
          This application is optimized for desktop experience.
          Please use a device with a larger screen (greater than 768px width).
        </p>

        {/* Warning badge */}
        <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-lg">
          <AlertTriangle size={16} />
          <span>Tablet & Mobile not supported</span>
        </div>

      </div>
    </div>
  )
}

export default NotAvailable