import { useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer"
import authService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

const Private = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            navigate('/login'); // sin token -> fuera
            return;
        }
        if (!store.user) {
            authService.getMe().then(data => {
                if (data) dispatch({ type: 'auth', payload: { user: data.data } });
                else { // token inválido o expirado
                    authService.logout();
                    navigate('/login');
                }
            });
        }
    }, []);

    return (
        <div className="container text-center mt-5">
            <h1>Bienvenido {store.user?.email}</h1>
            <p>... so private ...</p>
        </div>
    );
}

export default Private