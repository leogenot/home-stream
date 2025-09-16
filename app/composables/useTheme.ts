const useCurrentTheme = () => useState('currentTheme', () => 'transparent-light')

export function useTheme() {
    const theme = useCurrentTheme()

    function setCurrentTheme(color?: string) {
        if (color) {
            theme.value = color
        }
    }

    return {
        theme,
        setCurrentTheme
    }
}