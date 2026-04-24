<template>
  <VNumberInput
    v-for="([prefix, sufix], index) in items"
    :key="index"
    v-model="response[index]"
    :prefix="prefix"
    :readonly="isSubmitted"
    :rules="[(val: number) => isNumber(val) || 'You have to enter your answer']"
    :suffix="sufix"
    class="mt-4"
    control-variant="stacked"
    hide-details="auto"
    label="Answer"
    type="number"
    variant="outlined"
  >
    <template v-if="isSubmitted" #append-inner>
      <VIcon
        :color="isCorrect(index) ? 'success' : 'error'"
        :icon="`mdi-${isCorrect(index) ? 'check' : 'close'}-circle`"
      />
    </template>
  </VNumberInput>
</template>

<script setup lang="ts">
import { cloneDeep, isNumber, zip } from 'lodash-es';
import { computed, ref, watch } from 'vue';
import type { Element } from '@tailor-cms/ce-numerical-response-manifest';

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits<{
  'user-input': [data: { response: any[] }];
}>();

const initializeResponse = () =>
  cloneDeep(props.userState?.response) ??
  Array(props.element.data.prefixes.length).fill(undefined);

const isSubmitted = ref(!!props.userState?.isSubmitted);
const response = ref<any[]>(initializeResponse());

const items = computed(() =>
  zip(props.element.data.prefixes, props.element.data.suffixes),
);

watch(response, (val) => emit('user-input', { response: val }), { deep: true });

const isCorrect = (index: number) => {
  const { response, correct } = props.userState ?? {};
  return response?.[index] === correct?.[index];
};

watch(
  () => props.userState,
  (state = {}) => {
    response.value = initializeResponse();
    isSubmitted.value = !!state.isSubmitted;
  },
  { deep: true },
);
</script>
