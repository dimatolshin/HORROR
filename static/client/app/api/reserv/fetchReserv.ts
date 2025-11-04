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
  older_14: boolean;
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
  older_14
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
      older_14
    })
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
};

export interface BookingDataLater {
    horror: number;
    data: string;
    time: string;
    count_of_peoples: number;
    phone: string;
    first_name: string;
    last_name: string;
    certificate?: boolean;
    comment?: string;
    older_14: boolean;
}

export const fetchReservLater = ({
   horror,
   data,
   time,
   phone,
   count_of_peoples,
   first_name,
   last_name,
   certificate,
   comment,
   older_14
}: BookingDataLater) => {
    return axios
        .post(`${api}/api/take_later_data_quest/`, {
            horror,
            data,
            phone,
            time,
            first_name,
            count_of_peoples,
            last_name,
            certificate,
            comment,
            older_14
        })
        .then((response) => {
            const data = response.data;
            return data;
        })
        .catch((err) => {
            console.error(err);
        });
};
