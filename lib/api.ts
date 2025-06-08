import { GraphQLClient } from "graphql-request";
import { getAccessToken } from "@auth0/nextjs-auth0";

const GRAPHQL_API_URL =
  process.env.GRAPHQL_API_URL || "http://localhost:8000/graphql";

export async function graphqlClient(
  query: string,
  variables?: any,
  req?: any,
  res?: any
) {
  try {
    let accessToken = "";

    if (req && res) {
      // Server-side
      const { accessToken: token } = await getAccessToken(req, res);
      accessToken = token || "";
    } else if (typeof window !== "undefined") {
      // Client-side
      const response = await fetch("/auth/access-token");
      if (response.ok) {
        const data = await response.json();
        accessToken = data.accessToken || "";
      }
    }

    const client = new GraphQLClient(GRAPHQL_API_URL, {
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
    });

    return await client.request(query, variables);
  } catch (error) {
    console.error("GraphQL request error:", error);
    throw error;
  }
}

// GraphQL Queries
export const GET_STATIONS = `
  query GetStations {
    stations {
      id
      alias
      elevation
      lat
      lon
      country
      state
      city
      responsible
      description
      cameras {
        id
        reference
      }
    }
  }
`;

export const GET_STATION = `
  query GetStation($id: Int!) {
    station(id: $id) {
      id
      alias
      elevation
      lat
      lon
      country
      state
      city
      responsible
      description
      cameras {
        id
        reference
        sizeX
        sizeY
      }
    }
  }
`;

export const GET_CAMERAS = `
  query GetCameras {
    cameras {
      id
      reference
      sizeX
      sizeY
      station_id
    }
  }
`;

export const GET_CAMERA = `
  query GetCamera($id: Int!) {
    camera(id: $id) {
      id
      reference
      sizeX
      sizeY
      station_id
    }
  }
`;

export const CREATE_STATION = `
  mutation CreateStation($input: StationCreateInput!) {
    createStation(input: $input) {
      id
      alias
      elevation
      lat
      lon
      country
      state
      city
      responsible
      description
    }
  }
`;

export const UPDATE_STATION = `
  mutation UpdateStation($id: Int!, $input: StationUpdateInput!) {
    updateStation(id: $id, input: $input) {
      id
      alias
      elevation
      lat
      lon
      country
      state
      city
      responsible
      description
    }
  }
`;

export const DELETE_STATION = `
  mutation DeleteStation($id: Int!) {
    deleteStation(id: $id)
  }
`;

export const CREATE_CAMERA = `
  mutation CreateCamera($input: CameraCreateInput!) {
    createCamera(input: $input) {
      id
      reference
      sizeX
      sizeY
      station_id
      jwt_token
    }
  }
`;

export const UPDATE_CAMERA = `
  mutation UpdateCamera($id: Int!, $input: CameraUpdateInput!) {
    updateCamera(id: $id, input: $input) {
      id
      reference
      sizeX
      sizeY
      station_id
    }
  }
`;

export const DELETE_CAMERA = `
  mutation DeleteCamera($id: Int!) {
    deleteCamera(id: $id)
  }
`;
