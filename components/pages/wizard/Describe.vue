<template>
    <div class="space-y-4">
        <h1 class="text-4xl text-gray-800 font-bold">Let's descibe this board ✏️</h1>
        <p class="text-gray-700">What's +{{ wizard.name }} about? Write a bit about it.</p>
        <div>
            <label for="name" class="text-xs font-bold text-gray-900">Enter a display name</label>
            <input type="text" id="name" v-model="wizard.displayName"
                class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" />

        </div>
        <p class="text-sm text-gray-600">This step can be skipped.</p>
    </div>
</template>

<script setup>
import { useWizardStore } from '@/stores/StoreWizard';
import { ref } from 'vue';

const wizard = useWizardStore();

/*watch(
    () => name.value,
    newValue => {
        if (name.value.includes(' ')) {
            name.value = name.value.replace(' ', '_');
        }

        wizard.name = newValue;
        wizard.boarding.canProceed = newValue.length > 0;
    }
)*/
</script>