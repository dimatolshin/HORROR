import axios from "axios";

export interface IReviewsPromise {
    id: number;
    datetime: string;
    name: string;
    text: string;
    rating: number;
    nameQuest?: string;
}

export default async function fetchReviews(id?: number, name?: string): Promise<IReviewsPromise[]> {
    try {
        const response = await axios.get(`https://extrareality.by/api2/reviews?quest_id=${id || 0}`);
        return response.data.map((review: IReviewsPromise) => ({
            ...review,
            nameQuest: name
        }));
    } catch (err) {
        console.error("Ошибка получения данных", err);
        return [];
    }
}