<template>
  {{ d.num.toFixed(0) }}
</template>
<script setup>
import gsap from "gsap";
import { reactive, watch } from "vue";

let props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
});

const d = reactive({
  num: 0,
});

function animateToValue() {
  gsap.to(d, {
    duration: 0.5,
    num: props.value,
  });
}

animateToValue();

watch(
  () => props.value,
  () => animateToValue()
);
</script>
<style scoped>
</style>