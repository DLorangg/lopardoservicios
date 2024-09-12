import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export function ModalUpdateComponent({ show, handleClose, updateClientes, clienteData: initialClienteData }) {
  const [clienteData, setClienteData] = useState({
    Nombre: '',
    DNI: '',
    Ciudad: '',
    Direccion: '',
    Equipamiento: [],
    Telefono: '',
    RazonSocial: '',
    Email: '',
    Email2: ''
  });

  const [equipamientoOptions, setEquipamientoOptions] = useState([]);

  useEffect(() => {
    axios.get('https://lopardoservicios.com/backend/routes/getEquipamiento.php')
      .then(response => {
        setEquipamientoOptions(response.data);
      })
      .catch(error => {
        console.error('Error al obtener equipamiento:', error);
      });
  }, []);

  useEffect(() => {
    if (initialClienteData) {
      console.log("Datos del cliente a editar:", initialClienteData); // Verifica que los datos están llegando correctamente
      setClienteData({
        ...initialClienteData,
        Equipamiento: initialClienteData.Equipamiento ? initialClienteData.Equipamiento.split(', ') : [],
      });
    }
  }, [initialClienteData]);
  

  const handleChange = e => {
    const { name, value } = e.target;
    setClienteData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEquipamientoChange = e => {
    const { options } = e.target;
    const selectedEquipamiento = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedEquipamiento.push(options[i].value);
      }
    }
    setClienteData(prevState => ({
      ...prevState,
      Equipamiento: selectedEquipamiento,
    }));
  };

  const handleGuardar = () => {
    console.log('Datos del cliente antes de enviar:', clienteData);
    console.log('ID del cliente:', initialClienteData.IdCliente);
  
    axios.put(`https://lopardoservicios.com/backend/routes/putCliente.php?id=${initialClienteData.IdCliente}`, clienteData)
    .then(response => {
      console.log('Cliente actualizado:', response.data);
      alert('Cliente actualizado exitosamente');
      handleClose();
      updateClientes(); 
    })
    .catch(error => {
      console.error('Error al actualizar cliente:', error);
      alert('Error al actualizar cliente');
    });

  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control type="text" name="Nombre" value={clienteData.Nombre} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDNI">
            <Form.Label>DNI</Form.Label>
            <Form.Control type="text" name="DNI" value={clienteData.DNI} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formCiudad">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control type="text" name="Ciudad" value={clienteData.Ciudad} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control type="text" name="Direccion" value={clienteData.Direccion} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" name="Telefono" value={clienteData.Telefono} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRazonSocial">
            <Form.Label>Razon Social</Form.Label>
            <Form.Control type="text" name="RazonSocial" value={clienteData.RazonSocial} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="Email" value={clienteData.Email} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail2">
            <Form.Label>Email 2</Form.Label>
            <Form.Control type="email" name="Email2" value={clienteData.Email2} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGuardar}>
          Guardar
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
