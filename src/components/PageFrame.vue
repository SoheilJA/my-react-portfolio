<template>
  <div class="relative mx-auto w-full max-w-[1280px] border-x border-line">
    <div
      class="hatch pointer-events-none absolute inset-y-0 -start-[41px] hidden w-10 border-x border-line min-[1400px]:block"
      aria-hidden="true"
    ></div>
    <div
      class="hatch pointer-events-none absolute inset-y-0 -end-[41px] hidden w-10 border-x border-line min-[1400px]:block"
      aria-hidden="true"
    ></div>
    <slot />
  </div>
</template>