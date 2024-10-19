import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PayPalButton from './PayPalButton';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(145deg, #f5f5f5, #ffffff);
`;

const Title = styled.h2`
  text-align: center;
  color: #444;
  margin-bottom: 40px;
  font-family: 'Roboto', sans-serif;
  font-size: 2em;
  letter-spacing: 1.5px;
`;

const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

const ProductCard = styled.div`
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: calc(30% - 20px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const ProductDetails = styled.div`
  padding: 20px;
  text-align: center;
`;

const ProductName = styled.h3`
  margin: 0;
  font-size: 1.4em;
  color: #333;
  font-family: 'Roboto', sans-serif;
`;

const ProductPrice = styled.p`
  margin: 15px 0 10px;
  font-size: 1.2em;
  color: #28a745;
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 1em;
  font-family: 'Roboto', sans-serif;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #c82333;
  }
`;

const TotalAmountContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f9fa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const TotalAmountValue = styled.p`
  margin: 10px 0 0;
  font-size: 2em;
  color: #87CEFA;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
`;

const PaymentLabel = styled.h3`
  margin-top: 20px;
  text-align: center;
  color: #444;
  font-size: 1.6em;
  font-family: 'Roboto', sans-serif;
`;

const styles={
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    transition: 'background-color 0.3s',
    width:'100%'
    
},
}




const Cart = ({ proizvodiUKorpi, removeFromCart, removeAllFromCart, tokenData,azurirajProizvode,azurirajPorudzbine,startPayment }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0); // Procentualni popust



  function intialPayment(){
    checkStock().then(isAvailable => {
      if (isAvailable) {
         
         startPayment();
      } else {
         // setTrebaPrikaz(false);
          alert('Some items are not available in the requested quantity. Please adjust your cart and try again.');
         // throw new Error('Stock unavailable');
      }
  });
       {/* <PayPalButton azurirajProizvode={azurirajProizvode} azurirajPorudzbine={azurirajPorudzbine}   key={discountedTotal} discountedTotal={discountedTotal} pomocna={pomocna} tokenData={tokenData} removeAllFromCart={removeAllFromCart}/> */}
  }


  useEffect(() => {
    if (tokenData.tipKupca === "SILVER") {
      setDiscountPercent(10); // 10% popust za BRONZE
    } else if (tokenData.tipKupca === "GOLD") {
      setDiscountPercent(20); // 20% popust za SILVER
    } else {
      setDiscountPercent(0); // Nema popusta
    }
  }, [tokenData]);

  const pomocna = () => JSON.stringify(proizvodiUKorpi);

  useEffect(() => {
    setTotalAmount(
      proizvodiUKorpi.reduce((sum, el) => sum + el.proizvod.cena * el.kolicina, 0)
    );
  }, [proizvodiUKorpi]);

  useEffect(() => {
    let discount = 0;
    if (tokenData.tipKupca === 'GOLD') {
      discount = (totalAmount * 20) / 100;
    } else if (tokenData.tipKupca === 'SILVER') {
      discount = (totalAmount * 10) / 100;
    }
    setDiscountedTotal(totalAmount - discount);
  }, [totalAmount, tokenData]);

  const checkStock = async () => {
    const formData = new FormData();
    formData.append("stavkePorudzbineJson", JSON.stringify(proizvodiUKorpi));
    try {
        const response = await axios.post('/api/public/proizvodi/check-stock', formData);
        console.log('Stock check response:', response.data);
        return response.data.indikator;
    } catch (error) {
        console.error('Error checking stock:', error);
        return false;
    }
};

  return (
    <Container>
      <Title>{proizvodiUKorpi.length === 0 ? 'Your cart is empty' : 'Your cart'}</Title>
      <ProductsContainer>
        {proizvodiUKorpi.map(el => (
          <ProductCard key={el.proizvod.id}>
            <ProductImage src={el.proizvod.url} alt={el.proizvod.naziv} />
            <ProductDetails>
              <ProductName>{el.proizvod.naziv}</ProductName>
              <ProductPrice>{el.proizvod.cena} EUR</ProductPrice>
              <ProductPrice>Quantity: {el.kolicina}</ProductPrice>
              <RemoveButton onClick={() => removeFromCart(el.proizvod.id)}>
                Remove from cart
              </RemoveButton>
            </ProductDetails>
          </ProductCard>
        ))}
      </ProductsContainer>
      {proizvodiUKorpi.length > 0 && (
        <TotalAmountContainer>
        <TotalAmountValue>Total Amount: {totalAmount.toFixed(2)} EUR</TotalAmountValue>
        {discountPercent > 0 && (
          <>
            <TotalAmountValue>Discounted Price: {discountedTotal.toFixed(2)} EUR</TotalAmountValue>
            <TotalAmountValue>You received a {discountPercent}% discount.</TotalAmountValue>
            
          </>
        )}
        <button style={styles.button} onClick={() => intialPayment(true)}>
                   Lets pay
                </button>
      </TotalAmountContainer>
      )}
      {proizvodiUKorpi.length > 0 && (
        <>
          {/* <PaymentLabel>Securely proceed with your payment via PayPal</PaymentLabel> */}
          {/* Ključ ovde prisiljava PayPal dugme da se uvek ponovo kreira kad se `discountedTotal` promeni */}
         
          {/* <PayPalButton azurirajProizvode={azurirajProizvode} azurirajPorudzbine={azurirajPorudzbine}   key={discountedTotal} discountedTotal={discountedTotal} pomocna={pomocna} tokenData={tokenData} removeAllFromCart={removeAllFromCart}/> */}
        </>
      )}
    </Container>
  );
};

export default Cart;