"use client";

import type React from "react";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import Modal from "../../src/components/Modal";
import {
  graphqlClient,
  GET_STATION,
  UPDATE_STATION,
  DELETE_STATION,
} from "../../lib/api";

interface Station {
  id: number;
  alias: string;
  elevation: number;
  lat: number;
  lon: number;
  country: string;
  state: string;
  city: string;
  responsible?: string;
  description?: string;
  cameras: Array<{
    id: number;
    reference: string;
    sizeX: number;
    sizeY: number;
  }>;
}

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

export default function StationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [station, setStation] = useState<Station | null>(null);
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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStation();
    }
  }, [id]);

  async function fetchStation() {
    try {
      setLoading(true);
      const data = await graphqlClient(GET_STATION, {
        id: Number.parseInt(id as string),
      });
      const stationData = data.station;

      if (stationData) {
        setStation(stationData);
        setForm({
          alias: stationData.alias,
          elevation: stationData.elevation.toString(),
          lat: stationData.lat.toString(),
          lon: stationData.lon.toString(),
          country: stationData.country,
          state: stationData.state,
          city: stationData.city,
          responsible: stationData.responsible || "",
          description: stationData.description || "",
        });
      }
    } catch (err) {
      setError("Failed to load station");
      console.error("Station detail error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate(e: React.FormEvent) {
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
      setUpdating(true);
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

      await graphqlClient(UPDATE_STATION, {
        id: Number.parseInt(id as string),
        input,
      });
      router.push("/stations");
    } catch (err) {
      setError("Failed to update station");
      console.error("Update station error:", err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await graphqlClient(DELETE_STATION, {
        id: Number.parseInt(id as string),
      });
      router.push("/stations");
    } catch (err) {
      setError("Failed to delete station");
      console.error("Delete station error:", err);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!station) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Station not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Station</h1>
          <p className="text-gray-600 mt-2">Update station information</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <form onSubmit={handleUpdate} className="space-y-6">
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
                    disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Update Station"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModal(true)}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    Delete Station
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

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Station Cameras
              </h3>
              {station.cameras.length > 0 ? (
                <div className="space-y-3">
                  {station.cameras.map((camera) => (
                    <div
                      key={camera.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {camera.reference}
                        </p>
                        <p className="text-sm text-gray-600">
                          {camera.sizeX}x{camera.sizeY}
                        </p>
                      </div>
                      <a
                        href={`/cameras/${camera.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No cameras assigned
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Station"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the station "{station.alias}"? This
            action cannot be undone and will also delete all associated cameras.
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setDeleteModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

export const getServerSideProps = withPageAuthRequired();
