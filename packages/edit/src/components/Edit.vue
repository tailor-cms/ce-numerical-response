<template>
  <QuestionContainer
    v-bind="{
      allowedEmbedTypes,
      elementData,
      isDirty,
      isDisabled,
      isGradeable,
    }"
    :show-feedback="false"
    @cancel="updateData(element.data)"
    @save="save"
    @update="updateData($event)"
  >
    <div class="text-subtitle-2 mb-2">Answers</div>
    <VSlideYTransition group>
      <div v-for="(_, i) in elementData.correct" :key="i" class="d-flex mb-2">
        <VRow>
          <VCol cols="3">
            <VTextField
              v-model="elementData.prefixes[i]"
              :readonly="isDisabled"
              placeholder="Prefix..."
              variant="outlined"
            />
          </VCol>
          <VCol cols="6">
            <VTextField
              v-model="elementData.correct[i]"
              :readonly="isDisabled"
              :rules="[(val: number) => !!val || 'Value is required']"
              placeholder="Correct value..."
              variant="outlined"
              type="number"
            />
          </VCol>
          <VCol cols="3">
            <VTextField
              v-model="elementData.suffixes[i]"
              :readonly="isDisabled"
              placeholder="Suffix..."
              variant="outlined"
            />
          </VCol>
        </VRow>
        <VBtn
          v-if="canRemoveAnswer"
          class="my-3 ml-4"
          aria-label="Remove answer"
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
    <div v-if="!isDisabled" class="d-flex justify-center mb-4">
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
import { computed, defineEmits, defineProps, reactive, ref, watch } from 'vue';
import {
  Element,
  ElementData,
} from '@tailor-cms/ce-numerical-response-manifest';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pullAt from 'lodash/pullAt';
import { QuestionContainer } from '@tailor-cms/core-components';

const emit = defineEmits(['save']);
const props = defineProps<{
  allowedEmbedTypes: string[];
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
  isGradeable: boolean;
}>();

const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const isDirty = computed(() => !isEqual(elementData, props.element.data));
const answersCount = computed(() => elementData.correct.length);
const canRemoveAnswer = computed(
  () => !props.isDisabled && answersCount.value > 1,
);

const addAnswer = () => {
  elementData.prefixes.push('');
  elementData.suffixes.push('');
  elementData.correct.push('');
};

const removeAnswer = (index: number) => {
  if (elementData.correct.length <= 1) return;
  pullAt(elementData.prefixes, index);
  pullAt(elementData.suffixes, index);
  pullAt(elementData.correct, index);
};

const save = () => emit('save', elementData);

const updateData = (data: ElementData) => {
  Object.assign(elementData, cloneDeep(data));
};

watch(() => props.element.data, updateData);
</script>
