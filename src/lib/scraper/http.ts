import axios from "axios";

export const scraperHttp = axios.create({
    timeout: 30000,
    headers: {
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36",
        Accept: "application/json, text/html, */*",
        "Accept-Language": "en-US,en;q=0.9",
    },
});