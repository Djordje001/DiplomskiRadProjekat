import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';
import { type } from '@testing-library/user-event/dist/type';

const styles = {
  container: {
      padding: '20px',
     
  },
  formsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '50px'
  },
  cardWrapper: {
      flex: '1',
      minWidth: '0',
      maxWidth: '25%'
  },
  card: {
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      padding: '15px',
      height: '100%'
  },
  textarea: {
      resize: 'none',
      width: '100%'
  },
  checkboxContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
  },
  button: {
      marginTop: '10px',
      width:"100%"
  }
};

const ProizvodiContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;  // Ovo osigurava da sadržaj bude raspoređen duž glavne ose
  align-items: center;
  padding: 20px;
  min-height: 100vh;  // Osigurava da ProizvodiContainer uvek zauzima minimalno visinu celog viewport-a
  width: 100%;
`;

const ProizvodiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const Naslov = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const ProizvodCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  width: 100%;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ProizvodImg = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ProizvodBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const ProizvodTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
`;

const ProizvodInfo = styled.p`
  margin: 4px 0;
  font-size: 14px;
  color: #666;
`;

const ProizvodButtons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: auto;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  color: #fff;
  background: ${props => props.primary ? '#007bff' : '#dc3545'};
  margin-bottom: 10px;
  transition: background 0.3s;
  
  &:hover {
    background: ${props => props.primary ? '#0056b3' : '#c82333'};
  }
`;

const PaginationContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-bottom: 25px; // Malo dodatnog prostora
  margin-top: auto;  // Ovo gura paginaciju na dno ako ima prostora
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: ${props => props.disabled ? '#f5f5f5' : props.active ? '#0056b3' : '#007bff'};
  color: ${props => props.disabled ? '#aaa' : props.active ? '#fff' : '#fff'};
  
  &:hover {
    background: ${props => !props.disabled && !props.active ? '#0056b3' : ''};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h2`
  margin: 0 0 20px;
  font-size: 20px;
  color: #333;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  color: #fff;
  background-color: ${props => props.primary ? '#007bff' : '#dc3545'};
  
  &:hover {
    background-color: ${props => props.primary ? '#0056b3' : '#c82333'};
  }
