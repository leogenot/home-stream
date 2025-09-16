import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    public: {
      BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  },
  site: {
    url: process.env.BASE_URL,
    name: 'Curin',
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/supabase',],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      include: ['/account/'],
      exclude: [],
      saveRedirectToCookie: false,
    },
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/themes.css',
    '~/assets/css/reveal.css',
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    compressPublicAssets: true,
    preset: 'netlify',
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src * data: blob:; script-src * 'self' 'unsafe-inline' 'unsafe-eval'; style-src * 'self' 'unsafe-inline'; connect-src * 'self';",
          ].join('; '),
        },
      },
    },
  },
})