import { useState } from 'react';

import '../pagesstyle/Signup.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name:'',
    lastname:'',
    username: '',
    email: '',
    password: '',
    cpassword: '',
    gender: '',
    birthday: '', 
    role: ''
  })

  const [formError,setformError] = useState({})

  const onChangeHandler = (event) => 
  {
    if (event.target.name === 'languages') {
      let copy = { ...formData }
      if (event.target.checked) {
        copy.languages.push(event.target.value)
      } else {
        copy.languages = copy.languages.filter(el => el !== event.target.value)
      }
      setFormData(copy)
    } else {
      setFormData(() => ({
        ...formData,
        [event.target.name]: event.target.value
      }))
    }
  }

  const validateForm = () => // proveriti mandatory polja jos jednom
  {
    let err = {}
    if(formData.username === '')
    {
      err.username= "Polje mora biti popunjeno!"
    }
    if(formData.name === '')
    {
      err.name= "Polje mora biti popunjeno!"
    }
    if(formData.lastname === '' )
    {
      err.lastname= "Polje mora biti popunjeno!"
    }
    if(formData.gender === '')
    {
      err.gender= "Morate reći kog ste pola!"
    }
    if (formData.password.length < 8) 
    {
      err.password="Lozinka nije dovoljno duga!";  
    }
    if(formData.password === '' || formData.cpassword === '') 
    {
      err.password= "Polja za lozinku i njenu potvrdu moraju biti popunjena!"
    }
    else
    {
      if(formData.password !== formData.cpassword)
      {
        err.password="Lozinke koje ste uneli se ne slažu"
      }
    }
    if(formData.email === '')
    {
      err.email="Polje mora biti popunjeno!"
    }
    else
    {
      let regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      if(!(regex.test(formData.email)))
      {
        err.email="Napisali ste mejl u lošem formatu!"
      }
    }
    setformError({...err})
    return Object.keys(err).length<1;
  }

  const handler = (event) =>
  {
    event.preventDefault();

    let isValid = validateForm();
    let buttonId = event.target.id
    if (isValid) 
    {
      if(buttonId==1) // G
      {
          formData.role = "Glumac";

          localStorage.setItem('formData', JSON.stringify(formData));

          window.location.href = '/Actor';
      }
      if(buttonId==2) // C
      {
          formData.role = "Casting director";

          localStorage.setItem('formData', JSON.stringify(formData));

          window.location.href = '/CastingDirector';
      }
      if(buttonId==3) // P
      {
          formData.role = "Producent";

          localStorage.setItem('formData', JSON.stringify(formData));

          window.location.href = '/Producer';
      }
    }
    else
    {
      console.debug("Is it valid? "+isValid);
    }
  }
  return (
    <div className="App">
      <div className="block">
      <form>
      <div className="form-group">
      <div className="form-welcome">
          <h3>Dobrodošli na Actdition!</h3>
      </div>
      </div>

      <div className="form-group">
          <label htmlFor="name" className="form-label">Ime</label>
          <input className="form-control" name="name" onChange={onChangeHandler} value={formData.name} />
          <span className="non-valid">{formError.name}</span>
        </div>
        <div className="form-group">
          <label htmlFor="lastname" className="form-label">Prezime</label>
          <input className="form-control" name="lastname" onChange={onChangeHandler} value={formData.lastname} />
          <span className="non-valid">{formError.lastname}</span>
        </div>
       
        <div className="form-group">
          <label htmlFor="username" className="form-label">Korisničko ime</label>
          <input className="form-control" name="username" onChange={onChangeHandler} value={formData.username} />
          <span className="non-valid">{formError.username}</span>
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input className="form-control" name="email" onChange={onChangeHandler} value={formData.email} />
          <span className="non-valid">{formError.email}</span>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Lozinka</label>
          <input className="form-control" type="password" name="password" onChange={onChangeHandler} value={formData.password} />
          <span className="non-valid">{formError.password}</span>
        </div>
        <div className="form-group">
          <label htmlFor="cpassword" className="form-label">Potvrdite lozinku</label>
          <input className="form-control" type="password" name="cpassword" onChange={onChangeHandler} value={formData.cpassword} />
        </div>
        <div className="form-group">
          <label htmlFor="birthdate" className="form-label">Datum rođenja</label>
              <input className="form-control" name="birthday" type="date" onChange={onChangeHandler} value={formData.birthday}/>
        </div>
        <div className="form-gender">
          <label htmlFor="gender" className="gender-label">Pol:</label>
          <div className="gender-buttons">
          <a>
              <input type="radio" name="gender" value="m" className="gender" onChange={onChangeHandler} checked={formData.gender === 'm'} />
              <label htmlFor="male">Muško</label>
            </a>
            <a>
              <input type="radio" name="gender" value="z" className="gender" onChange={onChangeHandler} checked={formData.gender === 'z'} />
              <label htmlFor="female">Žensko</label>
          </a>
          </div>
          <span className="non-valid">{formError.gender}</span>
        </div>
        <div className="form-user">
        <label htmlFor="role" className="user">Pozicija:</label>
        </div>
        <div className="form-group">
        <div className="buttons">
          <button id="1" className="btn" onClick={handler}>Glumac</button>
          <button id="2" className="btn" onClick={handler}>CD</button>
          <button id="3" className="btn" onClick={handler}>Producent</button>
        </div>
        </div>
      </form>
        <img 
          className='image'
          src={require('../pagesstyle/images/bondcrop.jpg')} 
          alt="Girl in a jacket" 
        />
      </div>
    </div>
  );  
}
