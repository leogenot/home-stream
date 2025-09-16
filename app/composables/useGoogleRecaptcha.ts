type ReCaptchaResponse = {
    success: true | false // whether this request was a valid reCAPTCHA token for your site
    score: number // the score for this request (0.0 - 1.0)
    action: string // the action name for this request (important to verify)
    challenge_ts: string // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    hostname: string // the hostname of the site where the reCAPTCHA was solved
    'error-codes': [] // optional
}

export const useGoogleRecaptcha = () => {
    const getRecaptchaToken = async (action: string) => {
        const config = useRuntimeConfig()
        const load = (await import('recaptcha-v3')).load

        const recaptcha = await load(config.public.RECAPTCHA_SITE_KEY, {
            autoHideBadge: true,
            useRecaptchaNet: true,
        })

        const token = await recaptcha.execute(action)
        console.log('composable token', token)
        console.log('composable key', config.public.RECAPTCHA_SITE_KEY)
        const verify = await $fetch<ReCaptchaResponse>('/api/recaptcha', {
            method: 'POST',
            body: { token },
        })
        if (verify?.success && verify.score > 0.3) {
            return token
        }

        return null
    }

    return { getRecaptchaToken }
}