import React, { useState } from "react";
import { Form, FormGroup, Button, Image } from "react-bootstrap";

import "../pagesstyle/ProducerFill.css";
import "../pagesstyle/FillInPages.css";

const ip = "http://127.0.0.1:5000/";
const imageaddress = "http://127.0.0.1:5000/files/get/";
let filename;

// primer kompletne slike:  imageaddress  + d['fname'] <- "http://192.168.196.26:5000/files/get/1D9BFFDCE52D0EE5894BD35CC9A56ACF.png"

export default function Producer() {
  const [imgSrc, setImgSrc] = useState("Invalid Image Source");

  async function regProducer() {
    // definicija API funkcije za registraciju producenta
    const response = await fetch(ip + "users/registerProducer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fulldata),
    });
    const d = await response.json();
    return response.ok;
  }

  async function upload() {
    // definisana API funkcija za file upload
    var input = document.querySelector('input[type="file"]');

    var data = new FormData();
    data.append("file", input.files[0]);

    const u = await fetch(ip + "files/upload", {
      method: "POST",
      body: data,
    });
    const d = await u.json();
    console.table(d);

    filename = d["fname"];
    formData.urlimage = imageaddress + d["fname"];

    console.debug(formData.urlimage);
    document.querySelector("#Querry").src = formData.urlimage;
  }

  const formDataMaster = JSON.parse(localStorage.getItem("formData"));

  const [formData, setFormData] = useState({
    urlimage: "",
    auditionadress: "",
    ime_Produkcije: "",
    kod_Produkcije: "",
  });

  const fulldata = {
    username: "",
    hashpass: "",
    ime: "",
    prezime: "",
    email: "",
    datumRodjenja: "",
    pol: "",
    profilnaSlika: "",
    adresaAudicije: "",
    produkcija: "",
  };

  const production = {
    kod: "",
    ime: "",
  };

  const [formError, setFormError] = useState({});

  const onChangeHandler = (event) => {
    if (event.target.name === "languages") {
      let copy = { ...formData };

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
        ...formData,
        [event.target.name]: event.target.value,
      }));
    }
  };

  const validateForm = () => {
    let err = {};
    if (formData.auditionadress === "") {
      err.auditionadress = "Niste uneli adresu gde održavate audiciju";
    }
    if (formData.ime_Produkcije === "") {
      err.auditionadress = "Niste uneli ime produkcije";
    }
    if (formData.kod_Produkcije === "") {
      err.auditionadress = "Niste uneli kod produkcije";
    }
    setFormError({ ...err });

    return Object.keys(err).length < 1;
  }; // mislim da je ok

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let isValid = validateForm();
    if (isValid) {
      fulldata.username = formDataMaster.username;
      fulldata.hashpass = formDataMaster.password;
      fulldata.ime = formDataMaster.name;
      fulldata.prezime = formDataMaster.lastname;
      fulldata.email = formDataMaster.email;
      fulldata.datumRodjenja = formDataMaster.birthday;
      fulldata.pol = formDataMaster.gender;
      fulldata.profilnaSlika = formData.urlimage;
      fulldata.adresaAudicije = formData.auditionadress;

      production.ime = formData.ime_Produkcije;
      production.kod = formData.kod_Produkcije;

      fulldata.produkcija = production;

      if (formData.urlimage === imageaddress) {
        fulldata.profilnaSlika = "";
      } else {
        fulldata.profilnaSlika = filename;
      }

      regProducer().then((funVal) => {
        console.log(funVal);
        if (funVal && isValid) {
          window.location.href = "/login";
        } else {
          console.debug("doslo je do greske negde");
        }
      });
    } else {
      console.debug(isValid);
    }
  };
  return (
    <div className="App">
      <div className="about-producer">
        <form onSubmit={onSubmitHandler}>
          <div className="form-group">
            <label className="produkcija">Kreirajte svoju produkciju:</label>
          </div>

          <div className="form-group">
            <label htmlFor="ime_Produkcije" className="form-label">
              Ime produkcije
            </label>
            <input
              className="form-control"
              name="ime_Produkcije"
              onChange={onChangeHandler}
              value={formData.ime_Produkcije}
            />
            <span className="non-valid">{formError.ime_Produkcije}</span>
          </div>

          <div className="form-group">
            <label htmlFor="kod_Produkcije" className="form-label">
              Kod produkcije
            </label>
            <input
              className="form-control"
              name="kod_Produkcije"
              onChange={onChangeHandler}
              value={formData.kod_Produkcije}
            />
            <span className="non-valid">{formError.kod_Produkcije}</span>
          </div>

          <div className="form-group">
            <label htmlFor="auditionadress" className="form-label">
              Adresa održavanja audicije
            </label>
            <input
              className="form-control"
              name="auditionadress"
              onChange={onChangeHandler}
              value={formData.auditionadress}
            />
            <span className="non-valid">{formError.auditionadress}</span>
          </div>

          <div className="form-group">
            <div className="btn-wrapperS">
              <button className="btn" type="submit">
                Registruj
              </button>
            </div>
          </div>
        </form>
        <div className="right">
          <label className="profilna">Postavite svoju profilnu sliku:</label>
          <div>
            <input type="file" id="myFile" name="file" className="chooseFile" />
            <div className="frame">
              <Image
                id="Querry"
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
            <div>
              <button onClick={upload} className="btnAdd">
                Dodaj
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
