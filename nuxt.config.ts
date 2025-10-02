import tailwindcss from '@tailwindcss/vite'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
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
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxtjs/supabase', "@nuxtjs/device", '@nuxt/ui', '@vueuse/nuxt', 'nuxt-vitalizer'],
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' },
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Home Stream - Personal Music Streaming Platform',
      titleTemplate: '%s | Home Stream',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Stream your personal music collection anywhere. Upload, organize, and enjoy your music with Home Stream - your private music streaming platform.' },
        { name: 'keywords', content: 'music streaming, personal music, music player, audio streaming, music collection, playlist, music upload' },
        { name: 'author', content: 'Home Stream' },
        { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate' },
        { name: 'googlebot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        { name: 'bingbot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        { name: 'slurp', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        { name: 'duckduckbot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        { name: 'baiduspider', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        { name: 'yandexbot', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
        { name: 'facebookexternalhit', content: 'noindex, nofollow' },
        { name: 'twitterbot', content: 'noindex, nofollow' },
        { name: 'linkedinbot', content: 'noindex, nofollow' },
        { name: 'whatsapp', content: 'noindex, nofollow' },
        { name: 'applebot', content: 'noindex, nofollow' },
        // AI Bot blocking
        { name: 'gptbot', content: 'noindex, nofollow' },
        { name: 'chatgpt-user', content: 'noindex, nofollow' },
        { name: 'ccbot', content: 'noindex, nofollow' },
        { name: 'anthropic-ai', content: 'noindex, nofollow' },
        { name: 'claude-web', content: 'noindex, nofollow' },
        { name: 'perplexitybot', content: 'noindex, nofollow' },
        { name: 'youbot', content: 'noindex, nofollow' },
        { name: 'google-extended', content: 'noindex, nofollow' },
        { name: 'facebookbot', content: 'noindex, nofollow' },
        { name: 'meta-externalagent', content: 'noindex, nofollow' },
        { name: 'meta-externalfetcher', content: 'noindex, nofollow' },
        { name: 'oai-searchbot', content: 'noindex, nofollow' },
        { name: 'searchgpt', content: 'noindex, nofollow' },
        { name: 'originbot', content: 'noindex, nofollow' },
        { name: 'diffbot', content: 'noindex, nofollow' },
        { name: 'chatgpt', content: 'noindex, nofollow' },
        { name: 'ai2bot', content: 'noindex, nofollow' },
        { name: 'bytespider', content: 'noindex, nofollow' },
        { name: 'amazonbot', content: 'noindex, nofollow' },
        { name: 'claudebot', content: 'noindex, nofollow' },
        { name: 'cohere-ai', content: 'noindex, nofollow' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'msapplication-TileColor', content: '#ffffff' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'Home Stream' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Home Stream' },
        { property: 'og:title', content: 'Home Stream - Personal Music Streaming Platform' },
        { property: 'og:description', content: 'Stream your personal music collection anywhere. Upload, organize, and enjoy your music with Home Stream.' },
        { property: 'og:image', content: '/android-chrome-512x512.png' },
        { property: 'og:image:width', content: '512' },
        { property: 'og:image:height', content: '512' },
        { property: 'og:image:alt', content: 'Home Stream Logo' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: 'Home Stream - Personal Music Streaming Platform' },
        { name: 'twitter:description', content: 'Stream your personal music collection anywhere. Upload, organize, and enjoy your music with Home Stream.' },
        { name: 'twitter:image', content: '/android-chrome-512x512.png' },
        { name: 'twitter:image:alt', content: 'Home Stream Logo' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'canonical', href: process.env.BASE_URL || 'https://home-stream.servemp3.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Doto:wght@100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap' },
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
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['home-stream.fallwinter.dk'],
    },
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },

  ui: {
    fonts: false
  },
  icon: {
    mode: 'css',
    cssLayer: 'base',
    serverBundle: {
      collections: ['lucide']
    }
  },
  experimental: {
    buildCache: true,
  },

  // SEO Configuration
  seo: {
    fallbackTitle: 'Home Stream - Personal Music Streaming Platform',
    description: 'Stream your personal music collection anywhere. Upload, organize, and enjoy your music with Home Stream - your private music streaming platform.',
  },

  nitro: {
    prerender: {
      crawlLinks: false, // Prevent Nitro from crawling and generating routes
      routes: [], // No pre-rendered routes
    },
    compressPublicAssets: true,
    serverAssets: [
      {
        baseName: 'uploads',
        dir: 'uploads'
      }
    ],
    preset: 'node-server',
    routeRules: {
      '/**': {
        headers: {
          'Content-Security-Policy': [
            "default-src * data: blob:; script-src * 'self' 'unsafe-inline' 'unsafe-eval'; style-src * 'self' 'unsafe-inline'; connect-src * 'self';worker-src 'self' blob:;",
          ].join('; '),
          'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'no-referrer',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      },
    },
  },

})