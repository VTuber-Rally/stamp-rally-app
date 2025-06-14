import { polygon } from "@turf/helpers";
import { Feature, FeatureCollection } from "geojson";
import { RasterLayerSpecification, StyleSpecification } from "maplibre-gl";

import { getCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { getStandists } from "@/lib/hooks/useStandists.ts";

const tiles = [
  {
    url: "/map_tiles/japex_export_1.webp",
    coordinates: [
      [2.5141680514198583, 48.97365453111249],
      [2.520007580674303, 48.97365453111249],
      [2.520007580674303, 48.97076366749354],
      [2.5141680514198583, 48.97076366749354],
    ],
  },
  {
    url: "/map_tiles/japex_export_2_new.webp",
    coordinates: [
      [2.516233051419858, 48.97076366749354],
      [2.520007580674303, 48.97076366749354],
      [2.520007580674303, 48.9678728038746],
      [2.516233051419858, 48.9678728038746],
    ],
  },
  {
    url: "/map_tiles/japex_export_3.webp",
    coordinates: [
      [2.520007580674303, 48.97076366749354],
      [2.5258471099287476, 48.97076366749354],
      [2.5258471099287476, 48.9678728038746],
      [2.520007580674303, 48.9678728038746],
    ],
  },
  {
    url: "/map_tiles/japex_export_4.webp",
    coordinates: [
      [2.520007580674303, 48.97365453111249],
      [2.5258471099287476, 48.97365453111249],
      [2.5258471099287476, 48.97076366749354],
      [2.520007580674303, 48.97076366749354],
    ],
  },
] satisfies {
  url: string;
  coordinates: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ];
}[];

const mapColors = {
  forestGreen: "#024f05",
  lightGreen: "#9ffe76",
  blue: "#312783",
  yellow: "#daa520",
  white: "white",
} as const;

export async function getStandistsFeatureCollection() {
  const standists = await getStandists();
  const stamps = await getCollectedStamps();
  const stampedStandistsIds = new Set(stamps.map((s) => s.standistId));

  return {
    type: "FeatureCollection",
    features: standists.reduce<Feature[]>((polygons, standist) => {
      if (standist.geometry)
        polygons.push(
          polygon(standist.geometry, {
            name: standist.name,
            id: standist.userId,
            stamped: stampedStandistsIds.has(standist.userId),
          }),
        );
      return polygons;
    }, []),
  } satisfies FeatureCollection;
}

export function generateStyleSpec() {
  return {
    version: 8,
    glyphs: `${window.location.origin}/glyphs/{fontstack}/{range}.pbf`,
    sources: {
      ...Object.fromEntries(
        tiles.map((tile, index) => {
          return [`japan_expo_${index}`, { type: "image", ...tile }];
        }),
      ),
      standists: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
        promoteId: "id",
      },
    },
    layers: [
      ...tiles.map<RasterLayerSpecification>((_, index) => ({
        type: "raster",
        id: `japan_expo_${index}`,
        source: `japan_expo_${index}`,
        paint: {
          "raster-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            1,
            19,
            0.55,
          ],
        },
      })),
      {
        type: "line",
        id: "line",
        source: "standists",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["get", "stamped"], false],
            mapColors.forestGreen,
            mapColors.blue,
          ],
          "line-width": ["interpolate", ["linear"], ["zoom"], 16, 0.2, 19, 8],
        },
      },
      {
        type: "fill",
        id: "fill",
        source: "standists",
        paint: {
          "fill-color": [
            "case",
            ["boolean", ["get", "stamped"], false],
            mapColors.forestGreen,
            mapColors.blue,
          ],
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            16,
            0.9,
            19,
            0.1,
          ],
        },
      },
      {
        type: "symbol",
        id: "symbol",
        source: "standists",
        minzoom: 14,
        layout: {
          "text-field": ["get", "name"],
          "text-font": ["Open Sans Bold"],
          "text-radial-offset": [
            "interpolate",
            ["exponential", 1.5],
            ["zoom"],
            16,
            0.25,
            18,
            1,
            19,
            0.25,
          ],
          "text-allow-overlap": true,
          "text-anchor": "bottom",
          "text-size": [
            "interpolate",
            ["exponential", 1.5],
            ["zoom"],
            16,
            10,
            18,
            14,
            19,
            16,
          ],
        },
        paint: {
          "text-color": [
            "case",
            ["==", ["get", "name"], "Sedeto"],
            mapColors.yellow,
            ["boolean", ["get", "stamped"], false],
            mapColors.lightGreen,
            mapColors.white,
          ],
          "text-halo-width": 2,
          "text-halo-color": "#312783",
        },
      },
    ],
  } satisfies StyleSpecification;
}
