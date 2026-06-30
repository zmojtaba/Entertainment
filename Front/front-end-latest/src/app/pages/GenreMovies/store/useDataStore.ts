import { createWithEqualityFn } from "zustand/traditional";
import { DataStoreState, DataStoreType, Genre } from "./type";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import { getGenreMovieList } from "../constants/api";
import { v4 as uuid } from 'uuid'

const initialState: DataStoreState = {
    genreList: [],
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
            loadingMsg: 'Loading genre list ...',
            genreList: [],
        })
        try {

            let genres = (await getGenreMovieList()).data;
            // let genresMapped: Genre[] = genres.genres.map(genre => ({ id: uuid(), title: genre.title }))

            await window.wait()
            set({
                genreList: genres.genres,
                loadingMsg: '',
                loadingMovieList: false,
            })

        } catch (e: any) {

            if (e.response.status == 404) {
                set({
                    genreList: [],
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

    deleteMovie(titleGenre) {
        set(store => (
            {
                genreList: store.genreList.filter(c => c !== titleGenre)
            }
        ))
    },

    insertMovie(genres) {
        set(store => {
            genres.forEach(genre => {
                store.genreList.push( genre )
            })
        })
    },

    setLoadingMsg(loadingMsg) {
        set({ loadingMsg })
    },
    clearStore: () => set(initialState)
})))

export default useDataStore