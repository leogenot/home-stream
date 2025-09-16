const useCurrentError = () => useState('currentError', () => null)

export function useErrorMessage() {
    const errorMessage = <string | null>useCurrentError()

    function setCurrentError(error?: string | null) {
        errorMessage.value = error
    }

    return {
        errorMessage,
        setCurrentError,
    }
}