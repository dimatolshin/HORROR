import axios from "axios";

export interface IReviewsPromise {
    id: number;
    datetime: string;
    name: string;
    text: string;
    rating: number;
    nameQuest?: string;
}

interface QuestInfo {
    id: string;
    name: string;
}

export default async function fetchReviews(id?: string): Promise<IReviewsPromise[]> {
    const ids: Record<string, QuestInfo> = {
        "4": { id: "4027", name: "Зарождение зла. Аннабель" },
        "5": { id: "3977", name: "И гаснет свет" },
        "6": { id: "3553", name: "Астрал" },
        "7": { id: "3544", name: "Заклятие" },
        "8": { id: "4169", name: "Искатели Могил" },
    };

    const questId = id === undefined ? "3544" : (ids[id]?.id || "3544");

    try {
        const response = await axios.get(`https://extrareality.by/api2/reviews?quest_id=${questId}`);
        return response.data.map((review: IReviewsPromise) => ({
            ...review,
            nameQuest: id ? ids[id]?.name : undefined
        }));
    } catch (err) {
        console.error("Ошибка получения данных", err);
        return [];
    }
}