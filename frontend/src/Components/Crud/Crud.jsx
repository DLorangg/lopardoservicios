import React from 'react';

function Crud({ onLogout }) {
  const handleLogout = () => {
    localStorage.setItem('loggedIn', 'false');
    onLogout();
  };

  return (
    <div>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Crud;
