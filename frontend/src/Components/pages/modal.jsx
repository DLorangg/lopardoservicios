import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

export function ModalComponent({ show, handleClose, updateClientes }) {
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
    // Cargar opciones de equipamiento al cargar el componente
    axios.get(`${import.meta.env.VITE_API_URL}/getEquipamiento.php`)
      .then(response => {
        setEquipamientoOptions(response.data);
      })
      .catch(error => {
        console.error('Error al obtener equipamiento:', error);
      });
  }, []);

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
    const clienteDataToSend = {
      ...clienteData,
      Telefono: clienteData.Telefono.toString(),
    };

    axios.post(`${import.meta.env.VITE_API_URL}/postCliente.php`, clienteDataToSend)
      .then(response => {
        console.log('Cliente creado:', response.data);
        alert('Cliente creado exitosamente');
        handleClose();
        updateClientes(); 
      })
      .catch(error => {
        console.error('Error al crear cliente:', error);
        alert('Error al crear cliente');
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crear Cliente</Modal.Title>
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
          <Form.Group className="mb-3" controlId="formEquipamiento">
            <Form.Label>Equipamiento</Form.Label>
            <Form.Control as="select" name="Equipamiento" multiple onChange={handleEquipamientoChange}>
              {equipamientoOptions.map(equipamiento => (
                <option key={equipamiento.IdEquipamiento} >
                  {equipamiento.Nombre}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control type="text" name="Telefono" value={clienteData.Telefono} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRazonSocial">
            <Form.Label>Razón social</Form.Label>
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
