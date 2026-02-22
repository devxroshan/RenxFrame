'use client';
import { AlertTriangle } from 'lucide-react'

const InternalServerError = () => {
  return (
    <main className="select-none w-screen h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute w-screen h-screen bg-red-600/20 rounded-full blur-3xl -z-10" />
      
      <div className="flex flex-col items-center justify-center gap-6 text-center px-6">

        {/* Icon */}
        <div className="bg-red-600/10 p-6 rounded-2xl border border-red-600/20 shadow-lg">
          <AlertTriangle size={64} className="text-red-500" />
        </div>

        {/* Big 500 */}
        <h1 className="text-7xl font-bold tracking-wider text-red-500">
          500
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold">
          Internal Server Error
        </h2>

        {/* Description */}
        <div className="flex flex-col gap-1 text-gray-400 max-w-md">
          <span>
            Something unexpected happened on our end.
          </span>
          <span>
            Our system has encountered an unusual condition.
          </span>
          <span>
            Please try again later or contact support if the issue persists.
          </span>
        </div>

        {/* Extra Info */}
        <div className="mt-4 text-sm text-gray-600">
          <span>Error Code: INTERNAL_SERVER_ERROR</span>
        </div>

        {/* Retry Button */}
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 transition rounded-xl font-semibold shadow-lg shadow-red-600/20 cursor-pointer"
        >
          Try Again
        </button>

      </div>
    </main>
  )
}

export default InternalServerError