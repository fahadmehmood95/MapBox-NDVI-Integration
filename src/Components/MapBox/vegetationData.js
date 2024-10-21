// src/api.js
import axios from "axios";

const fetchVegetationData = async (bbox) => {
  const response = await axios.post(
    `https://services.sentinel-hub.com/api/v1/process`,
    {
      input: {
        bounds: {
          bbox: bbox,
          properties: {
            crs: "EPSG:4326",
          },
        },
        data: [
          {
            type: "sentinel-2-l1c",
            dataFilter: {
              timeRange: {
                from: "2022-01-01T00:00:00Z",
                to: "2022-12-31T23:59:59Z",
              },
            },
          },
        ],
        evalscript: `
          //VERSION=3
          function setup() {
            return {
              input: ["B4", "B3", "B2"],
              output: { bands: 3 }
            };
          }
          function evaluatePixel(sample) {
            return [sample.B4, sample.B3, sample.B2]; // RGB
          }
        `,
      },
    },
    {
      headers: {
        Authorization: `Bearer c38cbf4c-67a1-414c-b025-3b0913ae5c0c`,
      },
    }
  );
  return response.data;
};

export default fetchVegetationData;
