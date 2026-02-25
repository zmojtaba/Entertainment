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
            loadingMsg: ' ... Loading Audio Story list',
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
                toast.warning<string>('Error retrieving Audio Story list', {
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
    deleteEpisod(seasonId) {
        set(store => (
            {
                // movieList: store.movieList.filter(c => c. !== movie.id)


                movieList: store.movieList.map(epizod => (
                    {
                        ...epizod,
                        episodes: epizod.episodes.filter(ep => ep.id == seasonId)
                    }
                ))

            }
        ))
    },
    deleteSeason(seasonId) {
        set(store => (
            {
                // movieList: store.movieList.filter(c => c. !== movie.id)
                movieList: store.movieList.map(epizod => (
                    {
                        ...epizod,
                        episodes: epizod.episodes.filter(ep => ep.id == seasonId)
                    }
                ))
                // movieList: store.movieList.map(series => ({
                //     ...series,
                //     seasons: series.seasons.filter(
                //         se => se.id !== seasonId
                //     )
                // }))
            }
        ))
    },

    insertMovie(movie) {
        const foundedIndex = get().movieList.findIndex(c => c.id === movie.id)
        console.log('foundedIndex', foundedIndex)
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