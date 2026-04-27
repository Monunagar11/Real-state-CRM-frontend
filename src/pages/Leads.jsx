import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeads, createLead, deleteLead, updateLeadStatus, clearLeadErrors } from '../features/lead/leadSlice';
import { fetchClients } from '../features/client/clientSlice';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const getStatusBadge = (status) => {
    switch(status) {
        case 'NEW': return <span className="badge bg-info-subtle text-info">New</span>;
        case 'CONTACTED': return <span className="badge bg-primary-subtle text-primary">Contacted</span>;
        case 'VISIT_SCHEDULED': return <span className="badge bg-warning-subtle text-warning">Visit Scheduled</span>;
        case 'NEGOTIATION': return <span className="badge bg-secondary-subtle text-secondary">Negotiation</span>;
        case 'CONVERTED': return <span className="badge bg-success-subtle text-success">Converted</span>;
        case 'CLOSED': return <span className="badge bg-danger-subtle text-danger">Closed</span>;
        default: return <span className="badge bg-light text-dark">{status}</span>;
    }
};

const Leads = () => {
    const dispatch = useDispatch();
    const { leads, isLoading, isError, errorMessage } = useSelector(state => state.lead);
    const { clients } = useSelector(state => state.client);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(fetchLeads());
        dispatch(fetchClients());
    }, [dispatch]);

    const handleClose = () => {
        setShowModal(false);
        formik.resetForm();
        dispatch(clearLeadErrors());
    };
    
    const handleShow = () => setShowModal(true);

    const formik = useFormik({
        initialValues: {
            clientId: '',
            source: '',
            status: 'NEW',
            budget: '',
            priority: 'Medium'
        },
        validationSchema: Yup.object({
            clientId: Yup.string().required('Client is required'),
            source: Yup.string().required('Source is required'),
            status: Yup.string().required('Status is required'),
            budget: Yup.number().positive('Budget must be positive').required('Budget is required'),
            priority: Yup.string().required('Priority is required')
        }),
        onSubmit: async (values) => {
            dispatch(clearLeadErrors());
            const resultAction = await dispatch(createLead(values));
            if (createLead.fulfilled.match(resultAction)) {
                handleClose();
            }
        }
    });

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this lead?")) {
            dispatch(deleteLead(id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        dispatch(updateLeadStatus({ id, status: newStatus }));
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="mb-0 fw-bold">Leads</h4>
                    <span className="text-muted">CRM / Leads</span>
                </div>
                <button className="btn btn-primary" onClick={handleShow}>
                    <i className="bi bi-plus-circle me-2"></i>Add Lead
                </button>
            </div>

            <div className="card border-0 shadow-sm rounded-3">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 ps-4">Client</th>
                                    <th className="py-3">Source</th>
                                    <th className="py-3">Budget</th>
                                    <th className="py-3">Priority</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3 pe-4 text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && leads.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                                ) : leads.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-4">No leads found.</td></tr>
                                ) : (
                                    leads.map(lead => {
                                        // Optional: map clientId to client name if clients are loaded
                                        const client = clients.find(c => c._id === lead.clientId);
                                        const clientName = client ? client.name : lead.clientId;
                                        
                                        return (
                                            <tr key={lead._id}>
                                                <td className="ps-4 fw-medium text-dark">{clientName}</td>
                                                <td>{lead.source}</td>
                                                <td>${lead.budget?.toLocaleString() || '-'}</td>
                                                <td>{lead.priority}</td>
                                                <td>
                                                    <select 
                                                        className="form-select form-select-sm border-0 bg-transparent"
                                                        value={lead.status}
                                                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                                                        style={{width: 'auto', display: 'inline-block'}}
                                                    >
                                                        <option value="NEW">New</option>
                                                        <option value="CONTACTED">Contacted</option>
                                                        <option value="VISIT_SCHEDULED">Visit Scheduled</option>
                                                        <option value="NEGOTIATION">Negotiation</option>
                                                        <option value="CONVERTED">Converted</option>
                                                        <option value="CLOSED">Closed</option>
                                                    </select>
                                                    {getStatusBadge(lead.status)}
                                                </td>
                                                <td className="pe-4 text-end">
                                                    <button 
                                                        className="btn btn-sm btn-light text-danger btn-icon"
                                                        onClick={() => handleDelete(lead._id)}
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Lead Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-bottom-0 pb-0">
                    <Modal.Title className="fs-5 fw-bold">Add New Lead</Modal.Title>
                </Modal.Header>
                <form onSubmit={formik.handleSubmit}>
                    <Modal.Body>
                        {isError && <div className="alert alert-danger">{errorMessage}</div>}
                        
                        <div className="mb-3">
                            <label className="form-label">Client <span className="text-danger">*</span></label>
                            <select 
                                className={`form-select bg-light ${formik.touched.clientId && formik.errors.clientId ? 'is-invalid' : ''}`}
                                name="clientId"
                                {...formik.getFieldProps('clientId')}
                            >
                                <option value="">Select a client...</option>
                                {clients.map(client => (
                                    <option key={client._id} value={client._id}>{client.name} ({client.email})</option>
                                ))}
                            </select>
                            {formik.touched.clientId && formik.errors.clientId && <div className="invalid-feedback">{formik.errors.clientId}</div>}
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Source <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className={`form-control bg-light ${formik.touched.source && formik.errors.source ? 'is-invalid' : ''}`}
                                    name="source"
                                    placeholder="e.g. Website, Referral"
                                    {...formik.getFieldProps('source')}
                                />
                                {formik.touched.source && formik.errors.source && <div className="invalid-feedback">{formik.errors.source}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Budget ($) <span className="text-danger">*</span></label>
                                <input 
                                    type="number" 
                                    className={`form-control bg-light ${formik.touched.budget && formik.errors.budget ? 'is-invalid' : ''}`}
                                    name="budget"
                                    placeholder="e.g. 5000"
                                    {...formik.getFieldProps('budget')}
                                />
                                {formik.touched.budget && formik.errors.budget && <div className="invalid-feedback">{formik.errors.budget}</div>}
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label">Priority <span className="text-danger">*</span></label>
                                <select 
                                    className={`form-select bg-light ${formik.touched.priority && formik.errors.priority ? 'is-invalid' : ''}`}
                                    name="priority"
                                    {...formik.getFieldProps('priority')}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                                {formik.touched.priority && formik.errors.priority && <div className="invalid-feedback">{formik.errors.priority}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Initial Status <span className="text-danger">*</span></label>
                                <select 
                                    className={`form-select bg-light ${formik.touched.status && formik.errors.status ? 'is-invalid' : ''}`}
                                    name="status"
                                    {...formik.getFieldProps('status')}
                                >
                                    <option value="NEW">New</option>
                                    <option value="CONTACTED">Contacted</option>
                                    <option value="VISIT_SCHEDULED">Visit Scheduled</option>
                                </select>
                                {formik.touched.status && formik.errors.status && <div className="invalid-feedback">{formik.errors.status}</div>}
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className="border-top-0 pt-0">
                        <Button variant="light" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Add Lead'}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    );
};

export default Leads;
