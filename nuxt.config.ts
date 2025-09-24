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
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/supabase', "@nuxtjs/device"],
  device: {
    refreshOnResize: true,
  },
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap' },
      ],
    },
  },
  supabase: {
    redirectOptions: {
      login: '*',
      callback: '*',
    },
  },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/themes.css',
    '~/assets/css/reveal.css',
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['home-stream.fallwinter.dk'],
    },
  },
  nitro: {
    compressPublicAssets: true,
    serveStatic: true,
    preset: 'node-server',
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src * data: blob:; script-src * 'self' 'unsafe-inline' 'unsafe-eval'; style-src * 'self' 'unsafe-inline'; connect-src * 'self';worker-src 'self' blob:;",
          ].join('; '),
        },
      },
    },
  },
})