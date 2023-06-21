import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pagesstyle/Pregled.css";
import "../pagesstyle/UIProducer.css";

const ip = "http://127.0.0.1:5000/";
const imageaddress = "http://127.0.0.1:5000/files/get/";
let selectId = undefined;

export default function Pregled() {
  function potvrdiFun(id) {
    console.log(id);
    confirmA(thetoken, id).then((funVal) => {
      if (funVal) {
        console.log(funVal);
        window.location.reload();
      } else {
        console.log(funVal);
      }
    });
  }

  function odbijFun(id) {
    console.log(id);
    denyA(thetoken, id).then((funVal) => {
      if (funVal) {
        window.location.reload();
        console.log(funVal);
      } else {
        console.log(funVal);
      }
    });
  }

  async function denyA(token, id) {
    const response = await fetch(ip + "movies/odbi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        body: id,
      }),
    });

    // const data = await response.json();
    return response.ok;
  }

  async function confirmA(token, id) {
    const response = await fetch(ip + "movies/odobri", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        body: id,
      }),
    });

    // const data = await response.json();
    return response.ok;
  }

  const thetoken = localStorage.getItem("token"); // token od login-a

  const [movies, setMovies] = useState([]);

  async function moviesListProducer(token) {
    const response = await fetch(ip + "movies/listPredlog", {
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

  let navigate = useNavigate();
  function nazad() {
    navigate(-1);
  }
  return (
    <div className="background">
      <button className="btnN" onClick={nazad}>
        Nazad
      </button>
      <div className="contentAB">
        {movies.map((spoj) => (
          <div className="sadrzaj">
            <div className="ramPregled">
              <img
                onClick={() => {
                  selectId = spoj.film.id;
                  console.log(selectId);
                }}
                className="thumb"
                src={`${ip}files/get/${spoj.film.poster}`}
                alt="Offline"
              />
              <label className="borac">{spoj.film.ime}</label>
              <br />
              <label className="borac">{spoj.film.zanr}</label>
              <br />
              <button
                onClick={() => {
                  odbijFun(spoj.film.id);
                }}
                className="btn"
              >
                Odbij
              </button>
              <div className="trunck-group">
                <div className="trunckx">
                  {spoj.ponude.map((role) => (
                    <div>
                      <div className="ramPregled uicd" data-tooltip={"Prihvati"} key={role.id}>
                        <img
                          onClick={() => {
                            selectId = role.id;
                            console.log(selectId);
                            potvrdiFun(role.id);
                          }}
                          className="thumb"
                          src={`${ip}files/get/${role.pnguloge}`}
                          alt="Offline"
                        />
                      </div>
                      <div>
                        <label className="borac">{role.naslov}</label>
                        <br />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="trunckx">
                  {spoj.film.listaUloga.map((role) => (
                    <div className="celina">
                      <div className="ramPregled" key={role.id}>
                        <img
                          onClick={() => {
                            selectId = role.id;
                            console.log(selectId);
                          }}
                          className="thumb"
                          src={`${ip}files/get/${role.pnglika}`}
                          alt="Offline"
                        />
                        <br />
                      </div>
                      <label className="borac">{role.imelika}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
