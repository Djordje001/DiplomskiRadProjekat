import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const ProizvodiContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const ProizvodiColumn = styled.div`
  flex: 1;
  margin: 0 10px;
`;

const Naslov = styled.h3`
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;
`;

const ProizvodCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const ProizvodImg = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ProizvodBody = styled.div`
  padding: 15px;
`;

const ProizvodTitle = styled.h5`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #333;
`;

const ProizvodInfo = styled.p`
  margin-bottom: 10px;
  color: #555;
`;

const ProizvodButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  color: #fff;
  transition: background-color 0.3s;
  width: 100%;
  &.btn-danger {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
  &.btn-primary {
    background-color: #007bff;
    &:hover {
      background-color: #0056b3;
    }
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
`;

const Modal = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
`;

const ModalTitle = styled.h4`
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: #333;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  resize: none;
`;

function Proizvodi({ proizvodi, pisci, vrsteKancelarijskogMaterijala, azurirajProizvode }) {
  const [selectedProizvod, setSelectedProizvod] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({});

  const openDeleteModal = (proizvod) => {
    setSelectedProizvod(proizvod);
    setShowDeleteModal(true);
  };

  const openUpdateModal = (proizvod) => {
    setSelectedProizvod(proizvod);
    setFormData({ ...proizvod });
    setShowUpdateModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/proizvodi/${selectedProizvod.id}`, {
        headers: {
          'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        },
      });
      azurirajProizvode();
      setShowDeleteModal(false);
    } catch (error) {
      setShowDeleteModal(false);
      alert("Ne možete obrisati proizvod koji se nalazi u okviru neke porudžbine");
      console.error('Greška prilikom brisanja proizvoda:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/proizvodi/${selectedProizvod.id}`, formData);
      azurirajProizvode();
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Greška prilikom ažuriranja proizvoda:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <ProizvodiContainer>
      <ProizvodiColumn>
        <Naslov>Knjige</Naslov>
        {proizvodi.filter(p => p.autori).map((knjiga) => (
          <ProizvodCard key={knjiga.id}>
            <ProizvodImg src={knjiga.url} alt={knjiga.naziv} />
            <ProizvodBody>
              <ProizvodTitle>{knjiga.naziv}</ProizvodTitle>
              <ProizvodInfo>Cena: {knjiga.cena} RSD</ProizvodInfo>
              <ProizvodInfo>Izdanje: {knjiga.izdanje}</ProizvodInfo>
              <ProizvodInfo>Opis: {knjiga.opis}</ProizvodInfo>
              <ProizvodInfo>Autori: {knjiga.autori.map((autor) => (
                <span key={autor.id}> {autor.pisac.ime} {autor.pisac.prezime}</span>
              ))}</ProizvodInfo>
              <ProizvodButtons>
                <Button className="btn-danger" onClick={() => openDeleteModal(knjiga)}>Delete</Button>
                <Button className="btn-primary" onClick={() => openUpdateModal(knjiga)}>Update</Button>
              </ProizvodButtons>
            </ProizvodBody>
          </ProizvodCard>
        ))}
      </ProizvodiColumn>

      <ProizvodiColumn>
        <Naslov>Kancelarijski Proizvodi</Naslov>
        {proizvodi.filter(p => p.vrstaKancelarijskogProizvoda).map((proizvod) => (
          <ProizvodCard key={proizvod.id}>
            <ProizvodImg src={proizvod.url} alt={proizvod.naziv} />
            <ProizvodBody>
              <ProizvodTitle>{proizvod.naziv}</ProizvodTitle>
              <ProizvodInfo>Cena: {proizvod.cena} RSD</ProizvodInfo>
              <ProizvodInfo>Vrsta: {proizvod.vrstaKancelarijskogProizvoda}</ProizvodInfo>
              <ProizvodInfo>Proizvođač: {proizvod.proizvodjac}</ProizvodInfo>
              <ProizvodInfo>Dimenzije: {proizvod.duzina} x {proizvod.sirina} x {proizvod.visina} cm</ProizvodInfo>
              <ProizvodButtons>
                <Button className="btn-danger" onClick={() => openDeleteModal(proizvod)}>Delete</Button>
                <Button className="btn-primary" onClick={() => openUpdateModal(proizvod)}>Update</Button>
              </ProizvodButtons>
            </ProizvodBody>
          </ProizvodCard>
        ))}
      </ProizvodiColumn>

      {/* Delete Modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>Potvrda Brisanja</ModalTitle>
            <p>Da li ste sigurni da želite da obrišete {selectedProizvod?.naziv}?</p>
            <ModalActions>
              <Button className="btn-danger" onClick={handleDelete}>Obriši</Button>
              <Button className="btn-primary" onClick={() => setShowDeleteModal(false)}>Zatvori</Button>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <ModalOverlay>
          <Modal>
            <ModalTitle>Ažuriraj Proizvod</ModalTitle>
            <Label htmlFor="naziv">Naziv</Label>
            <Input type="text" name="naziv" value={formData.naziv || ''} onChange={handleChange} />
            
            <Label htmlFor="cena">Cena</Label>
            <Input type="number" name="cena" value={formData.cena || ''} onChange={handleChange} />

            <Label htmlFor="opis">Opis</Label>
            <TextArea name="opis" value={formData.opis || ''} onChange={handleChange} />

            <Label htmlFor="vrstaKancelarijskogProizvoda">Vrsta Kancelarijskog Proizvoda</Label>
            <select name="vrstaKancelarijskogProizvoda" value={formData.vrstaKancelarijskogProizvoda || ''} onChange={handleChange}>
              {vrsteKancelarijskogMaterijala.map(vrsta => (
                <option key={vrsta.id} value={vrsta.naziv}>{vrsta.naziv}</option>
              ))}
            </select>

            <ModalActions>
              <Button className="btn-primary" onClick={handleUpdate}>Ažuriraj</Button>
              <Button className="btn-danger" onClick={() => setShowUpdateModal(false)}>Zatvori</Button>
            </ModalActions>
          </Modal>
        </ModalOverlay>
      )}
    </ProizvodiContainer>
  );
}

export default Proizvodi;







