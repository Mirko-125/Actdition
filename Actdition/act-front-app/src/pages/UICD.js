import React, { useEffect, useState } from "react";
import "../pagesstyle/UIActor.css";
import "../pagesstyle/UICD.css";
import { tablePaginationClasses } from "@mui/material";

const ip = "http://127.0.0.1:5000/";
const imageaddress = "http://127.0.0.1:5000/files/get/";
let selectId = undefined;

export default function UIActor() {
  function proslediFilm(FilmID, RoleList) {
    console.log(FilmID);
    console.log(RoleList);
    const bodi = {
      idFilma: FilmID,
      listaIdUloga: RoleList,
    };
    predlozi(thetoken, bodi).then((funval) => {
      if (funval) {
        moviesUpdate();
      } else {
        console.warn(funval);
      }
    });
  }

  async function predlozi(token, bodi) {
    const response = await fetch(ip + "movies/predlozi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        body: bodi,
      }),
    });

    // const data = await response.json();
    return response.ok;
  }

  function resetR() {
    window.location.reload();
    return;
  }
  const [drag, setDrag] = useState([[]]);

  function handleOnDrag(e, roleType) {
    e.dataTransfer.setData("roleType", JSON.stringify(roleType)); // postavlja u medju space
  }

  function handleDrop(e) {
    e.preventDefault();
    if (e.target.tagName != "DIV") {
      return;
    }
    let selektovanaUloga = JSON.parse(e.dataTransfer.getData("roleType"));
    console.table(selektovanaUloga);
    const maxRoles = parseInt(e.target.getAttribute("maxRoles"));
    const dispId = parseInt(e.target.getAttribute("displayId"));
    if (drag[dispId].length >= maxRoles) {
      return;
    }
    for (let i = 0; i < drag.length; i++) {
      for (let j = 0; j < drag[i].length; j++) {
        if (drag[i][j].id === selektovanaUloga.id) {
          drag[i].splice(j, 1);
        }
      }
    }
    setDrag(drag);
    let rol = roles.filter((role) => role.id !== selektovanaUloga.id);
    setRoles(rol);
    const i = parseInt(e.target.getAttribute("displayId"));
    drag[i].push(selektovanaUloga);
    setDrag([...drag]);
  }

  function onDropHandlerReverse(e) {
    let selektovanaUloga = JSON.parse(e.dataTransfer.getData("roleType"));
    e.preventDefault();
    if (e.target.tagName != "DIV") {
      return;
    }
    if (roles.filter((r) => r.id === selektovanaUloga.id).length > 0) {
      return;
    }
    console.debug(e.target.id);
    if (e.target.id === "nedodeljeni") {
      roles.push(selektovanaUloga);
      setRoles([...roles]);
      let rol = roles.filter((role) => role.id !== selektovanaUloga.id);
    }
    for (let i = 0; i < drag.length; i++) {
      for (let j = 0; j < drag[i].length; j++) {
        if (drag[i][j].id === selektovanaUloga.id) {
          drag[i].splice(j, 1);
        }
      }
    }
    setDrag(drag);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  const thetoken = localStorage.getItem("token"); // token od login-a

  checkToken(thetoken);

  function checkToken(token) {
    console.log(token);
    if (token === null) {
      window.location.href = "/login";
      //napraviti na kraju notifikaciju
    } else {
    }
  }

  function moviesUpdate() {
    moviesListProducer(thetoken).then((listeddata) => {
      console.table(listeddata);
      listeddata.map((muvi, index) => {
        drag[index] = [];
      });
      setMovies(listeddata);
    });
  }

  useEffect(() => {
    moviesUpdate();
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

  const [roles, setRoles] = useState([]);

  async function rolesListActor(token) {
    const response = await fetch(ip + "roles/list", {
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
    rolesListActor(thetoken).then((listeddata) => {
      let listR = [];
      listeddata.map((glumac) =>
        glumac.ponudjeneUloge.map((pu) =>
          listR.push({
            ...pu,
            imeGlumca: glumac.ime,
            prezimeGlumca: glumac.prezime,
            visinaGlumca: glumac.visina,
            tezinaGlumca: glumac.tezina,
            nacionalnostGlumca: glumac.nacionalnost,
            bojaKoseGlumca: glumac.bojaKose,
            bojaOcijuGlumca: glumac.bojaOciju,
            datumRodjenjaGlumaca: glumac.datumRodjenja,
            polGlumca: glumac.pol,
          })
        )
      );
      console.table(listeddata);
      setRoles(listR);
    });
  }, []);

  function obrisiNalog() {
    localStorage.setItem("token", thetoken); // kesiramo token
    window.location.href = "/Obrisi";
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
  return (
    <div className="background">
      <div className="sidebar">
        <div>
          <label className="full-name">{`${data.ime} ${data.prezime}`}</label>
        </div>
        <div>
          <label className="nickname">{data.username}</label>
        </div>
        <ul className="menu">
          <li className="menu-item">
            <a href="#" onClick={resetR}>
              Resetuj uloge
            </a>
          </li>
         
          <li className="menu-item">
            <a href="#" onClick={obrisiNalog}>
              Obriši profil
            </a>
          </li>
          <li className="menu-item logout">
            <a href="#" onClick={logOut}>
              Log out
            </a>
          </li>
        </ul>
      </div>
      <div className="display">
        <div
          className="leva-strana"
          id="nedodeljeni"
          onDrop={onDropHandlerReverse}
          onDragOver={handleDragOver}
        >
          {roles.map((role) => (
            <div
              dragable
              onDragStart={(e) => handleOnDrag(e, role)}
              className="frejm uicd"
              data-tooltip={`${role.imeGlumca} ${role.prezimeGlumca}\n Pol: ${role.polGlumca}\n Nacionalnost: ${role.nacionalnostGlumca}\n Visina: ${role.visinaGlumca}m\n Težina: ${role.tezinaGlumca}kg\n`}
              key={role.id}
            >
              <img
                onClick={() => {
                  selectId = role.id;
                  console.log(selectId);
                }}
                className="thumb"
                src={`${ip}files/get/${role.pnguloge}`}
                alt="Offline"
              />
              <label className="borac">{role.naslov}</label>
            </div>
          ))}
        </div>
        <div className="desna-strana">
          {movies.map((film, index) => (
            <div className="frejm uiproducer" data-tooltip={`Trajanje: ${film.trajanjeMinuta}min\nUzrast: ${film.uzrast}+\nBroj uloga: ${film.listaUloga.length}`}>
              <img
                onClick={() => {
                  selectId = film.id;
                  console.log(selectId);
                }}
                className="thumb"
                src={`${ip}files/get/${film.poster}`}
                alt="Offline"
              />
              <label className="borac">{film.ime}</label>
              <br />
              <label className="borac">{film.zanr}</label>
              <div
                className="trunck"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                displayId={index}
                movieId={film.id}
                maxRoles={film.listaUloga.length}
              >
                {drag[index].map((role) => (
                  <div
                    draggable
                    onDragStart={(e) => handleOnDrag(e, role)}
                    className="frejm"
                    key={role.id}
                  >
                    <img
                      onClick={() => {
                        selectId = role.id;
                        console.log(selectId);
                      }}
                      className="thumb"
                      src={`${ip}files/get/${role.pnguloge}`}
                      alt="Offline"
                    />
                    <label className="borac">{role.naslov}</label>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  proslediFilm(
                    film.id,
                    drag[index].map((o) => o.id)
                  );
                }}
                className="btn"
              >
                Pošalji
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
