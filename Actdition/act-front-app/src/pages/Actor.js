import React, { useState } from "react";
import { Form, FormGroup, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../pagesstyle/ActorFill.css";
import "../pagesstyle/FillInPages.css";

const ip = "http://127.0.0.1:5000/";
const imageaddress = "http://127.0.0.1:5000/files/get/";
let filename;

// primer kompletne slike:  imageaddress  + d['fname'] <- "http://192.168.196.26:5000/files/get/1D9BFFDCE52D0EE5894BD35CC9A56ACF.png"

export default function Actor() {
  const [imgSrc, setImgSrc] = useState("Invalid Image Source");

  async function actorRegistration() {
    //definisana API funkcija za registraciju glumca
    const response = await fetch(ip + "users/registerActor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fulldata),
    });

    const data = await response.json();
    return response.ok;
  }

  async function upload() {
    // definisana API funkcija za file upload
    let input = document.querySelector('input[type="file"]');

    let data = new FormData();
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

  const formDataMaster = JSON.parse(localStorage.getItem("formData")); // uzima iz kesa od prosle stranice

  const [formData, setFormData] = useState({
    urlimage: "",
    height: "",
    weight: "",
    haircolour: "",
    eyecolour: "",
    nationality: "",
  });

  const fulldata =
    // actor object
    {
      username: "",
      hashpass: "",
      ime: "",
      prezime: "",
      email: "",
      datumRodjenja: "",
      pol: "",
      profilnaSlika: "",
      visina: "",
      tezina: "",
      bojaKose: "",
      bojaOciju: "",
      nacionalnost: "",
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

    if (formData.height === "") {
      err.height = "Niste uneli Vašu visinu";
    }
    if (formData.weight === "") {
      err.weight = "Niste uneli Vašu težinu";
    }
    if (formData.haircolour === "") {
      err.haircolour = "Niste izabrali Vašu boju kose";
    }
    if (formData.eyecolour === "") {
      err.eyecolour = "Niste izabrali Vašu boju očiju";
    }
    if (formData.nationality === "") {
      err.nationality = "Niste izabrali svoju nacionalnost";
    }
    setFormError({ ...err });

    return Object.keys(err).length < 1;
  };

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
      fulldata.visina = formData.height;
      fulldata.tezina = formData.weight;
      fulldata.bojaKose = formData.haircolour;
      fulldata.bojaOciju = formData.eyecolour;
      fulldata.nacionalnost = formData.nationality;
      
      if (formData.urlimage === imageaddress) {
        fulldata.profilnaSlika = "";
      } else {
        fulldata.profilnaSlika = filename;
      }
      actorRegistration().then((funVal) => {
        console.log(funVal);

        if (funVal && isValid) {
          window.location.href = "/login";
        } else {
          console.debug("doslo je do greske negde");
        }
      });
    } else {
      console.debug("Is it valid? " + isValid);
    }
  };
  return (
    <div className="App">
      <div className="actor-image">
        <Form onSubmit={onSubmitHandler}>
          <FormGroup className="form-group">
            <label htmlFor="height" className="form-label">
              Visina
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              name="height"
              onChange={onChangeHandler}
              value={formData.height}
            />
            <span className="non-valid">{formError.height}</span>
          </FormGroup>
          <FormGroup className="form-group">
            <label htmlFor="weight" className="form-label">
              Težina
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              className="form-control"
              name="weight"
              onChange={onChangeHandler}
              value={formData.weight}
            />
            <span className="non-valid">{formError.weight}</span>
          </FormGroup>
          <FormGroup className="form-group selectdiv">
            <label htmlFor="haircolour" className="form-label">
              Boja kose
            </label>
            <select
              className="form-select"
              name="haircolour"
              onChange={onChangeHandler}
              value={formData.haircolour}
            >
              <option value=""></option>
              <option value="brown">Braon</option>
              <option value="blonde">Plava</option>
              <option value="red">Crvena</option>
              <option value="ginger">Riđa</option>
              <option value="black">Crna</option>
              <option value="dyed">Ofarbana</option>
            </select>
            <span className="non-valid">{formError.eyecolour}</span>
          </FormGroup>
          <FormGroup className="form-group selectdiv">
            <label htmlFor="eyecolour" className="form-label">
              Boja očiju
            </label>
            <select
              className="form-select"
              name="eyecolour"
              onChange={onChangeHandler}
              value={formData.eyecolour}
            >
              <option value=""></option>
              <option value="brown">Braon</option>
              <option value="blue">Plava</option>
              <option value="green">Zelena</option>
              <option value="red">Crvena</option>
            </select>
            <span className="non-valid">{formError.eyecolour}</span>
          </FormGroup>
          <FormGroup className="form-group selectdiv">
            <label htmlFor="nationality" className="form-label">
              Nacionalnost
            </label>
            <select
              className="form-select"
              name="nationality"
              onChange={onChangeHandler}
              value={formData.nationality}
            >
              <option value=""></option>
              <option value="afghan">Avganistanska</option>
              <option value="albanian">Albanska</option>
              <option value="american">Američka</option>
              <option value="argentinian">Argentinska</option>
              <option value="australian">Australijska</option>
              <option value="azerbaijani">Azerbejdžanska</option>
              <option value="bahamian">Bahamska</option>
              <option value="bangladeshi">Bangladeška</option>
              <option value="belarusian">Beloruska</option>
              <option value="brazilian">Brazilskа</option>
              <option value="bulgarian">Bugarska</option>
              <option value="canadian">Kanadska</option>
              <option value="chilean">Čileanska</option>
              <option value="chinese">Kineska</option>
              <option value="colombian">Kolumbijska</option>
              <option value="croatian">Hrvatska</option>
              <option value="cuban">Kubanska</option>
              <option value="czech">Češka</option>
              <option value="danish">Danska</option>
              <option value="dominican">Dominikanska</option>
              <option value="dutch">Holandska</option>
              <option value="egyptian">Egipatska</option>
              <option value="english">Engleska</option>
              <option value="estonian">Estonska</option>
              <option value="ethiopian">Etiopska</option>
              <option value="filipino">Filipinska</option>
              <option value="finnish">Finska</option>
              <option value="french">Francuska</option>
              <option value="georgian">Gruzijska</option>
              <option value="german">Nemačka</option>
              <option value="ghanaian">Ganska</option>
              <option value="greek">Grčka</option>
              <option value="haitian">Haitska</option>
              <option value="hungarian">Mađarska</option>
              <option value="icelandic">Islandska</option>
              <option value="indian">Indijska</option>
              <option value="indonesian">Indonežanska</option>
              <option value="iranian">Iranska</option>
              <option value="iraqi">Iračka</option>
              <option value="irish">Irska</option>
              <option value="israeli">Izraelska</option>
              <option value="italian">Italijanska</option>
              <option value="ivorian">Obalska Slonovače</option>
              <option value="jamaican">Jamajčanska</option>
              <option value="japanese">Japanska</option>
              <option value="kazakh">Kazahstanska</option>
              <option value="kenyan">Kenijska</option>
              <option value="korean">Južnokorejska</option>
              <option value="kyrgyz">Kirgistanska</option>
              <option value="latvian">Letonska</option>
              <option value="lithuanian">Litvanska</option>
              <option value="malawian">Malavijska</option>
              <option value="malaysian">Malezijska</option>
              <option value="macedonian">Makedonska</option>
              <option value="mexican">Meksička</option>
              <option value="mongolian">Mongolska</option>
              <option value="moroccan">Marokanska</option>
              <option value="mozambican">Mozambijska</option>
              <option value="namibian">Namibijska</option>
              <option value="newzealander">Novozelandska</option>
              <option value="nigerian">Nigerijska</option>
              <option value="norwegian">Norveška</option>
              <option value="pakistani">Pakistanska</option>
              <option value="peruvian">Peruanska</option>
              <option value="polish">Poljska</option>
              <option value="polynesian">Polinezijska</option>
              <option value="portuguese">Portugalska</option>
              <option value="romanian">Rumunska</option>
              <option value="russian">Ruska</option>
              <option value="ruthenian">Rusinska</option>
              <option value="saudi">Saudijska Arabija</option>
              <option value="senegalese">Senegalska</option>
              <option value="serbian">Srpska</option>
              <option value="slovak">Slovačka</option>
              <option value="slovenian">Slovenačka</option>
              <option value="southafrican">Južnoafrička</option>
              <option value="spanish">Španska</option>
              <option value="sudanese">Sudanska</option>
              <option value="swedish">Švedska</option>
              <option value="tajik">Tadžikistanska</option>
              <option value="tanzanian">Tanzanijska</option>
              <option value="thai">Tajlandska</option>
              <option value="tunisian">Tuniška</option>
              <option value="turkish">Turska</option>
              <option value="turkmen">Turkmenistanska</option>
              <option value="ukrainian">Ukrajinska</option>
              <option value="uzbek">Uzbekistanska</option>
              <option value="vietnamese">Vijetnamska</option>
              <option value="zambian">Zambijska</option>
              <option value="zimbabwean">Zimbabveanska</option>
            </select>
            <span className="non-valid">{formError.nationality}</span>
          </FormGroup>
          <FormGroup className="form-group">
            <div className="btn-wrapper2">
              <button className="btn" type="submit">
                Submit
              </button>
            </div>
          </FormGroup>
        </Form>
        <FormGroup className="right">
          <label className="profilna">Postavite svoju profilnu sliku:</label>
          <div>
            <input type="file" id="myFile" name="file" className="chooseFile"/>
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
              <button onClick={upload} className="btnAddA">
                Postavi
              </button>
            </div>
          </div>
        </FormGroup>
      </div>
    </div>
  );
}
