import React from 'react';
import "./componentstyle/about.css"

export default function About() {
  return (
    <div className = "about-line">
      <img 
          className='grid'
          src={require('../../src/assets/material/grid.png')} 
          alt="X" 
        />
       <div className="work">
        Ova web stranica omogućava da svim zainteresovanim glumcima olakša proces dobijanja uloga putem korisnog interfejsa koji koriste filmske produkcije
       </div>
    </div>
  )
}
