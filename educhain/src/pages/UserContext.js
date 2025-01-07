import React, { createContext, useContext, useState } from 'react';

// Créer un contexte pour les utilisateurs
const UserContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useUserContext = () => {
  return useContext(UserContext);
};

// Fournisseur du contexte pour encapsuler l'application
export const UserProvider = ({ children }) => {
  // Charger les utilisateurs depuis localStorage ou utiliser un tableau vide s'il n'y en a pas
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  // Fonction pour ajouter un utilisateur
  const addUser = (user) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers, user];
      // Sauvegarder les utilisateurs dans localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  // Fonction pour récupérer un utilisateur par email
  const getUserByEmail = (email) => {
    return users.find((user) => user.email === email);
  };

  return (
    <UserContext.Provider value={{ users, addUser, getUserByEmail }}>
      {children}
    </UserContext.Provider>
  );
};
