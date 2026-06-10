import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Private = () => {
    const {store, dispatch} = useGlobalReducer();
    const navigate = useNavigate()
    
    useEffect(()=>{
        if (localStorage.getItem('token') && !store.user) {
            authService.getMe().then(data => dispatch({
            type: 'auth',
            payload: {
                user: data.data
            }
        }))
        }
        if (!localStorage.getItem('token')) navigate('/') 
    },[store.auth])

const handleLogout = () => {
    authService.logout()
    dispatch({
        type: "logout"
    })
}
    return (
        <div>
            ... so private ...
            <h1>Welcome {store.user?.email}</h1>

            <button onClick={handleLogout}>logout</button>

        </div>
    )
}

export default Private