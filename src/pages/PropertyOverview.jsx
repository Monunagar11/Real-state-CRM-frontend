import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPropertyById, deleteProperty, updatePropertyStatus } from '../features/property/propertySlice';

const getStatusBadge = (status) => {
    switch(status) {
        case 'DRAFT': return <span className="badge bg-secondary-subtle text-secondary fs-6">Draft</span>;
        case 'AVAILABLE': return <span className="badge bg-success-subtle text-success fs-6">Available</span>;
        case 'SOLD': return <span className="badge bg-danger-subtle text-danger fs-6">Sold</span>;
        case 'LEASED': return <span className="badge bg-info-subtle text-info fs-6">Leased</span>;
        case 'BOOKED': return <span className="badge bg-primary-subtle text-primary fs-6">Booked</span>;
        default: return <span className="badge bg-light text-dark fs-6">{status}</span>;
    }
};

const PropertyOverview = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentProperty, isLoading, isError, errorMessage } = useSelector(state => state.property);

    useEffect(() => {
        if (id) {
            dispatch(fetchPropertyById(id));
        }
    }, [dispatch, id]);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
            const result = await dispatch(deleteProperty(id));
            if (deleteProperty.fulfilled.match(result)) {
                navigate('/admin/properties');
            }
        }
    };

    const handleStatusChange = (e) => {
        dispatch(updatePropertyStatus({ id, status: e.target.value }));
    };

    if (isLoading && !currentProperty) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (isError && !currentProperty) {
        return (
            <div className="container-fluid py-5">
                <div className="alert alert-danger">{errorMessage || "Failed to load property details."}</div>
                <button className="btn btn-primary" onClick={() => navigate('/admin/properties')}>Back to Properties</button>
            </div>
        );
    }

    if (!currentProperty) {
        return null; // or empty state
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="mb-0 fw-bold">Property Overview</h4>
                    <span className="text-muted">Real Estate / Properties / Overview</span>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-light" onClick={() => navigate('/admin/properties')}>
                        <i className="bi bi-arrow-left me-2"></i>Back
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                        <i className="bi bi-trash me-2"></i>Delete
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Main Details and Images */}
                <div className="col-xl-8">
                    <div className="card border-0 shadow-sm rounded-3 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h3 className="fw-bold mb-2">{currentProperty.title}</h3>
                                    <p className="text-muted fs-5 mb-0">
                                        <i className="bi bi-geo-alt me-2 text-primary"></i>
                                        {currentProperty.location}
                                    </p>
                                </div>
                                <h3 className="text-primary fw-bold mb-0">
                                    ${currentProperty.price?.toLocaleString()}
                                </h3>
                            </div>
                            
                            <div className="d-flex gap-2 mb-4">
                                {getStatusBadge(currentProperty.status)}
                                <span className="badge bg-light text-dark border fs-6">{currentProperty.type}</span>
                            </div>

                            {/* Main Image Gallery */}
                            {currentProperty.images && currentProperty.images.length > 0 && (
                                <div className="row g-2 mb-4">
                                    <div className="col-12 col-md-8">
                                        <div style={{height: '400px', borderRadius: '12px', overflow: 'hidden'}}>
                                            <img src={currentProperty.images[0]} alt="Main" className="w-100 h-100 object-fit-cover" />
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-4 d-flex flex-column gap-2">
                                        {currentProperty.images.slice(1, 3).map((img, idx) => (
                                            <div key={idx} style={{height: currentProperty.images.length > 2 ? '196px' : '400px', borderRadius: '12px', overflow: 'hidden'}}>
                                                <img src={img} alt={`Gallery ${idx+1}`} className="w-100 h-100 object-fit-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="row g-4 border-top pt-4">
                                <div className="col-sm-6 col-md-4">
                                    <div className="d-flex align-items-center bg-light p-3 rounded-3">
                                        <div className="flex-shrink-0 text-primary fs-3 me-3">
                                            <i className="bi bi-arrows-fullscreen"></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Area</h6>
                                            <h5 className="mb-0 fw-bold">{currentProperty.area} sq.ft</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6 col-md-4">
                                    <div className="d-flex align-items-center bg-light p-3 rounded-3">
                                        <div className="flex-shrink-0 text-primary fs-3 me-3">
                                            <i className="bi bi-buildings"></i>
                                        </div>
                                        <div>
                                            <h6 className="text-muted mb-1">Property Type</h6>
                                            <h5 className="mb-0 fw-bold">{currentProperty.type}</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Details / Actions */}
                <div className="col-xl-4">
                    <div className="card border-0 shadow-sm rounded-3 mb-4">
                        <div className="card-header bg-transparent border-bottom pt-4 pb-3">
                            <h5 className="mb-0 fw-bold">Quick Actions</h5>
                        </div>
                        <div className="card-body p-4">
                            <label className="form-label fw-medium">Update Status</label>
                            <select 
                                className="form-select bg-light mb-3"
                                value={currentProperty.status}
                                onChange={handleStatusChange}
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="AVAILABLE">Available</option>
                                <option value="INQUIRY_RECEIVED">Inquiry Received</option>
                                <option value="SITE_VISIT_SCHEDULED">Site Visit Scheduled</option>
                                <option value="NEGOTIATION">Negotiation</option>
                                <option value="BOOKED">Booked</option>
                                <option value="SOLD">Sold</option>
                                <option value="LEASED">Leased</option>
                                <option value="ON_HOLD">On Hold</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            
                            <p className="text-muted fs-14 mb-0">
                                Changing the status will immediately update the property listing across the platform.
                            </p>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-header bg-transparent border-bottom pt-4 pb-3">
                            <h5 className="mb-0 fw-bold">System Info</h5>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-unstyled mb-0">
                                <li className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Property ID</span>
                                    <span className="fw-medium text-truncate ms-3" style={{maxWidth: '150px'}}>{currentProperty._id}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Created At</span>
                                    <span className="fw-medium">{new Date(currentProperty.createdAt).toLocaleDateString()}</span>
                                </li>
                                <li className="d-flex justify-content-between">
                                    <span className="text-muted">Last Updated</span>
                                    <span className="fw-medium">{new Date(currentProperty.updatedAt).toLocaleDateString()}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyOverview;
