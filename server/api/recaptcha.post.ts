export default defineEventHandler(async (event) => {
    try {
        const { token } = await readBody(event)
        if (!token) {
            throw createError({ statusCode: 400, message: 'Missing reCAPTCHA token' })
        }

        const config = useRuntimeConfig()
        const data = await $fetch(
            'https://www.google.com/recaptcha/api/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    secret: config.RECAPTCHA_SECRET_KEY,
                    response: token,
                }),
            },
        )

        if (!data.success) {
            throw createError({
                statusCode: 401,
                message: 'reCAPTCHA verification failed',
                data,
            })
        }

        return data
    } catch (error) {
        console.error('Recaptcha error:', error)
        throw createError(error as Error)
    }
})