const redirects = {

"/cal2026.pdf":"https://drive.google.com/uc?export=download&id=1jc_oIf5tSoTTaZq3IbtT3DSlWnrq8rzG",
"/cal2026.jpg":"https://drive.google.com/uc?export=download&id=1f3PM0UYG9Iad2ULI5dHiJ5FkP5YBwWp7",

"/cal2025.pdf":"https://docs.google.com/uc?export=download&id=12gGs7CJSUvNzNAacYuwQa4tro7IYaegM",
"/cal2025.jpg":"https://docs.google.com/uc?export=download&id=12aqGCOOyRx5NYf3nHGQrjihTAzIJTN8N",

"/cal2024.pdf":"https://docs.google.com/uc?export=download&id=19kRKHCdNnXDDl3vGRSielHLtCaoxHlk7",
"/cal2024.jpg":"https://docs.google.com/uc?export=download&id=19odhMvJXJGUwtTEUVpExbU0M354ehOJA",

"/cal2023.pdf":"https://docs.google.com/uc?export=download&id=19vUcPhlmQgNCJV3XpnZqAHkUXuF4AWQd",
"/cal2023.jpg":"https://docs.google.com/uc?export=download&id=19ohGTvexeEyCVV79lHrkif6l5kqmmOJ4",

"/cal2022.pdf":"https://docs.google.com/uc?export=download&id=19kT2padJ7EErVjiZ-Eq2SijhAOHWNhHN",
"/cal2022.jpg":"https://docs.google.com/uc?export=download&id=19wsvnjKYOjKoIZdIKREamtF3UgFwVjtv",

"/cal2021.pdf":"https://docs.google.com/uc?export=download&id=19oNCHuuHoTWkUxC86oR8X-qJoEPkw4LA",
"/cal2021.jpg":"https://docs.google.com/uc?export=download&id=19oN4__ws5i5aDNSrBzSTk8m4lvo5FXTc",

"/cal2020.pdf":"https://docs.google.com/uc?export=download&id=19kIL8uumVl-77SCCdlswrMFKRSiA95zH",
"/cal2020.jpg":"https://docs.google.com/uc?export=download&id=19gtRaRov0YGAV6BeAQGM_0_2t6wP-1gp",

"/cal2019.pdf":"https://docs.google.com/uc?export=download&id=19kCM8xIY0Y-kGMYfyuXEMLswIx6POj-H",
"/cal2019.jpg":"https://docs.google.com/uc?export=download&id=19orjKyUum1jaADOSZA2LzIe9mV-tdaNH",

"/cal2018.pdf":"https://docs.google.com/uc?export=download&id=19fnCsvD3xkchwngxS_q9vdVrZccf2ouC",
"/cal2018.jpg":"https://docs.google.com/uc?export=download&id=19iRxOe2Nq25RUXpf3YzwxTM030KqOTzF",

"/cal2017.pdf":"https://docs.google.com/uc?export=download&id=19p9mFN2B9JUWt5jCV2h0Kh7fFkROZO_o",
"/cal2017.jpg":"https://docs.google.com/uc?export=download&id=19rFtaSLuHRVVHcZdNtVzSd_e8ExKV7ja",

"/cal2016.pdf":"https://docs.google.com/uc?export=download&id=19vKhsgbfBV1x7t1kcsoSKaOCz72sCf9d",
"/cal2016.jpg":"https://docs.google.com/uc?export=download&id=19ibKAzzUzYaEY0fJDOFLPYYHdjibk-Uv",

"/cal2015.pdf":"https://docs.google.com/uc?export=download&id=19i0qPtAnudzjuIKZnUBwbxVO4IoIssVe",
"/cal2015.jpg":"https://docs.google.com/uc?export=download&id=19jJUeKUpVlZPvbiHRmvfPKzJE_vvF2WR",

"/cal2014.pdf":"https://docs.google.com/uc?export=download&id=19pClC5GzgrsH716ysSfArtl-CkJ4zh7P",
"/cal2014.jpg":"https://docs.google.com/uc?export=download&id=19umf_frNz8Y-VfD12TlgdaCv_dRmMyqX",

"/cal2013.pdf":"https://docs.google.com/uc?export=download&id=19hXEmII3yO4DxiAJXusaDb0KjVhF_zGp",
"/cal2013.jpg":"https://docs.google.com/uc?export=download&id=19rhAS62ATjWYTWWq1hF3b4DCIHiV5afo",

"/cal2012.pdf":"https://docs.google.com/uc?export=download&id=19u23z_ubId4iXMuv_xdQOMmEo329Y5rU",
"/cal2012.jpg":"https://docs.google.com/uc?export=download&id=19hv6USzYZFaNyHnGzBa2PL-kuShks--s"

};

const path = window.location.pathname;

if (redirects[path]) {
window.location.replace(redirects[path]);
} else {
window.location.replace("https://saratrout.in/");
}
