export const GET_CAMERAS = /* GraphQL */`
  query GetCameras {
    cameras {
      id
      reference
      sizeX
      sizeY
      stationId
    }
  }
`;

export const GET_CAMERA = /* GraphQL */`
  query GetCamera($id: Int!) {
    camera(id: $id) {
      id
      reference
      sizeX
      sizeY
      stationId
    }
  }
`;
