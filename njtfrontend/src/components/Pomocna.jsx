import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for styling
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
`;

const OptionInput = styled.input`
  margin-right: 5px;
`;

function Pomocna() {
  const [selectedOption, setSelectedOption] = useState('proizvodi'); // Default option
  const navigate = useNavigate();

  // Automatically navigate to the "Proizvodi" page on component load
//   useEffect(() => {
//     navigate('/products/knjige'); // Navigate to products page initially
//   }, []);


  useEffect(() => {
    
   const savedPath = localStorage.getItem('currentPath');
     if (savedPath) {
        if(savedPath=="/products/knjige"){
            setSelectedOption("proizvodi");
            navigate("/products/knjige");
            return;
       } if(savedPath=="/products/kancelarijskiProizvodi"){
            setSelectedOption("kancelarijski-materijal");
            navigate("/products/kancelarijskiProizvodi");
            return;
        }else{
            setSelectedOption("proizvodi");
            navigate("/products/knjige");
        }
        // navigate(savedPath);  //!MORA GA VRATIS
     }
 }, []);

  const handleOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOption(value);

    // Change route based on the selected option
    if (value === 'proizvodi') {
      navigate('/products/knjige'); // Ruta za proizvode
    } else if (value === 'kancelarijski-materijal') {
      navigate('/products/kancelarijskiProizvodi'); // Ruta za kancelarijski materijal
    }
  };

  return (
    <HeaderContainer>
      <Title>Products</Title>
      <Options>
        <OptionLabel>
          <OptionInput
            type="radio"
            name="filter"
            value="proizvodi"
            checked={selectedOption === 'proizvodi'}
            onChange={handleOptionChange}
          />
          Books
        </OptionLabel>
        <OptionLabel>
          <OptionInput
            type="radio"
            name="filter"
            value="kancelarijski-materijal"
            checked={selectedOption === 'kancelarijski-materijal'}
            onChange={handleOptionChange}
          />
          Office supplies
        </OptionLabel>
      </Options>
    </HeaderContainer>
  );
}

export default Pomocna;