import logo from './logo.svg';
import './App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from './components/NavBar';
import { useState } from 'react';
import { Routes } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PasswordUtilPage from './components/PasswordUtilPage';

import Knjige from './components/Knjige';
import KancelarijskiProizvodi from './components/KancelarijskiProizvodi';
import Cart from './components/Cart';
import Porudzbine from './components/Porudzbine';
import { jwtDecode } from "jwt-decode";

import { useEffect } from 'react';

import Proizvodi from './components/Proizvodi';
import AddProizvodPage from './components/AddProizvodPage';
import MyProfile from './components/MyProfile';
import PromoteUser from './components/PromoteUser';


import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Pomocna from './components/Pomocna';
import Payment from './components/Payment';
import Pomocna2 from './components/Pomocna2';

function App() {
  console.log("Izrenderovana app komponenta");
  const [pisci,setPisci]=useState([]);
  const [vrsteKancelarijskogMaterijala,setVrsteKancelarijskogMaterijala]=useState([]);
  const [proizvodi,setProizvodi]=useState([]);
  const[proizvodiUKorpi,setProizvodiUKorpi]=useState([]);
  const[kolicina,setKolicina]=useState(0);
  const[potvrdjenePorudzbine,setPotvrdjenePorudzbine]=useState([]);
  const[nepotvrdjenePorudzbine,setNeotvrdjenePorudzbine]=useState([]);
    const[discountedTotal,setDiscountedTotal]=useState(0);
    const[svePorudzbine,setSvePorudzbine]=useState([]);
  

  const[silver,setSilver]=useState([]);
  const[gold,setGold]=useState([]);

  console.log(window.sessionStorage.token);

  const[ulogovani,setUlogovani]=useState();
  const[tokenData,setTokenData]=useState({});
  const[update,setUpdate]=useState(false);
  // O

 console.log(ulogovani);
  const[renderAll,setRenderAll]=useState(false);

 


  useEffect(() => {
    if (window.location.pathname === '/change-password' || window.location.pathname==='/setup-password') {
      // Ako jeste, nemoj izvršavati ostatak koda
      return;
    }
    const savedPath = localStorage.getItem('currentPath');
    if (savedPath) {
      //  navigate(savedPath);  //!MORA GA VRATIS
    }
}, []);

useEffect(() => {
  if (window.location.pathname === '/change-password' || window.location.pathname==='/setup-password') {
    // Ako jeste, nemoj izvršavati ostatak koda
    return;
  }
   // localStorage.setItem('currentPath', window.location.pathname);
}, [window.location.pathname]);


  useEffect(() => {
   updateTokenData();
  }, []); 

 function  updateTokenData(){
  const token = window.sessionStorage.getItem('token'); // Učitaj token iz sessionStorage

  if (token) {
    console.log("postoji");
    try {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken); // Ovdje možeš videti sve podatke iz tokena
      console.log(decodedToken.firstName);
      setTokenData(decodedToken);
      if(!decodedToken.iss || !decodedToken.firstName || !decodedToken.lastName || !decodedToken.brojTelefona || !decodedToken.id){
        console.log("1");
        logoutBezZahteva();
      }
      if(!decodedToken.tipAdmina &&  !decodedToken.tipKupca){
        console.log("2");
        logoutBezZahteva();
      }
      if(decodedToken.tipKupca && (!decodedToken.datumRodjenja)){
        console.log("3");
        logoutBezZahteva();
      }
      if(decodedToken.tipAdmina && (!decodedToken.datumZaposlenja)){
        console.log("4");
        logoutBezZahteva();
      }
      if(decodedToken.datumRodjenja){
        decodedToken.datumRodjenja=formatDateToSQL(decodedToken.datumRodjenja);
        setTokenData(decodedToken);
        console.log(decodedToken);
      }
    } catch (error) {
      console.error("Invalid token", error);
       
    //  logoutBezZahteva(); // Pozovi funkciju za logout ako je token nevalidan
    }
  } else {
    console.log("ne postoji");
   // logoutBezZahteva(); // Pozovi funkciju za logout ako token ne postoji
   setTokenData({});
  }
  }


  function formatDateToSQL(dateString) {
    // Razdvajanje stringa u delove
    let dateParts = dateString.split(' ');
    
    // Parsiranje meseca
    const months = {
        Jan: '01', Feb: '02', Mar: '03', Apr: '04',
        May: '05', Jun: '06', Jul: '07', Aug: '08',
        Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    let month = months[dateParts[1]];  // "Aug" -> "08"
    
    // Parsiranje dana
    let day = dateParts[2].padStart(2, '0');  // "1" -> "01"
    
    // Godina
    let year = dateParts[dateParts.length - 1];  // "2024"
    
    // Formira format "YYYY-MM-DD 00:00:00.0"
    let formattedDate = `${year}-${month}-${day} 00:00:00.0`;
    
    return formattedDate;
}


  let navigate=useNavigate();

  function addToken(user,token) {
    console.log(user);


  // alert("System cant update order");
    

try {
    const decodedToken = jwtDecode(token);
    console.log(decodedToken); // Ovdje možeš videti sve podatke iz tokena
    console.log(decodedToken.firstName);
    setTokenData(decodedToken);
} catch (error) {
    console.error("Invalid token", error);
    logoutBezZahteva();
}



    window.sessionStorage.setItem(
      "token",
      token
    );
    // window.sessionStorage.setItem(
    //   "id",
    //   user.id
    // );
    // window.sessionStorage.setItem(
    //   "user",
    //    JSON.stringify(user),
      
    // );
    if(user.tipKupca){
      window.sessionStorage.setItem(
        "kolicina",
         0,
        
      );
      window.sessionStorage.setItem(
        "proizvodiUKorpi",
         JSON.stringify([]),
        
      );
    }
    
    
    setUlogovani(user);
    
    navigate("/myprofile");
    console.log("doslo do ovde");
    
   
  }

  const logout = async () => {
     const formData=new FormData();
     formData.append("vrednostTokena",window.sessionStorage.token);
    try{
      const response=await axios.post('http://localhost:8080/api/auth/logout',{"vrednostTokena":window.sessionStorage.token}, {
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
       //'Authorization': window.sessionStorage.getItem('token'),
        //    'Content-Type': 'multipart/form-data'
        }
    });
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('user');
    window.sessionStorage.removeItem('id');
    window.sessionStorage.removeItem("kolicina");
    window.sessionStorage.removeItem("proizvodiUKorpi");
    setTokenData({});
    removeAllFromCart();
  
    setUlogovani()

     navigate('/login');

    }catch(error){
      console.log(error);
      if (error.response.status === 401) {
        // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
         console.error('Unauthorized access - token may be invalid or expired.');
        // setMessage('Your session has expired. We will logout you after 2 seconds.');
        removeAllFromCart();
             logoutBezZahteva();
         
    }
    }
    
//    axios.post('http://localhost:8080/api/auth/logout',{vrednostTokena:window.sessionStorage.token},{
//     headers: {
//       'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
//    //'Authorization': window.sessionStorage.getItem('token'),
//         'Content-Type': 'multipart/form-data'
//     }
// })
//       .then((response)=>{
    
//     }).catch((error)=>{
      
//     });
  }
  function logoutBezZahteva(){
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('user');
    window.sessionStorage.removeItem('id');
    window.sessionStorage.removeItem("proizvodiUKorpi");
    window.sessionStorage.removeItem("kolicina");
    setTokenData({});
  
    removeAllFromCart();
    setUlogovani()

     navigate('/login');
     
  }

  function azurirajProizvode(){
    axios.get('/api/public/proizvodi')
    .then((response) => {
      console.log(response);
       setProizvodi(response.data);
    })
    .catch((e) => {
        console.log(e);
    });
  }

  const addToCart = (proizvod) => {
    console.log('Dodaj u korpu:', proizvod);
    
    // Povećaj ukupnu količinu proizvoda u korpi
    setKolicina(kolicina => kolicina + 1);
    const kol = JSON.parse(window.sessionStorage.kolicina) + 1;
    window.sessionStorage.setItem("kolicina", kol);
  
    // Učitaj trenutni niz proizvoda iz sessionStorage
    const existingProizvodi = JSON.parse(window.sessionStorage.getItem("proizvodiUKorpi")) || [];

    // Proveri da li proizvod već postoji u korpi
    const existingProizvod = existingProizvodi.find(item => item.proizvod.id === proizvod.id);
    
    let updatedProizvodi;
    
    if (existingProizvod) {
        // Ako proizvod već postoji, samo povećaj količinu
        updatedProizvodi = existingProizvodi.map(item =>
            item.proizvod.id === proizvod.id
                ? { ...item, kolicina: item.kolicina + 1 }
                : item
        );
    } else {
        // Ako proizvod ne postoji, dodaj ga u niz sa početnom količinom 1
        updatedProizvodi = [
            ...existingProizvodi,
            {
                proizvod,   // Originalni proizvod objekat
                id: null,   // Inicijalni id postavljen na null
                porudzbina: null, // Inicijalno porudzbina postavljena na null
                kolicina: 1, // Početna količina 1
                cena: 0     // Inicijalna cena postavljena na 0 (možeš promeniti prema potrebi)
            }
        ];
    }
    
    // Sačuvaj ažurirani niz u sessionStorage
    window.sessionStorage.setItem("proizvodiUKorpi", JSON.stringify(updatedProizvodi));

    // Ažuriraj stanje u React
    setProizvodiUKorpi(updatedProizvodi);
};

