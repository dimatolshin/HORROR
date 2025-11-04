import axios from "axios";
import { api } from "../api";

export interface ISlotsFetch {
  date: string;
  date_front: string;
  slots: {
    time: string;
    info: ISlotsInfo[];
    color: string;
    is_booked: boolean;
  }[];
}

export type ISlotsInfo = {
  id: number;
  count_of_peoples: number;
  price: number;
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
