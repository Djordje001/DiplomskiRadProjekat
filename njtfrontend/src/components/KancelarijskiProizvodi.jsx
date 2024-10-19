import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';

const styles = {
  container: {
      padding: '20px'
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
  grid-template-columns: repeat(3, 1fr); // Fiksan broj kolona (3 kolone po redu)
  gap: 20px;
  width: 100%;
  max-width: 1200px;

  
`;

const EmptyCard = styled.div`
  visibility: hidden; // Nevidljive kartice (placeholderi) popunjavaju prazan prostor
  height: 0;
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

function KancelarijskiProizvodi({ proizvodi, azurirajProizvode, vrsteKancelarijskogMaterijala,logoutBezZahteva,proizvodiUKorpi,setProizvodiUKorpi ,addToCart,tokenData}) {
  const [searchTerm, setSearchTerm] = useState("");

 
  const[clickedKM,setClickedKM]=useState(false);
 
   
   const[successKM,setSuccessKM]=useState(false);
 
 
   const[messageKM,setMessageKM]=useState("");

   const[errorsKM,setErrorsKM]=useState({});


  const handleSearch = () => {
    axios.get('/api/public/proizvodi/find?naziv='+searchTerm)
    .then((response) => {
      console.log(response);
      const filtered = response.data.filter(p => p.vrstaKancelarijskogProizvoda);
      setKancelarijskiProizvodi(filtered);
      setFilteredProizvodi(filtered);
       
    })
    .catch((e) => {
        console.log(e);
    });
  };


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
      visina: '',
      sirina: '',
      duzina: '',
      proizvodjac: '',
      vrstaKancelarijskogProizvoda: '',
      file: null,
    }
  });
  

