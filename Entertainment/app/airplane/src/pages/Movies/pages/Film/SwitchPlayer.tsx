import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import SeriesPlayer from '@/pages/Series/pages/Film';
import MoviePlayer from '.';

function SwitchPlayer() {
  const { category, id } = useParams();
  console.log("params", category?.includes('series'));

  // const currentPath=url.pathname.split('/').at(-1);
  return (

    <div style={{ display: 'flex', flex: 1 }}>
      {category?.includes('series')
        ? <SeriesPlayer />
        : <MoviePlayer />
      }
    </div>
  )
}

export default SwitchPlayer