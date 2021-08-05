import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

type colorScheme = {
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
	highlightedBg: string;
	likedBg: string;
	buttonColor: string;
}

export const lightColorScheme: colorScheme = {
	name: "light",
	bg: "#f8f8f8",
	bgLighter: "#fff",
	bgDarker: "#e8e8e8",
	color: "#292929",
	g1: "#835afd",
	g2: "#8b57fb",
	g3: "#c694f6",
	upperGradient: "linear-gradient(var(--g1), var(--g2))",
	lowerGradient: "linear-gradient(var(--g2), var(--g3))",
	gradient: "linear-gradient(var(--g1), var(--g3))",
	highlightedBg: "#f4f0ff",
	likedBg: "#dbdcdd",
	buttonColor: "#FFF",
}

export const darkColorScheme: colorScheme = {
	name: "dark",
	bg: "#5c5c5f",
	bgLighter: "#131314",
	bgDarker: "#878796",
	color: "#D2D2D2",
	g1: "#1E0433",
	g2: "#2E064D",
	g3: "#401562",
	upperGradient: "linear-gradient(var(--g1), var(--g2))",
	lowerGradient: "linear-gradient(var(--g2), var(--g3))",
	gradient: "linear-gradient(var(--g1), var(--g3))",
	highlightedBg: "#403945",
	likedBg: "#5551518c",
	buttonColor: "#835afd",
}

export function useTheme() {
	const value = useContext(ThemeContext)
	return value;
}
