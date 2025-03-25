<script setup>
import PolynomialWheel from '@/components/polynomial.vue'
import Wheel from "@/components/Wheel/Wheel.vue";
</script>

<template>
  <main>
    <PolynomialWheel />
  </main>
</template>

<style scoped>


header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