const removeFromCart = (id) => {
  setKolicina(kolicina => kolicina - 1);
  const kol = JSON.parse(window.sessionStorage.kolicina) - 1;
  window.sessionStorage.setItem("kolicina", kol);

  // Učitaj trenutni niz proizvoda iz sessionStorage
  const existingProizvodi = JSON.parse(window.sessionStorage.getItem("proizvodiUKorpi")) || [];

  // Ažuriraj proizvode u korpi
  const updatedProizvodi = existingProizvodi.map(item => {
      if (item.proizvod.id === id) {
          // Ako se ID poklapa, smanji količinu
          const updatedProizvod = { ...item, kolicina: item.kolicina - 1 };
          
          // Ako količina postane 0, vrati null za uklanjanje
          return updatedProizvod.kolicina > 0 ? updatedProizvod : null;
      }
      // Ako ID ne odgovara, vrati proizvod nepromenjen
      return item;
  });

  // Filtriraj proizvode da ukloni null vrednosti (one sa količinom 0)
  const finalProizvodi = updatedProizvodi.filter(item => item !== null);

  // Sačuvaj ažurirani niz u sessionStorage
  window.sessionStorage.setItem("proizvodiUKorpi", JSON.stringify(finalProizvodi));

  // Ažuriraj stanje u React
  setProizvodiUKorpi(finalProizvodi);
};

  const removeAllFromCart=()=>{
    setProizvodiUKorpi([]);
    setKolicina(0);
//    const kol=JSON.parse(window.sessionStorage.kolicina)-JSON.parse(window.sessionStorage.kolicina);
    window.sessionStorage.setItem(
      "kolicina",
       0
      
    );
    window.sessionStorage.setItem(
      "proizvodiUKorpi",
       JSON.stringify([])
      
    );
  }

  
 function azurirajPorudzbine(){
    axios.get('/api/public/porudzbine/unprocessed')
    .then((response) => {
      console.log(response);
       setPotvrdjenePorudzbine(response.data);
    })
    .catch((e) => {
        console.log(e);
    });

    axios.get('/api/public/porudzbine/pending')
    .then((response) => {
      console.log(response);
       setNeotvrdjenePorudzbine(response.data);
    })
    .catch((e) => {
        console.log(e);
    });

    axios.get('/api/public/porudzbine/all')
    .then((response) => {
      console.log(response);
       setSvePorudzbine(response.data);
    })
    .catch((e) => {
        console.log(e);
    });
  }




  useEffect(() => {
    axios.get('/api/public/pisci')
        .then((response) => {
          console.log(response);
           setPisci(response.data);
        })
        .catch((e) => {
            console.log(e);
        });


        axios.get('/api/public/proizvodi/vrsteKancelarijskogMaterijala')
        .then((response) => {
          console.log(response);
           setVrsteKancelarijskogMaterijala(response.data);
        })
        .catch((e) => {
            console.log(e);
        });


        axios.get('/api/public/proizvodi')
        .then((response) => {
       //   console.log(response);
           setProizvodi(response.data);
        })
        .catch((e) => {
            console.log(e);
        });

        // // axios.get('/api/public/porudzbine/unprocessed')
        // // .then((response) => {
        // // //  console.log(response);
        // //    setPotvrdjenePorudzbine(response.data);
        // // })
        // .catch((e) => {
        //     console.log(e);
        // });

        axios.get('/api/public/porudzbine/pending')
        .then((response) => {
        //  console.log(response);
           setNeotvrdjenePorudzbine(response.data);
        })
        .catch((e) => {
            console.log(e);
        });

        axios.get('/api/public/porudzbine/all')
        .then((response) => {
          console.log(response);
           setSvePorudzbine(response.data);
        })
        .catch((e) => {
            console.log(e);
        });

        // axios.get('/api/users/silver')
        // .then((response) => {
        //   console.log(response);
        //    setSilver(response.data);
        // })
        // .catch((e) => {
        //     console.log(e);
        // });

        // axios.get('/api/users/gold')
        // .then((response) => {
        //   console.log(response);
        //    setGold(response.data);
        // })
        // .catch((e) => {
        //     console.log(e);
        // });
}, []); // Prazna zavisnost znači da će se useEffect izvršiti samo jednom nakon inicijalnog rendera
  

   

