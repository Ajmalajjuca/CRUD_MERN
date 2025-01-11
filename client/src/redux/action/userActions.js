import axios from 'axios';

export const fetchUsers = () => async (dispatch) => {
    try {
        const { data } = await axios.get('/api/users/all-users'); // Adjust the API endpoint path
        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data.users });
    } catch (error) {
        console.error("Error fetching users:", error);
        dispatch({ type: 'FETCH_USERS_FAIL', payload: error.message });
    }
};