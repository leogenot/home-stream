<template>
  <div class="">
    <div class="">
      <div class="">
        <AppBackToLogin />
        <div class="">
          <div class="">
            <slot />
          </div>
        </div>
        <p class="">
          This site is authenticate by supabase.com and the Supabase
          <a
            target="_blank"
            href="https://supabase.com/privacy"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
          and
          <a target="_blank" href="https://supabase.com/terms" rel="noreferrer">
            Terms of Service
          </a>
          apply.
        </p>
      </div>
    </div>
  </div>
</template>
