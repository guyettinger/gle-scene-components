import { GroupProps } from '@react-three/fiber';
import { OcclusionCullingService, OGC3DTile, TileLoader } from 'gle-threedtiles';
import { Camera, Mesh, Points, Renderer } from 'three';

/**
 *
 * renderer?: Object – the renderer used to display the tileset
 * url?: Object – the url to the parent tileset.json
 * queryParams?: Object – optional, path params to add to individual tile urls (starts with "?").
 * geometricErrorMultiplier?: Object – the geometric error of the parent. 1.0 by default corresponds to a maxScreenSpaceError of 16
 * loadOutsideView?: Object – if truthy, tiles otside the camera frustum will be loaded with the least possible amount of detail
 * tileLoader?: Object – A tile loader that can be shared among tilesets in order to share a common cache.
 * meshCallback?: Object – A callback function that will be called on every mesh
 * pointsCallback?: Object – A callback function that will be called on every points
 * onLoadCallback?: Object – A callback function that will be called when the root tile has been loaded
 * occlusionCullingService?: Object – A service that handles occlusion culling
 * centerModel?: Object – If true, the tileset will be centered on 0,0,0 and in the case of georeferenced tilesets that use the "region" bounding volume, it will also be rotated so that the up axis matched the world y axis.
 * static?: Object – If true, the tileset is considered static which improves performance but the tileset cannot be moved
 * rootPath?: Object – optional the root path for fetching children
 * json?: Object – optional json object representing the tileset sub-tree
 * parentGeometricError?: Object – optional geometric error of the parent
 * parentBoundingVolume?: Object – optional bounding volume of the parent
 * parentRefinement?: Object – optional refinement strategy of the parent of the parent
 * cameraOnLoad?: Object – optional the camera used when loading this particular sub-tile
 * parentTile?: Object – optional the OGC3DTile object that loaded this tile as a child
 * proxy?: Object – optional the url to a proxy service. Instead of fetching tiles via a GET request, a POST will be sent to the proxy url with the real tile address in the body of the request.
 * yUp?: Object – optional value indicating the meshes are y up rather than z-up. This parameter is used only for box and sphere bounding volumes.
 * displayErrors?: Object – optional value indicating that errors should be shown on screen.
 */
export interface OGC3DTilesProps extends GroupProps {
  renderer?: Renderer;
  url?: string;
  queryParams?: any;
  geometricErrorMultiplier?: number;
  loadOutsideView?: boolean;
  tileLoader?: TileLoader;
  meshCallback?: (mesh: Mesh) => void;
  pointsCallback?: (points: Points) => void;
  onLoadCallback?: (tileset: OGC3DTile) => void;
  occlusionCullingService?: OcclusionCullingService;
  centerModel?: boolean;
  static?: boolean;
  rootPath?: string;
  json?: any;
  parentGeometricError?: number;
  parentBoundingVolume?: any;
  parentRefinement?: string;
  cameraOnLoad?: Camera;
  parentTile?: OGC3DTile;
  proxy?: string;
  yUp?: boolean;
  displayErrors?: boolean;
}
