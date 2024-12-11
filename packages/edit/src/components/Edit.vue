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
      <VRow v-for="(_, index) in elementData.correct" :key="index">
        <VCol cols="3">
          <VTextField
            v-model="elementData.prefixes[index]"
            :readonly="isDisabled"
            placeholder="Prefix..."
            variant="outlined"
          />
        </VCol>
        <VCol :cols="canRemoveAnswer ? 5 : 6">
          <VTextField
            v-model="elementData.correct[index]"
            :readonly="isDisabled"
            :rules="[requiredRule]"
            placeholder="Correct value..."
            variant="outlined"
          />
        </VCol>
        <VCol cols="3">
          <VTextField
            v-model="elementData.suffixes[index]"
            :readonly="isDisabled"
            placeholder="Suffix..."
            variant="outlined"
          />
        </VCol>
        <VCol v-if="canRemoveAnswer" cols="1">
          <VBtn
            aria-label="Remove answer"
            class="my-2"
            color="primary-darken-4"
            size="x-small"
            variant="text"
            icon
            @click="removeAnswer(index)"
          >
            <VIcon icon="mdi-close" size="large" />
          </VBtn>
        </VCol>
      </VRow>
    </VSlideYTransition>
    <div v-if="!isDisabled" class="d-flex justify-center mt-4 mb-12">
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

const answersCount = computed(() => elementData.correct.length);
const isDirty = computed(() => !isEqual(elementData, props.element.data));
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

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'The field is required';
};

const updateData = (data: ElementData) => {
  Object.assign(elementData, cloneDeep(data));
};

watch(() => props.element.data, updateData);
</script>
