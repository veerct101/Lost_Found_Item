import Navbar from "../partials/navbar";
import "../index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useRef } from "react";

function Createaccount() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [showPsw, setShowPsw] = useState(false);
  const navigate = useNavigate();
  const refName = useRef(null);
  const refOTP = useRef(null);

  useEffect(() => {
    if (!showOtp) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  useEffect(() => {
    refName.current?.focus();
  }, []);
  useEffect(() => {
    if (showOtp) {
      refOTP.current?.focus();
    }
  }, [showOtp]);

  const OTPCreate = async (e) => {
    e.preventDefault();

    if (!ValidatePassword(password)) {
      return;
    }

    setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/user/createaccount`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      },
    ).catch(() => {
      window.alert("Something went wrong please try again");
      navigate("/");
    });

    if (!res) {
      setLoading(false);
      return;
    }

    const resp = await res.json();

    if (res.ok) {
      setTimeLeft(300);
      setShowOtp(true);
    }

    setLoading(false);
    window.alert(resp.msg);
  };

  const OTPVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        otp,
      }),
    }).catch(() => {
      window.alert("Something went wrong please try again");
      navigate("/");
    });

    if (!res) {
      setLoading(false);
      return;
    }

    const resp = await res.json();

    setLoading(false);

    if (res.status === 429) {
      setTimeLeft(0);
      window.alert(resp.msg);
      return;
    }

    if (!res.ok) {
      window.alert(
        `${resp.msg}${
          resp.attemptsLeft !== undefined
            ? ` (${resp.attemptsLeft} attempts left)`
            : ""
        }`,
      );
      return;
    }

    window.alert(resp.msg);

    setName("");
    setEmail("");
    setPassword("");
    setOtp("");

    navigate("/login");
  };

  const resendOTP = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user/createaccount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setTimeLeft(300);
      }

      window.alert(data.msg);
    } catch {
      window.alert("Something went wrong please try again");
    } finally {
      setLoading(false);
    }
  };

  const ValidatePassword = (value) => {
    let errors = [];

    if (value.length < 6) {
      errors.push("Password should contain at least 6 characters");
    }

    if (!/[A-Z]/.test(value)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(value)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(value)) {
      errors.push("Password must contain at least one number");
    }

    setError(errors);
    return errors.length === 0;
  };
  return (
    <>
      <Navbar />
      <br />
      {!showOtp ? (
        <form onSubmit={OTPCreate} style={{ marginLeft: "8px" }}>
          <div>
            Name :{" "}
            <input
              type="text"
              ref={refName}
              required
              name="name"
              value={name}
              className="ip"
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <br />
            Email :{" "}
            <input
              type="email"
              required
              name="email"
              value={email}
              className="ip"
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <br />
            Password :{" "}
            <input
              type={showPsw ? "text" : "password"}
              required
              name="password"
              value={password}
              className="ip"
              onChange={(e) => {
                setPassword(e.target.value);
                ValidatePassword(e.target.value);
              }}
              minLength={6}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$"
            />
            <button
              type="button"
              onClick={() => setShowPsw(!showPsw)}
              className="showhide"
            >
              {" "}
              {showPsw ? "Hide" : "Show"}
            </button>
            {error.map((err) => (
              <li key={err} style={{ color: "red" }}>
                {err}
              </li>
            ))}
            <br />
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Updating..." : "Create"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={OTPVerify} style={{ marginLeft: "8px" }}>
          <div>
            Otp successfully sent on {email}
            <br />
            OTP :
            <input
              type="text"
              value={otp}
              ref={refOTP}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={5}
            />
            {timeLeft === 0 ? (
              <p style={{ color: "red" }}>OTP expired. Please resend OTP.</p>
            ) : (
              <p>
                OTP expires in {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </p>
            )}
            <button
              type="submit"
              className="btn"
              disabled={loading || timeLeft === 0}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            {timeLeft === 0 && (
              <button
                type="button"
                onClick={resendOTP}
                className="btn"
                disabled={loading}
              >
                Resend It
              </button>
            )}
          </div>
        </form>
      )}
      {loading && <div className="AfterSubmit">Creating...</div>}
    </>
  );
}

export default Createaccount;
