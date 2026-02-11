import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Indian Trading Platform
      </Link>

      <div>
        {token ? (
          <>
            <Link className="btn btn-outline-light me-2" to="/dashboard">
              Dashboard
            </Link>

            <Link className="btn btn-outline-light me-2" to="/profile">
              Profile
            </Link>
	    
            <Link className="btn btn-outline-light me-2" to="/watchlist">
             Watchlist
            </Link>
	  
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-light me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-light" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
