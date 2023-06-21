import "../pagesstyle/AddActorRole.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Button, Image } from "react-bootstrap";

const ip = "http://127.0.0.1:5000/";
const imageaddress = "http://127.0.0.1:5000/files/get/";
let filename;
const thetoken = localStorage.getItem("token"); // token od login-a

export default function AddFilmAndRoles() {
  const [imgSrc, setImgSrc] = useState("Invalid Image Source");
  const [postSrc, setPosterSrc] = useState("Invalid Poster Source");

  async function uploadImage() {
    // definisana API funkcija za file upload
    let input = document.querySelector("#png");

    let data = new FormData();
    data.append("file", input.files[0]);

    const u = await fetch(ip + "files/upload", {
      method: "POST",
      body: data,
    });
    const d = await u.json();
    console.table(d);

    filename = d["fname"];
    filmData.poster = d["fname"];

    console.debug(filmData.poster);
    document.querySelector("#Querry").src = ip + "files/get/" + filmData.poster;
  }

  async function uploadRoleImage() {
    // definisana API funkcija za file upload
    let input = document.querySelector("#role-png");

    let data = new FormData();
    data.append("file", input.files[0]);

    const u = await fetch(ip + "files/upload", {
      method: "POST",
      body: data,
    });
    const d = await u.json();
    console.table(d);

    filename = d["fname"];
    roleData.pnglika = d["fname"];

    console.debug(roleData.pnglika);
    document.querySelector("#RoleQuerry").src =
      ip + "files/get/" + roleData.pnglika;
  }

  async function makeMovie(obj) {
    //definisana API funkcija za registraciju glumca
    const response = await fetch(ip + "movies/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const data = await response.json();
    return response.ok;
  }

  const onChangeRoleHandler = (event) => {
    if (event.target.name === "languages") {
      let copy = { ...roleData };

      if (event.target.checked) {
        copy.languages.push(event.target.value);
      } else {
        copy.languages = copy.languages.filter(
          (el) => el !== event.target.value
        );
      }

      setElementData(copy);
    } else {
      setElementData(() => ({
        ...roleData,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const onChangeHandler = (event) => {
    if (event.target.name === "languages") {
      let copy = { ...filmData };

      if (event.target.checked) {
        copy.languages.push(event.target.value);
      } else {
        copy.languages = copy.languages.filter(
          (el) => el !== event.target.value
        );
      }

      setFormData(copy);
    } else {
      setFormData(() => ({
        ...filmData,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const [formError, setFormError] = useState({});

  const validateForm = () => {
    // Validacije
    let err = {};

    if (false) {
      err.ime = "x";
    }
    setFormError({ ...err });

    return Object.keys(err).length < 1;
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    Obj.token = thetoken;
    Obj.body = filmData;

    let isValid = validateForm();
    if (isValid) {
      // poziv api funkcije
      makeMovie(Obj).then((funVal) => {
        console.log(funVal);

        if (funVal && isValid) {
          navigate(-1);
          console.table(filmData);
        } else {

        }
      });
    } else {
      console.debug("Is it valid? " + isValid);
    }
  };

  const RoleHandler = (event) => {
    event.preventDefault();
    filmData.listaUloga.push(roleData);
    console.table(filmData);
    setElementData({imelika: "",
    opis: "",
    pnglika: "",
    godineMin: "",
    godineMax: "",
    visinaMin: "",
    visinaMax: "",
    tezinaMin: "",
    tezinaMax: "",
    bojaKose: "",
    bojaOciju: "",
  })

    let isValid = validateForm();
    if (isValid) {
      // poziv api funkcije
      /*  makeMovie(Obj).then((funVal) => 
          {
            console.log(funVal);
           
            if(funVal && isValid)
            {
              console.log("kreirano uspesno, ne brini se vise");
              console.table(filmData);
            }
            else
            {
              console.debug("doslo je do greske negde");
            }
          });
        }
        else
        {
          console.debug("Is it valid? " + isValid);
        }*/
    }
  };

  let navigate = useNavigate();
  function nazad() {
    navigate(-1);
  }

  const Obj = {
    token: "token",
    body: "body",
  };

  const [filmData, setFormData] = useState({
    ime: "",
    zanr: "",
    trajanjeMinuta: "",
    uzrast: "",
    poster: "",
    listaUloga: [],
  });

  const [roleData, setElementData] = useState({
    imelika: "",
    opis: "",
    pnglika: "",
    godineMin: "",
    godineMax: "",
    visinaMin: "",
    visinaMax: "",
    tezinaMin: "",
    tezinaMax: "",
    bojaKose: "",
    bojaOciju: "",
  });

  return (
    <div className="background">
      <button className="centerB" onClick={nazad}>
        Nazad
      </button>
      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <label htmlFor="ime" className="form-label">
            Ime filma
          </label>
          <input
            className="form-control"
            name="ime"
            onChange={onChangeHandler}
            value={filmData.ime}
          />
          <span className="non-valid">{formError.ime}</span>
        </div>

        <div className="form-group">
          <label htmlFor="zanr" className="form-label">
            Žanr filma
          </label>
          <input
            className="form-control"
            name="zanr"
            onChange={onChangeHandler}
            value={filmData.zanr}
          />
          <span className="non-valid">{formError.zanr}</span>
        </div>

        <div className="form-group">
          <label htmlFor="trajanjeMinuta" className="form-label">
            Trajanje filma u minutima
          </label>
          <input
            type="number"
            min="0"
            className="form-control"
            name="trajanjeMinuta"
            onChange={onChangeHandler}
            value={filmData.trajanjeMinuta}
          />
          <span className="non-valid">{formError.trajanjeMinuta}</span>
        </div>

        <div className="form-group">
          <label htmlFor="uzrast" className="form-label">
            Uzrast
          </label>
          <input
            type="number"
            min="0"
            max="18"
            className="form-control"
            name="uzrast"
            onChange={onChangeHandler}
            value={filmData.uzrast}
          />
          <span className="non-valid">{formError.uzrast}</span>
        </div>

        <div className="form-group">
          <button className="btn" type="submit">
            Dodaj film
          </button>
        </div>
      </form>

      <div>
        <label className="form-label">Postavite poster Vašeg filma</label>
        <div>
          <input className="chooseFile" type="file" id="png" name="file" />
          <button className="btn" onClick={uploadImage}>
            Postavi
          </button>
          <div className="frame">
            <Image
              id="Querry"
              src={postSrc}
              onError={() =>
                setPosterSrc(
                  require('../../src/assets/img/poster.png')
                )
              }
              alt="Neuspešno pribavljanje slike"
              height="300px"
              width="300px"
            />
          </div>
        </div>
      </div>

      <form onSubmit={RoleHandler}>
        <div className="form-group">
          <label htmlFor="imelika" className="form-label">
            Ime lika
          </label>
          <input
            className="form-control"
            name="imelika"
            onChange={onChangeRoleHandler}
            value={roleData.imelika}
          />
          <span className="non-valid">{formError.imelika}</span>
        </div>

        <div className="form-group">
          <label htmlFor="opis" className="form-label">
            Opis
          </label>
          <textarea
            className="form-control"
            name="opis"
            onChange={onChangeRoleHandler}
            value={roleData.opis}
          />
          <span className="non-valid">{formError.opis}</span>
        </div>

        <div className="form-group">
          <label htmlFor="godineMin" className="form-label">
            Gornja granica godina
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="form-control"
            name="godineMin"
            onChange={onChangeRoleHandler}
            value={roleData.godineMin}
          />
          <span className="non-valid">{formError.uzrast}</span>
        </div>

        <div className="form-group">
          <label htmlFor="godineMax" className="form-label">
            Donja granica godina
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="form-control"
            name="godineMax"
            onChange={onChangeRoleHandler}
            value={roleData.godineMax}
          />
          <span className="non-valid">{formError.uzrast}</span>
        </div>

        <div className="form-group">
          <label htmlFor="visinaMax" className="form-label">
            Gornja granica visine
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            name="visinaMax"
            onChange={onChangeRoleHandler}
            value={roleData.visinaMax}
          />
          <span className="non-valid">{formError.uzrast}</span>
        </div>

        <div className="form-group">
          <label htmlFor="visinaMin" className="form-label">
            Donja granica visine
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            name="visinaMin"
            onChange={onChangeRoleHandler}
            value={roleData.visinaMin}
          />
          <span className="non-valid">{formError.uzrast}</span>
        </div>

        <div className="form-group">
          <label htmlFor="tezinaMax" className="form-label">
            Gornja granica težine
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="form-control"
            name="tezinaMax"
            onChange={onChangeRoleHandler}
            value={roleData.tezinaMax}
          />
          <span className="non-valid">{formError.uzrast}</span>
        </div>

        <div className="form-group">
          <label htmlFor="tezinaMin" className="form-label">
            Donja granica težine
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            className="form-control"
            name="tezinaMin"
            onChange={onChangeRoleHandler}
            value={roleData.tezinaMin}
          />
          <span className="non-valid">{formError.uzrast}</span>
        </div>

        <div className="form-group selectdiv">
          <label htmlFor="bojaKose" className="form-label">
            Boja kose
          </label>
          <select
            className="form-select"
            name="bojaKose"
            onChange={onChangeRoleHandler}
            value={roleData.bojaKose}
          >
            <option value=""></option>
            <option value="brown">Braon</option>
            <option value="blonde">Plava</option>
            <option value="red">Crvena</option>
            <option value="ginger">Riđa</option>
            <option value="black">Crna</option>
            <option value="dyed">Ofarbana</option>
          </select>
          <span className="non-valid">{formError.bojaKose}</span>
        </div>

        <div className="form-group selectdiv">
          <label htmlFor="bojaOciju" className="form-label">
            Boja očiju
          </label>
          <select
            className="form-select"
            name="bojaOciju"
            onChange={onChangeRoleHandler}
            value={roleData.bojaOciju}
          >
            <option value=""></option>
            <option value="brown">Braon</option>
            <option value="blue">Plava</option>
            <option value="green">Zelena</option>
            <option value="red">Crvena</option>
          </select>
          <span className="non-valid">{formError.bojaOciju}</span>
        </div>

        <div className="form-group">
          <button className="btn" type="submit">
            Dodaj ulogu
          </button>
        </div>
      </form>
      <div>
        <label className="form-label">Slika lika</label>
        <div>
          <input className="chooseFile" type="file" id="role-png" name="file" />
          <button className="btn" onClick={uploadRoleImage}>Postavi</button>
          <div className="frame">
          <Image
              id="RoleQuerry"
              src={imgSrc}
              onError={() =>
                setImgSrc(
                  "https://static.vecteezy.com/system/resources/previews/003/819/753/non_2x/doodle-grunge-style-icon-hand-drawing-paint-brush-drawing-decorative-element-vector.jpg"
                )
              }
              alt="Neuspešno pribavljanje slike"
              height="300px"
              width="300px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
