import axios from "axios";

export interface IReviewsPromise {
  id: number;
  datetime: string;
  name: string;
  text: string;
  rating: number;
}

export default async function fetchReviews(): Promise<IReviewsPromise[]> {
  return await axios
    .get(`https://extrareality.by/api2/reviews?quest_id=3544`)
    .then((response) => {
      const data = response.data;
      return data;
    })
    .catch((err) => {
      console.error("Ошибка получения данных", err);
    });
}
