<template>
  <div class="tce-numerical-response">
    <div class="text-title-small mb-2">Answers</div>
    <VSlideYTransition group>
      <div v-for="(_, i) in answerCount" :key="i" class="d-flex mb-2">
        <VRow>
          <VCol cols="3">
            <VTextField
              :model-value="elementData.prefixes[i]"
              :readonly="isReadonly"
              placeholder="Prefix..."
              variant="outlined"
              @update:model-value="updateAnswer('prefixes', $event, i)"
            />
          </VCol>
          <VCol cols="6">
            <VNumberInput
              :model-value="elementData.correct?.[i]"
              :readonly="isReadonly"
              :rules="[(val: number) => isNumber(val) || 'Value is required']"
              control-variant="split"
              placeholder="Correct value..."
              type="number"
              variant="outlined"
              @update:model-value="updateAnswer('correct', $event, i)"
            />
          </VCol>
          <VCol cols="3">
            <VTextField
              :model-value="elementData.suffixes[i]"
              :readonly="isReadonly"
              placeholder="Suffix..."
              variant="outlined"
              @update:model-value="updateAnswer('suffixes', $event, i)"
            />
          </VCol>
        </VRow>
        <VBtn
          v-if="canRemoveAnswer"
          aria-label="Remove answer"
          class="my-3 ml-4"
          density="comfortable"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="removeAnswer(i)"
        />
      </div>
    </VSlideYTransition>
    <div v-if="!isReadonly" class="d-flex justify-center mb-4">
      <VBtn
        prepend-icon="mdi-plus"
        text="Add Answer"
        variant="text"
        @click="addAnswer"
      />
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
