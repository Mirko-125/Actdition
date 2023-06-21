import React, { useState } from "react";
import { Form, FormGroup, Button, Image } from "react-bootstrap";

import "../pagesstyle/CDFill.css";

let locke = false; // mutex
const ip = "http://127.0.0.1:5000/";

export default function CastingDirector() {
  async function cdRegistration() {
    // definicija API funkcije koja registruje direktora za uloge
    const response = await fetch(ip + "users/registerCastingDirektor", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fulldata),
    });
    console.table(fulldata);
    const user = await response.json();
    return response.ok;
  }

  async function vraca() {
    // definicija API funkcije koja vraca sve produkcije
    const response = await fetch(ip + "users/listProductions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const dropdown = document.getElementById("dropdown");
    for (const iterator of data) {
      console.log(iterator);
      const option = document.createElement("option");
      option.innerHTML = iterator;
      option.value = iterator;
      dropdown.appendChild(option);
    }
  }

  if (!locke) {
    vraca();
    locke = true;
  }

  const formDataMaster = JSON.parse(localStorage.getItem("formData"));
  const [formData, setFormData] = useState({
    prKod: "",
    ime: "",
  });

  const production = {
    prKod: "",
    ime: "",
  };

  const fulldata = {
    username: "",
    hashpass: "",
    ime: "",
    prezime: "",
    email: "",
    datumRodjenja: "",
    pol: "",
    prKod: "",
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

    if (false) {
      err.prKod = "pogresan kod";
    }

    if (false) {
      err.prKod = "Nevalidan kod";
    }
    setFormError({ ...err });

    return Object.keys(err).length < 1;
  };

  const onSubmitHandler = (event) => {
    // WIP
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
      fulldata.prKod = formData.prKod;

      cdRegistration().then((funVal) => {
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
      <div className="cd-detail">
        <form onSubmit={onSubmitHandler}>
          <div className="form-group">
            <label className="CDProdukcija">
              Odaberite produkciju za koju ćete raditi:
            </label>

            <label htmlFor="ime" className="form-label">
              Produkcija
            </label>
            <select
              id="dropdown"
              className="form-select"
              name="ime"
              onChange={onChangeHandler}
              value={formData.ime}
            >
              <option value=""></option>
            </select>
            <span className="non-valid">{formError.ime}</span>
          </div>
          <div className="form-group">
            <label htmlFor="prKod" className="form-label">
              Kod produkcije
            </label>
            <input
              className="form-control"
              name="prKod"
              onChange={onChangeHandler}
              value={formData.prKod}
            />
            <span className="non-valid">{formError.prKod}</span>
          </div>
          <div className="form-group">
            <div className="btn-wrapper">
              <button className="btnCD" type="submit">
                Submit
              </button>
            </div>
          </div>
        </form>
        <div className="left">
          <div className="slika">
            <Image
              className="imageCD"
              src={require("../pagesstyle/images/rocky (2).jpg")}
              alt="Script1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
