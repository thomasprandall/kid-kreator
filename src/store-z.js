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
                set({ kids: await response.json(), kid: response.json()[0] });
            },
            /*setKids: (kids) => set(state => (state.kids = kids)),*/
            setKids: (kids) => {
                //console.log(kids);
                //console.log(set);
                
                set((state) => {
                    
                    var newState = {
                        kids: kids,
                        kid: state.kid
                    };
                    //state.kids = kids;
                    
                    //console.log(state.kids = kids);
                    
                    return newState;
                });
                
            },
            selectKid: (id) => {
                set((state) => {
                    
                    var newState = {
                        kids: state.kids,
                        kid: state.kids[id]
                    }
                    
                    return newState;
                });
            },
            addKid: () => {
                set((state) => {
                    
                    var newState = {
                        kids: [...state.kids, {...state.kids[state.kids.length-1], name: "New Kid"}],
                        kid: state.kid
                    };
                    
                    //state.kids = [...state.kids, {...state.kids[state.kids.length-1], name: "New Kid"}];
                    return newState;
                });
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