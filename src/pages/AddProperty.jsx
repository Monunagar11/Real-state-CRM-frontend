import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createProperty, clearPropertyErrors } from '../features/property/propertySlice';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, isError, errorMessage } = useSelector(state => state.property);
    const [previewImages, setPreviewImages] = useState([]);

    const formik = useFormik({
        initialValues: {
            title: '',
            location: '',
            price: '',
            type: '',
            area: '',
            status: 'DRAFT',
            propertyImages: []
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            location: Yup.string().required('Location is required'),
            price: Yup.number().positive('Price must be positive').required('Price is required'),
            type: Yup.string().required('Property type is required'),
            area: Yup.number().positive('Area must be positive').required('Area is required'),
            status: Yup.string().required('Status is required'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('location', values.location);
            formData.append('price', values.price);
            formData.append('type', values.type);
            formData.append('area', values.area);
            formData.append('status', values.status);
            
            // Append files under the key expected by multer: 'propertyImages'
            if (values.propertyImages && values.propertyImages.length > 0) {
                for (let i = 0; i < values.propertyImages.length; i++) {
                    formData.append('propertyImages', values.propertyImages[i]);
                }
            } else {
                alert("Please select at least 1 image.");
                return;
            }

            dispatch(clearPropertyErrors());
            const resultAction = await dispatch(createProperty(formData));
            if (createProperty.fulfilled.match(resultAction)) {
                navigate('/admin/real-estate');
            }
        }
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            alert('You can only upload up to 5 images.');
            e.target.value = ''; // clear selection
            return;
        }
        formik.setFieldValue('propertyImages', files);
        
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h4 className="mb-0 fw-bold">Add Property</h4>
                    <span className="text-muted">Real Estate / Add Property</span>
                </div>
            </div>

            {isError && (
                <div className="alert alert-danger">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={formik.handleSubmit}>
                <div className="row g-4">
                    <div className="col-lg-8">
                        {/* Property Details Card */}
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-transparent border-bottom pt-4 pb-3">
                                <h5 className="mb-0 fw-bold">Property Details</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label">Property Title <span className="text-danger">*</span></label>
                                    <input 
                                        type="text" 
                                        className={`form-control bg-light ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                        name="title"
                                        placeholder="Enter property title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.title && formik.errors.title && <div className="invalid-feedback">{formik.errors.title}</div>}
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Property Type <span className="text-danger">*</span></label>
                                        <select 
                                            className={`form-select bg-light ${formik.touched.type && formik.errors.type ? 'is-invalid' : ''}`}
                                            name="type"
                                            value={formik.values.type}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="">Select type...</option>
                                            <option value="Apartment">Apartment</option>
                                            <option value="Villa">Villa</option>
                                            <option value="Commercial">Commercial</option>
                                            <option value="Residential">Residential</option>
                                        </select>
                                        {formik.touched.type && formik.errors.type && <div className="invalid-feedback">{formik.errors.type}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Status <span className="text-danger">*</span></label>
                                        <select 
                                            className={`form-select bg-light ${formik.touched.status && formik.errors.status ? 'is-invalid' : ''}`}
                                            name="status"
                                            value={formik.values.status}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
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
                                        {formik.touched.status && formik.errors.status && <div className="invalid-feedback">{formik.errors.status}</div>}
                                    </div>
                                </div>

                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Location <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            className={`form-control bg-light ${formik.touched.location && formik.errors.location ? 'is-invalid' : ''}`}
                                            name="location"
                                            placeholder="E.g. New York, USA"
                                            value={formik.values.location}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.location && formik.errors.location && <div className="invalid-feedback">{formik.errors.location}</div>}
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Price ($) <span className="text-danger">*</span></label>
                                        <input 
                                            type="number" 
                                            className={`form-control bg-light ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''}`}
                                            name="price"
                                            placeholder="E.g. 2500"
                                            value={formik.values.price}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.price && formik.errors.price && <div className="invalid-feedback">{formik.errors.price}</div>}
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Area (sq.ft) <span className="text-danger">*</span></label>
                                        <input 
                                            type="number" 
                                            className={`form-control bg-light ${formik.touched.area && formik.errors.area ? 'is-invalid' : ''}`}
                                            name="area"
                                            placeholder="E.g. 1500"
                                            value={formik.values.area}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.area && formik.errors.area && <div className="invalid-feedback">{formik.errors.area}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        {/* Property Images Card */}
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-header bg-transparent border-bottom pt-4 pb-3">
                                <h5 className="mb-0 fw-bold">Property Images</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <label className="form-label">Upload Images (Max 5) <span className="text-danger">*</span></label>
                                    <input 
                                        type="file" 
                                        className="form-control bg-light" 
                                        name="propertyImages"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <div className="form-text mt-2">Uploading images is required.</div>
                                </div>
                                {previewImages.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        {previewImages.map((src, index) => (
                                            <div key={index} style={{ width: '80px', height: '80px', overflow: 'hidden', borderRadius: '8px' }}>
                                                <img src={src} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="d-flex gap-2 justify-content-end">
                            <button type="button" className="btn btn-light px-4" onClick={() => navigate(-1)}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-4" disabled={isLoading}>
                                {isLoading ? (
                                    <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</span>
                                ) : (
                                    "Save Property"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProperty;
