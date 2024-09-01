import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

export function CajaUpdate() {
    const [formData, setFormData] = useState({
        fecha: '',
        detalle: '',
        ingreso: 0,
        egreso: 0
    });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetchRegistro();
    }, []);

    const fetchRegistro = () => {
        axios.get(`https://lopardoservicios.com/backend/routes/getCajaById.php`, {
            params: { id: id } 
        })
        .then(res => {
            const { fecha, detalle, ingreso, egreso } = res.data[0];
            setFormData({
                fecha,
                detalle,
                ingreso,
                egreso
            });
        })
        .catch(error => {
            console.error('Error al obtener el registro:', error);
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`https://lopardoservicios.com/backend/routes/putCaja.php?id=${id}`, formData)
            .then(res => {
                console.log(res);
                navigate('/caja');
            })
            .catch(error => {
                console.error('Error al actualizar el registro:', error);
            });
    }

    return (
        <>
        <div className="container my-5" style={{border: '1px solid #001461'}} >
            <h2 className="text-center mb-3">Editar Registro de Caja</h2>
            <div className="row bm-3">
                <div className="col-lg-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Fecha</label>
                            <div className="col-sm-8">
                                <input
                                    className="form-control"
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Detalle</label>
                            <div className="col-sm-8">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="detalle"
                                    value={formData.detalle}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Ingreso</label>
                            <div className="col-sm-8">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="ingreso"
                                    value={formData.ingreso}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-sm-4 col-form-label">Egreso</label>
                            <div className="col-sm-8">
                                <input
                                    className="form-control"
                                    type="number"
                                    name="egreso"
                                    value={formData.egreso}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="offset-sm-4 col-sm-4 d-grid">
                                <button type="submit" className="btn btn-primary btn-sm me-3">Guardar</button>
                            </div>
                            <div className="col-sm-4 d-grid">
                                <Link to="/caja" className="btn btn-danger me-2">Cancelar</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </>
    );
}

export default CajaUpdate;
