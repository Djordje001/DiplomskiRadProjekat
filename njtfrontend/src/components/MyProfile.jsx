import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyProfile = ({logoutBezZahteva,tokenData,updateTokenData}) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(tokenData);
    const [isAdmin, setIsAdmin] = useState(tokenData.tipAdmina ? true : false);
    const [isBaseDataModalOpen, setIsBaseDataModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    //console.log( userData.datumRodjenja.split('T')[0]);
    const [formData, setFormData] = useState({
        firstName: tokenData.firstName,
        lastName: tokenData.lastName,
        brojTelefona:tokenData.brojTelefona,
        ...(isAdmin ? { } : { datumRodjenja: convertBackendDateToInputDate(tokenData.datumRodjenja) })
    });
    console.log(formData);
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [message1,setMessage1]=useState('');


      //  const[uspesno,setUspesno]=useState(true);
  const[clickedUpdate,setClickedUpdate]=useState(false);
//  const[clickedReset,setClickedReset]=useState(false);

 
  const[successUpdate,setSuccessUpdate]=useState(false);
 // const[successReset,setSuccessReset]=useState(false);
  

  const[messageUpdate,setMessageUpdate]=useState("");
 // const[messageReset,setMessageReset]=useState("");


 // Helper function to format the date from backend
 function convertBackendDateToInputDate(backendDateStr) {
    // Parsing the date string
    console.log(typeof backendDateStr);
    const date = new Date(backendDateStr);

    // Checking if date is valid
    // if (isNaN(date.getTime())) {
    //     console.error('Invalid date:', backendDateStr);
    //     return '';
    // }

    // Extracting year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    // Formatting date to yyyy-MM-dd
    return `${year}-${month}-${day}`;
}

 

    const handleInputChange = (e) => {
        console.log(e.target.value);
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};
      //  const phoneRegex = /^[0-9]{10,12}$/;
        const today = new Date().toISOString().split('T')[0];

        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';

        if (!formData.brojTelefona) {
            newErrors.brojTelefona = 'Phone number is required';
        } 
        if (isAdmin) {
            
        } else {
            if (!formData.datumRodjenja) {
                newErrors.datumRodjenja = 'Date of birth is required';
            } else if (formData.datumRodjenja >= today) {
                newErrors.datumRodjenja = 'Date of birth must be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    function validateSerbianMobileNumber(phoneNumber) {
        // Regularni izraz za srpske mobilne brojeve (10 cifara, počinje sa 06X)
        const mobileRegex = /^06[0-9]\d{7}$/;
      
        // Provera da li broj telefona odgovara regularnom izrazu
        return mobileRegex.test(phoneNumber);
      }

    const handleSaveChanges = async () => {

        if(!validateSerbianMobileNumber(formData['brojTelefona'])){
            setClickedUpdate(true);
            setMessageUpdate("invalid phone number");
            setSuccessUpdate(false);

            return;
        }
        if (validateForm()) {
            setErrors({});
            try {
             
                const updateData = { ...formData };
    
                const date = new Date(formData['datumRodjenja']); // Pretpostavljam da je datum u formatu ISO
                const formattedDate = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;


                let datumRodjenjaFormatted = formData['datumRodjenja'] 
    ? new Date(formData['datumRodjenja']).toISOString().split('T')[0] 
    : '';
                
                const endpoint = isAdmin
                    ? `/api/users/change-user-data?firstName=${encodeURIComponent(formData['firstName'])}&brojTelefona=${encodeURIComponent(formData['brojTelefona'])}&lastName=${encodeURIComponent(formData['lastName'])}`
                     : `/api/users/change-user-data?firstName=${encodeURIComponent(formData['firstName'])}&brojTelefona=${encodeURIComponent(formData['brojTelefona'])}&lastName=${encodeURIComponent(formData['lastName'])}&datumRodjenja=${encodeURIComponent(datumRodjenjaFormatted)}`;
                          //   : `/api/users/change-user-data?id=${encodeURIComponent(tokenData['id'])}&firstName=${encodeURIComponent(formData['firstName'])}&brojTelefona=${encodeURIComponent(formData['brojTelefona'])}&lastName=${encodeURIComponent(formData['lastName'])}&datumRodjenja=${formattedDate}`;
console.log(formData['datumRodjenja']);
console.log(endpoint);
const response = await axios.put(endpoint, {
    // Podaci koje šaljete u telu zahteva
}, {
    headers: {
        'Authorization': `Bearer ${window.sessionStorage.token}`
    }
});

                console.log(response);
    
                // Prikaz poruke o uspehu
                console.log('Response:', response.data);
              //  setUlogovani(response.data.user);
             // window.sessionStorage.removeItem("token");
                window.sessionStorage.setItem(
                    "token",
                     response.data.token,
                    
                  );
                  updateTokenData();
                
                setMessageUpdate(response.data.message);
                setClickedUpdate(true);
                setSuccessUpdate(true);
                setTimeout(() => {
                    setIsBaseDataModalOpen(false);
                    setMessage();
                }, 2000);
    
            } catch (error) {
                console.error('Error updating profile:', error);
                
                setClickedUpdate(true);
                setSuccessUpdate(false);
              //  setMessage(error.response.message);
                if (error.response.status === 401) {
                    console.error('Unauthorized access - token may be invalid or expired.');
                    setMessage('Your session has expired. We will logout you after 2 seconds.');
                    setMessageUpdate('Your session has expired. We will logout you after 2 seconds.');
                    setTimeout(() => {
                        logoutBezZahteva();
                    }, 2000);

                    
                    // Logika za izlogovanje korisnika ili preusmeravanje na login stranicu
                }else{
                    setMessageUpdate(error.response.data.message);
                }
            }
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await axios.post('/api/auth/request-password-change', { email: userData["iss"] });
            console.log(response.data);
            setMessage1(response.data+",after 3 seconds we will logout you");
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setMessage1();
                logoutBezZahteva();
            }, 3000);
        } catch (error) {
            console.log(error);
            console.error('Error changing password:', error);
            setMessage('Error changing password. Please try again.');
        }
    };


    function openModal(){
        setErrors({});
        setIsBaseDataModalOpen(true);
        setMessageUpdate("");
        setClickedUpdate(false);
    }


    

