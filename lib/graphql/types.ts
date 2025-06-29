type Camera = {
  id: number;
  reference: string;
  sizeX: number;
  sizeY: number;
  stationId: number;
}

type CameraForm = {
  reference: string;
  sizeX: string;
  sizeY: string;
  stationId: string;
}

type Station = {
  id: number;
  alias: string;
}
