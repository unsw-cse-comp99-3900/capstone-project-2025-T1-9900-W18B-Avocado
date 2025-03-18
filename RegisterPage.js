import React, { useState } from "react";

const styles = `
  body {
    background-color: yellow !important; 
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
  }

  .container {
    width: 90%;
    max-width: 900px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    position: relative; 
    text-align: center;
  }

  .logo {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 120px;
  }

  .logo-text {
    margin-top: 50px;  
    font-size: 24px;
    font-weight: bold;
    color: black;
    margin-bottom: 20px; 
  }

  .nav {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
  }

  .nav a {
    color: black;
    text-decoration: none;
    font-size: 16px;
    font-weight: bold;
    padding: 5px 10px;
    transition: 0.3s;
  }

  .nav a:hover {
    text-decoration: underline;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    text-align: left;
    margin-bottom: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }

  button {
    width: 100%;
    padding: 12px;
    background: black;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
  }

  button:hover {
    background: #333;
  }

  .message {
    font-weight: bold;
    padding: 10px;
    margin-bottom: 10px;
  }

  .error {
    color: red;
  }

  .success {
    color: green;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

function RegisterPage() {
  const [formData, setFormData] = useState({
    studentID: "",
    email: "",
    name: "",
    faculty: "",
    degree: "",
    citizenship: "",
    isArcMember: "TRUE",
    graduationYear: "2025",
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.studentID || !formData.email || !formData.name || !formData.faculty || !formData.degree || !formData.citizenship || !formData.password) {
      setErrorMsg("❌ All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("❌ Passwords do not match.");
      return;
    }

    try {
      let response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = await response.json();
      if (response.ok) {
        setSuccessMsg("✅ " + (data.message || "Registration successful!"));
      } else {
        setErrorMsg("❌ " + (data.error || "An error occurred."));
      }
    } catch (error) {
      setErrorMsg("❌ Network error. Please try again.");
    }
  };

  return (
    <div className="container">
      <img src="/logo.png" alt="App Logo" className="logo" />

      <div className="logo-text">Student Register</div>

      <div className="nav">
        <a href="/">Home</a>
        <a href="/login">Log in</a>
        <a href="/signup">Sign up</a>
      </div>

      {errorMsg && <div className="message error">{errorMsg}</div>}
      {successMsg && <div className="message success">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Student ID *</label>
            <input type="text" name="studentID" value={formData.studentID} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Confirm Password *</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Are you an Arc Member? *</label>
            <select name="isArcMember" value={formData.isArcMember} onChange={handleChange}>
              <option value="TRUE">Yes</option>
              <option value="FALSE">No</option>
            </select>
          </div>
          <div className="form-group">
            <label>Faculty *</label>
            <input type="text" name="faculty" value={formData.faculty} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Degree *</label>
            <input type="text" name="degree" value={formData.degree} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Graduation Year *</label>
            <select name="graduationYear" value={formData.graduationYear} onChange={handleChange}>
              <option>2024</option>
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
          <div className="form-group">
            <label>Citizenship *</label>
            <input type="text" name="citizenship" value={formData.citizenship} onChange={handleChange} />
          </div>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
