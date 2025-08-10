export const COOKIE_CONSENT_KEY = "batman_cookie_consent";

export const getCookieConsent = () => {
  return localStorage.getItem(COOKIE_CONSENT_KEY);
};

export const setCookieConsent = (value) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
};
