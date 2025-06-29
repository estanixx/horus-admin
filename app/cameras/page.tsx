"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "@components/Layout";
import LoadingSpinner from "@components/LoadingSpinner";
import Modal from "@components/Modal";
import {
  graphqlClient,
  GET_CAMERAS,
  GET_STATIONS,
  DELETE_CAMERA,
} from "@/lib/graphql/";

interface Camera {
  id: number;
  reference: string;
  sizeX: number;
  sizeY: number;
  stationId: number;
}

interface Station {
  id: number;
  alias: string;
}

export default function Cameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    camera: Camera | null;
  }>({
    isOpen: false,
    camera: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [camerasData, stationsData] = await Promise.all([
        graphqlClient(GET_CAMERAS),
        graphqlClient(GET_STATIONS),
      ]);
      setCameras(camerasData.cameras || []);
      setStations(stationsData.stations || []);
    } catch (err) {
      setError("Failed to load cameras");
      console.error("Cameras error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(camera: Camera) {
    try {
      setDeleting(true);
      await graphqlClient(DELETE_CAMERA, { id: camera.id });
      setCameras(cameras.filter((c) => c.id !== camera.id));
      setDeleteModal({ isOpen: false, camera: null });
    } catch (err) {
      setError("Failed to delete camera");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  }

  function getStationAlias(stationId: number) {
    const station = stations.find((s) => s.id === stationId);
    return station ? station.alias : `Station ${stationId}`;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cameras</h1>
            <p className="text-gray-600 mt-2">Manage camera devices</p>
          </div>
          <Link
            href="/cameras/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Create New Camera
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Station
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cameras.map((camera) => (
                    <tr key={camera.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">📹</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {camera.reference}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {camera.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {camera.sizeX} × {camera.sizeY}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getStationAlias(camera.stationId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/cameras/${camera.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteModal({ isOpen: true, camera })
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cameras.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📹</span>
                <p className="text-gray-500">No cameras found</p>
                <Link
                  href="/cameras/create"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create your first camera
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, camera: null })}
        title="Delete Camera"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the camera "
            {deleteModal.camera?.reference}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setDeleteModal({ isOpen: false, camera: null })}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={() =>
                deleteModal.camera && handleDelete(deleteModal.camera)
              }
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
