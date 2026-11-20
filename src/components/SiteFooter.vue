<template>
  <footer class="border-t border-line">
    <div
        class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <span class="font-display text-xl font-bold text-ink">
          Soheil<span class="text-accent">.</span>
        </span>
        <p class="mt-1 text-sm">{{ $t('hero.tagline') }}</p>
      </div>
      <p class="label">{{ $t('footer.rights') }}</p>
      <a
          href="#home"
          class="label text-accent transition-colors hover:text-ink"
      >
        {{ $t('footer.top') }} ↑
      </a>
    </div>
  </footer>
</template>