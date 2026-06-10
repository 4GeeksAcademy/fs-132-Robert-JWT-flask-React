import { useState } from "react"
import authService from "../services/auth.service"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const { dispatch} = useGlobalReducer();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        type: 'login',
    })

    const handleType = () => {
        setFormData({ ...formData, type: formData.type === 'register' ? 'login' : "register" })
    }


    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }


    const handleSubmit = e => {
        e.preventDefault()
        authService.auth(formData).then(data => {
            dispatch({
            type: 'auth',
            payload: {
                user: data.data
            }
        })
        navigate('/private')
        }
    )
    }




    return (
        <>
            <form onSubmit={handleSubmit}>
                <button role="button" type="button" onClick={handleType}>
                    change to {formData.type === 'register' ? 'login' : "register"}
                </button>
                <p>{formData.type}</p>



                <input name="email" value={formData.email} onChange={handleChange} type="email" />
                <input name="password" value={formData.password} onChange={handleChange} type="password" />
                <input type="submit" />
            </form>
        </>
    )


}

export default Auth