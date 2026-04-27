import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateProfile, updatePassword } from '../features/user/authSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('overview');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const profileFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user?.username || '',
            phone: user?.phone || '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            phone: Yup.string().required('Phone number is required'),
        }),
        onSubmit: async (values) => {
            setProfileSuccess('');
            const resultAction = await dispatch(updateProfile(values));
            if (updateProfile.fulfilled.match(resultAction)) {
                setProfileSuccess('Profile updated successfully!');
            }
        }
    });

    const passwordFormik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string().required('New password is required').min(6, 'Password must be at least 6 characters'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                .required('Confirm password is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            setPasswordSuccess('');
            const resultAction = await dispatch(updatePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            }));
            if (updatePassword.fulfilled.match(resultAction)) {
                setPasswordSuccess('Password changed successfully!');
                resetForm();
            }
        }
    });

    return (
        <div className="container-fluid py-4" style={{ minHeight: '100vh' }}>
            {/* Header / Cover */}
            <div className="position-relative mb-5" style={{ height: '200px', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{
                    background: 'linear-gradient(90deg, #4F46E5 0%, #818CF8 100%)',
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1
                }}></div>
                <div className="position-absolute w-100 h-100 bg-black opacity-25" style={{ zIndex: 2 }}></div>
            </div>

            <div className="row">
                <div className="col-xl-3">
                    <div className="card border-0 shadow-sm rounded-3 text-center mb-4" style={{ marginTop: '-80px', position: 'relative', zIndex: 3 }}>
                        <div className="card-body p-4">
                            <div className="mx-auto mb-3" style={{ width: '120px', height: '120px' }}>
                                <img src={`https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=fff&color=4F46E5&size=120`} alt="Profile" className="img-thumbnail rounded-circle p-1 bg-body" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <h4 className="fw-bold mb-1">{user?.username || 'Admin User'}</h4>
                            <p className="text-muted mb-3">{user?.email || 'admin@example.com'}</p>
                            
                            <div className="d-flex justify-content-center gap-2">
                                <button className="btn btn-primary btn-sm px-4">Follow</button>
                                <button className="btn btn-light btn-sm px-4">Message</button>
                            </div>

                            <hr className="my-4 border-bottom" />

                            <div className="text-start">
                                <h6 className="fw-semibold mb-3 text-uppercase text-muted" style={{ fontSize: '13px', letterSpacing: '1px' }}>Complete your profile</h6>
                                <div className="progress bg-light" style={{ height: '8px' }}>
                                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '85%' }} aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <small className="text-muted">Profile Complete</small>
                                    <small className="fw-bold text-success">85%</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-9">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-header bg-transparent border-bottom pt-3 pb-0">
                            <ul className="nav nav-tabs nav-tabs-custom border-bottom-0" role="tablist">
                                <li className="nav-item">
                                    <a className={`nav-link fw-semibold px-4 pb-3 ${activeTab === 'overview' ? 'active text-primary' : 'text-muted'}`} 
                                       style={{ cursor: 'pointer', borderBottom: activeTab === 'overview' ? '2px solid #4F46E5' : 'none' }}
                                       onClick={() => setActiveTab('overview')}>
                                        Overview
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link fw-semibold px-4 pb-3 ${activeTab === 'settings' ? 'active text-primary' : 'text-muted'}`} 
                                       style={{ cursor: 'pointer', borderBottom: activeTab === 'settings' ? '2px solid #4F46E5' : 'none' }}
                                       onClick={() => setActiveTab('settings')}>
                                        Settings
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="card-body p-4">
                            {activeTab === 'overview' && (
                                <div>
                                    <h5 className="fw-bold mb-4">About</h5>
                                    <p className="text-muted mb-4" style={{ lineHeight: '1.8' }}>
                                        Hi I'm {user?.username || 'Admin'}, a dedicated professional working in the real estate sector.
                                        I specialize in managing properties, leads, and client relations seamlessly.
                                    </p>
                                    
                                    <div className="row g-4 mt-2">
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <i className="bi bi-person-badge fs-3 text-primary bg-primary bg-opacity-10 rounded p-2"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <p className="text-muted mb-1 fs-sm">Full Name</p>
                                                    <h6 className="mb-0 fw-semibold">{user?.username || 'N/A'}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <i className="bi bi-telephone fs-3 text-success bg-success bg-opacity-10 rounded p-2"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <p className="text-muted mb-1 fs-sm">Mobile Number</p>
                                                    <h6 className="mb-0 fw-semibold">{user?.phone || 'N/A'}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <i className="bi bi-envelope fs-3 text-warning bg-warning bg-opacity-10 rounded p-2"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <p className="text-muted mb-1 fs-sm">Email Address</p>
                                                    <h6 className="mb-0 fw-semibold">{user?.email || 'N/A'}</h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0">
                                                    <i className="bi bi-geo-alt fs-3 text-info bg-info bg-opacity-10 rounded p-2"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <p className="text-muted mb-1 fs-sm">Location</p>
                                                    <h6 className="mb-0 fw-semibold">California, USA</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div>
                                    <h5 className="fw-bold mb-4 border-bottom pb-3">Personal Details</h5>
                                    
                                    {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

                                    <form onSubmit={profileFormik.handleSubmit} className="mb-5">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Username</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control bg-light ${profileFormik.touched.username && profileFormik.errors.username ? 'is-invalid' : ''}`}
                                                    name="username"
                                                    value={profileFormik.values.username}
                                                    onChange={profileFormik.handleChange}
                                                    onBlur={profileFormik.handleBlur}
                                                />
                                                {profileFormik.touched.username && profileFormik.errors.username && (
                                                    <div className="invalid-feedback">{profileFormik.errors.username}</div>
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Phone Number</label>
                                                <input 
                                                    type="text" 
                                                    className={`form-control bg-light ${profileFormik.touched.phone && profileFormik.errors.phone ? 'is-invalid' : ''}`}
                                                    name="phone"
                                                    value={profileFormik.values.phone}
                                                    onChange={profileFormik.handleChange}
                                                    onBlur={profileFormik.handleBlur}
                                                />
                                                {profileFormik.touched.phone && profileFormik.errors.phone && (
                                                    <div className="invalid-feedback">{profileFormik.errors.phone}</div>
                                                )}
                                            </div>
                                            <div className="col-12 mt-4 text-end">
                                                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                                    {isLoading ? 'Updating...' : 'Updates Changes'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    <h5 className="fw-bold mb-4 border-bottom pb-3">Change Password</h5>
                                    
                                    {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

                                    <form onSubmit={passwordFormik.handleSubmit}>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label">Old Password*</label>
                                                <input 
                                                    type="password" 
                                                    className={`form-control bg-light ${passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword ? 'is-invalid' : ''}`}
                                                    name="oldPassword"
                                                    placeholder="Enter current password"
                                                    value={passwordFormik.values.oldPassword}
                                                    onChange={passwordFormik.handleChange}
                                                    onBlur={passwordFormik.handleBlur}
                                                />
                                                {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword && (
                                                    <div className="invalid-feedback">{passwordFormik.errors.oldPassword}</div>
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">New Password*</label>
                                                <input 
                                                    type="password" 
                                                    className={`form-control bg-light ${passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? 'is-invalid' : ''}`}
                                                    name="newPassword"
                                                    placeholder="Enter new password"
                                                    value={passwordFormik.values.newPassword}
                                                    onChange={passwordFormik.handleChange}
                                                    onBlur={passwordFormik.handleBlur}
                                                />
                                                {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                                                    <div className="invalid-feedback">{passwordFormik.errors.newPassword}</div>
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Confirm Password*</label>
                                                <input 
                                                    type="password" 
                                                    className={`form-control bg-light ${passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? 'is-invalid' : ''}`}
                                                    name="confirmPassword"
                                                    placeholder="Confirm password"
                                                    value={passwordFormik.values.confirmPassword}
                                                    onChange={passwordFormik.handleChange}
                                                    onBlur={passwordFormik.handleBlur}
                                                />
                                                {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                                                    <div className="invalid-feedback">{passwordFormik.errors.confirmPassword}</div>
                                                )}
                                            </div>
                                            <div className="col-12 mt-4 text-end">
                                                <button type="submit" className="btn btn-success" disabled={isLoading}>
                                                    {isLoading ? 'Changing...' : 'Change Password'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
