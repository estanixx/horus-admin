"use client";

import type React from "react";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import { graphqlClient, GET_STATIONS, CREATE_CAMERA } from "../../lib/api";

interface Station {
  id: number;
  alias: string;
}

interface CameraForm {
  reference: string;
  sizeX: string;
  sizeY: string;
  station_id: string;
}

export default function CreateCamera() {
  const router = useRouter();
  const [stations, setStations] = useState<Station[]>([]);
  const [form, setForm] = useState<CameraForm>({
    reference: "",
    sizeX: "",
    sizeY: "",
    station_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [stationsLoading, setStationsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createdCamera, setCreatedCamera] = useState<any>(null);
  const [jwtToken, setJwtToken] = useState<string>("");

  useEffect(() => {
    fetchStations();
  }, []);

  async function fetchStations() {
    try {
      setStationsLoading(true);
      const data = await graphqlClient(GET_STATIONS);
      setStations(data.stations || []);
    } catch (err) {
      setError("Failed to load stations");
      console.error("Stations error:", err);
    } finally {
      setStationsLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.reference || !form.sizeX || !form.sizeY || !form.station_id) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const input = {
        reference: form.reference,
        sizeX: Number.parseInt(form.sizeX),
        sizeY: Number.parseInt(form.sizeY),
        station_id: Number.parseInt(form.station_id),
      };

      const result = await graphqlClient(CREATE_CAMERA, { input });
      setCreatedCamera(result.createCamera);
      setJwtToken(result.createCamera.jwt_token || "JWT_TOKEN_PLACEHOLDER");
    } catch (err) {
      setError("Failed to create camera");
      console.error("Create camera error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(jwtToken);
      alert("JWT token copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = jwtToken;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("JWT token copied to clipboard!");
    }
  }

  if (stationsLoading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (createdCamera) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Camera Created Successfully!
            </h1>
            <p className="text-gray-600 mt-2">
              Your camera has been registered in the system
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  Camera Registration Complete
                </h3>
                <p className="text-green-700">
                  Camera "{createdCamera.reference}" has been created with ID:{" "}
                  {createdCamera.id}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Camera JWT Token
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>
                Copy this JWT and configure it in the Camera PC console
                application for this camera. Store it securely!
              </strong>
            </p>

            <div className="space-y-4">
              <div className="relative">
                <textarea
                  value={jwtToken}
                  readOnly
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm resize-none"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                >
                  <span>📋</span>
                  <span>Copy to Clipboard</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-start">
              <span className="text-xl mr-3">⚠️</span>
              <div>
                <h4 className="font-medium text-yellow-800">
                  Important Security Notice
                </h4>
                <p className="text-yellow-700 text-sm mt-1">
                  This JWT token will only be displayed once. Make sure to copy
                  and store it securely before leaving this page. You will need
                  this token to configure the camera application.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => router.push("/cameras")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Done - Return to Cameras
            </button>
          </div>
        </div>
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
            <div>
              <label
                htmlFor="reference"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Camera Reference *
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={form.reference}
                onChange={handleChange}
                placeholder="e.g., CAM-001, Front-Door-Camera"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

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

            <div>
              <label
                htmlFor="station_id"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assign to Station *
              </label>
              <select
                id="station_id"
                name="station_id"
                value={form.station_id}
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
              {stations.length === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  No stations available. Please create a station first.
                </p>
              )}
            </div>

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
                onClick={() => router.push("/cameras")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {stations.length === 0 && (
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

export const getServerSideProps = withPageAuthRequired();
