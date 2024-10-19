/*import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function Porudzbine({ porudzbine, azurirajPorudzbine, pogled, logoutBezZahteva,tokenData }) {
  const [poruke, setPoruke] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedPorudzbina, setSelectedPorudzbina] = useState(null);
  const [pitalica, setPitalica] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Ograničavamo na 3 porudžbine po stranici

  // Calculate the index of the first and last item for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Slice the array to get the items for the current page
  const currentPorudzbine = porudzbine.slice(indexOfFirstItem, indexOfLastItem);

  // Calculate the total number of pages
  const totalPages = Math.ceil(porudzbine.length / itemsPerPage);

  const handlePorukaChange = (porudzbinaId, e) => {
    setPoruke({
      ...poruke,
      [porudzbinaId]: e.target.value
    });
  };

  const handleAction = (action, porudzbina) => {
    setSelectedAction(() => action);
    setSelectedPorudzbina(porudzbina);
    if (action === process) {
      setPitalica("Are you sure that you want to mark as processed this order?");
    }
    if (action === accept) {
      setPitalica("Are you sure that you want to accept this order?");
    }
    if (action === reject) {
      setPitalica("Are you sure that you want to reject this order?");
    }
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedAction && selectedPorudzbina) {
      selectedAction(selectedPorudzbina);
    }
    setShowModal(false);
  };

  function process(porudzbina) {
    setShowModal(false);
    axios.put(`/api/porudzbine/process/${porudzbina.id}/${tokenData.id}`, null, {
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
      }
    })
      .then((response) => {
        azurirajPorudzbine();
        setPitalica("");
        alert(response.data);
      }).catch((error) => {
        setPitalica("");
        console.log(error);
        if (error.response.status === 401) {
          console.error('Unauthorized access - token may be invalid or expired.');
          alert('Unauthorized access - token may be invalid or expired. We will logout you.');
          logoutBezZahteva();
        } else {
          alert(error.response.data);
        }
      });
  }

  function accept(porudzbina) {
    setShowModal(false);
    axios.put(`/api/porudzbine/rejectOrProcess/${porudzbina.id}/${tokenData.id}?prihvacena=true`, null, {
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
      }
    })
      .then((response) => {
        azurirajPorudzbine();
        setPitalica("");
        alert(response.data);
      }).catch((error) => {
        console.log(error);
        setPitalica("");
        if (error.response.status === 401) {
          console.error('Unauthorized access - token may be invalid or expired.');
          alert('Unauthorized access - token may be invalid or expired. We will logout you.');
          logoutBezZahteva();
        } else {
          alert(error.response.data);
        }
      });
  }

  function reject(porudzbina) {
    setShowModal(false);
    console.log(poruke[porudzbina.id]);

    setTimeout(() => {
      axios.put(`/api/porudzbine/rejectOrProcess/${porudzbina.id}/${tokenData.id}?prihvacena=false&poruka=` + poruke[porudzbina.id], null, {
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        }
      })
      .then((response) => {
        azurirajPorudzbine();
        setPitalica("");
        alert(response.data);
      }).catch((error) => {
        console.log(error);
        setPitalica("");
        if (error.response.status === 401) {
          console.error('Unauthorized access - token may be invalid or expired.');
          alert('Unauthorized access - token may be invalid or expired. We will logout you.');
          logoutBezZahteva();
        } else {
          alert(error.response.data);
        }
      });
    }, 5);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mt-5" style={{ minHeight: '100vh', paddingBottom: '50px' ,}}>
      {currentPorudzbine.map((porudzbina) => (
        <div
          key={porudzbina.id}
          className="card mb-4 shadow-lg"
          style={{
            width: '80%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '10px',
            border: '1px solid #ddd',
            overflow: 'hidden'
          }}
        >
          <div className="card-body" style={{ width: '100%' }}>
          <p className="card-text" style={{ marginBottom: '0.5rem' }}>
              <strong>Order id:</strong> {porudzbina.id}
            </p>
            <p className="card-text" style={{ marginBottom: '0.5rem' }}>
              <strong>Customer fullName:</strong> {porudzbina.fullName}
            </p>
            <p className="card-text" style={{ marginBottom: '0.5rem' }}>
              <strong>Customer Email:</strong> {porudzbina.email}
            </p>
            <p className="card-text" style={{ marginBottom: '0.5rem' }}>
              <strong>Customer Phone number:</strong> {porudzbina.phoneNumber}
            </p>
            <p className="card-text" style={{ marginBottom: '0.5rem' }}>
              <strong>Address:</strong> {porudzbina.adresa}
            </p>
            <p className="card-text" style={{ marginBottom: '0.5rem' }}>
              <strong>Products:</strong>{' '}
              {porudzbina.stavkePorudzbine.map((stavka, index) => (
                <span key={stavka.id}>
                  {stavka.proizvod? stavka.proizvod.naziv : "deleted product"} ({stavka.kolicina} pcs)
                  {index < porudzbina.stavkePorudzbine.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
            {/* <p className="card-text" style={{ marginBottom: '1rem' }}>
              <strong>Desired Delivery Date:</strong> {new Date(porudzbina.datumIsporuke).toLocaleDateString('en-US')}
            </p> }

            {pogled === 1 && (
              <>
                <p className="card-text" style={{ marginBottom: '1rem' }}>
                  <strong>Order Creation Date:</strong> {new Date(porudzbina.datumVreme).toLocaleDateString('en-US')}
                </p>
                <div className="button-group" style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-success"
                    style={{ flex: 1, borderRadius: '5px' }}
                    onClick={() => handleAction(accept, porudzbina)}
                  >
                       Mark as Processed
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ flex: 1, borderRadius: '5px' }}
                    onClick={() => handleAction(reject, porudzbina)}
                  >
                    Reject
                  </button>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <textarea
                    placeholder="Reason for rejection"
                    value={poruke[porudzbina.id] || ""}
                    onChange={(e) => handlePorukaChange(porudzbina.id, e)}
                    style={{
                      width: '100%',
                      borderRadius: '5px',
                      border: '1px solid #ddd',
                      padding: '0.5rem',
                      resize: 'none'
                    }}
                  />
                </div>
              </>
            )}

            {pogled === 2 && (
              <div className="button-group" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, borderRadius: '5px' }}
                  onClick={() => handleAction(process, porudzbina)}
                >
                  Mark as Processed
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pagination Controls }
      <div
        className="pagination-controls"
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid #ddd',
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <button
          className="btn btn-secondary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} me-2`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn btn-secondary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{pitalica}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmAction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Porudzbine;*/




  
