import React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';

function RegisterPage() {
  const[clickedRegister,setClickedRegister]=useState(false);

 
   const[successRegister,setSuccessRegister]=useState(false);
   
 
   const[messageRegister,setMessageRegister]=useState("");

   const[errorsRegister,setErrorsRegister]=useState({});
   
   const [error, setError] = useState('');
 
   // Validacija email adrese
   
  



    function handleInput(e) {
        let newUserData = userData;
        newUserData[e.target.name] = e.target.value;
        

        setUserData(newUserData);

      //  console.log(userData);
      }

    const [userData, setUserData] = useState({
        email: "",
        firstName:"",
        lastName:"",
        datumRodjenja:"",
        brojTelefona:"",
        
      });

      
   
   


    let navigate = useNavigate();


    const validateData = (data) => {
      let tempErrors = {};
  if (!data.email) tempErrors.email = 'Email is required';
  if (!data.firstName) tempErrors.firstName = 'FirstName is required';
  // if (!data.file) tempErrors.file = 'File is required';
  if (!data.lastName) tempErrors.lastName = 'LastName is required';
  if (!data.datumRodjenja) tempErrors.datumRodjenja = 'Date of birth is required';
  if (!data.brojTelefona) tempErrors.brojTelefona = 'Phone number is required';
 
  return tempErrors;
  };


    function validateEmail(email) {
      // Regularni izraz za proveru validnosti email adrese
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      // Provera da li email odgovara regularnom izrazu
      return emailRegex.test(email);
    }

    function validateSerbianMobileNumber(phoneNumber) {
      // Regularni izraz za srpske mobilne brojeve (10 cifara, počinje sa 06X)
      const mobileRegex = /^06[0-9]\d{7}$/;
    
      // Provera da li broj telefona odgovara regularnom izrazu
      return mobileRegex.test(phoneNumber);
    }

    function handleRegister(e) {
        console.log(e);
        

      

    e.preventDefault();
    const validationErrors = validateData(userData);
    if (Object.keys(validationErrors).length > 0) {
        setErrorsRegister(validationErrors);
        setClickedRegister(true);
        setSuccessRegister(false);
        setMessageRegister("");
        return;
    }
    setErrorsRegister({});


        if (!validateEmail(userData.email)) {
         setMessageRegister('Invalid email');
         setClickedRegister(true);
         setSuccessRegister(false);
         return;
          // Ovde možeš dodati kod za dalje procesiranje email adrese
          
        } 
        if(!validateSerbianMobileNumber(userData.brojTelefona)){
          setMessageRegister('Invalid phone number');
          setClickedRegister(true);
          setSuccessRegister(false);
          return;
        }




        
            
       axios
          .post("api/auth/register", userData)
          .then((response) => {  
           console.log(response);
           console.log(response.data.message);

          setClickedRegister(true);
          setSuccessRegister(true);
          setMessageRegister(response.data);

          
         

          })
          .catch((error) => {  
            console.log(error);
            setClickedRegister(true);
            setSuccessRegister(false);
            setMessageRegister(error.response.data);
          });
        
      


        }
        const styles = {
          button: {
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3498db',
            color: '#fff',
            transition: 'background-color 0.3s',
            marginRight: '10px'
        },
        }
        
        


  return (
    <section className="vh-100" >
  <div className="container h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-lg-12 col-xl-11">
        <div className="card text-black" style={{borderRadius: "25px"}}> 
          <div className="card-body p-md-5">
            <div className="row justify-content-center">
              <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                <form  onSubmit={(e)=>{handleRegister(e)}}  className="mx-1 mx-md-4">

                 

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="text" id="form3Example3c" className="form-control" name="email" onInput={(e)=>handleInput(e)} />
                      {errorsRegister.email && <Form.Text className="text-danger">{errorsRegister.email} <br></br></Form.Text>}
                      <label className="form-label" htmlFor="form3Example3c">Your Email</label>
                      
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="text" id="form3Example3c" className="form-control" name="firstName" onInput={(e)=>handleInput(e)} />
                      {errorsRegister.firstName && <Form.Text className="text-danger">{errorsRegister.firstName} <br></br></Form.Text>}
                      <label className="form-label" htmlFor="form3Example3c">First Name</label>
                      
                    </div>
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="text" id="form3Example3c" className="form-control" name="lastName" onInput={(e)=>handleInput(e)} />
                      {errorsRegister.lastName && <Form.Text className="text-danger">{errorsRegister.lastName} <br></br></Form.Text>}
                      <label className="form-label" htmlFor="form3Example3c">Last Name</label>
                      
                    </div>
                  </div>


                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="date" id="form3Example3c" className="form-control" name="datumRodjenja" onInput={(e)=>handleInput(e)} />
                      {errorsRegister.datumRodjenja && <Form.Text className="text-danger">{errorsRegister.datumRodjenja} <br></br></Form.Text>}
                      <label className="form-label" htmlFor="form3Example3c">Date of birth</label>
                      
                    </div>
                  </div>



                  <div className="d-flex flex-row align-items-center mb-4">
                    <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                    <div className="form-outline flex-fill mb-0">
                      <input type="text" id="form3Example3c" className="form-control" name="brojTelefona" onInput={(e)=>handleInput(e)} />
                      {errorsRegister.brojTelefona && <Form.Text className="text-danger">{errorsRegister.brojTelefona} <br></br></Form.Text>}
                      <label className="form-label" htmlFor="form3Example3c">Phone number</label>
                      
                    </div>
                  </div>
                 

                  

                  

                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                 
                  <button type="submit" style={styles.button} >Register</button>

<Link to="/login">
  <button type="submit" style={styles.button}>Back to Login</button>
</Link>
                   
                    
                  </div>


                  <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                 
                  {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}
                    {clickedRegister && (
        <label style={{ color: successRegister ? 'green' : 'red', fontSize: '14px', marginTop: '5px' }}>
       {messageRegister}
       </label> 
       )}
                 
               </div>




                </form>

              </div>
              <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

               
                  <img src="https://th.bing.com/th/id/OIP.dXGkobjHDXDBmSwW6E1C7wHaE8?rs=1&pid=ImgDetMain"
                  className="img-fluid" alt="Sample image"/> 

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}

export default RegisterPage