// console.log(formattedDate);

    return (
        <div style={parentStyles}> 
        <div style={styles.profileContainer}>
            <h1 style={styles.title}>My Profile</h1>
            {isAdmin ? (
                <div style={styles.adminInfo}>
                    <p><strong>First Name:</strong> {tokenData.firstName}</p>
                    <p><strong>Last Name:</strong> {tokenData.lastName}</p>
                    <p><strong>Email:</strong> {tokenData.iss}</p>
                    <p><strong>Phone Number:</strong> {tokenData.brojTelefona}</p>
                    <p><strong>Date of Employment</strong> {new Date(tokenData.datumZaposlenja).toLocaleDateString()}</p>
                    <p><strong>Admin Type:</strong> {tokenData.tipAdmina}</p>
                </div>
            ) : (
                <div style={styles.customerInfo}>
                    <p><strong>First Name:</strong> {tokenData.firstName}</p>
                    <p><strong>Last Name:</strong> {tokenData.lastName}</p>
                    <p><strong>Email:</strong> {tokenData.iss}</p>
                    <p><strong>Phone Number:</strong> {tokenData.brojTelefona}</p>
                    <p><strong>Customer Type:</strong> {tokenData.tipKupca}</p>
{tokenData.tipKupca === 'BRONZE' && (
  <p>You dont have discount for orders.</p>
)}
{tokenData.tipKupca === 'SILVER' && (
  <p>You have 10% discount for orders.</p>
)}
{tokenData.tipKupca === 'GOLD' && (
  <p>You have 20% discount for orders.</p>
)}
                    <p><strong>Date of Birth:</strong> {new Date(tokenData.datumRodjenja).toLocaleDateString()}</p>
                    {/* <p><strong>Date of Birth:</strong> { userData.datumRodjenja}</p> */}
                </div>
            )}
            <div style={styles.buttonContainer}>
                <button style={styles.button} onClick={() => openModal()}>
                    Change Base Data
                </button>
                <button style={styles.button} onClick={() => setIsPasswordModalOpen(true)}>
                    Change Password
                </button>
            </div>

            {isBaseDataModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>Edit Base Data</h2>
                        <div style={styles.modalContent}>
                            <label style={styles.label}>First Name:</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                            {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}

                            <label style={styles.label}>Last Name:</label>
                            <input
                                style={styles.input}
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                            {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}

                            <label style={styles.label}>Phone Number:</label>
                                    <input
                                        style={styles.input}
                                        type="text"
                                        name="brojTelefona"
                                        value={formData.brojTelefona}
                                        onChange={handleInputChange}
                                    />
                                    {errors.brojTelefona && <span style={styles.error}>{errors.brojTelefona}</span>}
                            {isAdmin ? (
                                <>
                                    
                                </>
                            ) : (
                                <>
                                    <label style={styles.label}>Date of Birth:</label>
                                    <input
                                        style={styles.input}
                                        type="date"
                                        name="datumRodjenja"
                                        value={formData.datumRodjenja}
                                        onChange={handleInputChange}
                                    />
                                    {errors.datumRodjenja && <span style={styles.error}>{errors.datumRodjenja}</span>}
                                </>
                            )}
                        </div>
                        {clickedUpdate && (
       <label style={{ color: successUpdate ? 'green' : 'red', fontSize: '14px', marginTop: '5px' }}>
      {messageUpdate}
      </label> 
      )}
                        <div style={styles.modalActions}>
                            <button style={styles.button} onClick={handleSaveChanges}>
                                Save
                            </button>
                            <button style={styles.button} onClick={() => setIsBaseDataModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isPasswordModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>Change Password</h2>
                        <div style={styles.modalContent}>
    <p style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: 'green',  // Crvena boja za poruke greške
        backgroundColor: 'white',  // Svetla pozadina
        padding: '10px',
        borderRadius: '4px',
        marginTop: '10px',
    }}>
        {message1}
    </p>
</div>
                        <div style={styles.modalActions}>
                            <button style={styles.button} onClick={handleChangePassword}>
                                Yes, I want to change password
                            </button>
                            <button style={styles.button} onClick={() => setIsPasswordModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

const parentStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '90vh', // Uzima celu visinu viewport-a
    width: '100vw', // Uzima celu širinu viewport-a
 //   backgroundColor: 'rgba(52, 152, 219, 0.5)' 
};



const styles = {
    profileContainer: {
        padding: '30px',
        minWidth: '900px',
      // margin: '40px auto',
       //margin:'250px auto',
       //justifyContent: 'center', // Centriranje vertikalno unutar roditeljskog elementa
       //margin: '0 auto', // Centriranje horizontalno
      // height: '100vh', // Visina viewport-a
        border: '1px solid #ddd',
        borderRadius: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fefefe',
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,

       
   
       
    },
    title: {
        textAlign: 'center',
        color: '#2c3e50',
        fontSize: '2rem',
        marginBottom: '20px',
    },
    adminInfo: {
        padding: '20px',
        border: '1px solid #3498db',
        borderRadius: '8px',
        backgroundColor: '#ecf0f1',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        color: '#34495e',
        fontSize: '16px',
    },
    customerInfo: {
        padding: '20px',
        border: '1px solid #2ecc71',
        borderRadius: '8px',
        backgroundColor: '#ecf0f1',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        color: '#34495e',
        fontSize: '16px',
    },
    buttonContainer: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-around',
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
    buttonPrimary: {
        backgroundColor: '#3498db',
    },
    buttonSecondary: {
        backgroundColor: '#e74c3c',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '90%',
        maxWidth: '500px',
        textAlign: 'center',
    },
    modalTitle: {
        fontSize: '1.5rem',
        marginBottom: '20px',
    },
    modalContent: {
        marginBottom: '20px',
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'space-around',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
    },
    error: {
        color: '#e74c3c',
        fontSize: '14px',
        marginBottom: '10px',
    },
    
};

export default MyProfile;




