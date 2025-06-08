type Camera = {
  id: number;
  reference: string;
  sizeX: number;
  sizeY: number;
  station_id: number;
}

type CameraForm = {
  reference: string;
  sizeX: string;
  sizeY: string;
  station_id: string;
}

type Station = {
  id: number;
  alias: string;
}
