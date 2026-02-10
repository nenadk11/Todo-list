const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const password = form.elements["password"].value;
    const confirmPassword = form.elements["confirmPassword"].value;

    if (!username || !email || !password) {
        alert("All fields are required");
        return;
    }

    if (/\s/.test(username)) {
        alert("Username cannot contain spaces");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters");
        return;
    }

    if (username.length < 4 || username.length > 20) {
        alert("Username must be between 4 and 20 characters long");
        return;
    }

    //Slanje inputa backendu
    try {
        const res = await fetch("/backend/api/auth/register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password, confirmPassword})
        });

        const data = await res.json();

        if (data.success) {
            alert("You registered successfully");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Unsuccessful register");
        }
    } catch (err) {
        console.error(err);
        alert("Something went wrong. Please try again.");
    }
});