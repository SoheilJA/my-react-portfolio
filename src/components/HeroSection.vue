<template>
  <section
    id="home"
    class="grid min-h-screen items-center gap-12 py-16 md:grid-cols-2"
  >
    <div>
      <h1 class="text-4xl font-bold leading-tight text-white md:text-5xl">
        {{ $t("hero.title_1") }}
        <span class="text-accent">{{ $t("hero.title_2") }}</span>
      </h1>
      <p class="mt-6 text-lg">{{ $t("hero.subtitle") }}</p>
      <a
        href="#contact"
        class="mt-8 inline-block border border-accent px-5 py-3 text-white transition hover:bg-accent/20"
      >
        {{ $t("hero.cta") }}
      </a>
    </div>

    <div class="relative mx-auto h-80 w-80">
      <div class="absolute left-4 top-4 h-48 w-48 border border-accent"></div>
      <div
        class="absolute bottom-16 right-8 h-40 w-40 border border-accent"
      ></div>
      <div class="dots absolute right-0 top-10 h-28 w-28"></div>
      <div
        class="absolute bottom-0 left-0 right-0 border border-muted px-3 py-2 text-sm"
      >
        <span class="me-2 inline-block h-3 w-3 bg-accent"></span>
        {{ $t("hero.status") }}
      </div>
    </div>
  </section>
</template>
