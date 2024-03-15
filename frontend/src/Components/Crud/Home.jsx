import React, { useState, useRef } from 'react';

function Home({ onLogout }) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFiles = (selectedFiles) => {
    const newFiles = [...files];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      newFiles.push(file);
    }

    setFiles(newFiles);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleLogout = () => {
    localStorage.setItem('loggedIn', 'false');
    onLogout();
  };

  return (
    <div>
      <button onClick={handleLogout} style={{ marginBottom: '10px' }}>Cerrar sesión</button>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleOpenFileDialog}
        style={{ border: '2px dashed #ccc', padding: '20px', borderRadius: '5px', textAlign: 'center', cursor: 'pointer' }}
      >
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
        />
        <p>Arrastra y suelta archivos aquí o haz clic para seleccionar archivos</p>
        {files.length > 0 && (
          <div>
            <h2>Archivos seleccionados</h2>
            <ul>
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
