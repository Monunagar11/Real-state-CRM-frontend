import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/authSlice";
import * as Yup from "yup";
import { useFormik } from "formik";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, errorMessage, errors } = useSelector(
    (state) => state.auth
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log(values);
      const result = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        })
      );
      if (loginUser.fulfilled.match(result)) {
        navigate("/admin");
      } else if (loginUser.rejected.match(result)) {
        console.log(result.payload);
      }
    },
  });
  return (
    <div className="container">
      <section className="vh-100">
        <div className="containerh-100">
              <div className="card text-black mb-5">
                <div className="card-body p-md-5">
          <div className="row d-flex justify-content-center align-items-center h-100">
           
            <div className="col-md-9 col-lg-6 col-xl-5 ">
               
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample image"
              />
              
            </div>
            <div className="col-md-6 col-lg-4 col-xl-3 offset-xl-1">
              <form  onSubmit={formik.handleSubmit} noValidate>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-floating mx-1"
                  >
                    <i className="bi bi-google"></i>
                  </button>

                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-floating mx-1"
                  >
                    <i className="bi bi-facebook"></i>
                  </button>

                  <button
                    type="button"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-floating mx-1"
                  >
                    <i className="bi bi-linkedin"></i>
                  </button>
                </div>

                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0">Or</p>
                </div>

                {/* <!-- Email input --> */}
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                                formik.touched.email && formik.errors.email
                                  ? "is-invalid"
                                  : formik.touched.email
                                    ? "is-valid"
                                    : ""
                              }`}
                              placeholder="Your Email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <div className="invalid-feedback">
                                {formik.errors.email}
                              </div>
                            )}
                  <label className="form-label" htmlFor="email">
                    Email address
                  </label>
                </div>

                {/* <!-- Password input --> */}
                <div data-mdb-input-init className="form-outline mb-3">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`form-control ${
                                formik.touched.password &&
                                formik.errors.password
                                  ? "is-invalid"
                                  : formik.touched.password
                                    ? "is-valid"
                                    : ""
                              }`}
                              placeholder="Password"
                              value={formik.values.password}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.password &&
                              formik.errors.password && (
                                <div className="invalid-feedback">
                                  {formik.errors.password}
                                </div>
                              )}
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  {/* <!-- Checkbox --> */}
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="text-body">
                    Forgot password?
                  </a>
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="submit"
                    data-mdb-button-init
                    data-mdb-ripple-init
                    className="btn btn-primary btn-lg"
                    disabled={isLoading || formik.isSubmitting}
                    // style="padding-left: 2.5rem; padding-right: 2.5rem;"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </button>
                  {errorMessage && (
                    <div className="alert alert-danger mt-3">
                      {errorMessage}
                    </div>
                  )}
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{" "}
                    <NavLink to="/register" className="link-danger">
                      Register
                    </NavLink>
                  </p>
                </div>
              </form>
            </div>
            </div>
            </div>
            

          </div>
          
        </div>
        <div className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
          {/* <!-- Copyright --> */}
          <div className="text-white mb-3 mb-md-0">
            Copyright © 2020. All rights reserved.
          </div>
          {/* <!-- Copyright --> */}

          {/* <!-- Right --> */}
          <div>
            <a href="#!" className="text-white me-4">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#!" className="text-white me-4">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#!" className="text-white me-4">
              <i className="fab fa-google"></i>
            </a>
            <a href="#!" className="text-white">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          {/* <!-- Right --> */}
        </div>
      </section>
    </div>
  );
}

export default Login;
