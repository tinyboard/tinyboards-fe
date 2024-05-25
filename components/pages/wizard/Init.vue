<template>
    <div class="space-y-4">
        <h1 class="text-4xl text-gray-800 font-bold">Welcome to the Board Creator Wizard 🧙</h1>
        <p class="text-gray-700">Without further ado, let's initiate the procedure by naming your board.</p>
        <div>
            <label for="name" class="text-xs font-bold text-gray-900">Enter name</label>
            <div
                class="bg-gray-100 border border-gray-300 rounded px-4 py-2 focus-within:ring-2 flex flex-row items-center">
                <h3 class="text-gray-400 font-bold">+</h3>
                <input v-model="name" maxlength="26"
                    class="border-0 p-0 text-gray-800 font-bold bg-gray-100 focus:ring-0 w-full focus-visible:outline-none"
                    placeholder="Enter name..." />
            </div>
            <div class="flex justify-end">
                <p class="mt-2 text-xs" :class="board.name?.length > 20 ? 'text-red-600' : 'text-gray-500'">{{
                    board.name?.length }} / 26</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useWizardStore } from '@/stores/StoreWizard';
import { ref } from 'vue';

const board = useWizardStore();

const name = ref('');

watch(
    () => name.value,
    newValue => {
        if (name.value.includes(' ')) {
            name.value = name.value.replace(' ', '_');
        }

        board.name = newValue;
        board.boarding.canProceed = newValue.length > 0;
    }
)
</script>