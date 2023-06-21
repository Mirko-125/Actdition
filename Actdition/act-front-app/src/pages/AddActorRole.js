import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pagesstyle/Title.css";
import "../pagesstyle/AddActorRole.css";
import { Form, FormGroup, Button, Image } from "react-bootstrap";

const ip = "http://127.0.0.1:5000/";
const imageaddress = "http://127.0.0.1:5000/files/get/";
let filename;
const thetoken = localStorage.getItem("token"); // token od login-a

export default function AddActorRole() {
  const [imgSrc, setImgSrc] = useState("Invalid Image Source");

  let navigate = useNavigate();
  function nazad() {
    navigate(-1);
  }

  const Obj = {
    token: "token",
    body: "body",
  };

  async function addActorRolePrefered(obj) {
    //definisana API funkcija za registraciju glumca
    const response = await fetch(ip + "roles/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const data = await response.json();
    return response.ok;
  }

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
    formData.pnguloge = d["fname"];

    console.debug(formData.pnguloge);
    document.querySelector("#Querry").src =
      ip + "files/get/" + formData.pnguloge;
  }

  async function uploadMP4() {
    // jos jedna definisana API funkcija za file upload
    let input = document.querySelector("#mp4");

    let data = new FormData();
    data.append("file", input.files[0]);

    const u = await fetch(ip + "files/upload", {
      method: "POST",
      body: data,
    });
    const d = await u.json();
    console.table(d);

    formData.mp4 = d["fname"];
    console.log(formData.mp4);
    //ovde da ispise kada je postavljen snimak
    //document.querySelector('#Querry').src=formData.pnguloge; preko ovo
  }

  async function uploadPDF() {
    // i onda jos jedna definisana API funkcija za file upload
    let input = document.querySelector("#pdf");

    let data = new FormData();
    data.append("file", input.files[0]);

    const u = await fetch(ip + "files/upload", {
      method: "POST",
      body: data,
    });
    const d = await u.json();
    console.table(d);

    formData.pdf = d["fname"];
    console.log(formData.pdf);

  }

  const [formData, setFormData] = useState({
    naslov: "",
    pnguloge: "",
    opisuloge: "",
    mp4: "",
    pdf: "",
  });

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

  const [formError, setFormError] = useState({});

  const validateForm = () => {
    let err = {};

    if (formData.opisuloge === "") {
      err.opisuloge = "Niste opisali Vašu ulogu";
    }
    if (formData.naslov === "") {
      err.naslov = "Niste nazvali Vašeg lika";
    }
    /*
    if (formData.pnguloge === '') {
      err.pnguloge = 'Niste uneli sliku vašeg lika'
    }
    if (formData.mp4 === '') {
      err.mp4 = 'Niste postavili vaš snimak'
    }
    if (formData.pdf === '') {
      err.eyecolour = 'Niste postavili vaš CV'
    }
    */
    setFormError({ ...err });

    return Object.keys(err).length < 1;
  };
  const onSubmitHandler = (event) => {
    event.preventDefault();

    Obj.token = thetoken;
    Obj.body = formData;

    let isValid = validateForm();
    if (isValid) {
      addActorRolePrefered(Obj).then((funVal) => {
        console.log(funVal);

        if (funVal && isValid) {
          console.table(formData);
          navigate(-1);
        } else {
          console.debug("doslo je do greske negde");
        }
      });

      console.table(formData.opisuloge);
    } else {
      console.debug("Is it valid? " + isValid);
    }
  };

  return (
    <div className="background">
      <div>
        <button className="centerB" onClick={nazad}>
          Nazad
        </button>
      </div>
      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <label htmlFor="naslov" className="form-label">
            Ime lika
          </label>
          <input
            className="form-control"
            name="naslov"
            onChange={onChangeHandler}
            value={formData.naslov}
          />
          <span className="non-valid">{formError.naslov}</span>
        </div>
        <div className="form-group">
          <label htmlFor="opisuloge" className="opisuloge">
            Opis uloge:
          </label>
          <textarea
            className="form-control textarea"
            name="opisuloge"
            onChange={onChangeHandler}
            value={formData.opisuloge}
          />
          <span className="non-valid">{formError.opisuloge}</span>
        </div>
        <div className="form-group">
          <button className="btn" type="submit">
            Dodaj
          </button>
        </div>
      </form>
      
      <div className="right">
        <label className="form-label">Postavite sliku Vašeg lika</label>
        <div>
          <input type="file" id="png" name="file" className="chooseFile" />
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
            <button onClick={uploadImage} className="btnAddA">
              Postavi
            </button>
          </div>
        </div>

        <label className="form-label">Postavite Vašu revizijsku traku</label>
        <div>
          <input className="chooseFile" type="file" id="mp4" name="file" />
          <button className="btn" onClick={uploadMP4}>Postavi</button>
        </div>

        <label className="form-label">Postavite Vaš CV</label>
        <div>
          <input className="chooseFile" type="file" id="pdf" name="file" />
          <button className="btn" onClick={uploadPDF}>Postavi</button>
        </div>
      </div>
    </div>
  );
}