`;

function Knjige({ proizvodi, azurirajProizvode ,pisci,logoutBezZahteva,proizvodiUKorpi,setProizvodiUKorpi,addToCart,tokenData }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    axios.get('/api/public/proizvodi/find?naziv='+searchTerm)
    .then((response) => {
      console.log(response);
      const filtered = response.data.filter(p => p.autori);
      setFilteredProizvodi(filtered);
       
    })
    .catch((e) => {
        console.log(e);
    });
  };


  const[clickedKnjiga,setClickedKnjiga]=useState(false);
 
   
  const[successKnjiga,setSuccessKnjiga]=useState(false);


  const[messageKnjiga,setMessageKnjiga]=useState("");

  const[errorsKnjiga,setErrorsKnjiga]=useState({});




  const [kancelarijskiProizvodi, setKancelarijskiProizvodi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [proizvodiPerPage] = useState(6);
  const [filteredProizvodi, setFilteredProizvodi] = useState([]);
  const [modalState, setModalState] = useState({
    showDeleteModal: false,
    showUpdateModal: false,
    selectedProizvod: null,
    formData: {
      naziv: '',
      cena: '',
      kolicina:'',
      opis: '',
      izdanje:'',
      file:null,
    }
  });

  const validateKnjiga = (data) => {
//     let tempErrors = {};
// if (!data.naziv) tempErrors.naziv = 'Name is required';
// if (!data.cena || isNaN(data.cena)) tempErrors.cena = 'Price must be a number';
// //if (!data.file) tempErrors.file = 'File is required';
// if(!data.kolicina || isNaN(data.kolicina)) tempErrors.kolicina="Quantity must be a number";
// if (!data.izdanje || isNaN(data.izdanje)) tempErrors.izdanje = 'Edition must be a number';
// if (!data.opis) tempErrors.opis = 'Description is required';
// return tempErrors;


let tempErrors = {};
if (!data.naziv) tempErrors.naziv = 'Name is required';
if (!data.cena || isNaN(data.cena) || data.cena<=0) tempErrors.cena = 'Price must be a positive number';
if(!data.kolicina || isNaN(data.kolicina)  || !Number.isInteger(parseFloat(data.kolicina)) ||  data.kolicina<0) tempErrors.kolicina="Quantity must be a whole number,and cant be lower than zero";

if (!data.izdanje || isNaN(data.izdanje) || data.izdanje<=0 || !Number.isInteger(parseFloat(data.izdanje))) tempErrors.izdanje = 'Edition must be a whole positive number';
if (!data.opis) tempErrors.opis = 'Description is required';
return tempErrors;
};




  useEffect(() => {
    const filtered = proizvodi.filter(p => p.autori);
    setFilteredProizvodi(filtered);
    setKancelarijskiProizvodi(filtered);
  }, [proizvodi]);

  const indexOfLastProizvod = currentPage * proizvodiPerPage;
  const indexOfFirstProizvod = indexOfLastProizvod - proizvodiPerPage;
  const currentProizvodi = filteredProizvodi.slice(indexOfFirstProizvod, indexOfLastProizvod);
  const totalPages = Math.ceil(filteredProizvodi.length / proizvodiPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const openDeleteModal = (proizvod) => {
    setModalState({
      ...modalState,
      showDeleteModal: true,
      selectedProizvod: proizvod
    });
  };

  const closeDeleteModal = () => {
    setModalState({ ...modalState, showDeleteModal: false });
};

  const handleDelete = async () => {

    closeDeleteModal();




    try {
      const response=await axios.delete(`/api/proizvodi/${modalState.selectedProizvod.id}`, {
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        },
      });
      azurirajProizvode();
      setModalState({ ...modalState, showDeleteModal: false, selectedProizvod: null });
      
      alert(response.data);
      //alert("Succesfully deleted book");
    } catch (error) {
    
      console.log(error);
          if (error.response.status === 401) {
            alert('Your session has expired. We will logout you.');
            logoutBezZahteva();
          
        }else{
          alert(error.response.data);
        }
  };
}

  const openUpdateModal = (proizvod) => {
    setMessageKnjiga("");
    setModalState({
      ...modalState,
      showUpdateModal: true,
      selectedProizvod: proizvod,
      formData: {
        file:null,
        naziv: proizvod.naziv,
        cena: proizvod.cena,
        kolicina:proizvod.kolicina,
        opis:proizvod.opis,
        izdanje:proizvod.izdanje,
        pisciJson: proizvod.autori.map(autor => autor.pisac.id)

      }
    });
  };

  function handleUpdate(e) {
    e.preventDefault();
    const validationErrors = validateKnjiga(modalState.formData);
    if (Object.keys(validationErrors).length > 0) {
        setErrorsKnjiga(validationErrors);
        setClickedKnjiga(false);
        setMessageKnjiga("");
        return;
    }
   
    setErrorsKnjiga({});
    console.log(modalState.formData);
    //treba da mi od modalState.formData.pisciJson niz pisaca napravis json reprezentaciju niza u kome se nalaze samo id pisaca
    const pisciJson= JSON.stringify(modalState.formData.pisciJson);
    console.log(pisciJson);

     // Ažuriramo stanje
     const newFormData = {
      ...modalState.formData,
      pisci: pisciJson
  };
  

      if(!modalState.formData.file){
      console.log("bez slike");
     console.log(`/api/proizvodi/knjiga/${modalState.selectedProizvod.id}`);
    axios.post(`/api/proizvodi/knjiga/${modalState.selectedProizvod.id}`, newFormData,{
      headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
            'Content-Type': 'multipart/form-data'
          
      }
  })
      .then((response)=>{
        azurirajProizvode();
      //  setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null });

        setClickedKnjiga(true);
          setMessageKnjiga(response.data.message);
          setSuccessKnjiga(true);
          setTimeout(() => {
            setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null });
        }, 2000);
       // alert("Succesfully updated book");
    }).catch((error)=>{
      console.log(error);
      setClickedKnjiga(true);
      
      setSuccessKnjiga(false);
      if (error.response.status === 401) {
        // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
         console.error('Unauthorized access - token may be invalid or expired.');
        // setMessage('Your session has expired. We will logout you after 2 seconds.');
        setMessageKnjiga("Your session has expired. We will logout you after 2 seconds.");
         setTimeout(() => {
             logoutBezZahteva();
         }, 2000);
    }else{
      setMessageKnjiga(error.response.data.message);
    }
      
    });
   
  }
  if(modalState.formData.file){
    axios.post(`/api/proizvodi/knjiga/${modalState.selectedProizvod.id}`, newFormData,{
      headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
      }
  })
      .then((response)=>{
        azurirajProizvode();
       // setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null });
        setClickedKnjiga(true);
          setMessageKnjiga(response.data.message);
          setSuccessKnjiga(true);
          setTimeout(() => {
            setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null });
        }, 2000);
      //  alert("Succesfully updated book");
    }).catch((error)=>{
      console.log(error);
      setClickedKnjiga(true);
      
      setSuccessKnjiga(false);
      if (error.response.status === 401) {
        // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
         console.error('Unauthorized access - token may be invalid or expired.');
        // setMessage('Your session has expired. We will logout you after 2 seconds.');
        setMessageKnjiga("Your session has expired. We will logout you after 2 seconds.");
         setTimeout(() => {
             logoutBezZahteva();
         }, 2000);
    }else{
      setMessageKnjiga(error.response.data.message);
    }
    });
}

      
    
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    if (type === 'file') {
      // Handle file input
      setModalState({
        ...modalState,
        formData: {
          ...modalState.formData,
          [name]: files[0] // Assuming single file upload
        }
      });
    } else {
      // Handle text input
      setModalState({
        ...modalState,
        formData: {
          ...modalState.formData,
          [name]: value
        }
      });
    }
  };


  const handlePisciChange = (e) => {
    const { value, checked } = e.target;
    console.log(typeof value);
     console.log(e.target.value);
     console.log(modalState.formData.pisciJson);
    setModalState(prevState => {
      let updatedPisci = [...prevState.formData.pisciJson];
      const pomocna = Number(value);
      if (checked) {
        // Add pisac to array
        if (!updatedPisci.includes(pomocna)) {
          updatedPisci.push(pomocna);
        }
      } else {
        // Remove pisac from array
        updatedPisci = updatedPisci.filter(pisac => pisac !== pomocna);
      }
  
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          pisciJson: updatedPisci
        }
      };
    });
  };

  




  return (
    <ProizvodiContainer>
      <div style={{ padding: "20px" }}>
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
            width: "1000px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: '#3498db',
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      </div>



   
      <ProizvodiGrid>
        {currentProizvodi.map(proizvod => (
          <ProizvodCard key={proizvod.id}>
            <ProizvodImg src={proizvod.url} alt={proizvod.naziv} />
            <ProizvodBody>
              <ProizvodTitle>Name: {proizvod.naziv}</ProizvodTitle>
              <ProizvodInfo>Price: {proizvod.cena} EUR</ProizvodInfo>
              {tokenData.tipAdmina && (
               <ProizvodInfo>Quantity: {proizvod.kolicina}</ProizvodInfo>
            )}
              
              <ProizvodInfo>Description: {proizvod.opis} </ProizvodInfo>
              <ProizvodInfo>Edition: {proizvod.izdanje} </ProizvodInfo>
              <ProizvodInfo>
  Autors: {proizvod.autori.map(autor => autor.pisac.ime + ' ' + autor.pisac.prezime).join(', ')}
</ProizvodInfo>

              
              
              <ProizvodButtons>
              {tokenData.tipAdmina && (
        <>
          <Button  onClick={() => openUpdateModal(proizvod)} style={{ backgroundColor: '#3498db' }}>Change</Button>
          <Button onClick={() => openDeleteModal(proizvod)}>Delete</Button>
        </>
      )}
      {tokenData.tipKupca && proizvod.kolicina > 0 && (
    <>
        {/* Dugmići specifični za kupce */}
        <Button 
            primary 
            style={{ 
                backgroundColor:'#3498db',
                color: '#fff', 
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
            }} 
            onClick={() => addToCart(proizvod)}
            // onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            // onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
            Add to cart
        </Button>
    </>
)}

{tokenData.tipKupca && proizvod.kolicina <= 0 && (
    <>
        {/* Onemogućeno dugme i poruka */}
        <Button 
            primary 
            disabled 
            style={{ 
                backgroundColor: '#cccccc', 
                color: '#666666', 
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'not-allowed',
                opacity: 0.6
            }}
        >
           Currently out of stock
        </Button>
        {/* <p style={{ 
            color: '#ff0000', 
            fontWeight: 'bold',
            marginTop: '10px'
        }}>
            This product is currently out of stock
        </p> */}
    </>
)}
              </ProizvodButtons>
            </ProizvodBody>
          </ProizvodCard>
        ))}
      </ProizvodiGrid>

      {/* <PaginationContainer>
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PaginationButton>
        {[...Array(totalPages)].map((_, index) => (
          <PaginationButton
            key={index}
            onClick={() => handlePageChange(index + 1)}
            active={currentPage === index + 1}
          >
            {index + 1}
          </PaginationButton>
        ))}
        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PaginationButton>
      </PaginationContainer> */}


      <div
        className="pagination-controls"
        style={{
          width: '70%',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          display: 'flex',
          justifyContent: 'center',
          borderTop: '1px solid #ddd',
          marginTop:'25px',
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
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





      {modalState.showDeleteModal && (
  <ModalOverlay>
    <Modal>
      <ModalTitle>Confirm Deletion</ModalTitle>
      <p>Are you sure you want to delete the product "{modalState.selectedProizvod.naziv}"?</p>
      <ModalActions>
        <ModalButton style={{backgroundColor:'#3498db'}} onClick={handleDelete}>Confirm</ModalButton>
        <ModalButton onClick={() => setModalState({ ...modalState, showDeleteModal: false })}>Cancel</ModalButton>
      </ModalActions>
    </Modal>
  </ModalOverlay>
)}

{modalState.showUpdateModal && (
  <ModalOverlay>
    <Modal>
      <ModalTitle>Update Book</ModalTitle>
      <Form>
        <Form.Group controlId="formFileKnjiga">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="file" onChange={(e) => handleChange(e)} />
          {errorsKnjiga.file && <Form.Text className="text-danger">{errorsKnjiga.file}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="formNazivKnjiga">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="naziv" placeholder="Name" value={modalState.formData.naziv} onChange={(e) => handleChange(e)} />
          {errorsKnjiga.naziv && <Form.Text className="text-danger">{errorsKnjiga.naziv}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="formCenaKnjiga">
          <Form.Label>Price(EUR)</Form.Label>
          <Form.Control type="text" name="cena" placeholder="Price"  value={modalState.formData.cena} onChange={(e) => handleChange(e)} />
          {errorsKnjiga.cena && <Form.Text className="text-danger">{errorsKnjiga.cena}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="formCenaKnjiga">
          <Form.Label>Quantity</Form.Label>
          <Form.Control type="text" name="kolicina" placeholder="Quantity" value={modalState.formData.kolicina} onChange={(e) => handleChange(e)} />
          {errorsKnjiga.kolicina && <Form.Text className="text-danger">{errorsKnjiga.kolicina}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="formIzdanjeKnjiga">
          <Form.Label>Edition</Form.Label>
          <Form.Control type="text" name="izdanje" placeholder="Edition"value={modalState.formData.izdanje} onChange={(e) => handleChange(e)} />
          {errorsKnjiga.izdanje && <Form.Text className="text-danger">{errorsKnjiga.izdanje}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="formOpisKnjiga">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="opis" placeholder="Description" value={modalState.formData.opis} onChange={(e) => handleChange(e)} style={styles.textarea} />
          {errorsKnjiga.opis && <Form.Text className="text-danger">{errorsKnjiga.opis}</Form.Text>}
        </Form.Group>

        <Form.Group controlId="formPisciKnjiga">
          <Form.Label>Authors</Form.Label>
          <div style={styles.checkboxContainer} onChange={handlePisciChange}>
            {pisci.map((pisac) => (
              <Form.Check
                key={pisac.id}
                type="checkbox"
                id={`pisac-${pisac.id}`}
                label={`${pisac.ime} ${pisac.prezime}`}
                value={pisac.id}
                checked={modalState.formData.pisciJson.some(id => id === pisac.id)}
              />
            ))}
          </div>
        </Form.Group>
        <ModalActions>
          <ModalButton style={{backgroundColor:'#3498db'}} onClick={(e) => handleUpdate(e)}>Update</ModalButton>
          <ModalButton onClick={() => setModalState({ ...modalState, showUpdateModal: false })}>Cancel</ModalButton>
          {clickedKnjiga && (
        <label style={{ color: successKnjiga ? 'green' : 'red', fontSize: '14px', marginTop: '5px' }}>
       {messageKnjiga}
       </label> 
       )}
        </ModalActions>
      </Form>
    </Modal>
  </ModalOverlay>
)}


      
    </ProizvodiContainer>
  );
}


export default Knjige;

