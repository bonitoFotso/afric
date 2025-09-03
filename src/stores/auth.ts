import { defineStore } from 'pinia';
import { ref, computed, readonly } from 'vue';
import type { User, LoginCredentials } from '@/types';
import { mockApi } from '@/services/mockApi';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(credentials: LoginCredentials) {
    loading.value = true;
    try {
      const response = await mockApi.login(credentials);
      token.value = response.token;
      user.value = response.user;
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      throw error;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function initializeAuth() {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    loading: readonly(loading),
    isAuthenticated,
    login,
    logout,
    initializeAuth
  };
});
