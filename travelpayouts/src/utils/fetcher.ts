import axios from "axios";

export const axiosClient = axios.create({
  headers: {
    "User-Agent": "NextTravel/0.0.0",
  },
});
