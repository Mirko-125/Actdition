import React, { useEffect, useState } from 'react';
import "../pagesstyle/UIActor.css"

const ip = "http://127.0.0.1:5000/"
const imageaddress = "http://127.0.0.1:5000/files/get/";
let selectId = undefined;


export default function UIActor() 
{
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

    const thetoken = localStorage.getItem('token'); // token od login-a
    
    function moveToInbox()
    {
        localStorage.setItem('token', thetoken); // kesiramo token
        window.location.href = '/Inbox';        
    }

    async function rolesListActor(token) 
      {
        const response = await fetch(ip + "roles/list", 
        {
                                method: "POST",
                                headers: {
                                           "Content-Type": "application/json",
                                         },
                                body: JSON.stringify(token),
        });
        
        const data = await response.json();
        return data;
      }

    checkToken(thetoken)
    
    function checkToken(token)
    {
        console.log(token);
        if(token===null)
        {
            window.location.href = '/login';
            //napraviti na kraju notifikaciju
        }
        else
        {

        }
    }

    function moveToAdd()
    {
        localStorage.setItem('token', thetoken); // kesiramo token
        window.location.href = '/AddActorRole';
    }

    function obrisiNalog()
    {
        localStorage.setItem('token', thetoken); // kesiramo token
        window.location.href = '/Obrisi';
    }

    async function obrisiUlogu(thetoken, id)
    {
        if(id>=0)
        {
            const response = await fetch(ip + "roles/delete", 
            {
                                    method: "DELETE",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        token: thetoken,
                                        body: id
                                    })
            });
            const data = await response.json();
            console.log(data);
            return response.ok;
        }
        else
        {
            return false;
        }

    }

    async function logOut()
    {
        const response = await fetch(ip + "users/logout", 
            {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(thetoken)
            });
        const data = await response.json();
        console.log(data);

        localStorage.removeItem("token"); 
        window.location.href = '/login';
    } 

    const [roles, setRoles] = useState([]);
    const [data, setData] = useState(0);
    useEffect(()=>
    {
        getRequest().then((fdata) => 
        {
            console.table(fdata);
            setData(fdata);
        }) 
    },[])


    useEffect(()=>
    {
        rolesListActor(thetoken).then((listeddata) =>
        {
            console.table(listeddata);
            setRoles(listeddata);
        })
    },[])

    console.log("Radi");
    console.table(roles);

    async function getRequest()
    {
            const response = await fetch(ip + "users/getUserData", 
            {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(thetoken)
            });
            const data = await response.json();
            return data;
    }
    return(
        <div className="background">
            <div className="sidebar">
            <div className="logo">
                <img className="pfp" src={`${imageaddress}${data.profilnaSlika}`} alt="Offline"/>
            </div>
            <div>
                <label className='full-name'>{`${data.ime} ${data.prezime}`}</label>
            </div>
            <div>
                <label className='nickname'>{data.username}</label>
            </div>
                <ul className="menu">
                    <li className="menu-item">
                        <a href="#" onClick={moveToAdd}>Napravi ulogu</a>
                    </li>
                    <li className="menu-item">
                        <a href="#" onClick={ () => {obrisiUlogu(thetoken,selectId).then((povrat)=>{
                            if(povrat)
                            {
                                window.location.reload();
                                return;
                            }
                            else
                            {
                                console.error("bila je neka greska");
                            }
                        }
                        )}}>Obriši ulogu</a> {/* dodati then */}
                    </li>
                    <li className="menu-item">
                        <a href="#" onClick={izmeniProfilnu}>Izmeni profilnu</a>
                    </li>
                    <li className="menu-item">
                        <a href="#" onClick={obrisiNalog}>Obriši profil</a>
                    </li>
                    <li className="menu-item">
                        <a href="#" onClick={moveToInbox}>Inbox</a>
                    </li>
                    <li className="menu-item logout">
                        <a href="#" onClick={logOut}>Log out</a>
                    </li>
                </ul>
            </div>            
            <div className="ponudjene-uloge">
                <div className="prezentacija">
                    {roles.map(role => (<div className="frejm uiactor" data-tooltip={`Opis: ${role.opisuloge}`} key={role.id}>
                    <img  onClick={ (e) => { selectId=role.id; console.log(selectId);  document.querySelectorAll(".frejm").forEach(el => {el.style = '';}); e.target.parentElement.style = 'border: 4px #0047ab solid;'  } } className="thumb" src={`${ip}files/get/${role.pnguloge}`} alt="Offline"/>
                    <label className="borac">{role.naslov}</label>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}