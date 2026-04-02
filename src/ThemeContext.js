import { createContext, useContext, useState } from 'react'
import { themes } from './theme'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light')
  const theme = themes[mode]

  const toggleTheme = () => setMode(m => m === 'light' ? 'dark' : 'light')

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
