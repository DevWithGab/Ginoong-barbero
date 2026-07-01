// Auth storage abstraction: admin uses sessionStorage (clears on browser close),
// customers use localStorage (persists across sessions).

const ADMIN_ROLE = 'admin';
const KEYS = ['token', 'user', 'userRole'];

function getStorage(role) {
  return role === ADMIN_ROLE ? sessionStorage : localStorage;
}

function getStorageForRead() {
  if (sessionStorage.getItem('token')) return sessionStorage;
  return localStorage;
}

export const authStorage = {
  setToken(token, role) {
    getStorage(role).setItem('token', token);
  },
  setUser(user, role) {
    getStorage(role).setItem('user', JSON.stringify(user));
  },
  setUserRole(role) {
    getStorage(role).setItem('userRole', role || 'customer');
  },

  getToken() {
    return getStorageForRead().getItem('token');
  },
  getUser() {
    const data = getStorageForRead().getItem('user');
    if (data) {
      try { return JSON.parse(data); } catch { return null; }
    }
    return null;
  },
  getUserRole() {
    return getStorageForRead().getItem('userRole') || 'customer';
  },

  isAuthenticated() {
    return !!(this.getToken() && this.getUser());
  },
  isAdmin() {
    return this.getUserRole() === 'admin';
  },

  clearAll() {
    KEYS.forEach(k => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  },
};
