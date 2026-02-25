import { createWithEqualityFn } from "zustand/traditional";
import { DataStoreState, DataStoreType, IMagazin } from "./type";
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
            loadingMsg: ' ... Loading movie list',
            movieList: [],
        })
        let res_refrence_data: any = []
        let resGet: IMagazin[] = []
        try {
            res_refrence_data = (await getMovieRefrenceData('movie')).data;
            res_refrence_data = { ...res_refrence_data, genres: res_refrence_data.genres.map(g => g.title) }

            let res = (await getMovieList()).data;
            // resGet = res.map(r => ({ ...r, genres: r.genres.map(g => g.title) }))
            // console.log('ddddddddddddddddddddddddddddddddddd', res.data)

            await window.wait()
            set({
                movieRefrenceData: res_refrence_data,
                movieList: res,
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
                toast.warning<string>('Error retrieving movie list', {
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