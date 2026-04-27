import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, createClient, deleteClient, clearClientErrors } from '../features/client/clientSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Clients = () => {
    const dispatch = useDispatch();
    const { clients, isLoading, isError, errorMessage } = useSelector(state => state.client);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    const handleClose = () => {
        setShowModal(false);
        formik.resetForm();
        dispatch(clearClientErrors());
    };
    
    const handleShow = () => setShowModal(true);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            prefrence: '' // Intentionally matching backend spelling
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone number is required'),
            prefrence: Yup.string().required('Preference is required')
        }),
        onSubmit: async (values) => {
            dispatch(clearClientErrors());
            const resultAction = await dispatch(createClient(values));
            if (createClient.fulfilled.match(resultAction)) {
                handleClose();
            }
        }
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            dispatch(deleteClient(id));
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="mb-0 fw-bold">Clients</h4>
                    <span className="text-muted">CRM / Clients</span>
                </div>
                <button className="btn btn-primary" onClick={handleShow}>
                    <i className="bi bi-plus-circle me-2"></i>Add Client
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 ps-4">Name</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Phone</th>
                                    <th className="py-3">Preference</th>
                                    <th className="py-3 pe-4 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && clients.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                                ) : clients.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-4">No clients found.</td></tr>
                                ) : (
                                    clients.map(client => (
                                        <tr key={client._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="avatar-xs bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px'}}>
                                                        {client.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="fw-medium">{client.name}</span>
                                                </div>
                                            </td>
                                            <td>{client.email}</td>
                                            <td>{client.phone}</td>
                                            <td>{client.prefrence}</td>
                                            <td className="pe-4 text-end">
                                                <button 
                                                    className="btn btn-sm btn-light text-danger btn-icon"
                                                    onClick={() => handleDelete(client._id)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Client Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fs-5 fw-bold">Add New Client</Modal.Title>
                </Modal.Header>
                <form onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        {isError && <div className="alert alert-danger">{errorMessage}</div>}
                        
                        <div className="mb-3">
                            <label className="form-label">Client Name <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className={`form-control bg-light ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                name="name"
                                placeholder="Enter name"
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name && <div className="invalid-feedback">{formik.errors.name}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email Address <span className="text-danger">*</span></label>
                            <input 
                                type="email" 
                                className={`form-control bg-light ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                name="email"
                                placeholder="Enter email"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                            <input 
                                type="text" 
                                className={`form-control bg-light ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                                name="phone"
                                placeholder="Enter phone"
                                {...formik.getFieldProps('phone')}
                            />
                            {formik.touched.phone && formik.errors.phone && <div className="invalid-feedback">{formik.errors.phone}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Preference <span className="text-danger">*</span></label>
                            <select 
                                className={`form-select bg-light ${formik.touched.prefrence && formik.errors.prefrence ? 'is-invalid' : ''}`}
                                name="prefrence"
                                {...formik.getFieldProps('prefrence')}
                            >
                                <option value="">Select preference...</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                            {formik.touched.prefrence && formik.errors.prefrence && <div className="invalid-feedback">{formik.errors.prefrence}</div>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="border-top-0 pt-0">
                        <Button variant="light" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Add Client'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
};

export default Clients;
