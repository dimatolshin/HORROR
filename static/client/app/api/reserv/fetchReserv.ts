import axios from "axios";
import { api } from "../api";

export interface BookingData {
  horror: number;
  data: string;
  slot: number;
  phone: string;
  first_name: string;
  last_name: string;
  certificate?: boolean;
  comment?: string;
  price: number;
}

export const fetchReserv = ({
  horror,
  data,
  slot,
  phone,
  first_name,
  last_name,
  certificate,
  comment,
  price,
}: BookingData) => {
  return axios
    .post(`${api}/api/bookings/`, {
      horror,
      data,
      phone,
      slot,
      first_name,
      last_name,
      certificate,
      comment,
      price,
    })
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
};
