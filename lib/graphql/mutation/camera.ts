
export const CREATE_CAMERA = /* GraphQL */`
  mutation CreateCamera($input: CameraCreateInput!) {
    createCamera(input: $input) {
      id
      reference
      sizeX
      sizeY
      stationId
      jwtToken
    }
  }
`;

export const UPDATE_CAMERA = /* GraphQL */`
  mutation UpdateCamera($id: Int!, $input: CameraUpdateInput!) {
    updateCamera(id: $id, input: $input) {
      id
      reference
      sizeX
      sizeY
      stationId
    }
  }
`;

export const DELETE_CAMERA = /* GraphQL */`
  mutation DeleteCamera($id: Int!) {
    deleteCamera(id: $id)
  }
`;
