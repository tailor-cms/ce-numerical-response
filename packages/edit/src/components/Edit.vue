<template>
  <VForm
    ref="form"
    class="tce-numerical-response my-4"
    validate-on="submit"
    @submit.prevent="save"
  >
    <RichTextEditor
      v-model="elementData.question"
      :readonly="isDisabled"
      :rules="[requiredRule]"
      class="my-3"
      label="Question"
      variant="outlined"
    />
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
            density="comfortable"
            icon="mdi-close"
            variant="text"
            @click="removeAnswer(index)"
          />
        </VCol>
      </VRow>
    </VSlideYTransition>
    <div class="d-flex justify-center align-center mb-12">
      <VBtn
        v-if="!isDisabled"
        class="mt-4"
        color="primary-darken-4"
        prepend-icon="mdi-plus"
        variant="text"
        rounded
        @click="addAnswer"
      >
        Add Answer
      </VBtn>
    </div>
    <VTextField
      v-model="elementData.hint"
      :clearable="!isDisabled"
      :readonly="isDisabled"
      placeholder="Optional hint..."
      variant="outlined"
    />
    <div v-if="!isDisabled" class="d-flex justify-end">
      <VBtn
        :disabled="isDirty"
        color="primary-darken-4"
        variant="text"
        @click="cancel"
      >
        Cancel
      </VBtn>
      <VBtn
        :disabled="isDirty"
        class="ml-2"
        color="primary-darken-3"
        type="submit"
        variant="tonal"
      >
        Save
      </VBtn>
    </div>
  </VForm>
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
import { RichTextEditor } from '@tailor-cms/core-components';

const emit = defineEmits(['save']);
const props = defineProps<{
  element: Element;
  isFocused: boolean;
  isDisabled: boolean;
}>();

const form = ref<HTMLFormElement>();
const elementData = reactive<ElementData>(cloneDeep(props.element.data));

const answersCount = computed(() => elementData.correct.length);
const isDirty = computed(() => isEqual(elementData, props.element.data));
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

const save = async () => {
  const { valid } = await form.value?.validate();
  if (valid) emit('save', elementData);
};

const cancel = () => {
  Object.assign(elementData, cloneDeep(props.element.data));
  form.value?.resetValidation();
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'The field is required';
};

watch(
  () => props.element.data,
  (data) => Object.assign(elementData, cloneDeep(data)),
);
</script>

<style lang="scss" scoped>
.tce-numerical-response {
  text-align: left;
}
</style>
