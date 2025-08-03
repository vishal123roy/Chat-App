import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  theme:localStorage.getItem("chatApp-theme")||"coffee",
  setTheme: (theme) =>{
    localStorage.setItem("chatApp-theme",theme);
      set({theme})
  } 
}))