import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f4f4f4;
  border-bottom: 2px solid #ccc;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const Options = styled.div`
  display: flex;
  gap: 10px;
`;

const OptionLabel = styled.label`
  font-size: 16px;
  color: #555;
  margin-right:15px;
`;

const OptionInput = styled.input`
  margin-right: 5px;
`;


function Porudzbine({ svePorudzbine, azurirajPorudzbine, pogled, logoutBezZahteva, tokenData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [poruke, setPoruke] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedPorudzbina, setSelectedPorudzbina] = useState(null);
  const [pitalica, setPitalica] = useState("");
  const [porudzbine,setPorudzbine]=useState(svePorudzbine.filter(p => p.obradjena==false && p.rejectionMessage==null));

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Limiting to 3 orders per page

  // Calculate the index of the first and last item for the current page
 // const indexOfLastItem = currentPage * itemsPerPage;
 // const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const[indexOfLastItem,setIndexOfLastItem]=useState(currentPage * itemsPerPage);
  const [indexOfFirstItem,setIndexOfFirstItem]=useState(indexOfLastItem - itemsPerPage);

  // Slice the array to get the items for the current page
 // const currentPorudzbine = porudzbine.slice(indexOfFirstItem, indexOfLastItem);
  const[currentPorudzbine,setCurrentPorudzbine]=useState( porudzbine.slice(indexOfFirstItem, indexOfLastItem));

  // Calculate the total number of pages
 // const totalPages = Math.ceil(porudzbine.length / itemsPerPage);
  const [totalPages,setTotalPages]=useState(Math.ceil(porudzbine.length / itemsPerPage));


  const [selectedOption, setSelectedOption] = useState('pending'); // Default option
  const navigate = useNavigate();

  // Automatically navigate to the "Proizvodi" page on component load
//   useEffect(() => {
//     navigate('/products/knjige'); // Navigate to products page initially
//   }, []);


  useEffect(() => {
    let sve=svePorudzbine;
     let filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage==null);
    if(selectedOption=="pending"){
      filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage==null);
    }
    if(selectedOption=="rejected"){
      filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage!=null);
    }
    if(selectedOption=="processed"){
      filtered=sve.filter(p => p.obradjena==true );
    }
    setPorudzbine(filtered);
    setCurrentPorudzbine(filtered.slice(indexOfFirstItem, indexOfLastItem));
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
//    const savedPath = localStorage.getItem('currentPath');
//      if (savedPath) {
//         if(savedPath=="/products/knjige"){
//             setSelectedOption("proizvodi");
//             navigate("/products/knjige");
//             return;
//        } if(savedPath=="/products/kancelarijskiProizvodi"){
//             setSelectedOption("kancelarijski-materijal");
//             navigate("/products/kancelarijskiProizvodi");
//             return;
//         }else{
//             setSelectedOption("proizvodi");
//             navigate("/products/knjige");
//         }
//         // navigate(savedPath);  //!MORA GA VRATIS
//      }
 }, [svePorudzbine]);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOption(value);
    setSearchTerm("");
     console.log(value);
     let sve=svePorudzbine;
     let filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage==null);
    if(value=="pending"){
      filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage==null);
    }
    if(value=="rejected"){
      filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage!=null);
    }
    if(value=="processed"){
      filtered=sve.filter(p => p.obradjena==true );
    }
    setPorudzbine(filtered);
     setCurrentPorudzbine(filtered.slice(0, 3));
     setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
     
  };




  useEffect(() => {
    // const filtered = porudzbine.filter(p => p.vrstaKancelarijskogProizvoda);
    // setFilteredProizvodi(filtered);
    // setKancelarijskiProizvodi(filtered);
  }, [porudzbine]);


  const handlePorukaChange = (porudzbinaId, e) => {
    setPoruke({
      ...poruke,
      [porudzbinaId]: e.target.value
    });
  };

  const handleAction = (action, porudzbina) => {
    setSelectedAction(() => action);
    setSelectedPorudzbina(porudzbina);
    if (action === process) {
      setPitalica("Are you sure that you want to mark as processed this order?");
    }
    if (action === accept) {
      setPitalica("Are you sure that you want to accept this order?");
    }
    if (action === reject) {
      setPitalica("Are you sure that you want to reject this order?");
    }
    setShowModal(true);
  };

  const confirmAction = () => {
    if (selectedAction && selectedPorudzbina) {
      selectedAction(selectedPorudzbina);
    }
    setShowModal(false);
  };

  function process(porudzbina) {
    setShowModal(false);
    axios.put(`/api/porudzbine/process/${porudzbina.id}`, null, {
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
      }
    })
      .then((response) => {
        azurirajPorudzbine();
        setPitalica("");
        alert(response.data);
      }).catch((error) => {
        setPitalica("");
        console.log(error);
        if (error.response.status === 401) {
          console.error('Unauthorized access - token may be invalid or expired.');
          alert('Unauthorized access - token may be invalid or expired. We will logout you.');
          logoutBezZahteva();
        } else {
          alert(error.response.data);
        }
      });
  }

  function accept(porudzbina) {
    setShowModal(false);
    axios.put(`/api/porudzbine/rejectOrProcess/${porudzbina.id}?prihvacena=true`, null, {
      headers: {
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
      }
    })
      .then((response) => {
        azurirajPorudzbine();
        setPitalica("");
        alert(response.data);
      }).catch((error) => {
        console.log(error);
        setPitalica("");
        if (error.response.status === 401) {
          console.error('Unauthorized access - token may be invalid or expired.');
          alert('Unauthorized access - token may be invalid or expired. We will logout you.');
          logoutBezZahteva();
        } else {
          alert(error.response.data);
        } 
      });
  }

  function reject(porudzbina) {
    setShowModal(false);
    console.log(poruke[porudzbina.id]);

    setTimeout(() => {
      axios.put(`/api/porudzbine/rejectOrProcess/${porudzbina.id}?prihvacena=false&poruka=` + poruke[porudzbina.id], null, {
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        }
      })
      .then((response) => {
        azurirajPorudzbine();
        setPitalica("");
        alert(response.data);
      }).catch((error) => {
        console.log(error);
        setPitalica("");
        if (error.response.status === 401) {
          console.error('Unauthorized access - token may be invalid or expired.');
          alert('Unauthorized access - token may be invalid or expired. We will logout you.');
          logoutBezZahteva();
        } else {
          alert(error.response.data);
        }
      });
    }, 5);
  }

  const handlePageChange = (pageNumber) => {
 //   const[indexOfLastItem,setIndexOfLastItem]=useState(currentPage * itemsPerPage);
  //  const [indexOfFirstItem,setIndexOfFirstItem]=useState(indexOfLastItem - itemsPerPage);
    setCurrentPage(pageNumber);

    setIndexOfLastItem(pageNumber*itemsPerPage);
    setIndexOfFirstItem((pageNumber * itemsPerPage)-itemsPerPage);
    setCurrentPorudzbine(porudzbine.slice(((pageNumber * itemsPerPage)-itemsPerPage),pageNumber*itemsPerPage));




    

    //const[currentPorudzbine,setCurrentPorudzbine]=useState( porudzbine.slice(indexOfFirstItem, indexOfLastItem));
  };



  const handleSearch = () => {
    axios.get('/api/public/porudzbine/find?email='+searchTerm)
    .then((response) => {
      console.log(response);
      const sve = response.data;


    
      let filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage==null);
     if(selectedOption=="pending"){
       filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage==null);
     }
     if(selectedOption=="rejected"){
       filtered=sve.filter(p => p.obradjena==false && p.rejectionMessage!=null);
     }
     if(selectedOption=="processed"){
       filtered=sve.filter(p => p.obradjena==true );
     }
     //setPorudzbine(filtered);
     // setKancelarijskiProizvodi(filtered);
      //setFilteredProizvodi(filtered);
    //  setCurrentPorudzbine(filtered.slice(indexOfFirstItem, indexOfLastItem));
    //setTotalPages(Math.ceil(filtered.length / itemsPerPage));




    setPorudzbine(filtered);
     setCurrentPorudzbine(filtered.slice(0, 3));
     setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
       
    })
    .catch((e) => {
        console.log(e);
    });
  };

  return (
    <div>
       <HeaderContainer>
      <Title>Orders</Title>
      <Options>
        <OptionLabel>
          <OptionInput
            type="radio"
            name="filter"
            value="pending"
            checked={selectedOption === 'pending'}
            onChange={handleOptionChange}
          />
          Pending
        </OptionLabel>
        <OptionLabel>
          <OptionInput
            type="radio"
            name="filter"
            value="rejected"
            checked={selectedOption === 'rejected'}
            onChange={handleOptionChange}
          />
          Rejected
        </OptionLabel>

        <OptionLabel>
          <OptionInput
            type="radio"
            name="filter"
            value="processed"
            checked={selectedOption === 'processed'}
            onChange={handleOptionChange}
          />
          Processed 
        </OptionLabel>
      </Options>
    </HeaderContainer>
    <div
      className="container mt-5 d-flex flex-column"
      style={{ minHeight: '100vh', paddingBottom: '50px', justifyContent: 'space-between' }}
    >
       <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
            width: "1300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor:'#3498db',
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      <div style={{ flexGrow: 1 }}>
        {currentPorudzbine.map((porudzbina) => (
          <div
            key={porudzbina.id}
            className="card mb-4 shadow-lg"
            style={{
              width: '80%',
              minHeight: '200px',  // Postavlja minimalnu visinu kartica
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '10px',
              border: '1px solid #ddd',
              padding: '5px',
            }}
          >
            <div className="card-body" style={{ width: '100%' }}>
              <p className="card-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Order id:</strong> {porudzbina.id}
              </p>
              <p className="card-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Customer fullName:</strong> {porudzbina.fullName}
              </p>
              <p className="card-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Customer Email:</strong> {porudzbina.email}
              </p>
              <p className="card-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Customer Phone number:</strong> {porudzbina.phoneNumber}
              </p>
              <p className="card-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Address:</strong> {porudzbina.adresa}
              </p>
              <p className="card-text" style={{ marginBottom: '0.5rem' }}>
                <strong>Products:</strong>{' '}
                {porudzbina.stavkePorudzbine.map((stavka, index) => (
                  <span key={stavka.id}>
                    {stavka.proizvod ? stavka.proizvod.naziv : 'deleted product'} ({stavka.kolicina} pcs)
                    {index < porudzbina.stavkePorudzbine.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
              
                <>
                  <p className="card-text" style={{ marginBottom: '1rem' }}>
                    <strong>Order Creation Date:</strong> {new Date(porudzbina.datumVreme).toLocaleDateString('en-US')}
                  </p>
                  {porudzbina.obradjena==true ? <>
                    <p className="card-text" style={{ marginBottom: '1rem' }}>
                    <strong>Approver:</strong> {porudzbina.approver.firstName +" "+porudzbina.approver.lastName}
                  </p>
                  </> :
                  <></>}

 
                  {porudzbina.prihvacena==false && porudzbina.rejectionMessage!=null ? <>
                    <p className="card-text" style={{ marginBottom: '1rem' }}>
                    <strong>Approver:</strong> {porudzbina.approver.firstName +" "+porudzbina.approver.lastName}
                  </p>
                  <p className="card-text" style={{ marginBottom: '1rem' }}>
                    <strong>Rejection message:</strong> {porudzbina.rejectionMessage}
                  </p>
                  </> :
                  <></>}


                  {!(porudzbina.obradjena==true || (porudzbina.prihvacena==false && porudzbina.rejectionMessage!=null)) ? <>

                    

                  <div className="button-group" style={{ display: 'flex', gap: '0.5rem' }}>

                   
                    <button
                      className="btn btn-success"
                      style={{ flex: 1, borderRadius: '5px' ,backgroundColor: '#3498db'}}
                      
                      onClick={() => handleAction(accept, porudzbina)}
                    >
                      Mark as Processed
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ flex: 1, borderRadius: '5px' }}
                      onClick={() => handleAction(reject, porudzbina)}
                    >
                      Reject
                    </button>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <textarea
                      placeholder="Reason for rejection"
                      value={poruke[porudzbina.id] || ''}
                      onChange={(e) => handlePorukaChange(porudzbina.id, e)}
                      style={{
                        width: '100%',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        padding: '0.5rem',
                        resize: 'none',
                      }}
                    />
                  </div>
                  </> : <></>}


                </>
            
  
              {pogled === 2 && (
                <div className="button-group" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: '5px' }}
                    onClick={() => handleAction(process, porudzbina)}
                  >
                    Mark as Processed
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
  
      {/* Pagination Controls */}
      <div
        className="pagination-controls"
        style={{
          width: '100%',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid #ddd',
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
          marginTop:'35px'
        }}
      >
        <button
          className="btn btn-secondary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'} me-2`}
            style={currentPage === index + 1 ? { backgroundColor: '#3498db' } : {}}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="btn btn-secondary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
  
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{pitalica}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button style={{backgroundColor: '#3498db'}} onClick={confirmAction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
  
}


export default Porudzbine;


