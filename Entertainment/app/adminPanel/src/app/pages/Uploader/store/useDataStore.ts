import { createWithEqualityFn } from "zustand/traditional";
import { DataStoreState, DataStoreType, IMagazin, UploadData } from "./type";
import { immer } from "zustand/middleware/immer";
import { toast } from "react-toastify";
import { getMovieList, getMovieRefrenceData } from "../constants/api";

const initValueMoviList: UploadData = {
  albums: [],
  audiostories: [],
  books: [],
  corus: [],
  magazines: [],
  movies: [],
  newspapers: [],
  podcasts: [],
  series: [],
  tracks: [],
};
const initialState: DataStoreState = {
  movieList: initValueMoviList,
  loadingMsg: "",
  currentlyDownload: [],
  errorLoadingMovies: false,
  loadingMovieList: false,
};

const useDataStore = createWithEqualityFn<
  DataStoreType,
  [["zustand/immer", never]]
>(
  immer((set, get) => ({
    ...initialState,

    loadMovieList: async () => {
      set({
        loadingMovieList: true,
        errorLoadingMovies: false,
        loadingMsg: "  Loading uploader data list",
        movieList: initValueMoviList,
      });
      try {
        const res = await getMovieList();
        const _data = res.data;
        const mapData: UploadData = {
          ...res.data,
          podcast: _data.podCast,
          audiostory: _data.audioStory,
          newspaper: _data.newsPaper
        }
        console.log("Map",mapData)

        // let newData: IMagazin[] = res.data.map(item => ({ ...item, genres: item.genres.map(g => ({ title: g.title ?? g })) }))
        // console.log("Data", res.data.currentlyDownload);

        await window.wait();
        set({
          movieList: mapData,
          currentlyDownload: res?.data?.currentlyDownload.length ? res?.data?.currentlyDownload : [],
          loadingMsg: "",
          loadingMovieList: false,
        });
      } catch (e: any) {
        if (e.response.status == 404) {
          set({
            movieList: initValueMoviList,
            loadingMsg: "",
            loadingMovieList: false,
          });
        } else {
          toast.warning<string>("Error retrieving Uploading list", {
            style: {
              direction: "ltr",
              textAlign: "left",
            },
          });
          set({
            errorLoadingMovies: true,
            loadingMovieList: false,
            loadingMsg: "",
          });
        }
      }
    },

    setLoadingMsg(loadingMsg) {
      set({ loadingMsg });
    },
    clearStore: () => set(initialState),
  })),
);

export default useDataStore;
