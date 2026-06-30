import { authRoles } from "app/auth"
import { NavigationItem } from "./types"
import './navigation-i18n'

/* < ----------------------------- Artificial Intelligence Tools--------------------------------> */
const navigationConfig: NavigationItem[] = [

  {
    id: "Import_Files",
    title: "Import Files",
    // translate: "Import Files",
    type: "group",
    auth: authRoles.admin,
    icon: "upload-file-icon",
    // url: "/plate-detection",
    children: [
      {
        id: "Movies",
        title: "Movies",
        // translate: "Import Files",
        type: "group",
        auth: authRoles.admin,
        icon: "movie-icon",
        // url: "/plate-detection",
        children: [
          {
            id: 'Movies',
            title: 'Movie',
            // translate: "CAMERA_VIEW",
            type: 'item',
            icon: 'movie-icon',
            url: '/movies',
            auth: authRoles.admin,
          }, {
            id: 'Series',
            title: 'Series',
            translate: "Series",
            type: 'item',
            icon: 'theaters-icon',
            url: '/series',
            auth: authRoles.admin,
          }
          , {
            id: 'Genres',
            title: 'Genres',
            translate: "Genres",
            type: 'item',
            icon: 'theater_comedy_icon',
            url: '/genreMovies',
            auth: authRoles.admin,
          }
        ]
      },
      {
        id: "Magazine",
        title: "Publication",
        // translate: "Import Files",
        type: "group",
        auth: authRoles.admin,
        icon: "import_contacts_icon",
        // url: "/plate-detection",
        children: [
          {
            id: 'Magazine',
            title: 'Magazine',
            // translate: "CAMERA_VIEW",
            type: 'item',
            icon: 'import_contacts_icon',
            url: '/magazins',
            auth: authRoles.admin,
          }, {
            id: 'Newspaper',
            title: 'Newspaper',
            // translate: "Series",
            type: 'item',
            icon: 'newspaper_icon',
            url: '/newspapers',
            auth: authRoles.admin,
          }
          , {
            id: 'Genres_Magazine',
            title: 'Genres_Magazine',
            translate: "Genres",
            type: 'item',
            icon: 'theater_comedy_icon',
            url: '/genreMagazine',
            auth: authRoles.admin,
          }
        ],
      },
      {
        id: "Music",
        title: "Music",
        // translate: "Import Files",
        type: "group",
        auth: authRoles.admin,
        icon: "lyrics-icon",
        // url: "/plate-detection",
        children: [
          {
            id: 'Track',
            title: 'Track',
            // translate: "CAMERA_VIEW",
            type: 'item',
            icon: 'audiotrack-icon',
            url: '/tracks',
            auth: authRoles.admin,
          }, {
            id: 'Album',
            title: 'Album',
            // translate: "Series",
            type: 'item',
            icon: 'queue-music-icon',
            url: '/albums',
            auth: authRoles.admin,
          }, {
            id: 'Genres_Music',
            title: 'Genres_Music',
            translate: "Genres",
            type: 'item',
            icon: 'theater_comedy_icon',
            url: '/genreMusic',
            auth: authRoles.admin,
          }
        ],
      },
      {
        id: "Story",
        title: "Story",
        // translate: "Import Files",
        type: "group",
        auth: authRoles.admin,
        icon: "menu_book_icon",
        // url: "/plate-detection",
        children: [
          {
            id: 'Book',
            title: 'Book',
            // translate: "CAMERA_VIEW",
            type: 'item',
            icon: 'book_icon',
            url: '/books',
            auth: authRoles.admin,
          },
          {
            id: 'Podcast',
            title: 'Podcast',
            // translate: "Series",
            type: 'item',
            icon: 'mic_icon',
            url: '/podcasts',
            auth: authRoles.admin,
          },
          {
            id: 'Audio_Story',
            title: 'Audio Story',
            // translate: "Series",
            type: 'item',
            icon: 'headphones_icon',
            url: '/storys',
            auth: authRoles.admin,
          }, {
            id: 'Genres_Story',
            title: 'Genres_Story',
            translate: "Genres",
            type: 'item',
            icon: 'theater_comedy_icon',
            url: '/genreStory',
            auth: authRoles.admin,
          }
        ],
      },

    ]
  },
  {
    id: 'Users',
    title: 'Users',
    // translate: "CAMERA_VIEW",
    type: 'item',
    icon: 'group-icon',
    url: '/users',
    auth: authRoles.admin,
  },
  {
    id: 'UPLOADER',
    title: 'Uploading Data',
    // translate: "CAMERA_VIEW",
    type: 'item',
    icon: 'sync-icon',
    url: '/uploader',
    auth: authRoles.admin,
  }


]
export default navigationConfig
