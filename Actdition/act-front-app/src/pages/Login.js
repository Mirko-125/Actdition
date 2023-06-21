import { useState } from 'react';
import { Form, FormGroup, Button, Image } from 'react-bootstrap';

import '../pagesstyle/Login.css';
import '../pagesstyle/FillInPages.css'; // mozda da zapocnemo iznova?

const ip = "http://127.0.0.1:5000/"
    let err = {}
let msg = ''
export default function LogIn() 
{
  // podaci forme

  const [formDataLog, setFormData] = useState({
    username: '',
    password: '',
  })

  const [formError,setformError] = useState({})

  const onChangeHandler = (event) => {

    if (event.target.name === 'languages') {

      let copy = { ...formDataLog }

      if (event.target.checked) {
        copy.languages.push(event.target.value)
      } else {
        copy.languages = copy.languages.filter(el => el !== event.target.value)
      }

      setFormData(copy)

    } else {
      setFormData(() => ({
        ...formDataLog,
        [event.target.name]: event.target.value
      }))
    }
  }

  const validateForm = () => 
  {

    if(formDataLog.username === '')
    {
      err.username= "Polje mora biti popunjeno!"
    }
    if(formDataLog.password === '')
    {
      err.password= "Polje mora biti popunjeno!"
    }
    setformError({...err})
    return Object.keys(err).length<1;
  } 

  const onSubmitHandler = async (event) => 
  {
    event.preventDefault()
    console.log("uneto:")
    console.table(formDataLog);
    
    let isValid = validateForm();
        
    if(isValid || err.username === "Niste verifikovani")
    {
      // objekat onoga sto nam treba od korisnika
      const data =
      {
        username: '',
        hashpass: ''
      }
      data.username = formDataLog.username;
      data.hashpass = formDataLog.password;
      try 
      {
        const response = await fetch(ip + "users/login", 
        {
                                method: "POST",
                                headers: {
                                           "Content-Type": "application/json",
                                         },
                                body: JSON.stringify(data), // salje JSON podataka kroz API
        });
        const user = await response.json();
        console.log("response:user:");
        if(!response.ok) {
          err.username= user["status"];
          setformError({...err});

        }
        const token = user.token;
        const tip = user.tip;
        
        localStorage.setItem('token', token); // kesiramo token
        
        switch(tip) 
        {
          case "Glumac":
            window.location.href = "/UIActor";
            break;
          case "KastingDirektor": 
            window.location.href = "/UICD";
            break;
          case "Producent":
            window.location.href = "/UIProducer";
            break;
          default:
            console.debug(user.tip);
        } 
      
      } 
      catch (error) 
      {
        console.error(error);
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
      <Image
          className='image'
          src={require('../pagesstyle/images/don2.JPG')} 
          alt="Script1" 
        />
      <form  onSubmit={onSubmitHandler}>
      <div className="form-group">
        <div className="form-welcomeBack">
          <h3>Popunite tražena polja:</h3>
        </div>
      </div>
        <div className="form-group">
          <label htmlFor="username" className="form-label" placeholder='SuperCoolUsername_125'>Korisničko ime</label>
          <input className="form-control" name="username" onChange={onChangeHandler} value={formDataLog.username} />
          <span className="non-valid">{formError.username}</span>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Lozinka</label>
          <input className="form-control" type="password" name="password" onChange={onChangeHandler} value={formDataLog.password} />
          <span className="non-valid">{formError.password}</span>
        </div>
        <div className="form-group">
          <div className="btn-wrapper">
             <button className="btn" type="submit" >Log in</button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
}
