import React from 'react'
import { useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom';






import { useNavigate } from 'react-router-dom';
import { Modal, Form, Button } from 'react-bootstrap';

function LoginPage({addToken}) {
  let navigate=useNavigate();
  const[emailForReset,setEmailForReset]=useState("");
    const [userData, setUserData] = useState({
        email: "",
        password: "",
      });


  //  const[uspesno,setUspesno]=useState(true);
  const[clickedLogin,setClickedLogin]=useState(false);
  const[clickedReset,setClickedReset]=useState(false);

 
  const[successLogin,setSuccessLogin]=useState(false);
  const[successReset,setSuccessReset]=useState(false);
  

  const[messageLogin,setMessageLogin]=useState("");
  const[messageReset,setMessageReset]=useState("");


  const [error, setError] = useState('');
  const[errorReset,setErrorReset]=useState('');


    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {

      
      setModalIsOpen(true);
      //setUspesno(true);

    }

    const closeModal = () => {

      setClickedReset(false);
      setMessageReset("");
      setSuccessReset(false);
     // setUspesno(true);
      setModalIsOpen(false);
    //  setUserData(currentData => ({ ...currentData, email: '' }));
    setEmailForReset("");
    }

    const handleForgotPassword = () => {
      if (!validateEmail(emailForReset)) {
        setMessageReset("Invalid email");
        setSuccessReset(false);
        setClickedReset(true);
        return;
      } 
      setMessageReset("");


      axios
      .post("api/auth/request-password-change", { email: emailForReset }) // Replace with the actual endpoint for password reset
      .then((response) => {
           console.log(response);
           setClickedReset(true);
           setSuccessReset(true);
           setMessageReset(response.data)
           setTimeout(() => {
            closeModal();
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
        setClickedReset(true);
           setSuccessReset(false);
           setMessageReset(error.response.data)

          
      })
      .finally(() => {
        // Close the modal after handling
       // closeModal();
      });
    
    };


      function handleInput(e) {
       
        let newUserData = userData;
        
        newUserData[e.target.name] = e.target.value;
        
       
        setUserData(newUserData);
      }


      function validateEmail(email) {
        // Regularni izraz za proveru validnosti email adrese
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        // Provera da li email odgovara regularnom izrazu
        return emailRegex.test(email);
      }
      

      function handleLogin(e) {
        e.preventDefault();

        if(userData['email']=="" || userData['password']==""){
          setMessageLogin("You need to set your email and password");
          setSuccessLogin(false);
          setClickedLogin(true);
          return;
        }
        if (!validateEmail(userData['email'])) {
          setMessageLogin("Invalid email");
          setSuccessLogin(false);
          setClickedLogin(true);
          return;
        } 
        setError("");
         
       axios
          .post("api/auth/login", userData)
          .then((response) => {   
            console.log(response);
            setClickedLogin(true);
            setSuccessLogin(true);
            setMessageLogin(response.data.poruka);



            addToken(response.data.user,response.data.token);
            
          })
          .catch((error) => { 
           // setUspesno(false);
           console.log(error.response.data.poruka);
           setClickedLogin(true);
           setSuccessLogin(false);
           setMessageLogin(error.response.data.poruka);
            
          });
      }
      
      const buttonStyles = {
        backgroundColor: '#98FB98',
        color: '#000000',
        fontSize: '20px',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin:'10px',
    };

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
    },
    }
    


  return (
    <section className="h-100 gradient-form" style={{
  //    backgroundColor: 'rgba(52, 152, 219, 0.5)' ,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh', // Obezbeđuje da se stranica proteže do punog viewport-a
    }}>
  <div  className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-xl-10">
        <div className="card rounded-5 text-black">
          <div  className="row g-0">
          

            <div >
              <div className="card-body p-md-5 mx-md-4">

                <div className="text-center">
                  
                    <img src="https://th.bing.com/th/id/OIP.VVOgqpFQdlBXUxREdquNxAHaEJ?w=328&h=184&c=7&r=0&o=5&dpr=1.5&pid=1.7"
                    style={{width: "185px",alt:"logo"}}/> 
                  <h4 className="mt-1 mb-5 pb-1">Welcome to our online store</h4>
                </div>

                <form onSubmit={handleLogin}>
                  <p>Please login to your account</p>

                  <div className="form-outline mb-4">
                    <input type="text" id="form2Example11" className="form-control"
                      placeholder="email address"  name="email"   onInput={(e)=>handleInput(e)}/>
                    <label className="form-label" htmlFor="form2Example11">Email</label>
                  </div>

                  <div className="form-outline mb-4">
                    <input   placeholder="password" type="password" id="form2Example22" className="form-control"  name='password' onInput={(e)=>handleInput(e)}/>
                    <label className="form-label" htmlFor="form2Example22">Password</label>
                  </div>

                  <button type="button" style={styles.button} onClick={openModal}>Forgot Password?</button>

                                        {/* Modal for "Forgot Password"*/ }
                                        <Modal show={modalIsOpen} onHide={closeModal}>
                                          <Modal.Header closeButton>
                                            <Modal.Title>Forgot Password</Modal.Title>
                                          </Modal.Header>
                                          <Modal.Body>
                                            {/* Include form elements for the "Forgot Password" functionality */}
                                            {/* For example, an email input */}
                                            <Form.Group className="mb-4">
                                              <Form.Control type="text" placeholder="Enter your email" name="email"   onInput={(e)=>setEmailForReset(e.target.value)} />
                                            </Form.Group>
                                          </Modal.Body>
                                          <Modal.Footer>
                                            <Button style={styles.button} onClick={handleForgotPassword}>
                                              Reset Password
                                            </Button>
                                            <Button variant="secondary" onClick={closeModal}>
                                              Close
                                            </Button>

                                            <div className="d-flex align-items-center justify-content-center pb-4">
                 
                 {/* {errorReset && <p style={{ color: 'red' }}>{errorReset}</p>}*/ }
              {clickedReset && (
  <label style={{ color: successReset ? 'green' : 'red', fontSize: '14px', marginTop: '5px' }}>
 {messageReset}
 </label> 
 )}
           
         </div>
                                          </Modal.Footer>
                                        </Modal>

                  <div className="text-center pt-1 mb-5 pb-1">
                  <button
  type="submit"
    // Podesite širinu na 100%
  style={styles.button}
>
  Log in
</button>
                      </div>
                      <div className="d-flex align-items-center justify-content-center pb-4">
                 
                      {/* {error && <p style={{ color: 'red' }}>{error}</p>}*/ }
                   {clickedLogin && (
       <label style={{ color: successLogin ? 'green' : 'red', fontSize: '14px', marginTop: '5px' }}>
      {messageLogin}
      </label> 
      )}
                
              </div>
                 
                   
                    
                  

                  <div className="d-flex align-items-center justify-content-center pb-4">
                    <p className="mb-0 me-2">Don't have an account?</p>
                    <button type="button" className="btn btn-outline-danger">
                      <Link to="/register" className="nav-link">
                Create new
                </Link></button>
                  </div>

                </form>

              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
              <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                <h4 className="mb-4">We are more than just a company</h4>
                <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}

export default LoginPage






