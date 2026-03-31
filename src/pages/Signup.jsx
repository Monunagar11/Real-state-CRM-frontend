import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/user/authSlice";

const signupSchema = Yup.object({
  username: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  terms: Yup.boolean()
    .oneOf([true], "You must accept the Terms of Service")
    .required("You must accept the Terms of Service"),
});

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, errorMessage, errors } = useSelector(
    (state) => state.auth
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      terms: false,
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      console.log(values);
      const result = await dispatch(
        registerUser({
          username: values.username,
          email: values.email,
          password: values.password,
          phone: values.phone,
        })
      );
      if (registerUser.fulfilled.match(result)) {
        navigate("/");
      } else if (registerUser.rejected.match(result)) {
        console.log(result.payload);
      }
    },
  });

  return (
    <div className="container">
      <section className="vh-100">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black">
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    {/* ── Form Column ── */}
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Sign up
                      </p>

                      <form
                        className="mx-1 mx-md-4"
                        onSubmit={formik.handleSubmit}
                        noValidate
                      >
                        {/* Name */}
                        <div className="d-flex flex-row align-items-start mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw mt-2"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="username"
                              name="username"
                              className={`form-control ${
                                formik.touched.username &&
                                formik.errors.username
                                  ? "is-invalid"
                                  : formik.touched.username
                                    ? "is-valid"
                                    : ""
                              }`}
                              placeholder="Your Name"
                              value={formik.values.username}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.username &&
                              formik.errors.username && (
                                <div className="invalid-feedback">
                                  {formik.errors.username}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="d-flex flex-row align-items-start mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw mt-2"></i>
                          <div className="form-outline flex-fill mb-0">
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
                          </div>
                        </div>

                        {/* Password */}
                        <div className="d-flex flex-row align-items-start mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw mt-2"></i>
                          <div className="form-outline flex-fill mb-0">
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
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="d-flex flex-row align-items-start mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw mt-2"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              className={`form-control ${
                                formik.touched.confirmPassword &&
                                formik.errors.confirmPassword
                                  ? "is-invalid"
                                  : formik.touched.confirmPassword
                                    ? "is-valid"
                                    : ""
                              }`}
                              placeholder="Repeat your password"
                              value={formik.values.confirmPassword}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.confirmPassword &&
                              formik.errors.confirmPassword && (
                                <div className="invalid-feedback">
                                  {formik.errors.confirmPassword}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Phone*/}
                        <div className="d-flex flex-row align-items-start mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw mt-2"></i>
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              id="phone"
                              name="phone"
                              className={`form-control ${
                                formik.touched.phone && formik.errors.phone
                                  ? "is-invalid"
                                  : formik.touched.phone
                                    ? "is-valid"
                                    : ""
                              }`}
                              placeholder="Your Phone"
                              value={formik.values.phone}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                              <div className="invalid-feedback">
                                {formik.errors.phone}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Terms */}
                        <div className="form-check d-flex justify-content-center mb-5">
                          <input
                            className={`form-check-input me-2 ${
                              formik.touched.terms && formik.errors.terms
                                ? "is-invalid"
                                : ""
                            }`}
                            type="checkbox"
                            id="terms"
                            name="terms"
                            checked={formik.values.terms}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label className="form-check-label" htmlFor="terms">
                            I agree to all statements in{" "}
                            <a href="#!">Terms of Service</a>
                          </label>
                          {formik.touched.terms && formik.errors.terms && (
                            <div className="invalid-feedback d-block text-center">
                              {formik.errors.terms}
                            </div>
                          )}
                        </div>

                        {/* Server error */}
                        {errorMessage && (
                          <div
                            className="alert alert-danger py-2 mb-3"
                            role="alert"
                          >
                            <p className="mb-0 fw-semibold text-center">
                              {errorMessage}
                            </p>
                            {errors && errors.length > 0 && (
                              <ul className="mb-0 mt-1 ps-3">
                                {errors.map((err, idx) => (
                                  <li key={idx} className="small">
                                    {typeof err === "string"
                                      ? err
                                      : err.message || JSON.stringify(err)}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {/* Submit */}
                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={isLoading || formik.isSubmitting}
                          >
                            {isLoading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Registering...
                              </>
                            ) : (
                              "Register"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* ── Image Column ── */}
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        alt="Sign up illustration"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
