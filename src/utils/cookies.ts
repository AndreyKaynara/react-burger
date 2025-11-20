import Cookies, { CookieAttributes } from 'js-cookie';

export const setCookie = (name: string, value: string, options: CookieAttributes = {}) => {
  Cookies.set(name, value, options);
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const deleteCookie = (name: string) => {
  Cookies.remove(name);
};
