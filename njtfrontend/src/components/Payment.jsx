import React from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalButton from './PayPalButton';
import styled from 'styled-components';
function Payment({azurirajProizvode,azurirajPorudzbine,removeAllFromCart,tokenData}) {
console.log("R E N D E R ");
const PaymentLabel = styled.h3`
  margin-top: 20px;
  text-align: center;
  color: #444;
  font-size: 1.6em;
  font-family: 'Roboto', sans-serif;
`;


     const proizvodiUKorpi=JSON.parse(window.sessionStorage.proizvodiUKorpi);
    const totalAmount =proizvodiUKorpi.reduce((sum, el) => sum + el.proizvod.cena * el.kolicina, 0);

      
    
    
     
        let discount = 0;
        if (tokenData.tipKupca === 'GOLD') {
          discount = (totalAmount * 20) / 100;
        } else if (tokenData.tipKupca === 'SILVER') {
          discount = (totalAmount * 10) / 100;
        }
        
     
       const discountedTotal=totalAmount-discount;


    let navigate=useNavigate();
  // Funkcija za rukovanje klikom na dugme
  const handleReturnToCart = () => {
    // Ovde možeš dodati logiku za vraćanje u korpu, npr. navigaciju
    navigate("/cart");
  };

  // Inline stilovi
  const paymentContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
   // backgroundColor: '#f0f0f0', // Možeš promeniti boju pozadine
  };

  const innerContainerStyle = {
    width: '90%', // Širina unutrašnjeg kontejnera može se prilagoditi
    height: '90%', // Visina unutrašnjeg kontejnera može se prilagoditi
    maxWidth: '800px', // Maksimalna širina unutrašnjeg kontejnera
    maxHeight: '600px', // Maksimalna visina unutrašnjeg kontejnera
    padding: '20px',
    backgroundColor: '#ffffff', // Pozadina unutrašnjeg kontejnera
    borderRadius: '8px', // Za zaobljene ivice
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Skrivene senke za efekat dubine
    textAlign: 'center', // Poravnanje teksta u centru
    overflow: 'auto', // Omogućava skrolovanje ako sadržaj premaši veličinu kontejnera
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#ffffff',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom:'15px'
  };

  return (
    <div style={paymentContainerStyle}>
      <div style={innerContainerStyle}>
        {/* <h2>Payment</h2> */}
        <button style={buttonStyle} onClick={handleReturnToCart}>
          Return to Cart
        </button>
        {/* <p>{discountedTotal}</p> */}
        <PaymentLabel>Securely proceed with your payment via PayPal</PaymentLabel> 
        <PayPalButton azurirajProizvode={azurirajProizvode} azurirajPorudzbine={azurirajPorudzbine}  discountedTotal={discountedTotal} proizvodiUKorpi={JSON.stringify(proizvodiUKorpi)} tokenData={tokenData} removeAllFromCart={removeAllFromCart}/> 
      </div>
    </div>
  );
}

export default Payment;