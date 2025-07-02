<template>
  <QuestionContainer
    :data="element.data"
    :is-correct="userState.isCorrect"
    :is-submitted="isSubmitted"
    allowed-retake
    is-graded
    @retry="isSubmitted = false"
    @submit="submit"
  >
    <div class="text-subtitle-2 mb-2">Enter your numeric answers:</div>
    <VTextField
      v-for="([prefix, sufix], index) in items"
      :key="index"
      v-model="response[index]"
      :prefix="prefix"
      :readonly="isSubmitted"
      :rules="[(val: string) => !!val || 'You have to enter your answer']"
      :suffix="sufix"
      class="my-3"
      label="Answer"
      type="number"
      variant="outlined"
    >
      <template v-if="isSubmitted" #append>
        <VIcon
          :color="isCorrect(index) ? 'success' : 'error'"
          :icon="`mdi-${isCorrect(index) ? 'check' : 'close'}-circle`"
        />
      </template>
    </VTextField>
  </QuestionContainer>
</template>

<script setup lang="ts">
import { cloneDeep, zip } from 'lodash-es';
import { computed, ref, watch } from 'vue';
import { Element } from '@tailor-cms/ce-numerical-response-manifest';
import { QuestionContainer } from '@tailor-cms/lx-components';

const initializeResponse = () =>
  cloneDeep(props.userState?.response) ??
  Array(props.element.data.prefixes.length).fill('');

const props = defineProps<{ element: Element; userState: any }>();
const emit = defineEmits(['interaction']);

const isSubmitted = ref(!!props.userState.isSubmitted);
const response = ref<string[]>(initializeResponse());

const items = computed(() =>
  zip(props.element.data.prefixes, props.element.data.suffixes),
);

const submit = () => emit('interaction', { response: response.value });

const isCorrect = (index: number) => {
  const { response, correct } = props.userState;
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
