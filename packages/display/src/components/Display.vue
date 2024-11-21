<template>
  <VForm ref="form" class="tce-root" @submit.prevent="submit">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="rich-text px-2 my-4" v-html="data.question"></div>
    <div v-if="data.hint" class="d-flex justify-end mb-4">
      <VTooltip
        v-model="showHint"
        :open-on-hover="false"
        location="bottom"
        max-width="350"
        close-on-back
        open-on-click
      >
        <template #activator="{ isActive, props: tooltipProps }">
          <VBtn
            v-click-outside="() => (showHint = false)"
            v-bind="tooltipProps"
            :active="isActive"
            :prepend-icon="`mdi-lightbulb-${isActive ? 'on' : 'outline'}`"
            size="small"
            text="Hint"
            variant="text"
            rounded
          />
        </template>
        {{ data.hint }}
      </VTooltip>
    </div>
    <VTextField
      v-for="([prefix, sufix], index) in items"
      :key="index"
      v-model="response[index]"
      :prefix="prefix"
      :readonly="submitted"
      :rules="[requiredRule]"
      :suffix="sufix"
      class="my-3"
      label="Answer"
    >
      <template v-if="submitted" #append>
        <VIcon v-bind="iconProps(index)" />
      </template>
    </VTextField>
    <VAlert
      v-if="submitted"
      :text="userState?.isCorrect ? 'Correct' : 'Incorrect'"
      :type="userState?.isCorrect ? 'success' : 'error'"
      class="mb-3"
      rounded="lg"
      variant="tonal"
    />
    <div class="d-flex justify-end">
      <VBtn v-if="!submitted" type="submit" variant="tonal">Submit</VBtn>
      <VBtn v-else variant="tonal" @click="submitted = false">Try Again</VBtn>
    </div>
  </VForm>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { ElementData } from '@tailor-cms/ce-numerical-response-manifest';
import zip from 'lodash/zip';

const initializeResponse = () =>
  cloneDeep(props.userState?.response) ??
  Array(props.data.prefixes.length).fill('');

const props = defineProps<{ id: number; data: ElementData; userState: any }>();
const emit = defineEmits(['interaction']);

const form = ref<HTMLFormElement>();
const showHint = ref(false);
const submitted = ref('isSubmitted' in (props.userState ?? {}));
const response = ref<string[]>(initializeResponse());

const items = computed(() => zip(props.data.prefixes, props.data.suffixes));

const submit = async () => {
  const { valid } = await form.value?.validate();
  if (valid) emit('interaction', { response: response.value });
};

const requiredRule = (val: string | boolean | number) => {
  return !!val || 'You have to enter your answer.';
};

const iconProps = (index: number) => {
  const { response, correct } = props.userState;
  const isCorrect = response?.[index] === correct?.[index];
  if (isCorrect) return { icon: 'mdi-check-circle', color: 'success' };
  return { icon: 'mdi-close-circle', color: 'error' };
};

watch(
  () => props.userState,
  (state = {}) => {
    response.value = initializeResponse();
    submitted.value = 'isCorrect' in state;
  },
  { deep: true },
);
</script>

<style scoped>
.tce-root {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
}
</style>
