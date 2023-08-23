import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Landing from './pages/Landing'
import Questions from './pages/Questions';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </>
  )
}

export default App
