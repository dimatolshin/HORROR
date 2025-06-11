import axios from "axios";
import { api } from "../api";

export interface ISlotsFetch {
  date: string;
  date_front: string;
  slots: {
    slot: number;
    time: string;
    price: number;
    is_booked: boolean;
  }[];
}

export const fetchSlots = async (id: string): Promise<ISlotsFetch[]> => {
  return await axios
    .get(`${api}/api/horrors/${id}/available-slots/`)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((err) => {
      console.error("Ошибка получения данных", err);
    });
};
