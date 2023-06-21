import React, { useEffect, useState } from "react";
import "../pagesstyle/UIProducer.css";

const ip = "http://127.0.0.1:5000/";
const imageaddress = "http://127.0.0.1:5000/files/get/";
let selectId = undefined;

export default function UIProducer() {

  async function upload(file) {

    
    let data = new FormData();
    data.append("file", file);

    const u = await fetch(ip + "files/upload", {
      method: "POST",
      body: data,
    });
    const d = await u.json();
    console.table(d);
    return d["fname"];
  }

function izmeniProfilnu()
{
    const i = document.createElement("input");
    i.style = "display: none;";
    i.type = "file";
    document.body.appendChild(i);
    i.onchange = (e) => {
           
    upload(e.target.files[0]).then((funval) => {
        
        if (funval) {
            const bodi = {token:thetoken,body:funval};
            const u = fetch(ip + "users/changepfp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                  },
                body: JSON.stringify(bodi),
              }).then((resp) => {
                if(resp.ok) {
                    window.location.reload();
                }
              });
        } else {

        }
      });   
    }
    i.click();
  
}
  
  const thetoken = localStorage.getItem("token"); // token od login-a

  function moveToAdd() {
    localStorage.setItem("token", thetoken); // kesiramo token
    window.location.href = "/AddFilmAndRoles";
  }

  checkToken(thetoken);

  function checkToken(token) {
    console.log(token);
    if (token === null) {
      window.location.href = "/login";
      //napraviti na kraju notifikaciju
    } else {
    }
  }

  function moveToPregled() {
    localStorage.setItem("token", thetoken); // kesiramo token ako zatreba
    window.location.href = "/Pregled";
  }

  function obrisiNalog() {
    localStorage.setItem("token", thetoken); // kesiramo token
    window.location.href = "/Obrisi";
  }

  async function obrisiFilm(thetoken, id) {
    if (id >= 0) {
      const response = await fetch(ip + "movies/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: thetoken,
          body: id,
        }),
      });
      const data = await response.json();
      console.log(data);
      return response.ok;
    } else {
      return false;
    }
  }

  async function logOut() {
    const response = await fetch(ip + "users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thetoken),
    });
    const data = await response.json();
    console.log(data);

    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const [data, setData] = useState(0);
  useEffect(() => {
    getRequest().then((fdata) => {
      console.table(fdata);
      setData(fdata);
    });
  }, []);

  const [movies, setMovies] = useState([]);

  async function moviesListProducer(token) {
    const response = await fetch(ip + "movies/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    const data = await response.json();
    return data;
  }

  useEffect(() => {
    moviesListProducer(thetoken).then((listeddata) => {
      console.table(listeddata);
      setMovies(listeddata);
    });
  }, []);

  checkToken(thetoken);

  function checkToken(token) {
    console.log(token);
    if (token === null) {
      window.location.href = "/login";
      //napraviti na kraju notifikaciju
    } else {
    }
  }

  async function getRequest() {
    const response = await fetch(ip + "users/getUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(thetoken),
    });
    const data = await response.json();
    return data;
  }

  console.table(data);

  return (
    <div className="background">
      <div className="sidebar">
        <div className="logo">
          <img
            className="pfp"
            src={`${imageaddress}${data.profilnaSlika}`}
            alt="Offline"
          />
        </div>
        <div>
          <label className="full-name">{`${data.ime} ${data.prezime}`}</label>
        </div>
        <div>
          <label className="nickname">{data.username}</label>
        </div>
        <ul className="menu">
          <li className="menu-item">
            <a href="#" onClick={moveToAdd}>
              Napravi film
            </a>
          </li>
          
          <li className="menu-item">
            <a
              href="#"
              onClick={() => {
                obrisiFilm(thetoken, selectId).then((povrat) => {
                  if (povrat) {
                    window.location.reload();
                    return;
                  } else {
                    console.error("bila je neka greska");
                  }
                });
              }}
            >
              Obriši film
            </a>
          </li>
          <li className="menu-item">
            <a href="#" onClick={izmeniProfilnu}>Izmeni profilnu</a>
          </li>
          <li className="menu-item">
            <a href="#" onClick={obrisiNalog}>
              Obriši profil
            </a>
          </li>
          <li className="menu-item">
            <a href="#" onClick={moveToPregled}>
              Pregled
            </a>
          </li>
          <li className="menu-item logout">
            <a href="#" onClick={logOut}>
              Log out
            </a>
          </li>
        </ul>
      </div>
      <div className="ponudjene-uloge">
        <div className="prezentacija">
          {movies.map((film) => (
            <div className="frejm uiproducer" data-tooltip={`Trajanje: ${film.trajanjeMinuta}min\nUzrast: ${film.uzrast}+\nBroj uloga: ${film.listaUloga.length}`}>
              <img
                onClick={(e) => {
                  selectId = film.id;
                  console.log(selectId);
                  document.querySelectorAll(".frejm").forEach(el => {el.style = '';}); e.target.parentElement.style = 'border: 4px #0047ab solid;' 
                }}
                className="thumb"
                src={`${ip}files/get/${film.poster}`}
                alt="Offline"
              />
              <label className="borac">{film.ime}</label>
              <br />
              <label className="borac">{film.zanr}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
