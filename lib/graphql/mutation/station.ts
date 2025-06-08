

export const CREATE_STATION = /* GraphQL */`
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

export const UPDATE_STATION = /* GraphQL */`
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

export const DELETE_STATION = /* GraphQL */`
  mutation DeleteStation($id: Int!) {
    deleteStation(id: $id)
  }
`;