export async function checkAuth() {
    try {
        const res = await fetch("http://localhost:8000/backend/api/auth/checkAuth.php");
        const data = await res.json();
        
        if(!data.loggedIn){
            window.location.href = "/login.html";
            return null;
        }

        return data.user;
        
    }catch (err) {
        console.error("Auth error", err);
        window.location.href = "/login.html";
    }
}