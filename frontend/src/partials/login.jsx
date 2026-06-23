import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import { useUser } from "./UserContext";
import { useRef } from "react";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPsw, setShowPsw] = useState(false);
  const refEmail = useRef(null);

  useEffect(()=>{
      refEmail.current?.focus();
    }, []);


  const handle = async (e) => {
    e.preventDefault();

    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.msg === "Logged In") {
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/user/current-user`, {
          credentials: "include",
        });

        const userData = await userRes.json();

        setUser(userData.user);

        localStorage.setItem("user", JSON.stringify(userData.user));

        navigate("/");
      } else {
        alert(data.msg);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />

      <br />

      <form onSubmit={handle} style={{marginLeft : "8px"}}>
        Email : {" "}
        <input
          type="text"
          ref={refEmail}
          className="ip"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        Password :{" "}
        <input
          type= {showPsw ? "text" : "password"}
          className="ip"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={()=>setShowPsw(!showPsw)} className="showhide"> {showPsw ? "Hide" : "Show"}</button>
        <br />
        <br />
        <button type="submit" className="btn">
          Login
        </button>
      </form>
    </>
  );
}

export default Login;
