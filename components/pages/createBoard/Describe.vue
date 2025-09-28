<template>
    <div class="space-y-4">
        <h1 class="text-4xl text-gray-800 font-bold">Let's describe this board ✏️</h1>
        <p class="text-gray-700">What's {{ board.name }} about? Write a bit about it.</p>
        <div>
            <label for="name" class="text-base font-bold text-gray-900">Display name</label>
            <input type="text" id="name" v-model="board.displayName" maxlength="50" :placeholder="board.name"
                class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base" />
            <div class="flex justify-between">
                <p class="mt-2 text-sm text-gray-500">This will take precedence over the name of your board, if specified.
                </p>
                <p class="mt-2 text-xs" :class="board.displayName.length > 45 ? 'text-red-600' : 'text-gray-500'">{{
                    board.displayName.length }} / 50</p>
            </div>
        </div>
        <div>
            <label class="text-base font-bold leading-6 text-gray-900">Description</label>

            <!-- Input -->
            <textarea id="description" name="description" maxlength="255" rows="4"
                class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
                :placeholder="`A board for discussing everything about why ${board.name} is the best board ever.`"
                v-model="board.description" />
            <div class="flex justify-between">
                <p class="mt-2 text-sm text-gray-500">Brief description about your board.</p>
                <p class="mt-2 text-xs" :class="board.description.length > 230 ? 'text-red-600' : 'text-gray-500'">{{
                    board.description.length }} / 255</p>
            </div>
        </div>
        <p class="text-sm text-gray-600">This step can be skipped.</p>
    </div>
</template>

<script setup>
import { useWizardStore } from '@/stores/StoreWizard';
import { ref } from 'vue';

const board = useWizardStore();

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