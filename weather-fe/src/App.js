import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";

import Weather from "./Weather";

function Header() {
  return (
    <header>
      <h1>Weather App</h1>
    </header>
  );
}

function App() {
  
  return (
    <div className="App">
      <Header />
      <br/>
      <br/>
     <Weather />
    </div>
  );
}

export default App;
