import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === 'true')
  const [colorTheme, setColorTheme] = useState(
    () => localStorage.getItem('colorTheme') || 'theme1'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark', dark)
  }, [dark])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme)
    localStorage.setItem('colorTheme', colorTheme)
  }, [colorTheme])

  return (
    <ThemeContext.Provider value={{
      dark,
      toggleDark: () => setDark(d => !d),
      colorTheme,
      setColorTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)