import classes from './style.module.scss'
import { useTranslation } from 'react-i18next'
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import { Button, IconButton, Tooltip } from '@mui/material';
import useDataStore from '../../store/useDataStore';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import LoadingComponent from 'app/shared-components/LoadingComponent';
import _ from 'lodash';
import ErrorComponent from 'app/shared-components/ErrorComponent';
import AddIcon from '@mui/icons-material/Add';
import TableHeader from '../../components/TableHeader';
import { EmptyCameraListIcon } from '../../constants/icons';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import MovieListItem from '../CameraItem';

function MovieList() {
   const { t } = useTranslation('SETTINGS')
   const navigate = useNavigate()
   const genreList = useDataStore(st => st.genreList)
   const loadMovieList = useDataStore(st => st.loadMovieList)
   const { loadingMsg, error } = useDataStore(st => ({ loadingMsg: st.loadingMsg, error: st.errorLoadingMovies }));

   // console.log('genreList',genreList);

   useEffect(() => {
      document.title = 'Movie Genre'
      loadMovieList()
   }, [])

   return (
      <div className={classes.panel}>
         <div className={classes.header}>
            <div className={classes.title}>
               <span>
                  {'Genre List'}
               </span>
            </div>
            <div className={classes.actionsButtons}>

               <IconButton onClick={() => navigate('new-genre')} disabled={!!loadingMsg || error} size='small' data-press>
                  <Tooltip title={t('Add Genre')} >
                     <PlaylistAddIcon sx={{ fontSize: 30 }} />
                  </Tooltip>
               </IconButton>
               <IconButton onClick={loadMovieList} className={clsx({ [classes.rotating]: !!loadingMsg })}  >
                  <Tooltip title={t('Refresh')} >
                     <ReplayOutlinedIcon />
                  </Tooltip>
               </IconButton>
            </div>
         </div>
         <div className={classes.body}>
            {
               error ?
                  <ErrorComponent
                     error
                     errorMessage={t('Failed load Genre list')}
                     onRetry={loadMovieList}
                  />
                  :
                  genreList.length ?
                     (
                        <div className={clsx(classes.container)} >
                           <div className={classes.cameraList}>
                              <TableHeader />
                              {genreList.map(movie => (
                                 <MovieListItem
                                    key={movie}
                                    genre={movie}
                                 />
                              ))}
                           </div>
                        </div>
                     )
                     :
                     !loadingMsg &&
                     <div className={clsx(classes.notFound)}>
                        <EmptyCameraListIcon />
                        <p >
                           {t('Genre not Found')}
                        </p>
                        <Button
                           onClick={() => navigate('new-genre')}
                           startIcon={<AddIcon />}
                           variant='outlined'>
                           {t("Add Genre")}
                        </Button>
                     </div>
            }
            <LoadingComponent
               loading={Boolean(loadingMsg)}
               message={t(loadingMsg)}
            />

            {!loadingMsg && <Outlet />}
         </div>
      </div>
   )
}

export default MovieList
