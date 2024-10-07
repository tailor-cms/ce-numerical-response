<template>
  <VForm
    ref="form"
    class="tce-container"
    validate-on="submit"
    @submit.prevent="save"
  >
    <VTextarea
      v-model="elementData.question"
      :readonly="isDisabled"
      :rules="[requiredRule]"
      class="my-3"
      label="Question"
      rows="3"
      auto-grow
    />
    <div class="text-subtitle-2 mb-2">Answers</div>
    <VSlideYTransition group>
      <VRow v-for="(_, index) in elementData.correct" :key="index">
        <VCol cols="3">
          <VTextField
            v-model="elementData.prefixes[index]"
            :readonly="isDisabled"
            placeholder="Prefix..."
          />
        </VCol>
        <VCol :cols="canRemoveAnswer ? 5 : 6">
          <VTextField
            v-model="elementData.correct[index]"
            :readonly="isDisabled"
            :rules="[requiredRule]"
            placeholder="Correct value..."
          />
        </VCol>
        <VCol cols="3">
          <VTextField
            v-model="elementData.suffixes[index]"
            :readonly="isDisabled"
            placeholder="Suffix..."
          />
        </VCol>
        <VCol v-if="canRemoveAnswer" cols="1">
          <VBtn
            aria-label="Remove answer"
            class="my-2"
            density="comfortable"
            icon="mdi-close"
            variant="text"
            @click="removeAnswer(index)"
          />
        </VCol>
      </VRow>
    </VSlideYTransition>
    <div class="d-flex justify-center align-center mb-2">
      <VBtn
        v-if="!isDisabled"
        class="mt-4"
        prepend-icon="mdi-plus"
        variant="text"
        rounded
        @click="addAnswer"
      >
        Add Answer
      </VBtn>
    </div>
    <div v-if="!isDisabled" class="d-flex justify-end">
      <VBtn :disabled="isDirty" variant="text" @click="cancel">Cancel</VBtn>
      <VBtn :disabled="isDirty" class="ml-2" type="submit" variant="tonal">
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
.tce-container {
  text-align: left;
}
</style>
