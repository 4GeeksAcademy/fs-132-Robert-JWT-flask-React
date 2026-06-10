import { useState } from "react"
import authService from "../services/auth.service"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useNavigate, Link } from "react-router-dom";

const Auth = ({ type }) => {
    const { dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const data = await authService.auth({ ...formData, type });

        if (type === 'register') {
            if (data?.success) navigate('/login'); // registrado -> al login
            else alert(data?.data || "Error en el registro");
        } else {
            if (data?.token) {
                dispatch({ type: 'auth', payload: { user: data.data } });
                navigate('/private'); // login ok -> a la privada
            } else alert(data?.data || "Email o contraseña incorrectos");
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">{type === 'register' ? 'Registro' : 'Iniciar sesión'}</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-3" name="email" type="email" placeholder="Email"
                    value={formData.email} onChange={handleChange} required />
                <input className="form-control mb-3" name="password" type="password" placeholder="Contraseña"
                    value={formData.password} onChange={handleChange} required />
                <button className={`btn w-100 ${type === 'register' ? 'btn-primary' : 'btn-success'}`} type="submit">
                    {type === 'register' ? 'Crear cuenta' : 'Entrar'}
                </button>
            </form>
            <p className="text-center mt-3">
                {type === 'register'
                    ? <>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></>
                    : <>¿No tienes cuenta? <Link to="/signup">Regístrate</Link></>}
            </p>
        </div>
    )
}

export default Auth