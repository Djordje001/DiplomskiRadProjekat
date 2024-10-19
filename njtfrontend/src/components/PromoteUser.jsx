import React from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
  align-items: center;
`;

const Section = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ecf0f1;
  font-size: 18px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UserInfo = styled.span`
  color: #34495e;
`;

const PromoteButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

function PromoteUser({ silver, gold, updateSilverGold, logoutBezZahteva }) {
  const handlePromote = async (userId, type) => {
    try {
      const endpoint = `/api/users/promote/${userId}?tipKupca=${encodeURIComponent(type)}`;
      const response = await axios.put(endpoint, {}, {
        headers: {
          'Authorization': `Bearer ${window.sessionStorage.token}`,
        },
      });
      
      updateSilverGold();
      alert(response.data);
    } catch (error) {
     
      if (error.response.status === 401) {
          alert('Your session has expired. We will logout you after 2 seconds.');
          logoutBezZahteva();
     
      }else{
        alert(error.response.data);
      }
    }
  };

  return (
    <Container>
      <Section>
        <Title>Users to be Promoted to GOLD</Title>
        <UserList>
          {gold.map(user => (
            <UserItem key={user.id}>
              <UserDetails>
                <UserInfo>{user.firstName} {user.lastName}</UserInfo>
                <UserInfo>{user.email}</UserInfo>
              </UserDetails>
              <PromoteButton onClick={() => handlePromote(user.id, 'GOLD')}>
                Promote
              </PromoteButton>
            </UserItem>
          ))}
        </UserList>
      </Section>

      <Section>
        <Title>Users to be Promoted to SILVER</Title>
        <UserList>
          {silver.map(user => (
            <UserItem key={user.id}>
              <UserDetails>
                <UserInfo>{user.firstName} {user.lastName}</UserInfo>
                <UserInfo>{user.email}</UserInfo>
              </UserDetails>
              <PromoteButton onClick={() => handlePromote(user.id, 'SILVER')}>
                Promote
              </PromoteButton>
            </UserItem>
          ))}
        </UserList>
      </Section>
    </Container>
  );
}

export default PromoteUser;