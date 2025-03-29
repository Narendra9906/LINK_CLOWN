import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { toggle } from '../redux/slice/toggler'


const Logout = ({ setIsLoggedIn }) => {
    const isloggedin = useSelector((state) => state.toggle) // Fix here
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleLogout = () => {
        // Set isLoggedIn state to false
        dispatch(toggle());
        // Redirect the user to the login page
        navigate('/profile');
    };

    return (
        <div>
            <h2>You have been logged out successfully</h2>
            <button onClick={handleLogout}>Go to Login</button>
        </div>
    );
};

export default Logout;
