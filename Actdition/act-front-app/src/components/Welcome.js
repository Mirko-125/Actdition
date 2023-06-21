import React from 'react';
import "./componentstyle/welcome.css"

export default function Welcome() {
  return (
    <div className = "welcome-line">
      <div className='iconplustitle'>
      <img 
          className='icon'
          src={require('../../src/assets/material/img.icons8.png')} 
          alt="X" 
        />
        <div className='title'>ACTDITION</div>
      </div> 
      <div className='textabout'>Najbolje mesto za sve glumce koji traže nove uloge i za filmske produkcije koje njih traže</div>
    </div>
  )
}
