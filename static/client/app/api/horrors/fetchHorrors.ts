import axios from "axios";
import { api } from "../api";

export interface IHorrorsPromise {
  complexity: number;
  count_players: string;
  description: string;
  fear: number;
  genre: string;
  id: number;
  is_active: boolean;
  location: string;
  name: string;
  novelty: boolean;
  photos: Array<{
    image: string;
  }>;
  photos_back_card: Array<{
    image: string;
  }>;
  photos_blur: Array<{
    image: string;
  }>;
  rating: number;
  registration_date: string;
  travel_time: number;
}

export async function fetchHorrors(): Promise<IHorrorsPromise[]> {
  return await axios
    .get(`${api}/api/horrors`)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((err) => {
      console.error("Ошибка получения данных", err);
    });
}

export const getHorrors = async (): Promise<IHorrorsPromise[]> =>
  await fetch(`${api}/api/horrors`, { next: { revalidate: 3600 } })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.error("Ошибка получения данных", err);
    });

export async function fetchOneHorror(id: string): Promise<IHorrorsPromise> {
  return await axios
    .get(`${api}/api/horrors/${id}`)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((err) => {
      console.error("Ошибка получения данных", err);
    });
}

export const getOneHorror = async (id: string): Promise<IHorrorsPromise> =>
  await fetch(`${api}/api/horrors/${id}`, { next: { revalidate: 3600 } })
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.error("Ошибка получения данных", err);
    });
