import { createWithEqualityFn } from "zustand/traditional";
import { DataStoreState, DataStoreType } from "./type";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import { getMovieList, getMovieRefrenceData } from "../constants/api";

const initialState: DataStoreState = {
    movieRefrenceData: null,
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
            loadingMsg: ' ... Loading Books list',
            movieList: [],
        })
        let res_refrence_data: any = []
        try {
            res_refrence_data = (await getMovieRefrenceData('movie')).data;
            const res = await getMovieList();

            await window.wait()
            set({
                movieRefrenceData: res_refrence_data,
                movieList: res.data,
                loadingMsg: '',
                loadingMovieList: false,
            })

        } catch (e: any) {

            if (e.response.status == 404) {
                set({
                    movieRefrenceData: res_refrence_data ?? [],
                    movieList: [],
                    loadingMsg: '',
                    loadingMovieList: false,
                })
            } else {
                toast.warning<string>('Error retrieving Books list', {
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