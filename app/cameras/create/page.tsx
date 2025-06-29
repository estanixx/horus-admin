"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import the router hook
import Layout from "@components/Layout";
import LoadingSpinner from "@components/LoadingSpinner";
import { graphqlClient, GET_STATIONS, CREATE_CAMERA } from "@/lib/graphql/";

// Define the shape of the form data
interface CameraForm {
  reference: string;
  sizeX: string;
  sizeY: string;
  stationId: string;
}

// Define the shape of a station object
interface Station {
  id: string;
  alias: string;
}

export default function CreateCamera() {
  const router = useRouter(); // Initialize the router
  const [stations, setStations] = useState<Station[]>([]);
  const [form, setForm] = useState<CameraForm>({
    reference: "",
    sizeX: "",
    sizeY: "",
    stationId: "",
  });
  const [loading, setLoading] = useState(false);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stations when the component mounts
  useEffect(() => {
    async function fetchStations() {
      try {
        setStationsLoading(true);
        const data = await graphqlClient(GET_STATIONS);
        setStations(data.stations || []);
      } catch (err) {
        setError("Failed to load stations. Please try again later.");
        console.error("Stations loading error:", err);
      } finally {
        setStationsLoading(false);
      }
    }
    fetchStations();
  }, []);

  // Handle changes in form inputs
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate required fields
    if (!form.reference || !form.sizeX || !form.sizeY || !form.stationId) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare the input for the GraphQL mutation
      const input = {
        reference: form.reference,
        sizeX: Number.parseInt(form.sizeX),
        sizeY: Number.parseInt(form.sizeY),
        stationId: Number.parseInt(form.stationId),
      };

      // Execute the mutation
      await graphqlClient(CREATE_CAMERA, { input });

      // On success, navigate to the cameras list page
      router.push("/cameras");

    } catch (err) {
      setError("Failed to create camera. Please check the details and try again.");
      console.error("Create camera error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle cancel button click
  function handleCancel() {
    router.push("/cameras");
  }

  // Show a loading spinner while fetching stations
  if (stationsLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Camera
          </h1>
          <p className="text-gray-600 mt-2">
            Register a new camera device in the system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Reference Input */}
            <div>
              <label
                htmlFor="reference"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Camera Reference (Serial Number) *
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="e.g., SN-A8723B9"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
               <p className="text-xs text-gray-500 mt-1">The unique serial number or identifier for this camera.</p>
            </div>


            {/* Resolution Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="sizeX"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Width (pixels) *
                </label>
                <input
                  type="number"
                  id="sizeX"
                  name="sizeX"
                  value={form.sizeX}
                  onChange={handleChange}
                  placeholder="1920"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="sizeY"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Height (pixels) *
                </label>
                <input
                  type="number"
                  id="sizeY"
                  name="sizeY"
                  value={form.sizeY}
                  onChange={handleChange}
                  placeholder="1080"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Station Selector */}
            <div>
              <label
                htmlFor="stationId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assign to Station *
              </label>
              <select
                id="stationId"
                name="stationId"
                value={form.stationId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a station...</option>
                {stations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.alias} (ID: {station.id})
                  </option>
                ))}
              </select>
              {stations.length === 0 && !stationsLoading && (
                <p className="text-sm text-red-600 mt-1">
                  No stations available. Please create a station first.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || stations.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Camera"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Helper message if no stations exist */}
        {stations.length === 0 && !stationsLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <span className="text-xl mr-3">ℹ️</span>
              <div>
                <h4 className="font-medium text-blue-800">
                  No Stations Available
                </h4>
                <p className="text-blue-700 text-sm mt-1">
                  You need to create at least one station before you can
                  register cameras.
                </p>
                <a
                  href="/stations/create"
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Create a station now →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
