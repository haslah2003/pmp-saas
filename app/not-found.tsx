import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-gray-500 mt-2 mb-6">Page not found</p>
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
