const redirects = {
"/cal2026.pdf": "https://drive.google.com/uc?export=download&id=1jc_oIf5tSoTTaZq3IbtT3DSlWnrq8rzG",
"/cal2026.jpg": "https://drive.google.com/uc?export=download&id=1f3PM0UYG9Iad2ULI5dHiJ5FkP5YBwWp7",
"/cal2025.pdf": "https://docs.google.com/uc?export=download&id=12gGs7CJSUvNzNAacYuwQa4tro7IYaegM",
"/cal2025.jpg": "https://docs.google.com/uc?export=download&id=12aqGCOOyRx5NYf3nHGQrjihTAzIJTN8N",
"/cal2024.pdf": "https://docs.google.com/uc?export=download&id=19kRKHCdNnXDDl3vGRSielHLtCaoxHlk7",
"/cal2024.jpg": "https://docs.google.com/uc?export=download&id=19odhMvJXJGUwtTEUVpExbU0M354ehOJA",
"/cal2023.pdf": "https://docs.google.com/uc?export=download&id=19vUcPhlmQgNCJV3XpnZqAHkUXuF4AWQd",
"/cal2023.jpg": "https://docs.google.com/uc?export=download&id=19ohGTvexeEyCVV79lHrkif6l5kqmmOJ4"
};

const path = window.location.pathname;

if (redirects[path]) {
    window.location.replace(redirects[path]);
} else {
    window.location.replace("https://saratrout.in/");
}
