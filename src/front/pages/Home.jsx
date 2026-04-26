import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { json } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()
	const backendUrl = import.meta.env.VITE_BACKEND_URL
	const [user, setUser] = useState({})
	const [auth, setAuth] = useState(false)
	const [loginData, setLoginData] = useState({
		email: '',
		password: ''
	});

	const [registerData, setRegisterData] = useState({
		email: '',
		password: ''
	});

	const handleRegisterChange = (e) => {
		const { name, value } = e.target;
		setRegisterData({ ...registerData, [name]: value })
	}

	const handleLoginChange = (e) => {
		const { name, value } = e.target;
		setLoginData({ ...loginData, [name]: value })
	}

	const handleRegister = async e => {
		e.preventDefault();
		try {
			const resp = await fetch(backendUrl + "/api/register", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json',
				},
				body: JSON.stringify(registerData)
			})
			if (!resp.ok) throw new Error("failed register");
			const data = await resp.json()
			console.log(data)

		} catch (error) {
			console.log(erorr)
		}
	}

	const handleLogin = async e => {
		e.preventDefault();
		try {
			const resp = await fetch(backendUrl + "/api/login", {
				method: "POST",
				headers: {
					"Content-Type": 'application/json',
				},
				body: JSON.stringify(loginData)
			})
			if (!resp.ok) throw new Error("failed login");
			const data = await resp.json()
			console.log(data)
			// guardamos en token en el localStorage para que persista
			localStorage.setItem('token', data.token)
			setAuth(true)

		} catch (error) {
			console.log(erorr)
		}
	}

	const getUserInfo = async () => {
		try {
			const resp = await fetch(backendUrl + "/api/me", {
				method: "GET",
				headers: {
					"Content-Type": 'application/json',
					"Authorization": "Bearer " + localStorage.getItem('token') // aqui enviamos el token al backend
				}
			})
			if (!resp.ok) throw new Error('who are you?')
			const data = await resp.json()
			console.log(data)
			setUser(data.data)
		} catch (error) {

		}
	}

	useEffect(() => {
		if (!auth && localStorage.getItem('token')) setAuth(true)
		//if (auth) getUserInfo()
	}, [])

	useEffect(() => {
		if (auth) getUserInfo()
	}, [auth])

	const handleLogout = () => {
		setAuth(false)
		localStorage.removeItem('token')
	}


	return (
		<div className="text-center mt-5">
			<p className="fs-5 lead">Register</p>
			<form onSubmit={handleRegister}>
				<input type="email" name='email' value={registerData.email} onChange={handleRegisterChange} />
				<input type="password" name='password' value={registerData.password} onChange={handleRegisterChange} />
				<input type="submit" />
			</form>

			<p className="fs-5 lead">Login</p>
			<form onSubmit={handleLogin}>
				<input type="email" name='email' value={loginData.email} onChange={handleLoginChange} />
				<input type="password" name='password' value={loginData.password} onChange={handleLoginChange} />
				<input type="submit" />
			</form>

			{auth && <div>
				<button onClick={handleLogout}>
					logout
				</button>
				<p>Welcome {user.email}</p>
			</div>}

		</div>
	);
}; 