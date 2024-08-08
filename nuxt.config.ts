// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-primevue', '@vueuse/nuxt'],
  primevue: {
    options: {
      unstyled: true
    },
    importPT: { as: 'Aura', from: '~/presets/aura' }
  },
  nitro:  {
    storage: {
      db: {
        driver: 'memory',
      }
    },
    experimental: {
      websocket: true
    }
  }
})