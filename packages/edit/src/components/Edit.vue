<template>
  <QuestionContainer
    v-bind="{ elementData, embedElementConfig, isReadonly }"
    :show-feedback="false"
    @update="emit('update', $event)"
  >
    <div class="text-subtitle-2 mb-2">Answers</div>
    <VSlideYTransition group>
      <div v-for="(_, i) in elementData.correct" :key="i" class="d-flex mb-2">
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
              :model-value="elementData.correct[i]"
              :readonly="isReadonly"
              :rules="[(val: number) => !!val || 'Value is required']"
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
          color="primary-darken-4"
          size="x-small"
          variant="text"
          icon
          @click="removeAnswer(i)"
        >
          <VIcon icon="mdi-close" size="large" />
        </VBtn>
      </div>
    </VSlideYTransition>
    <div v-if="!isReadonly" class="d-flex justify-center mb-4">
      <VBtn
        color="primary-darken-4"
        prepend-icon="mdi-plus"
        variant="text"
        @click="addAnswer"
      >
        Add Answer
      </VBtn>
    </div>
  </QuestionContainer>
</template>

<script lang="ts" setup>
import { cloneDeep, last, pullAt, toNumber } from 'lodash-es';
import { computed, defineEmits, defineProps } from 'vue';
import { Element } from '@tailor-cms/ce-numerical-response-manifest';
import { QuestionContainer } from '@tailor-cms/core-components';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits(['save', 'update']);

const elementData = computed(() => props.element.data);
const canRemoveAnswer = computed(
  () => !props.isReadonly && elementData.value.correct.length > 1,
);

const addAnswer = () => {
  const { correct, prefixes, suffixes } = cloneDeep(elementData.value);
  prefixes.push('');
  suffixes.push('');
  correct.push('');
  emit('update', { correct, prefixes, suffixes });
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
  const values = cloneDeep(elementData.value[key]);
  values[index] = value;
  emit('update', { [key]: values });
};

const removeAnswer = (index: number) => {
  if (elementData.value.correct.length <= 1) return;
  const { correct, prefixes, suffixes } = cloneDeep(elementData.value);
  pullAt(prefixes, index);
  pullAt(suffixes, index);
  pullAt(correct, index);
  emit('update', { correct, prefixes, suffixes });
};
</script>