//  function updateSilverGold(){
//   axios.get('/api/users/silver')
//   .then((response) => {
//     console.log(response);
//      setSilver(response.data);
//   })
//   .catch((e) => {
//       console.log(e);
//   });

//   axios.get('/api/users/gold')
//   .then((response) => {
//     console.log(response);
//      setGold(response.data);
//   })
//   .catch((e) => {
//       console.log(e);
//   });
//  }



console.log(tokenData);

const initialOptions = {
  clientId: 'AbsVLL81eaaS0aZ2ktMjuIjJkqCJbcVnyuIHUpTyVIJ5z00SDUMYbSbRG4SmNniUhzD2q9XdY65BTeM8', // Zameni sa svojim PayPal Client ID
  currency: 'USD',
};

function startPayment(discountedTotal){
  console.log(discountedTotal);
  
    const totalAmount=proizvodiUKorpi.reduce((sum, el) => sum + el.proizvod.cena * el.kolicina, 0)
  

  let discount = 0;
  if (tokenData.tipKupca === 'GOLD') {
    discount = (totalAmount * 20) / 100;
  } else if (tokenData.tipKupca === 'SILVER') {
    discount = (totalAmount * 10) / 100;
  }
  setDiscountedTotal(totalAmount - discount);
  
    console.log("plati");
       {/* <PayPalButton azurirajProizvode={azurirajProizvode} azurirajPorudzbine={azurirajPorudzbine}   key={discountedTotal} discountedTotal={discountedTotal} pomocna={pomocna} tokenData={tokenData} removeAllFromCart={removeAllFromCart}/> */}
  navigate("/payment");
}


  if (!tokenData.id) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage addToken={addToken} />} />
        <Route path="/change-password" element={<PasswordUtilPage view={2} />} />
        <Route path="/setup-password" element={<PasswordUtilPage view={1} />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
     /*if(ulogovani['tipUsera']=="NOTREGISTERED"){
      <Routes>
   
     
     
      <Route path='/' element={<FinishRegistration/>}>
 
        
        <Route path="*" element={<Navigate to="/" />} />
        
      </Route>
   
   
   </Routes>
 
     }else{*/
     if(tokenData.tipAdmina=="HIGHADMIN"){
  return (
   <Routes>
   
     
     
      {/* <Route path='/' element={<NavBar tokenData={tokenData} logout={logout}/>}> */}
        {/* <Route path="/myprofile" element={<><NavBar tokenData={tokenData} logout={logout}/><MyProfile setUlogovani={setUlogovani}  tokenData={tokenData} updateTokenData={updateTokenData} logoutBezZahteva={logoutBezZahteva}/></>}/> */}
        {/* <Route path="/promoteuser" element={<><NavBar tokenData={tokenData} logout={logout}/><PromoteUser silver={silver} gold={gold} updateSilverGold={updateSilverGold} logoutBezZahteva={logoutBezZahteva}/></>}/> */}
        <Route path="/nepotvrdjeneporudzbine" element={<><NavBar tokenData={tokenData} logout={logout}/><Porudzbine tokenData={tokenData} logoutBezZahteva={logoutBezZahteva} pogled={1} svePorudzbine={svePorudzbine} azurirajPorudzbine={azurirajPorudzbine}/></>}/>
        {/* <Route path="/potvrdjeneporudzbine" element={<><NavBar tokenData={tokenData} logout={logout}/><Porudzbine tokenData={tokenData} logoutBezZahteva={logoutBezZahteva} pogled={2} porudzbine={potvrdjenePorudzbine} azurirajPorudzbine={azurirajPorudzbine}/></>}/> */}
        <Route path="/addproizvod" element={<><NavBar tokenData={tokenData} logout={logout}/><AddProizvodPage pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode} logoutBezZahteva={logoutBezZahteva}/></>}/>
        <Route path="/products/knjige" element={<><NavBar tokenData={tokenData} logout={logout}/><Pomocna /><Knjige   tokenData={tokenData} proizvodi={proizvodi} pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode}  logoutBezZahteva={logoutBezZahteva}/></>}/>
        <Route path="/products/kancelarijskiProizvodi"  element={<><NavBar tokenData={tokenData} logout={logout}/><Pomocna /><KancelarijskiProizvodi  tokenData={tokenData} proizvodi={proizvodi} pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode}  logoutBezZahteva={logoutBezZahteva} /></>}/>
        <Route path="*" element={<Navigate to="/addproizvod" />} />
        
      {/* </Route> */}
   
   
   </Routes>
 
  );
}

