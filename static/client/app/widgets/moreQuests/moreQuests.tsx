"use client";

import { fetchHorrors, IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";
import { useEffect, useState } from "react";
import { MoreQuestsServer } from "./moreQuestServer";

export const MoreQuests = () => {
  const [horrors, setHorrors] = useState<IHorrorsPromise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getHorrors = async () => {
      try {
        const data = await fetchHorrors();
        setHorrors(data);
      } catch (error) {
        console.error("Failed to fetch horrors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getHorrors();
  }, []);

  if (isLoading) {
    return <div className="text-white">Загрузка других квестов...</div>;
  }

  return <MoreQuestsServer horrors={horrors} />;
};
