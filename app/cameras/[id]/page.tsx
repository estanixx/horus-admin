"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Layout from "@components/Layout";
import LoadingSpinner from "@components/LoadingSpinner";
import Modal from "@components/Modal";
import {
  graphqlClient,
  GET_CAMERA,
  GET_STATIONS,
  UPDATE_CAMERA,
  DELETE_CAMERA,
} from "@/lib/graphql/";
import { redirect, useParams } from "next/navigation";






export default function CameraDetail() {
  const { id } = useParams();
  const [camera, setCamera] = useState<Camera | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [form, setForm] = useState<CameraForm>({
    reference: "",
    sizeX: "",
    sizeY: "",
    stationId: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  async function fetchData() {
    try {
      setLoading(true);
      const [cameraData, stationsData] = await Promise.all([
        graphqlClient(GET_CAMERA, { id: Number.parseInt(id as string) }),
        graphqlClient(GET_STATIONS),
      ]);

      const cameraInfo = cameraData.camera;
      if (cameraInfo) {
        setCamera(cameraInfo);
        setForm({
          reference: cameraInfo.reference,
          sizeX: cameraInfo.sizeX.toString(),
          sizeY: cameraInfo.sizeY.toString(),
          stationId: cameraInfo.stationId.toString(),
        });
      }

      setStations(stationsData.stations || []);
    } catch (err) {
      setError("Failed to load camera");
      console.error("Camera detail error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (!form.reference || !form.sizeX || !form.sizeY || !form.stationId) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setUpdating(true);
      setError(null);

      const input = {
        reference: form.reference,
        sizeX: Number.parseInt(form.sizeX),
        sizeY: Number.parseInt(form.sizeY),
        stationId: Number.parseInt(form.stationId),
      };

      await graphqlClient(UPDATE_CAMERA, {
        id: Number.parseInt(id as string),
        input,
      });
      redirect("/cameras");
    } catch (err) {
      setError("Failed to update camera");
      console.error("Update camera error:", err);
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    try {
      setDeleting(true);
      await graphqlClient(DELETE_CAMERA, { id: Number.parseInt(id as string) });
      redirect("/cameras");
    } catch (err) {
      setError("Failed to delete camera");
      console.error("Delete camera error:", err);
    } finally {
      setDeleting(false);
    }
  }

  function getStationAlias(stationId: number) {
    const station = stations.find((s) => s.id === stationId);
    return station ? station.alias : `Station ${stationId}`;
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (!camera) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Camera not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Camera</h1>
          <p className="text-gray-600 mt-2">Update camera information</p>
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
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

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
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    {updating ? "Updating..." : "Update Camera"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteModal(true)}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
                  >
                    Delete Camera
                  </button>
                  <button
                    type="button"
                    onClick={() => redirect("/cameras")}
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
                Camera Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">ID:</span>
                  <span className="text-sm text-gray-900">{camera.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Reference:
                  </span>
                  <span className="text-sm text-gray-900">
                    {camera.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Resolution:
                  </span>
                  <span className="text-sm text-gray-900">
                    {camera.sizeX} × {camera.sizeY}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Station:
                  </span>
                  <span className="text-sm text-gray-900">
                    {getStationAlias(camera.stationId)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start">
                <span className="text-xl mr-3">💡</span>
                <div>
                  <h4 className="font-medium text-blue-800">
                    Camera Configuration
                  </h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Remember to update your camera PC console application if you
                    change the station assignment or camera reference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Camera"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the camera "{camera.reference}"?
            This action cannot be undone.
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
