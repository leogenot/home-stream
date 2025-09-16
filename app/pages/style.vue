<script setup>
  const editorial = [
    { class: 'text-5xl', label: '5xl', italic: true },
    { class: 'text-4xl', label: '4xl' },
    { class: 'text-3xl', label: '3xl', italic: true },
    { class: 'text-2xl', label: '2xl' },
    { class: 'text-xl', label: 'xl', italic: true },
    { class: 'text-lg', label: 'lg', italic: true },
    { class: 'text-base', label: 'base' },
    { class: 'text-sm', label: 'sm' },
    { class: 'text-xs', label: 'xs' },
    { class: 'text-xxs', label: 'xxs' },
    { class: 'text-legal', label: 'legal' },
  ]
  const montreal = [
    { class: 'text-5xl', label: '5xl' },
    { class: 'text-4xl', label: '4xl' },
    { class: 'text-3xl', label: '3xl' },
    { class: 'text-2xl', label: '2xl' },
    { class: 'text-xl', label: 'xl' },
    { class: 'text-lg', label: 'lg' },
    { class: 'text-base', label: 'base', medium: true },
    { class: 'text-sm', label: 'sm', medium: true },
    { class: 'text-xs', label: 'xs', medium: true },
    { class: 'text-xxs', label: 'xxs', medium: true },
    { class: 'text-legal', label: 'legal', medium: true },
  ]

  const primaryColors = [
    { name: 'Black', class: 'bg-(--black)' },
    { name: 'White', class: 'bg-(--white) border border-(--black)/10' },
    { name: 'Sand', class: 'bg-(--sand)' },
  ]
  const secondaryColors = [
    { name: 'Black 40%', class: 'bg-(--black)/40' },
    { name: 'Black 20%', class: 'bg-(--black)/20' },
    { name: 'White 40%', class: 'bg-(--white)/40 border border-(--black)/10' },
    { name: 'Red', class: 'bg-(--red)' },
  ]
</script>

<template>
  <div class="p-bleed">
    <div class="mb-10 w-full rounded-4xl bg-white p-10 shadow-lg">
      <h2 class="mb-6 font-mono text-2xl text-[--black]">Colors</h2>
      <div class="flex gap-4">
        <div
          v-for="color in primaryColors"
          :key="color.name"
          class="flex flex-col"
        >
          <div class="h-20 w-20 rounded-lg" :class="color.class" />
          <span class="mt-2 font-mono text-xs">{{ color.name }}</span>
        </div>
      </div>
      <div class="mt-4 flex gap-4">
        <div
          v-for="color in secondaryColors"
          :key="color.name"
          class="flex flex-col"
        >
          <div class="h-20 w-20 rounded-lg" :class="color.class" />
          <span class="mt-2 font-mono text-xs">{{ color.name }}</span>
        </div>
      </div>
    </div>
    <div class="rounded-4xl bg-white p-10 shadow-lg">
      <h2 class="mb-6 font-mono text-2xl text-[--black]">Font styles</h2>
      <div class="mt-15">
        <div v-for="size in editorial" :key="size.class" class="mb-6">
          <span
            class="mb-1 block w-max rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-gray-500"
          >
            Editorial / {{ size.label }}
            <span v-if="size.italic">/ Italic</span>
          </span>
          <p :class="[`font-serif ${size.class}`, { italic: size.italic }]">
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>

      <div class="mt-15">
        <div v-for="size in montreal" :key="size.class" class="mb-6">
          <span
            class="mb-1 block w-max rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-gray-500"
          >
            Montreal / {{ size.label }}
            <span v-if="size.medium">/ Medium</span>
          </span>
          <p
            :class="[`font-sans ${size.class}`, { 'font-medium': size.medium }]"
          >
            The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>
    </div>
  </div>
</template>