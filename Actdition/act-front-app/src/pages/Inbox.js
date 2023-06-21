import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../pagesstyle/Pregled.css"
import "../pagesstyle/UIProducer.css"

const ip = "http://127.0.0.1:5000/"
const imageaddress = "http://127.0.0.1:5000/files/get/";

export default function Inbox() {
  const [mailInbox, setSetMailInbox] = useState([]);

  const thetoken = localStorage.getItem('token'); // token od login-a

  useEffect(()=>
  {
      mail(thetoken).then((fdata) => 
      {
          console.table(fdata);
          setSetMailInbox(fdata);
      }) 
  },[])

  async function mail(thetoken)
    {
        const response = await fetch(ip + "users/getInbox", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(thetoken)
            });
        const data = await response.json();
        console.log(data);
        return data;
    } 

  let navigate = useNavigate();
  function nazad()
  {
    navigate(-1);
  }

  return(
    <div className="background">
      <button className="btnN" onClick={nazad}>Nazad</button>
      <div className="listaMejlova">
      {
          mailInbox.map(msg => ( <div className="telo-poruke"> Čestitamo! Vaša uloga {msg.imeUloge} u filmu {msg.imeFilma} je izabrana. Dođite na audiciju na adresi {msg.adresa}</div>))
      }
      </div>
    </div>
  )
}
