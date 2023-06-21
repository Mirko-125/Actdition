import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagesstyle/Obrisi.css'
import { Form, FormGroup, Button, Image } from "react-bootstrap";

const ip = "http://127.0.0.1:5000/"

export default function Obrisi() 
{
  const [imgSrc, setImgSrc] = useState("Invalid Image Source");

  let navigate = useNavigate();
  function nazad()
  {
    navigate(-1);
  }

  const Obj = 
  {
    token:'token',
    body:'sifra'
  }

  const deletetoken = localStorage.getItem('token');
  console.log(deletetoken);

  async function deleteUser(obj)
    {
            const response = await fetch(ip + "users/delete", 
            {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(obj)
            });
            const data = await response.json();
            return response.ok;
    }

  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    
    console.log(deletetoken);
    Obj.token=deletetoken;
    Obj.body=password;

    deleteUser(Obj).then((boolToken) => 
    {
        if(boolToken)
        {
          localStorage.removeItem('token');
          console.log("Obrisan");
          window.location.href = '/login'; 
        }
    })
    
    console.log('Password submitted:', password);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  return (
    <div className="backgroundA">
      <div className="centerA">
      <Image
              className="bye"
              src={imgSrc}
              onError={() =>
                setImgSrc(
                  require('../../src/assets/img/bye.gif')
                )
              }
              alt="Neuspešno pribavljanje slike"
              height="300px"
              width="300px"
            />
      <form onSubmit={handleSubmit}>
        <label className="alert">
          Unesite lozinku da potvrdite brisanje profila:
          <input
            className="passphrase"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          </label>
          <div>
              <button  className="centerB move" type="submit">Obriši</button>
          </div>
      </form>
      </div>
      <div>
        <button  className="centerB" onClick={nazad}>Nazad</button>
      </div>
    </div>

  );
}
