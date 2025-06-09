import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

const App = () => {
  return (
    <div className="flex flex-col items-center justify-start">
      <Routes>
        <Route 
        path="/"
        element= {<HomePage />}
        />

        <Route 
        path="/login"
        element={<Login />}
        />

        <Route 
        path="/signup"
        element = {<SignUp />}
        />


      </Routes>
    </div>
    
  )
}

export default App;