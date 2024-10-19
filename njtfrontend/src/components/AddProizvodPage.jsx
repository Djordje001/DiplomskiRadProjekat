import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button, Col } from 'react-bootstrap';

function AddProizvodPage({ pisci, vrsteKancelarijskogMaterijala,azurirajProizvode,logoutBezZahteva }) {

    const[clickedKnjiga,setClickedKnjiga]=useState(false);
    const[clickedKM,setClickedKM]=useState(false);
   
     const[successKnjiga,setSuccessKnjiga]=useState(false);
     const[successKM,setSuccessKM]=useState(false);
   
     const[messageKnjiga,setMessageKnjiga]=useState("");
     const[messageKM,setMessageKM]=useState("");


    // State za Knjiga formu
    const [knjigaData, setKnjigaData] = useState({
        file: null,
        naziv: '',
        cena: '',
        kolicina:'',
        izdanje: '',
        opis: '',
        pisciJson: []
    });

    // State za KancelarijskiProizvod formu
    const [kancelarijskiData, setKancelarijskiData] = useState({
        file: null,
        naziv: '',
        cena: '',
        kolicina:'',
        duzina: '',
        visina: '',
        sirina: '',
        proizvodjac: '',
        vrstaKancelarijskogProizvoda: ''
    });

    // State za validaciju
    const [errorsKnjiga, setErrorsKnjiga] = useState({});
    const[errorsKM,setErrorsKM]=useState({});

    // Promena file-a
    const handleFileChange = (e, form) => {
        const file = e.target.files[0];
        if (form === 'knjiga') {
            setKnjigaData({ ...knjigaData, file });
        } else {
            setKancelarijskiData({ ...kancelarijskiData, file });
        }
    };

    // Promena input polja
    const handleInputChange = (e, form) => {
        const { name, value } = e.target;
        if (form === 'knjiga') {
            setKnjigaData({ ...knjigaData, [name]: value });
        } else {
            setKancelarijskiData({ ...kancelarijskiData, [name]: value });
        }
    };

    const handlePisciChange = (e) => {
        const selectedPisac = e.target.value;
        const isChecked = e.target.checked;
    
        setKnjigaData(prevState => {
            let updatedPisci = [...prevState.pisciJson];
    
            if (isChecked) {
                // Dodaj pisca u niz
                if (!updatedPisci.includes(selectedPisac)) {
                    updatedPisci.push(selectedPisac);
                }
            } else {
                // Ukloni pisca iz niza
                updatedPisci = updatedPisci.filter(pisac => pisac !== selectedPisac);
            }
    
            return {
                ...prevState,
                pisciJson: updatedPisci
            };
        });
        
        console.log(e.target.value);
    };

    // Validacija forme
    const validateKnjiga = (data) => {
        let tempErrors = {};
if (!data.naziv) tempErrors.naziv = 'Name is required';
if (!data.cena || isNaN(data.cena) || data.cena<=0) tempErrors.cena = 'Price must be a positive number';
if(!data.kolicina || isNaN(data.kolicina)  || !Number.isInteger(parseFloat(data.kolicina)) ||  data.kolicina<0) tempErrors.kolicina="Quantity must be a whole number,and cant be lower than zero";
if (!data.file) tempErrors.file = 'File is required';
if (!data.izdanje || isNaN(data.izdanje) || data.izdanje<=0 || !Number.isInteger(parseFloat(data.izdanje))) tempErrors.izdanje = 'Edition must be a whole positive number';
if (!data.opis) tempErrors.opis = 'Description is required';
return tempErrors;
    };

    const validateKM = (data) => {
        let tempErrors = {};
if (!data.naziv) tempErrors.naziv = 'Name is required';
if (!data.cena || isNaN(data.cena) || data.cena<=0) tempErrors.cena = 'Price must be a positive number';
if(!data.kolicina || isNaN(data.kolicina)  || !Number.isInteger(parseFloat(data.kolicina)) ||  data.kolicina<0) tempErrors.kolicina="Quantity must be a whole number,and cant be lower than zero";
if (!data.file) tempErrors.file = 'File is required';
if (!data.duzina || isNaN(data.duzina) || data.duzina<=0) tempErrors.duzina = 'Length must be a positive number';
if (!data.visina || isNaN(data.visina) || data.visina<=0) tempErrors.visina = 'Height must be a positive number';
if (!data.sirina || isNaN(data.sirina) || data.sirina<=0) tempErrors.sirina = 'Width must be a positive number';
if (!data.proizvodjac) tempErrors.proizvodjac = 'Manufacturer is required';
if (!data.vrstaKancelarijskogProizvoda) tempErrors.vrstaKancelarijskogProizvoda = 'Type of office product is required';
return tempErrors;
    };

    // Submit za Knjiga formu
    const handleKnjigaSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateKnjiga(knjigaData);
        if (Object.keys(validationErrors).length > 0) {
            setErrorsKnjiga(validationErrors);
            setClickedKnjiga(false);
            setMessageKnjiga("");
            return;
        }
       
        setErrorsKnjiga({});

        const formData = new FormData();
        formData.append('file', knjigaData.file);
        formData.append('naziv', knjigaData.naziv);
        formData.append('cena', knjigaData.cena);
        formData.append("kolicina",knjigaData.kolicina);
        formData.append('izdanje', knjigaData.izdanje);
        formData.append('opis', knjigaData.opis);
        formData.append('pisci', JSON.stringify(knjigaData.pisciJson));

        try {
            const response=await axios.post('http://localhost:8080/api/proizvodi/knjiga', formData, {
                headers: {
                  'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
               //'Authorization': window.sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            azurirajProizvode();
           // alert('Knjiga je uspešno dodata!');
           setClickedKnjiga(true);
           setSuccessKnjiga(true);
            setMessageKnjiga(response.data.message);
            setKnjigaData({
                file: null,
                naziv: '',
                cena: '',
                kolicina:'',
                izdanje: '',
                opis: '',
                pisciJson: []
        });
        } catch (error) {
            setClickedKnjiga(true);
            setSuccessKnjiga(false);
            
             console.log("doslo");
             console.log(error);
            console.error(error);

            if (error.response.status === 401) {
                // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
                 console.error('Unauthorized access - token may be invalid or expired.');
                 setMessageKnjiga('Your session has expired. We will logout you after 2 seconds.');
                 setTimeout(() => {
                     logoutBezZahteva();
                 }, 2000);
 
                 
                 // Logika za izlogovanje korisnika ili preusmeravanje na login stranicu
             }else{
                setMessageKnjiga(error.response.data.message);
             }

           
          /*  if (error.response.status === 401) {
               // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
                console.error('Unauthorized access - token may be invalid or expired.');
               // setMessage('Your session has expired. We will logout you after 2 seconds.');
                setTimeout(() => {
                    logoutBezZahteva();
                }, 2000);

                
                // Logika za izlogovanje korisnika ili preusmeravanje na login stranicu
            }else{
                alert('Došlo je do greške pri dodavanju knjige.');
            }*/
        }
    };

    // Submit za KancelarijskiMaterijal formu
    const handleKancelarijskiSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateKM(kancelarijskiData);
        if (Object.keys(validationErrors).length > 0) {
            setErrorsKM(validationErrors);
            setClickedKM(false);
            setMessageKM("");
            return;
        }
        setErrorsKM({});

        const formData = new FormData();
        formData.append('file', kancelarijskiData.file);
        formData.append('naziv', kancelarijskiData.naziv);
        formData.append('cena', kancelarijskiData.cena);
        formData.append('kolicina',kancelarijskiData.kolicina);
        formData.append('duzina', kancelarijskiData.duzina);
        formData.append('visina', kancelarijskiData.visina);
        formData.append('sirina', kancelarijskiData.sirina);
        formData.append('proizvodjac', kancelarijskiData.proizvodjac);
        formData.append('vrstaKancelarijskogProizvoda', kancelarijskiData.vrstaKancelarijskogProizvoda);

        try {
           const response= await axios.post('http://localhost:8080/api/proizvodi/kancelarijski', formData, {
                headers: {
                    'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            azurirajProizvode();
           // alert('Kancelarijski materijal je uspešno dodat!');
            setClickedKM(true);
            setSuccessKM(true);
             setMessageKM(response.data.message);
             setKancelarijskiData({
        file: null,
        naziv: '',
        cena: '',
        kolicina:'',
        duzina: '',
        visina: '',
        sirina: '',
        proizvodjac: '',
        vrstaKancelarijskogProizvoda: ''
    });
        } catch (error) {
            setClickedKM(true);
            setSuccessKM(false);
            
             
            console.error(error);

            if (error.response.status === 401) {
                // alert('istekao vam je token ili je nevazeci,izlogovacemo vas za 2 sekunde.');
                 console.error('Unauthorized access - token may be invalid or expired.');
                 setMessageKM('Your session has expired. We will logout you after 2 seconds.');
                 setTimeout(() => {
                     logoutBezZahteva();
                 }, 2000);
 
                 
                 // Logika za izlogovanje korisnika ili preusmeravanje na login stranicu
             }else{
                setMessageKM(error.response.data.message);
             }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formsContainer}>
                <Card style={styles.card}>
                    <Card.Body>
                        <h3 style={styles.cardTitle}>Add Book</h3>
                        <Form onSubmit={handleKnjigaSubmit}>
                            <Form.Group controlId="formFileKnjiga">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" name="file" onChange={(e) => handleFileChange(e, 'knjiga')} />
                                {errorsKnjiga.file && <Form.Text className="text-danger">{errorsKnjiga.file}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formNazivKnjiga">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="naziv" placeholder="Title" value={knjigaData.naziv} onChange={(e) => handleInputChange(e, 'knjiga')} />
                                {errorsKnjiga.naziv && <Form.Text className="text-danger">{errorsKnjiga.naziv}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formCenaKnjiga">
                                <Form.Label>Price(EUR)</Form.Label>
                                <Form.Control type="text" name="cena" placeholder="Price" value={knjigaData.cena} onChange={(e) => handleInputChange(e, 'knjiga')} />
                                {errorsKnjiga.cena && <Form.Text className="text-danger">{errorsKnjiga.cena}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formKolicinaKnjiga">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="text" name="kolicina" placeholder="Quantity" value={knjigaData.kolicina} onChange={(e) => handleInputChange(e, 'knjiga')} />
                                {errorsKnjiga.kolicina && <Form.Text className="text-danger">{errorsKnjiga.kolicina}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formIzdanjeKnjiga">
                                <Form.Label>Edition</Form.Label>
                                <Form.Control type="text" name="izdanje" placeholder="Edition" value={knjigaData.izdanje} onChange={(e) => handleInputChange(e, 'knjiga')} />
                                {errorsKnjiga.izdanje && <Form.Text className="text-danger">{errorsKnjiga.izdanje}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formOpisKnjiga">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" name="opis" placeholder="Description" value={knjigaData.opis} onChange={(e) => handleInputChange(e, 'knjiga')} style={styles.textarea} />
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
                                        />
                                    ))}
                                </div>
                            </Form.Group>

                            <Button variant="primary" type="submit" style={styles.submitButton}>
                                Add Book
                            </Button>
                            {clickedKnjiga && (
                                <div style={{ ...styles.message, color: successKnjiga ? 'green' : 'red' }}>
                                    {messageKnjiga}
                                </div>
                            )}
                        </Form>
                    </Card.Body>
                </Card>

                <Card style={styles.card}>
                    <Card.Body>
                        <h3 style={styles.cardTitle}>Add Office Supply</h3>
                        <Form onSubmit={handleKancelarijskiSubmit}>
                            <Form.Group controlId="formFileKancelarijski">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" name="file" onChange={(e) => handleFileChange(e, 'kancelarijski')} />
                                {errorsKM.file && <Form.Text className="text-danger">{errorsKM.file}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formNazivKancelarijski">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="naziv" placeholder="Title" value={kancelarijskiData.naziv} onChange={(e) => handleInputChange(e, 'kancelarijski')} />
                                {errorsKM.naziv && <Form.Text className="text-danger">{errorsKM.naziv}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formCenaKancelarijski">
                                <Form.Label>Price(EUR)</Form.Label>
                                <Form.Control type="text" name="cena" placeholder="Price" value={kancelarijskiData.cena} onChange={(e) => handleInputChange(e, 'kancelarijski')} />
                                {errorsKM.cena && <Form.Text className="text-danger">{errorsKM.cena}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formKolicinaKancelarijski">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control type="text" name="kolicina" placeholder="Quantity" value={kancelarijskiData.kolicina} onChange={(e) => handleInputChange(e, 'kancelarijski')} />
                                {errorsKM.kolicina && <Form.Text className="text-danger">{errorsKM.kolicina}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formDuzinaKancelarijski">
                                <Form.Label>Length(cm)</Form.Label>
                                <Form.Control type="text" name="duzina" placeholder="Length" value={kancelarijskiData.duzina} onChange={(e) => handleInputChange(e, 'kancelarijski')} />
                                {errorsKM.duzina && <Form.Text className="text-danger">{errorsKM.duzina}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formVisinaKancelarijski">
                                <Form.Label>Height(cm)</Form.Label>
                                <Form.Control type="text" name="visina" placeholder="Height" value={kancelarijskiData.visina} onChange={(e) => handleInputChange(e, 'kancelarijski')} />
                                {errorsKM.visina && <Form.Text className="text-danger">{errorsKM.visina}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formSirinaKancelarijski">
                                <Form.Label>Width(cm)</Form.Label>
                                <Form.Control type="text" name="sirina" placeholder="Width" value={kancelarijskiData.sirina} onChange={(e) => handleInputChange(e, 'kancelarijski')} />
                                {errorsKM.sirina && <Form.Text className="text-danger">{errorsKM.sirina}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formProizvodjacKancelarijski">
                                <Form.Label>Manufacturer</Form.Label>
                                <Form.Control type="text" name="proizvodjac" placeholder="Manufacturer" value={kancelarijskiData.proizvodjac} onChange={(e) => handleInputChange(e, 'kancelarijski')} />
                                {errorsKM.proizvodjac && <Form.Text className="text-danger">{errorsKM.proizvodjac}</Form.Text>}
                            </Form.Group>

                            <Form.Group controlId="formVrstaKancelarijski">
                                <Form.Label>Type of Office Supply</Form.Label>
                                <Form.Control as="select" name="vrstaKancelarijskogProizvoda" value={kancelarijskiData.vrstaKancelarijskogProizvoda} onChange={(e) => handleInputChange(e, 'kancelarijski')}>
                                    <option value="">Select Type</option>
                                    {vrsteKancelarijskogMaterijala.map((vrsta) => (
                                        <option key={vrsta} value={vrsta}>
                                            {vrsta}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errorsKM.vrstaKancelarijskogProizvoda && <Form.Text className="text-danger">{errorsKM.vrstaKancelarijskogProizvoda}</Form.Text>}
                            </Form.Group>

                            <Button variant="primary" type="submit" style={styles.submitButton}>
                                Add Office Supply
                            </Button>
                            {clickedKM && (
                                <div style={{ ...styles.message, color: successKM ? 'green' : 'red' }}>
                                    {messageKM}
                                </div>
                            )}
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px',
    //    backgroundColor: 'rgba(52, 152, 219, 0.5)' ,
    //    minHeight: '100vh',
   //   overflow: 'hidden',


        margin: 'auto', //OVO
        justifyContent: 'center',//OVO
        minHeight: '95vh', //OVO
          margin: 'auto' //OVO
    },
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
    formsContainer: {
    //      overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1200px',
        gap: '30px'
    },
    card: {
        borderRadius: '15px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        minWidth: '45%',
        marginTop: '30px', // Povećana udaljenost između kartica
    },
    cardTitle: {
        marginBottom: '10px',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#343a40'
    },
    submitButton: {
        marginTop: '20px',
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        borderRadius:"20px",
        backgroundColor: '#3498db',
    },
    textarea: {
        resize: 'none',
        height: '60px'
    },
    checkboxContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', // Maksimalna širina za svaku checkbox
        gap: '10px',
        marginTop: '0px'
    },
    checkbox: {
        margin: '0',
        padding: '0',
        fontSize: '0.875rem' // Manji font za checkbox
    },
    message: {
        marginTop: '15px',
        fontSize: '14px',
        textAlign: 'center'
    }
};

export default AddProizvodPage;


