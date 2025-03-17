document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('registerForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        let studentID = document.getElementById("studentID").value.trim();
        let email = document.getElementById("email").value.trim();
        let name = document.getElementById("name").value.trim();
        let faculty = document.getElementById("faculty").value.trim();
        let degree = document.getElementById("degree").value.trim();
        let citizenship = document.getElementById("citizenship").value.trim();
        let isArcMember = document.getElementById("isArcMember").value;
        let graduationYear = document.getElementById("graduationYear").value;
        let role = document.getElementById("role").value;
        let password = document.getElementById("password").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        let errorMsg = document.getElementById("errorMsg"); 
        let successMsg = document.getElementById("successMsg");

        errorMsg.textContent = ""; 
        successMsg.textContent = ""; 

        if (!studentID || !email || !name || !faculty || !degree || !citizenship || !graduationYear || !password) {
            errorMsg.textContent = "❌ All fields are required.";
            return;
        }

        if (password !== confirmPassword) {
            errorMsg.textContent = "❌ Passwords do not match.";
            return;
        }
        if (password.length < 6) {
            errorMsg.textContent = "❌ Password must be at least 6 characters.";
            return;
        }

        try {
            let response = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentID, email, name, faculty, degree, citizenship, isArcMember, graduationYear, role, password
                })
            });

            let data = await response.json(); 

            if (response.ok) {
                if (response.status === 200 || response.status === 201) {
                    successMsg.textContent = "✅ " + (data.message || "Registration successful!");
                } else {
                    errorMsg.textContent = "❌ Unexpected success response.";
                }
            } else {
                switch (response.status) {
                    case 400:
                        errorMsg.textContent = "❌ " + (data.error || "Bad Request.");
                        break;
                    case 401:
                        errorMsg.textContent = "❌ Unauthorized: " + (data.error || "Invalid credentials.");
                        break;
                    case 500:
                        errorMsg.textContent = "❌ Server error. Please try again later.";
                        break;
                    default:
                        errorMsg.textContent = "❌ Unexpected error: " + (data.error || "Unknown issue.");
                }
            }
        } catch (error) {
            errorMsg.textContent = "❌ Network error. Please check your connection.";
        }
    });
});
