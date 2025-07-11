"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import Layout from "@components/Layout";
import LoadingSpinner from "@components/LoadingSpinner";
import { graphqlClient, GET_STATIONS, GET_CAMERAS } from "@/lib/graphql";

// Dynamically import the map to avoid SSR issues with Leaflet
import dynamic from "next/dynamic";
const StationsMap = dynamic(() => import("@components/stations-map"), {
  ssr: false,
});

// Define the types for our data
interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
}
interface DashboardStats {
  totalStations: number;
  totalCameras: number;
  stations: Station[];
}

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

        // We already fetch stations for the count, so we can just reuse that data.
        // Ensure your GET_STATIONS query fetches id, name, lat, and lon.
        const [stationsData, camerasData] = await Promise.all([
          graphqlClient(GET_STATIONS), // Make sure this query returns id, name, lat, lon
          graphqlClient(GET_CAMERAS),
        ]);

        const stations = stationsData.stations || [];

        setStats({
          totalStations: stations.length,
          totalCameras: camerasData.cameras?.length || 0,
          stations: stations,
        });
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome, {user?.name || user?.email}!
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          <>
            {/* --- STATS CARDS (No change here) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Stations
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.totalStations || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">📹</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Cameras
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.totalCameras || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      System Status
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-3xl">👤</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active User
                    </p>
                    <p className="text-lg font-semibold text-blue-600">
                      {user?.name?.split(" ")[0] || "Admin"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- NEW MAP COMPONENT --- */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Stations Overview
              </h2>
              {stats && stats.stations.length > 0 ? (
                <StationsMap stations={stats.stations} />
              ) : (
                <p className="text-gray-600">
                  No stations found to display on the map.
                </p>
              )}
            </div>

            {/* --- QUICK ACTIONS (No change here) --- */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/stations/create"
                  className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl mr-3">➕</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Create New Station
                    </p>
                    <p className="text-sm text-gray-600">
                      Add a new monitoring station
                    </p>
                  </div>
                </a>
                <a
                  href="/cameras/create"
                  className="flex items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <span className="text-2xl mr-3">📷</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Create New Camera
                    </p>
                    <p className="text-sm text-gray-600">
                      Register a new camera device
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}