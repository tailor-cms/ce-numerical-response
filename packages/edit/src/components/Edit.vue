<template>
  <div class="tce-numerical-response mb-6">
    <div class="text-label-large mb-2">Answers</div>
    <div class="mx-2">
      <VSlideYTransition group>
        <div
          v-for="(_, i) in answerCount"
          :key="i"
          class="d-flex align-center ga-2 mb-2"
        >
          <VAvatar
            :text="String(i + 1)"
            class="text-label-medium font-weight-semibold mr-1"
            color="surface-container-highest"
            rounded="lg"
            size="small"
          />
          <VTextField
            :model-value="elementData.prefixes[i]"
            :readonly="isReadonly"
            density="comfortable"
            placeholder="Prefix..."
            variant="outlined"
            hide-details
            @update:model-value="updateAnswer('prefixes', $event, i)"
          />
          <VNumberInput
            :model-value="elementData.correct?.[i]"
            :readonly="isReadonly"
            :rules="[(val: number) => isNumber(val) || 'Value is required']"
            control-variant="split"
            density="comfortable"
            placeholder="Correct value..."
            type="number"
            variant="outlined"
            hide-details
            @update:model-value="updateAnswer('correct', $event, i)"
          />
          <VTextField
            :model-value="elementData.suffixes[i]"
            :readonly="isReadonly"
            density="comfortable"
            placeholder="Suffix..."
            variant="outlined"
            hide-details
            @update:model-value="updateAnswer('suffixes', $event, i)"
          />
          <VBtn
            v-if="!isReadonly"
            :disabled="!canRemoveAnswer"
            aria-label="Remove answer"
            class="ml-1"
            density="comfortable"
            icon="mdi-close"
            size="small"
            variant="text"
            @click="removeAnswer(i)"
          />
        </div>
      </VSlideYTransition>
      <VInput
        :rules="valuesValidation"
        :validation-value="elementData.correct"
        hide-details="auto"
      />
      <div v-if="!isReadonly" class="d-flex align-center ga-2 mt-2">
        <div class="d-flex flex-grow-1 justify-center">
          <VBtn
            prepend-icon="mdi-plus"
            text="Add Answer"
            variant="text"
            @click="addAnswer"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep, isNumber, last, pullAt, toNumber } from 'lodash-es';
import type {
  Element,
  ElementData,
} from '@tailor-cms/ce-numerical-response-manifest';
import { computed } from 'vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();

const emit = defineEmits<{
  update: [data: Partial<ElementData>];
}>();

const elementData = computed(() => props.element.data);
const answerCount = computed(
  () =>
    elementData.value.correct?.length ??
    elementData.value.prefixes?.length ??
    0,
);
const canRemoveAnswer = computed(
  () => !props.isReadonly && answerCount.value > 1,
);

const valuesValidation = [
  (val?: number[]) => !val || val.every(isNumber) || 'All values are required',
];

const addAnswer = () => {
  const { correct, prefixes, suffixes } = cloneDeep(elementData.value);
  prefixes.push('');
  suffixes.push('');
  const nextCorrect = correct ? [...correct, 0] : undefined;
  emit('update', {
    prefixes,
    suffixes,
    ...(nextCorrect && { correct: nextCorrect }),
  });
};

const updateAnswer = (
  key: 'prefixes' | 'correct' | 'suffixes',
  value: any,
  index: number,
) => {
  if (key === 'correct') {
    if (last(value) === '.') return;
    value = toNumber(value) || value;
  }
  const source = elementData.value[key];
  if (!source) return;
  const values = cloneDeep(source) as any[];
  values[index] = value;
  emit('update', { [key]: values });
};

const removeAnswer = (index: number) => {
  if (answerCount.value <= 1) return;
  const { correct, prefixes, suffixes } = cloneDeep(elementData.value);
  pullAt(prefixes, index);
  pullAt(suffixes, index);
  if (correct) pullAt(correct, index);
  emit('update', {
    prefixes,
    suffixes,
    ...(correct && { correct }),
  });
};
</script>

<style lang="scss" scoped>
.tce-numerical-response {
  text-align: left;
}
</style>
