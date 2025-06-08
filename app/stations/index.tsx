"use client";

import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import LoadingSpinner from "../../src/components/LoadingSpinner";
import Modal from "../../src/components/Modal";
import { graphqlClient, GET_STATIONS, DELETE_STATION } from "../../lib/api";

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
  cameras: Array<{ id: number; reference: string }>;
}

export default function Stations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    station: Station | null;
  }>({
    isOpen: false,
    station: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  async function fetchStations() {
    try {
      setLoading(true);
      const data = await graphqlClient(GET_STATIONS);
      setStations(data.stations || []);
    } catch (err) {
      setError("Failed to load stations");
      console.error("Stations error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(station: Station) {
    try {
      setDeleting(true);
      await graphqlClient(DELETE_STATION, { id: station.id });
      setStations(stations.filter((s) => s.id !== station.id));
      setDeleteModal({ isOpen: false, station: null });
    } catch (err) {
      setError("Failed to delete station");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stations</h1>
            <p className="text-gray-600 mt-2">Manage monitoring stations</p>
          </div>
          <Link
            href="/stations/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Create New Station
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
                      Alias
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coordinates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Elevation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cameras
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stations.map((station) => (
                    <tr key={station.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {station.alias}
                        </div>
                        {station.responsible && (
                          <div className="text-sm text-gray-500">
                            by {station.responsible}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {station.city}, {station.state}
                        </div>
                        <div className="text-sm text-gray-500">
                          {station.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {station.lat.toFixed(4)}, {station.lon.toFixed(4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {station.elevation}m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {station.cameras.length} camera
                        {station.cameras.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/stations/${station.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            setDeleteModal({ isOpen: true, station })
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
            {stations.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">🏢</span>
                <p className="text-gray-500">No stations found</p>
                <Link
                  href="/stations/create"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create your first station
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, station: null })}
        title="Delete Station"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the station "
            {deleteModal.station?.alias}"? This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={() => setDeleteModal({ isOpen: false, station: null })}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              onClick={() =>
                deleteModal.station && handleDelete(deleteModal.station)
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

export const getServerSideProps = withPageAuthRequired();
