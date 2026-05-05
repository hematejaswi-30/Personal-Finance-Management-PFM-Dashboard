import { createContext, useContext, useState, useEffect } from 'react';

const ThemeCtx = createContext();

const ACCENTS = {
    purple: { primary: '#8b5cf6', secondary: '#6d28d9', glow: 'rgba(139,92,246,0.25)', soft: 'rgba(139,92,246,0.1)', name: 'Purple' },
    ocean:  { primary: '#0ea5e9', secondary: '#0284c7', glow: 'rgba(14,165,233,0.25)',  soft: 'rgba(14,165,233,0.1)',  name: 'Ocean'  },
    sunset: { primary: '#f97316', secondary: '#ea580c', glow: 'rgba(249,115,22,0.25)',  soft: 'rgba(249,115,22,0.1)',  name: 'Sunset' },
    rose:   { primary: '#f43f5e', secondary: '#e11d48', glow: 'rgba(244,63,94,0.25)',   soft: 'rgba(244,63,94,0.1)',   name: 'Rose'   },
};

export const ThemeProvider = ({ children }) => {
    const [theme,  setTheme]  = useState(() => localStorage.getItem('nivesh-theme')  || 'dark');
    const [accent, setAccent] = useState(() => localStorage.getItem('nivesh-accent') || 'purple');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nivesh-theme', theme);
    }, [theme]);

    useEffect(() => {
        const a = ACCENTS[accent] || ACCENTS.purple;
        const root = document.documentElement;
        root.style.setProperty('--accent-purple',  a.primary);
        root.style.setProperty('--accent-primary',  a.primary);
        root.style.setProperty('--accent-secondary', a.secondary);
        root.style.setProperty('--purple-glow',     a.glow);
        root.style.setProperty('--accent-soft',     a.soft);
        root.setAttribute('data-accent', accent);
        localStorage.setItem('nivesh-accent', accent);
    }, [accent]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <ThemeCtx.Provider value={{ theme, toggleTheme, accent, setAccent, ACCENTS }}>
            {children}
        </ThemeCtx.Provider>
    );
};

export const useTheme = () => useContext(ThemeCtx);
