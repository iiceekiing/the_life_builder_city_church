import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (userData, token) => {
        set({
          user: userData,
          token,
          isAuthenticated: true,
        })
        localStorage.setItem('access_token', token)
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      },
      
      updateUser: (userData) => {
        set({ user: userData })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
