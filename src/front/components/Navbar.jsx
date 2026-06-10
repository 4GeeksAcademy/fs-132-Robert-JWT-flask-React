import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import authService from "../services/auth.service";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate();

	const handleLogout = () => {
		authService.logout();
		dispatch({ type: "logout" });
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="d-flex gap-2">
					{store.auth ? (
						<>
							<Link to="/private" className="btn btn-outline-primary">Private</Link>
							<button className="btn btn-danger" onClick={handleLogout}>Logout</button>
						</>
					) : (
						<>
							<Link to="/login" className="btn btn-outline-success">Login</Link>
							<Link to="/signup" className="btn btn-outline-primary">Signup</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};