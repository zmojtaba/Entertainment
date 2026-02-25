// import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import classes from './style.module.scss'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <div className={classes.mainPage}>
      <Routes >
        <Route path='/' element={<Dashboard />} />
        <Route path='/category' element={<Home />} />
        <Route path='*' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
