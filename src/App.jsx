import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from 'react'
import Navbar from './components/Navbar'
import Event from './pages/Event'

import './App.css'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="md:p-8 p-4">
    <Router>
      <div className='min-h-screen'>
        <Navbar/>   
        <Routes>
          <Route path='/' element={<Event />} />
        </Routes>
      </div>
      </Router>
    </div>
      
    </>
  )
}

export default App
