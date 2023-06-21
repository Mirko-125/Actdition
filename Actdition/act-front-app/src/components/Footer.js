import React from 'react';

import { FaFacebook } from 'react-icons/fa';
import { FaInstagramSquare } from 'react-icons/fa';
import { FaDiscord } from "react-icons/fa";

import '../pagesstyle/FillInPages.css';
import '../pagesstyle/Footer.css';

export default function Footer() 
{
    return(
    <footer className="footer">
      {/*Row1*/}
        <div className="footer-row">
        {/*Column1*/}
          <div className="footer-column">
            <p>Kontakt informacije:</p>
              <p>063/82-46-260</p> 
              <p>Niš, Srbija</p>
          </div>
        {/*Column2*/}
          <div className="footer-column2">
            <p>Nađite nas preko društvenih mreža:</p>
            <a href="https://www.facebook.com/profile.php?id=100009350090652" className="FB">
              <FaFacebook/>
            </a>
            <a href="https://www.instagram.com/akontotoga/" className="Instagram">
              <FaInstagramSquare/>
              </a>
            <a href="https://discord.com/" className="Discord"> 
              <FaDiscord/>
              </a>
          </div>
        {/*Row2*/}
          <div className="footer-row_date">
          <p className="footer-column_date">
            &copy; {new Date().getFullYear()} Zero Bug Development™ , all rights reserved
          </p>
        </div>  
      </div>
      </footer>
    )
}
  



