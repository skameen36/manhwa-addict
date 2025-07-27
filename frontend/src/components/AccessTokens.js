async function getAccessToken() {
    const response = await fetch("https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            grant_type: "password",
            username: process.env.REACT_APP_MANGADEX_USERNAME,  
            password: process.env.REACT_APP_MANGADEX_PASSWORD,  
            client_id: process.env.REACT_APP_MANGADEX_CLIENT_ID,  
            client_secret: process.env.REACT_APP_MANGADEX_CLIENT_SECRET  
        })
    });

    const data = await response.json();
    
    if (data.access_token) {
        // console.log("Access Token:", data.access_token);
        // console.log("Refresh Token:", data.refresh_token);  
        return data;
    } else {
        console.error("Failed to get access token:", data);
    }
}

export default getAccessToken;