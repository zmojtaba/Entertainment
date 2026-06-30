import { createWithEqualityFn } from "zustand/traditional";
import { DataStoreState, DataStoreType, IMagazin } from "./type";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import { getMovieList, getMovieRefrenceData } from "../constants/api";

const initialState: DataStoreState = {
    movieList: [],
    loadingMsg: '',
    errorLoadingMovies: false,
    loadingMovieList: false,
}

const useDataStore = createWithEqualityFn<DataStoreType, [["zustand/immer", never]]>(immer((set, get) => ({
    ...initialState,

    loadMovieList: async () => {
        set({
            loadingMovieList: true,
            errorLoadingMovies: false,
            loadingMsg: '  Loading User list',
            movieList: [],
        })
        try {
            const res = await getMovieList();
            // let newData: IMagazin[] = res.data.map(item => ({ ...item, genres: item.genres.map(g => ({ title: g.title ?? g })) }))

            await window.wait()
            set({
                movieList: res.data,
                loadingMsg: '',
                loadingMovieList: false,
            })

        } catch (e: any) {

            if (e.response.status == 404) {
                set({
                    movieList: [],
                    loadingMsg: '',
                    loadingMovieList: false,
                })
            } else {
                toast.warning<string>('Error retrieving User list', {
                    style: {
                        direction: "ltr",
                        textAlign: "left",
                    }
                })
                set({
                    errorLoadingMovies: true,
                    loadingMovieList: false,
                    loadingMsg: ''
                })
            }

        }
    },

    deleteMovie(movie) {
        set(store => (
            {
                movieList: store.movieList.filter(c => c.id !== movie.id)
            }
        ))
    },

    insertMovie(movie) {
        const foundedIndex = get().movieList.findIndex(c => c.id === movie.id)
        set(store => {
            if (foundedIndex > -1)
                store.movieList.splice(foundedIndex, 1, movie)
            else
                store.movieList.push(movie)
        })
    },


    setLoadingMsg(loadingMsg) {
        set({ loadingMsg })
    },
    clearStore: () => set(initialState)
})))

export default useDataStore