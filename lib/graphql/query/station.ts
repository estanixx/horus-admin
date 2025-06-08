
// GraphQL Queries
export const GET_STATIONS = /* GraphQL */`
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

export const GET_STATION = /* GraphQL */`
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
