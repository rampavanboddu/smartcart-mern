import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
const Students = ["Manikanta", "Ravi", "Kiran", "Suresh"];
 return(
  <div>
    <h1>Rendering List Example</h1>
    <ul>
      {Students.map((student, index)=>(
        <li key = {index}>{student}</li>
      ))}
    </ul>
      </div>
  );
  
}

export default App;