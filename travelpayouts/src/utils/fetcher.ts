import axios from "axios";

export const axiosClient = axios.create({
  headers: {
    "User-Agent": "NextTravel/1.0.0",
  },
});
