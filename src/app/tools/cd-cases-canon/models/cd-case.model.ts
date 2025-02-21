export interface Vector2D {
  x: number;
  y: number;
}

export interface CDCase {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  position: Vector2D;
  rotation: number;
  tilt: Vector2D;
  zIndex: number;
  elevation: number;
} 