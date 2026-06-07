import { create } from "zustand";

import { Lesson } from "@/src/types/lesson";

type LessonStore = {
    lessons: Lesson[];

    addLesson: (lesson: Lesson) => void;

    getLesson: (id: string) => Lesson | undefined;
};

export const useLessonStore =
    create<LessonStore>((set, get) => ({
        lessons: [],

        addLesson: (lesson) =>
            set((state) => ({
                lessons: [lesson, ...state.lessons],
            })),

        getLesson: (id) =>
            get().lessons.find(
                (lesson) => lesson.id === id
            ),
    }));