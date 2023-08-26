import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Landing from './pages/Landing'
import Questions from './pages/Questions';
import Results from './pages/Results'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </>
  )
}

export default App
