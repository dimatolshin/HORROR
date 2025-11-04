'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { IHorrorsPromise } from "@/app/api/horrors/fetchHorrors";

interface QuestContextType {
    selectedQuest: IHorrorsPromise | null;
    setSelectedQuest: (quest: IHorrorsPromise | null) => void;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined);

export function QuestProvider({ children, initialQuest }: {
    children: ReactNode;
    initialQuest?: IHorrorsPromise | null
}) {
    const [selectedQuest, setSelectedQuest] = useState<IHorrorsPromise | null>(
        initialQuest || null
    );

    return (
        <QuestContext.Provider value={{ selectedQuest, setSelectedQuest }}>
            {children}
        </QuestContext.Provider>
    );
}

// Хук для использования контекста
export function useQuest() {
    const context = useContext(QuestContext);
    if (context === undefined) {
        throw new Error('useQuest must be used within QuestProvider');
    }
    return context;
}
