import axios from "axios";

const TIME_OUT = 5000;

export const client = axios.create({
  baseURL: "https://swapi.dev/api",
  timeout: TIME_OUT,
});
