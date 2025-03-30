import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { toggle } from '../redux/slice/toggler'

const App = () => {
    const isloggedin = useSelector((state) => state.toggle) // Fix here
    const dispatch = useDispatch()

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
                dispatch(toggle());
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
            if(response.status === 201 || response.status === 200){
                dispatch(toggle());
                navigate('/');
            }
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
        <div  style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginTop: '100px', marginBottom: '50px'}}>
            <h2 className='font-semibold text-xl text-center text-gray-800 mb-4'>
                {isRegistering ? 'Register' : 'Login'}
            </h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                {isRegistering && (
                    <div className='mb-4 flex items-center'>
                        <label htmlFor="name" className='text-sm font-medium text-gray-700 mr-2 w-32'>Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className='px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'
                        />
                    </div>
                )}
                <div className='mb-4 flex items-center'>
                    <label htmlFor="email" className='text-sm font-medium text-gray-700 mr-2 w-32'>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className='px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'
                    />
                </div>
                <div className='mb-4 flex items-center'>
                    <label htmlFor="password" className='text-sm font-medium text-gray-700 mr-2 w-32'>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className='px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'
                    />
                </div>
                {isRegistering && (
                    <div className='mb-4 flex items-center'>
                        <label htmlFor="phoneNumber" className='text-sm font-medium text-gray-700 mr-2 w-32'>Phone Number:</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className='px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full'
                            placeholder="1234567890"
                            title="Format: 123-456-7890"
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
                    <span className='text-sm text-gray-600 flex items-center justify-center'>
                        Already have an account?{' '}
                        <button onClick={toggleForm} className='ml-1' style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer' }}>
                            Login here
                        </button>
                    </span>
                ) : (
                    <span className='text-sm text-gray-600 flex items-center justify-center'>
                        Don't have an account?{' '}
                        <button onClick={toggleForm} className='ml-1 ' style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer' }}>
                            Register here
                        </button>
                    </span>
                )}
            </p>
        </div>
    );
};

export default App;
