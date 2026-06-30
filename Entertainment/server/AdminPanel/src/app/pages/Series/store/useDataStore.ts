import { createWithEqualityFn } from "zustand/traditional";
import { DataStoreState, DataStoreType, ISeries } from "./type";
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
            loadingMsg: 'Loading movie list',
            movieList: [],
        })
        let res_refrence_data: any = []
        try {
            res_refrence_data = (await getMovieRefrenceData('movie')).data;
            // res_refrence_data = { ...res_refrence_data, genres: res_refrence_data.genres.map(g => g.title) }

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
                toast.warning<string>('Error retrieving series list',{
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
    deleteEpisod(seasonId, episodeId) {
        set(store => (
            {
                // movieList: store.movieList.filter(c => c. !== movie.id)

                movieList: store.movieList.map(series => ({
                    ...series,
                    seasons: series.seasons.map(season =>
                        season.id !== seasonId
                            ? season
                            : {
                                ...season,
                                episodes: season.episodes.filter(
                                    ep => ep.id !== episodeId
                                )
                            }
                    )
                }))
            }
        ))
    },
    deleteSeason(seasonId) {
        set(store => (
            {
                // movieList: store.movieList.filter(c => c. !== movie.id)

                movieList: store.movieList.map(series => ({
                    ...series,
                    seasons: series.seasons.filter(
                        se => se.id !== seasonId
                    )
                }))


            }
        ))
    },

    insertMovie(movie) {
        const foundedIndex = get().movieList.findIndex(c => c.id === movie.id)
        // console.log('foundedIndex', foundedIndex)
        set(store => {
            if (foundedIndex > -1)
                store.movieList.splice(foundedIndex, 1, movie)
            else
                store.movieList.push(movie)
        })
    },
    insertMovieSeasons(movie, season) {
        // const foundedIndex = get().movieList.findIndex(c => c.id === movie.id)
        set(store => ({
            movieList: store.movieList.map(m => m.id == movie.id ?
                { ...m, seasons: [...m.seasons, season] }
                : m)
        }))
    },
    insertMovieEposid(movie, season) {
        // const foundedIndex = get().movieList.findIndex(c => c.id === movie.id)
        set(store => ({
            movieList: store.movieList.map(m => m.id == movie.id ?
                { ...m, seasons: m.seasons.map(s => s.id == season.id ? { ...s, episodes: season.episodes } : s) }
                : m)
        }))
    },


    setLoadingMsg(loadingMsg) {
        set({ loadingMsg })
    },
    clearStore: () => set(initialState)
})))

export default useDataStore