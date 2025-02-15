import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login(props) {
    const [credentials, setCredentials] = useState({ email: "", password: "", showPassword: false });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    let history = useNavigate();

    const validateForm = () => {
        let newErrors = {};
        if (!credentials.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            newErrors.email = "Enter a valid email address.";
        }
        if (!credentials.password) {
            newErrors.password = "Password is required.";
        } else if (credentials.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const handleViewPassword = () => {
        setCredentials({ ...credentials, showPassword: !credentials.showPassword });
    };

    const handleClick = async () => {
        // Validate the form before submitting
        if (!validateForm()) {
            props.showAlert("Please fix the errors before submitting.", "warning");
            return;
        }

        setIsLoading(true); // Start loading state

        try {
            const response = await fetch("https://i-notebook-backend-j6mz.vercel.app/api/auth/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: credentials.email, password: credentials.password }),
            });

            const json = await response.json();

            // Handle non-OK responses (e.g., 400, 500)
            if (!response.ok) {
                if (json.error) {
                    // Display backend-specific error message
                    props.showAlert(json.error, "danger");
                } else {
                    // Generic error message for non-OK responses
                    props.showAlert("Something went wrong. Please try again.", "danger");
                }
                return;
            }

            // Handle successful login
            if (json.success) {
                localStorage.setItem('token', json.authtoken); // Store the token in localStorage
                history("/"); // Redirect to home page
                props.showAlert("Logged in successfully!", "success");
            } else {
                // Handle cases where success is false (e.g., invalid credentials)
                props.showAlert("Invalid credentials. Please try again.", "danger");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            // Handle network errors or unexpected issues
            props.showAlert("Failed to connect to the server. Please try again later.", "danger");
        } finally {
            setIsLoading(false); // Stop loading state
        }
    };

    return (
        <div>
            <div className='text-center mt-5 mb-4'>
                {isLoading && <h3>Trying to connect to the server. Please wait...</h3>}
                <h1>INotebook</h1>
                <p><b>Your notes on the cloud ☁️</b></p>
            </div>

            <div className="container form">
                <p className="text-center"><i>Login to continue using INotebook 😊</i></p>

                <div className="mb-4 input-container">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onchange} id="email" name="email" placeholder="name@example.com" autoComplete='on' />
                    {errors.email && <span className='error'><i className="fa fa-info-circle"></i> {errors.email}</span>}
                </div>

                <div className="mb-4 input-container">
                    <label htmlFor="password" className="form-label">Password</label>
                    <i className={`fa fa-eye${credentials.showPassword ? "-slash" : ""} view-password`} onClick={handleViewPassword}></i>
                    <input type={credentials.showPassword ? 'text' : 'password'} className="form-control" onChange={onchange} id="password" name="password" autoComplete='on' />
                    {errors.password && <span className='error'><i className="fa fa-info-circle"></i> {errors.password}</span>}
                </div>
            </div>

            <div className='text-center'>
                <button className='btn btn-primary' onClick={handleClick} disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </div>

            <br />
            <p className='text-center last-para'>Don't have an account? <Link to="/Signup">Sign Up →</Link></p>
        </div>
    );
}

export default Login;
