import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      credentials: "include",
    });

    localStorage.removeItem("user");
    setUser(null);

    navigate("/");
  };

  return (
    <nav className="navbar">
      <div
        className="logo"
        style={{ fontSize: "24px", fontWeight: "700", color: "ghostwhite" }}
      >
        Lost&Found
      </div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          Home
        </NavLink>

        <NavLink
          to="/lost"
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          Lost
        </NavLink>

        <NavLink
          to="/found"
          className={({ isActive }) => (isActive ? "link active-link" : "link")}
        >
          Found
        </NavLink>

        {user && (
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "link active-link" : "link"
            }
          >
            Post Item
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/mylist"
            className={({ isActive }) =>
              isActive ? "link active-link" : "link"
            }
          >
            My Items
          </NavLink>
        )}
      </div>

      <div className="right-nav">
        {user && (
          <NavLink to="/notifications">
            {({ isActive }) => (
              <button
                className={isActive ? "login-btn active-link" : "notification-btn"}
              >
                Notifications
              </button>
            )}
          </NavLink>
        )}

        {!user ? (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "login-btn active-link" : "login-btn"
              }
            >
              Login
            </NavLink>

            <NavLink
              to="/createaccount"
              className={({ isActive }) =>
                isActive ? "login-btn active-link" : "login-btn"
              }
            >
              Sign Up
            </NavLink>
          </>
        ) : (
          <>
          
            <span className="username">{user.userName}</span>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