if( tokenData.tipAdmina=="LOWADMIN"){
  return (
   <Routes>
   
     
     
      {/* <Route path='/' element={<NavBar tokenData={tokenData} logout={logout}/>}> */}
        {/* <Route path="/myprofile" element={<><NavBar tokenData={tokenData} logout={logout}/><MyProfile setUlogovani={setUlogovani} tokenData={tokenData}  updateTokenData={updateTokenData}  logoutBezZahteva={logoutBezZahteva}/></>}/> */}
        {/* <Route path="/promoteuser" element={<><NavBar tokenData={tokenData} logout={logout}/><PromoteUser silver={silver} gold={gold}  updateSilverGold={updateSilverGold} logoutBezZahteva={logoutBezZahteva}/></>}/> */}
        {/* <Route path="/nepotvrdjeneporudzbine" element={<Porudzbine logoutBezZahteva={logoutBezZahteva} pogled={1} porudzbine={nepotvrdjenePorudzbine} azurirajPorudzbine={azurirajPorudzbine}/>}/>
        <Route path="/potvrdjeneporudzbine" element={<Porudzbine logoutBezZahteva={logoutBezZahteva} pogled={2} porudzbine={potvrdjenePorudzbine} azurirajPorudzbine={azurirajPorudzbine}/>}/> */}
        <Route path="/addproizvod" element={<><NavBar tokenData={tokenData} logout={logout}/><AddProizvodPage pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode} logoutBezZahteva={logoutBezZahteva}/></>}/>
        <Route path="/products/knjige" element={<><NavBar tokenData={tokenData} logout={logout}/><Pomocna /><Knjige   tokenData={tokenData} proizvodi={proizvodi} pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode}  logoutBezZahteva={logoutBezZahteva}/></>}/>
        <Route path="/products/kancelarijskiProizvodi"  element={<><NavBar tokenData={tokenData} logout={logout}/><Pomocna /><KancelarijskiProizvodi  tokenData={tokenData} proizvodi={proizvodi} pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode}  logoutBezZahteva={logoutBezZahteva} /></>}/>
        <Route path="*" element={<Navigate to="/addproizvod" />} />
        
      {/* </Route> */}
   
   
   </Routes>
 
  );
}




  if(tokenData.tipKupca){
  return (
  <Routes>
   
     
     
  {/* <Route path='/' element={<NavBar tokenData={tokenData} kolicina={JSON.parse(window.sessionStorage.kolicina)} logout={logout}/>}> */}
  <Route path="/myprofile" element={<><NavBar tokenData={tokenData} kolicina={JSON.parse(window.sessionStorage.kolicina)} logout={logout}/><MyProfile   tokenData={tokenData} updateTokenData={updateTokenData}  x={ulogovani} setUlogovani={setUlogovani} logoutBezZahteva={logoutBezZahteva}/></>}/>
    <Route path="/products/knjige" element={<><NavBar tokenData={tokenData} kolicina={JSON.parse(window.sessionStorage.kolicina)} logout={logout}/><Pomocna /><Knjige  tokenData={tokenData} addToCart={addToCart} proizvodiUKorpi={proizvodiUKorpi} setProizvodiUKorpi={setProizvodiUKorpi}  proizvodi={proizvodi} pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode}  logoutBezZahteva={logoutBezZahteva}/></>}/>
    <Route path="/products/kancelarijskiProizvodi" element={<><NavBar tokenData={tokenData} kolicina={JSON.parse(window.sessionStorage.kolicina)} logout={logout}/><Pomocna /><KancelarijskiProizvodi  tokenData={tokenData} addToCart={addToCart} proizvodiUKorpi={proizvodiUKorpi} setProizvodiUKorpi={setProizvodiUKorpi}  proizvodi={proizvodi} pisci={pisci} vrsteKancelarijskogMaterijala={vrsteKancelarijskogMaterijala} azurirajProizvode={azurirajProizvode}  logoutBezZahteva={logoutBezZahteva} /></>}/>
    <Route path="/cart" element={<><NavBar tokenData={tokenData} kolicina={JSON.parse(window.sessionStorage.kolicina)} logout={logout}/> <Cart startPayment={startPayment} tokenData={tokenData} proizvodiUKorpi={JSON.parse(window.sessionStorage.proizvodiUKorpi)} removeFromCart={removeFromCart} removeAllFromCart={removeAllFromCart} logoutBezZahteva={logoutBezZahteva} azurirajPorudzbine={azurirajPorudzbine} azurirajProizvode={azurirajProizvode}/></>}/> 
   <Route path="/payment" element={<Payment azurirajProizvode={azurirajProizvode} azurirajPorudzbine={azurirajPorudzbine}  removeAllFromCart={removeAllFromCart} tokenData={tokenData}/>}/>
    <Route path="*" element={<Navigate to="/myprofile" />} />
    
   
    
  {/* </Route> */}


</Routes> 
  );
}
}

   // }


export default App;