const validateKM = (data) => {
//     let tempErrors = {};
// if (!data.naziv) tempErrors.naziv = 'Name is required';
// if (!data.cena || isNaN(data.cena)) tempErrors.cena = 'Price must be a number';
// // if (!data.file) tempErrors.file = 'File is required';
// if(!data.kolicina || isNaN(data.kolicina)) tempErrors.kolicina="Quantity must be a number";
// if (!data.duzina || isNaN(data.duzina)) tempErrors.duzina = 'Length must be a number';
// if (!data.visina || isNaN(data.visina)) tempErrors.visina = 'Height must be a number';
// if (!data.sirina || isNaN(data.sirina)) tempErrors.sirina = 'Width must be a number';
// if (!data.proizvodjac) tempErrors.proizvodjac = 'Manufacturer is required';
// if (!data.vrstaKancelarijskogProizvoda) tempErrors.vrstaKancelarijskogProizvoda = 'Type of office product is required';
// return tempErrors;

let tempErrors = {};
if (!data.naziv) tempErrors.naziv = 'Name is required';
if (!data.cena || isNaN(data.cena) || data.cena<=0) tempErrors.cena = 'Price must be a positive number';
if(!data.kolicina || isNaN(data.kolicina)  || !Number.isInteger(parseFloat(data.kolicina)) ||  data.kolicina<0) tempErrors.kolicina="Quantity must be a whole number,and cant be lower than zero";

if (!data.duzina || isNaN(data.duzina) || data.duzina<=0) tempErrors.duzina = 'Length must be a positive number';
if (!data.visina || isNaN(data.visina) || data.visina<=0) tempErrors.visina = 'Height must be a positive number';
if (!data.sirina || isNaN(data.sirina) || data.sirina<=0) tempErrors.sirina = 'Width must be a positive number';
if (!data.proizvodjac) tempErrors.proizvodjac = 'Manufacturer is required';
if (!data.vrstaKancelarijskogProizvoda) tempErrors.vrstaKancelarijskogProizvoda = 'Type of office product is required';
return tempErrors;
};




  useEffect(() => {
    const filtered = proizvodi.filter(p => p.vrstaKancelarijskogProizvoda);
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
    } catch (error) {
      console.log(error);
          if (error.response.status === 401) {
            alert('Your session has expired. We will logout you.');
           
                 logoutBezZahteva();
           
        }else{
          alert(error.response.data);
        }
    }
  };

  const openUpdateModal = (proizvod) => {
    setMessageKM("");
    setModalState({
      ...modalState,
      showUpdateModal: true,
      selectedProizvod: proizvod,
      formData: {
        file: null,
        naziv: proizvod.naziv,
        cena: proizvod.cena,
        kolicina:proizvod.kolicina,
        vrstaKancelarijskogProizvoda: proizvod.vrstaKancelarijskogProizvoda,
        visina: proizvod.visina,
        sirina: proizvod.sirina,
        duzina: proizvod.duzina,
        proizvodjac: proizvod.proizvodjac,
      }
    });
  };

  function handleUpdate(e) {
    e.preventDefault();

    e.preventDefault();
    const validationErrors = validateKM(modalState.formData);
    if (Object.keys(validationErrors).length > 0) {
        setErrorsKM(validationErrors);
        setClickedKM(false);
        setMessageKM("");
        return;
    }
    setErrorsKM({});




    if (!modalState.formData.file) {
      axios.post(`/api/proizvodi/kancelarijski/${modalState.selectedProizvod.id}`, modalState.formData, {
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
           'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          azurirajProizvode();
          
          setClickedKM(true);
          setMessageKM(response.data.message);
          setSuccessKM(true);
          setTimeout(() => {
            setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null });
        }, 2000);
        })
        .catch((error)=>{
          console.log(error);
          setClickedKM(true);
          
          setSuccessKM(false);
          if (error.response.status === 401) {
            // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
             console.error('Unauthorized access - token may be invalid or expired.');
            // setMessage('Your session has expired. We will logout you after 2 seconds.');
            setMessageKM("Your session has expired. We will logout you after 2 seconds.");
             setTimeout(() => {
                 logoutBezZahteva();
             }, 2000);
        }else{
          setMessageKM(error.response.data.message);
        }
        });

    } else {
      const formData = new FormData();
      formData.append('file', modalState.formData.file);
      formData.append('naziv', modalState.formData.naziv);
      formData.append('cena', modalState.formData.cena);
      formData.append('vrstaKancelarijskogProizvoda', modalState.formData.vrstaKancelarijskogProizvoda);
      formData.append('visina', modalState.formData.visina);
      formData.append('sirina', modalState.formData.sirina);
      formData.append('duzina', modalState.formData.duzina);
      formData.append('proizvodjac', modalState.formData.proizvodjac);
      console.log(formData);

      axios.post(`/api/proizvodi/kancelarijski/${modalState.selectedProizvod.id}`,modalState.formData, {
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          azurirajProizvode();
          //setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null });
          setClickedKM(true);
          setMessageKM(response.data.message);
          setSuccessKM(true);
          setTimeout(() => {
            setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null });
        }, 2000);
        })
        .catch((error)=>{
          console.log(error);
          setClickedKM(true);
          //setMessageKM(error.response.data.message);
          setSuccessKM(false);
          if (error.response.status === 401) {
            // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
            setMessageKM("Your session has expired. We will logout you after 2 seconds.");
             console.error('Unauthorized access - token may be invalid or expired.');
            // setMessage('Your session has expired. We will logout you after 2 seconds.');
             setTimeout(() => {
                 logoutBezZahteva();
             }, 2000);
        }
        else{
          setMessageKM(error.response.data.message);
        }
        });
    }
  }

  const handleFileChange = (e) => {
    setModalState({
      ...modalState,
      formData: { ...modalState.formData, file: e.target.files[0] }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModalState({
      ...modalState,
      formData: { ...modalState.formData, [name]: value }
    });
  };

  const numEmptyCards = proizvodiPerPage - currentProizvodi.length;

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
              <ProizvodInfo>Type: {proizvod.vrstaKancelarijskogProizvoda}</ProizvodInfo>
              <ProizvodInfo>Manufacturer: {proizvod.proizvodjac}</ProizvodInfo>
              <ProizvodInfo>Dimensions: {proizvod.duzina} x {proizvod.sirina} x {proizvod.visina} cm</ProizvodInfo>
              <ProizvodButtons>
                {/* <Button primary onClick={() => openUpdateModal(proizvod)}>Izmeni</Button>
                <Button onClick={() => openDeleteModal(proizvod)}>Obriši</Button> */}


                {tokenData.tipAdmina && (
        <>
          <Button primary onClick={() => openUpdateModal(proizvod)} style={{ backgroundColor: '#3498db' }}>Change</Button>
          <Button onClick={() => openDeleteModal(proizvod)}>Delete</Button>
        </>
      )}
      
      {tokenData.tipKupca && proizvod.kolicina > 0 && (
    <>
        {/* Dugmići specifični za kupce */}
        <Button 
            
            style={{ 
                backgroundColor: '#3498db',
                color: '#fff', 
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
            }} 
            onClick={() => addToCart(proizvod)}
            // onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            // onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
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

{Array.from({ length: numEmptyCards }).map((_, index) => (
          <EmptyCard key={index} />
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
          boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
          marginTop:'25px'
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

      {/* Delete Modal */}
{modalState.showDeleteModal && (
  <ModalOverlay>
    <Modal>
      <ModalTitle>Delete Confirmation</ModalTitle>
      <p>Are you sure you want to delete the product "{modalState.selectedProizvod.naziv}"?</p>
      <ModalActions>
        <ModalButton style={{backgroundColor:'#3498db'}} onClick={handleDelete}>Confirm</ModalButton>
        <ModalButton onClick={() => setModalState({ ...modalState, showDeleteModal: false, selectedProizvod: null })}>Cancel</ModalButton>
      </ModalActions>
    </Modal>
  </ModalOverlay>
)}

     {/* Update Modal */}
{modalState.showUpdateModal && (
  <ModalOverlay>
    <Modal>
      <ModalTitle>Update Office Supply</ModalTitle>
      <Form onSubmit={handleUpdate}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="naziv"
            value={modalState.formData.naziv}
            onChange={handleChange}
          />
           {errorsKM.naziv && <Form.Text className="text-danger">{errorsKM.naziv}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Price(EUR)</Form.Label>
          <Form.Control
            type="text"
            name="cena"
            
            value={modalState.formData.cena}
            onChange={handleChange}
          />
           {errorsKM.cena && <Form.Text className="text-danger">{errorsKM.cena}</Form.Text>}
        </Form.Group>


        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="text"
            name="kolicina"
            
            value={modalState.formData.kolicina}
            onChange={handleChange}
          />
           {errorsKM.kolicina && <Form.Text className="text-danger">{errorsKM.kolicina}</Form.Text>}
        </Form.Group>
        


        <Form.Group>
          <Form.Label>Office Supply Type</Form.Label>
          <Form.Control
            as="select"
            name="vrstaKancelarijskogProizvoda"
            value={modalState.formData.vrstaKancelarijskogProizvoda}
            onChange={handleChange}
          >
            {vrsteKancelarijskogMaterijala.map(vrsta => (
              <option key={vrsta} value={vrsta}>{vrsta}</option>
            ))}

          </Form.Control>
          {errorsKM.vrstaKancelarijskogMaterijala && <Form.Text className="text-danger">{errorsKM.vrstaKancelarijskogMaterijala}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Height (cm)</Form.Label>
          <Form.Control
            type="text"
            name="visina"
             
            value={modalState.formData.visina}
            onChange={handleChange}
          />
           {errorsKM.visina && <Form.Text className="text-danger">{errorsKM.visina}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Width (cm)</Form.Label>
          <Form.Control
            type="text"
            name="sirina"
            
            value={modalState.formData.sirina}
            onChange={handleChange}
          />
           {errorsKM.sirina && <Form.Text className="text-danger">{errorsKM.sirina}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Length (cm)</Form.Label>
          <Form.Control
            type="text"
            name="duzina"
            
            value={modalState.formData.duzina}
            onChange={handleChange}
          />
           {errorsKM.duzina && <Form.Text className="text-danger">{errorsKM.duzina}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Manufacturer</Form.Label>
          <Form.Control
            type="text"
            name="proizvodjac"
            value={modalState.formData.proizvodjac}
            onChange={handleChange}
          />
           {errorsKM.proizvodjac && <Form.Text className="text-danger">{errorsKM.proizvodjac}</Form.Text>}
        </Form.Group>
        <Form.Group>
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
            {errorsKM.file && <Form.Text className="text-danger">{errorsKM.file}</Form.Text>}
        </Form.Group>
        <ModalActions>
          <ModalButton style={{backgroundColor:'#3498db'}} type="submit">Update</ModalButton>
          <ModalButton onClick={() => setModalState({ ...modalState, showUpdateModal: false, selectedProizvod: null })}>Cancel</ModalButton>
          {clickedKM && (
        <label style={{ color: successKM ? 'green' : 'red', fontSize: '14px', marginTop: '5px' }}>
       {messageKM}
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

export default KancelarijskiProizvodi;


/*
<ModalActions>
                <ModalButton primary onClick={handleUpdate}>Ažuriraj</ModalButton>
                <ModalButton onClick={() => setModalState({ ...modalState, showUpdateModal: false })}>Odustani</ModalButton>
              </ModalActions>*/