import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp(props) {
    const [credentials, setCredentials] = useState({ email: "", name: "", password: "", cpassword: "", showPassword: false, showConfirmPassword: false });
    const [isLoading, setIsLoading] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    let history = useNavigate();

    const onchange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });

        // Validate password in real-time
        if (name === "password") {
            validatePassword(value);
        }
    };

    const validatePassword = (password) => {
        setPasswordErrors({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const handleViewPassword = (e) => {
        if (e.target.id === "password") {
            setCredentials({
                ...credentials,
                showPassword: !credentials.showPassword,
            });
        } else {
            setCredentials({
                ...credentials,
                showConfirmPassword: !credentials.showConfirmPassword,
            });
        }
    };

    const validateForm = () => {
        const { email, name, password, cpassword } = credentials;

        // Check if any field is empty
        if (!email || !name || !password || !cpassword) {
            props.showAlert("All fields are required", "danger");
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            props.showAlert("Please enter a valid email address", "danger");
            return false;
        }

        // Check if passwords match
        if (password !== cpassword) {
            props.showAlert("Passwords do not match", "danger");
            return false;
        }

        // Check if password meets all requirements
        if (!Object.values(passwordErrors).every((val) => val)) {
            props.showAlert("Password does not meet all requirements", "danger");
            return false;
        }

        return true;
    };

    const handleClick = async (e) => {
        e.preventDefault();

        // Validate form before making the API call
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("https://i-notebook-backend-j6mz.vercel.app/api/auth/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: credentials.email, name: credentials.name, password: credentials.password, cpassword: credentials.cpassword }),
            });

            const json = await response.json();

            if (json.success) {
                setIsLoading(false);
                localStorage.setItem('token', json.authtoken);
                history("/");
                props.showAlert("Account created successfully", "success");
            } else {
                setIsLoading(false);
                props.showAlert(json.error || "Invalid credentials", "danger");
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Fetch error:", error);
            props.showAlert("Failed to connect to the server. Please try again later.", "danger");
        }
    };

    return (
        <>
          
            <div className='container mt-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card shadow'>
                            <div className='card-body'>
                                <div className='text-center mb-4'>
                                    <h1>INotebook</h1>
                                    <p className='text-muted'><b>Your notes on cloud ☁️</b></p>
                                    {isLoading && <div className="spinner-border text-primary" role="status"></div>}
                                </div>
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input type="email" className="form-control" onChange={onchange} id="email" name="email" placeholder="name@example.com" autoComplete='on' required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input type="text" className="form-control" onChange={onchange} id="name" name="name" autoComplete='on' required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group">
                                            <input type={credentials.showPassword ? 'text' : 'password'} className="form-control" onChange={onchange} id="password" name="password" autoComplete='on' required />
                                            <button className="btn btn-outline-secondary" type="button" onClick={handleViewPassword} id="password">
                                                <i className={`fa fa-eye${credentials.showPassword ? "-slash" : ""}`}></i>
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            <small>Password must meet the following requirements:</small>
                                            <ul className="list-unstyled">
                                                <li className={passwordErrors.minLength ? 'text-success' : 'text-danger'}>
                                                    {passwordErrors.minLength ? '✓' : '✗'} At least 8 characters
                                                </li>
                                                <li className={passwordErrors.hasUppercase ? 'text-success' : 'text-danger'}>
                                                    {passwordErrors.hasUppercase ? '✓' : '✗'} At least one uppercase letter
                                                </li>
                                                <li className={passwordErrors.hasLowercase ? 'text-success' : 'text-danger'}>
                                                    {passwordErrors.hasLowercase ? '✓' : '✗'} At least one lowercase letter
                                                </li>
                                                <li className={passwordErrors.hasNumber ? 'text-success' : 'text-danger'}>
                                                    {passwordErrors.hasNumber ? '✓' : '✗'} At least one number
                                                </li>
                                                <li className={passwordErrors.hasSpecialChar ? 'text-success' : 'text-danger'}>
                                                    {passwordErrors.hasSpecialChar ? '✓' : '✗'} At least one special character
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                                        <div className="input-group">
                                            <input type={credentials.showConfirmPassword ? 'text' : 'password'} className="form-control" onChange={onchange} id="cpassword" name="cpassword" autoComplete='on' required />
                                            <button className="btn btn-outline-secondary" type="button" onClick={handleViewPassword} id="confirm-password">
                                                <i className={`fa fa-eye${credentials.showConfirmPassword ? "-slash" : ""}`}></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='text-center'>
                                        <button type="submit" className='btn btn-primary w-100' onClick={handleClick}>SignUp</button>
                                    </div>
                                </form>
                                <div className='text-center mt-3'>
                                    <p className='text-muted'>Already have an account? <Link to="/login">Login</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignUp;