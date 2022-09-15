import create from "zustand";
import { persist } from "zustand/middleware";

const kidAPI = "/kids.json";

const useKidStore = create(
    persist(
        (set) => ({
            kid: {},
            kids: [],
            fetch: async () => {
                const response = await fetch(kidAPI);
                set({ kids: await response.json() });
            },
            setKids: (kids) => set(state => (state.kids = kids)),
            selectKid: (id) => set(state => (state.kid = state.kids[id])),
            addKid: () => {
                set(state => (state.kids = [...state.kids, {...state.kids[state.kids.length-1], name: "New Kid"}]))
            }
        }),
        {
            name: "zu-kids"
        }
    )
);

// Abstraction for state objects
export const useKid = () => useKidStore((state) => state.kid);
export const useKids = () => useKidStore((state) => state.kids);
// Abstraction for state modifeirs
export const useFetch = () => useKidStore((state) => state.fetch);
export const useSetKids = () => useKidStore((state) => state.setKids);
export const useSelectKid = () => useKidStore((state) => state.selectKid);
export const useAddKid = () => useKidStore((state) => state.addKid);