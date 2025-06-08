"use client";

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      redirect("/dashboard");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Horus Admin</h1>
          <p className="text-lg text-gray-600 mb-8">
            Guardia Costera Administration Panel
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Welcome Back
            </h2>
            <p className="text-gray-600 mb-8">
              Sign in to access the administration panel and manage your
              stations and cameras.
            </p>
            <Link
              href="/auth/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              <span>🔐</span>
              <span>Login with Auth0</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
