import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const App = () => {
    const [isRegistering, setIsRegistering] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleForm = () => {
        setIsRegistering((prev) => !prev);
        setError('');
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !phoneNumber) {
            setError('All fields are required');
            return;
        }

        setError('');
        setLoading(true);

        const data = { name, email, password, phoneNumber };

        try {
            const response = await axios.post('http://localhost:3000/register', data);
            console.log('Response:', response);
            
            setError('');
            setName('');
            setEmail('');
            setPassword('');
            setPhoneNumber('');

            if(response.status === 201 || response.status === 200){
              navigate('/');
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Login form submit handler
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setError('');
        setLoading(true);

        const data = { email, password };

        try {
            const response = await axios.post('http://localhost:3000/login', data);
            console.log('Login Response:', response.data);
            setError('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                {isRegistering && (
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                )}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                {isRegistering && (
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="phoneNumber">Phone Number:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                    }}
                    disabled={loading}
                >
                    {loading ? (isRegistering ? 'Registering...' : 'Logging in...') : isRegistering ? 'Register' : 'Login'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
                {isRegistering ? (
                    <span>
                        Already have an account?{' '}
                        <button onClick={toggleForm} style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer' }}>
                            Login here
                        </button>
                    </span>
                ) : (
                    <span>
                        Don't have an account?{' '}
                        <button onClick={toggleForm} style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer' }}>
                            Register here
                        </button>
                    </span>
                )}
            </p>
        </div>
    );
};

export default App;
