import { createContext, ReactNode, useState } from 'react';

type Theme = {
	name: string;
	bg: string;
	bgLighter: string;
	bgDarker: string;
	color: string;
	g1: string;
	g2: string;
	g3: string;
	upperGradient: string;
	lowerGradient: string;
	gradient: string;
	border: string;
    highlightedBg: string;
    likedBg: string;
    buttonColor: string;
}

type ThemeContextType = {
    themeName: string;
    changeTheme: (definedTheme: Theme) => Promise<void>;
}

type ThemeContextProviderProps = {
    children: ReactNode;
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
   
    const [themeName, setThemeName] = useState(() => {
        if (
            localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
            {
                return 'dark';
            }
            else {
                return 'light';
            }
    });

    async function changeTheme(definedTheme: Theme) {
        document.querySelector("html")?.style.setProperty("--bg", definedTheme.bg)
        document.querySelector("html")?.style.setProperty("--bg-lighter", definedTheme.bgLighter)
        document.querySelector("html")?.style.setProperty("--bg-darker", definedTheme.bgDarker)
        document.querySelector("html")?.style.setProperty("--color", definedTheme.color)
        document.querySelector("html")?.style.setProperty("--g1", definedTheme.g1)
        document.querySelector("html")?.style.setProperty("--g2", definedTheme.g2)
        document.querySelector("html")?.style.setProperty("--g3", definedTheme.g3)
        document.querySelector("html")?.style.setProperty("--upper-gradient", definedTheme.upperGradient)
        document.querySelector("html")?.style.setProperty("--lower-gradient", definedTheme.lowerGradient)
        document.querySelector("html")?.style.setProperty("--gradient", definedTheme.gradient)
        document.querySelector("html")?.style.setProperty("--border", definedTheme.border)
        document.querySelector("html")?.style.setProperty("--highlighted-bg", definedTheme.highlightedBg)
        document.querySelector("html")?.style.setProperty("--liked-bg", definedTheme.likedBg)
        document.querySelector("html")?.style.setProperty("--button-color", definedTheme.buttonColor)
        setThemeName(definedTheme.name)
        return ;
    }

	return (
		<ThemeContext.Provider value={{ themeName, changeTheme }}>
            {props.children}
        </ThemeContext.Provider>
	);
}
