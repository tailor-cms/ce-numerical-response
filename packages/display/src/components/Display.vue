<template>
  <QuestionContainer
    :data="data"
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
      variant="outlined"
      type="number"
    >
      <template v-if="isSubmitted" #append>
        <VIcon
          :icon="`mdi-${isCorrect(index) ? 'check' : 'close'}-circle`"
          :color="isCorrect(index) ? 'success' : 'error'"
        />
      </template>
    </VTextField>
  </QuestionContainer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { ElementData } from '@tailor-cms/ce-numerical-response-manifest';
import zip from 'lodash/zip';
import { QuestionContainer } from '@tailor-cms/lx-components';

const initializeResponse = () =>
  cloneDeep(props.userState?.response) ??
  Array(props.data.prefixes.length).fill('');

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const isSubmitted = ref(!!props.userState.isSubmitted);
const response = ref<string[]>(initializeResponse());

const items = computed(() => zip(props.data.prefixes, props.data.suffixes));

const submit = () => emit('interaction', { response: response.value });

const isCorrect = (index: number) => {
  const { response, correct } = props.userState;
  return response?.[index] === correct?.[index];
}

watch(
  () => props.userState,
  (state = {}) => {
    response.value = initializeResponse();
    isSubmitted.value = !!state.isSubmitted;
  },
  { deep: true },
);
</script>
