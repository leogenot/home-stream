<script lang="ts" setup>
  type ButtonProps = {
    btnType?: 'button' | 'submit' | 'reset' | undefined
    ariaLabel?: string
    underline?: boolean
    markActive?: boolean
    linkType?: string
    title?: string
    url?: string
    target?: string
    disabled?: boolean
    page?: {
      title: string
      _id: string
      url: string
    }
  }

  const _props = withDefaults(defineProps<ButtonProps>(), {
    underline: false,
    markActive: false,
    target: '_self',
  })
</script>

<template>
  <button
    v-if="btnType"
    :type="btnType"
    :aria-label="ariaLabel"
    :disabled="disabled"
    class="e-button flex cursor-pointer justify-center justify-self-start border bg-(--bg-color) px-3 py-2 leading-none text-(--fg-color) transition-colors duration-300 hover:bg-(--fg-color) hover:text-(--bg-color) disabled:pointer-events-none disabled:border-(--fg-color)/40 disabled:opacity-40"
  >
    <span
      class="flex items-center gap-1 font-sans text-sm font-medium uppercase"
    >
      <slot></slot>
    </span>
  </button>
  <nuxt-link
    v-else
    :to="url || page?.url"
    :target="target"
    class="e-button flex cursor-pointer justify-center justify-self-start border bg-(--bg-color) px-3 py-2 leading-none text-(--fg-color) transition-colors duration-300 hover:bg-(--fg-color) hover:text-(--bg-color)"
  >
    <span class="font-sans text-sm font-medium uppercase">
      {{ title || page?.title || url }}
    </span>
  </nuxt-link>
</template>
