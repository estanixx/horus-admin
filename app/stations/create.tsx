"use client";

import type React from "react";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/Layout";
import { graphqlClient, CREATE_STATION } from "../../lib/api";

interface StationForm {
  alias: string;
  elevation: string;
  lat: string;
  lon: string;
  country: string;
  state: string;
  city: string;
  responsible: string;
  description: string;
}

export default function CreateStation() {
  const router = useRouter();
  const [form, setForm] = useState<StationForm>({
    alias: "",
    elevation: "",
    lat: "",
    lon: "",
    country: "",
    state: "",
    city: "",
    responsible: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.alias ||
      !form.elevation ||
      !form.lat ||
      !form.lon ||
      !form.country ||
      !form.state ||
      !form.city
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const input = {
        alias: form.alias,
        elevation: Number.parseFloat(form.elevation),
        lat: Number.parseFloat(form.lat),
        lon: Number.parseFloat(form.lon),
        country: form.country,
        state: form.state,
        city: form.city,
        responsible: form.responsible || null,
        description: form.description || null,
      };

      await graphqlClient(CREATE_STATION, { input });
      router.push("/stations");
    } catch (err) {
      setError("Failed to create station");
      console.error("Create station error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Station
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new monitoring station to the system
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="alias"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alias *
                </label>
                <input
                  type="text"
                  id="alias"
                  name="alias"
                  value={form.alias}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="elevation"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Elevation (m) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="elevation"
                  name="elevation"
                  value={form.elevation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lat"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Latitude *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  id="lat"
                  name="lat"
                  value={form.lat}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lon"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Longitude *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  id="lon"
                  name="lon"
                  value={form.lon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="responsible"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Responsible Person
                </label>
                <input
                  type="text"
                  id="responsible"
                  name="responsible"
                  value={form.responsible}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Station"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/stations")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
