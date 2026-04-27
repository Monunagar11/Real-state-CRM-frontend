import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties } from '../features/property/propertySlice';
import { useNavigate } from 'react-router-dom';

const getStatusBadge = (status) => {
    switch(status) {
        case 'DRAFT': return <span className="badge bg-secondary-subtle text-secondary">Draft</span>;
        case 'AVAILABLE': return <span className="badge bg-success-subtle text-success">Available</span>;
        case 'SOLD': return <span className="badge bg-danger-subtle text-danger">Sold</span>;
        case 'LEASED': return <span className="badge bg-info-subtle text-info">Leased</span>;
        case 'BOOKED': return <span className="badge bg-primary-subtle text-primary">Booked</span>;
        default: return <span className="badge bg-light text-dark">{status}</span>;
    }
};

const PropertyLists = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { properties, isLoading, isError, errorMessage } = useSelector(state => state.property);

    useEffect(() => {
        dispatch(fetchProperties());
    }, [dispatch]);

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="mb-0 fw-bold">Properties</h4>
                    <span className="text-muted">Real Estate / Properties</span>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/admin/add-property')}>
                    <i className="bi bi-plus-circle me-2"></i>Add Property
                </button>
            </div>

            {isError && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}

            {isLoading && properties.length === 0 ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : properties.length === 0 ? (
                <div className="text-center py-5">
                    <h5 className="text-muted">No properties found.</h5>
                    <button className="btn btn-outline-primary mt-3" onClick={() => navigate('/admin/add-property')}>
                        Add your first property
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    {properties.map(property => (
                        <div className="col-12 col-md-6 col-xl-4" key={property._id}>
                            <div 
                                className="card border-0 shadow-sm rounded-3 h-100 property-card" 
                                style={{cursor: 'pointer', transition: 'transform 0.2s ease-in-out'}}
                                onClick={() => navigate(`/admin/properties/${property._id}`)}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                            >
                                <div className="position-relative" style={{height: '220px', overflow: 'hidden', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                                    {property.images && property.images.length > 0 ? (
                                        <img src={property.images[0]} alt={property.title} className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <div className="w-100 h-100 bg-secondary d-flex justify-content-center align-items-center text-white">
                                            <i className="bi bi-image fs-1"></i>
                                        </div>
                                    )}
                                    <div className="position-absolute top-0 end-0 p-3">
                                        {getStatusBadge(property.status)}
                                    </div>
                                    <div className="position-absolute bottom-0 start-0 p-3 bg-gradient w-100" style={{background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'}}>
                                        <h5 className="text-white mb-0">${property.price?.toLocaleString()}</h5>
                                    </div>
                                </div>
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-2 text-truncate">{property.title}</h5>
                                    <p className="text-muted mb-3 fs-14">
                                        <i className="bi bi-geo-alt me-1"></i>{property.location}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
                                        <div className="d-flex align-items-center text-muted fs-14">
                                            <i className="bi bi-buildings me-2"></i>
                                            <span>{property.type}</span>
                                        </div>
                                        <div className="d-flex align-items-center text-muted fs-14">
                                            <i className="bi bi-arrows-fullscreen me-2"></i>
                                            <span>{property.area} sq.ft</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PropertyLists;
