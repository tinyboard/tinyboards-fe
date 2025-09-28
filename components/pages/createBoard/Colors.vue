<template>
    <div class="space-y-4">
        <h1 class="text-4xl text-gray-800 font-bold">Time to add some colors 🎨</h1>
        <p class="text-gray-700">Give {{ board.name }} an unforgettably cool style. More customization options will be
            available later.</p>


        <div class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
            :style="{ 'border-color': board.primaryColor }">
            <div>
                <h3 class="text-gray-800 font-bold">Primary color</h3>
                <p class="text-sm text-gray-500">The primary color used almost everywhere.</p>
            </div>
            <LazyPopoversColorPicker :color="board.primaryColor"
                @color-changed="newValue => board.primaryColor = newValue" />
        </div>
        <div class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
            :style="{ 'border-color': board.secondaryColor }">
            <div>
                <h3 class="text-gray-800 font-bold">Secondary color</h3>
                <p class="text-sm text-gray-500">The secondary color, used where the primary color
                    isn't.</p>
            </div>
            <LazyPopoversColorPicker :color="board.secondaryColor"
                @color-changed="newValue => board.secondaryColor = newValue" />
        </div>
        <div class="flex flex-row justify-between border-2 rounded px-6 py-3 items-center space-x-2 w-full"
            :style="{ 'border-color': board.hoverColor }">
            <div>
                <h3 class="text-gray-800 font-bold">Hover color</h3>
                <p class="text-sm text-gray-500">Color of things with the primary color when you hover
                    over them.</p>
            </div>
            <LazyPopoversColorPicker :color="board.hoverColor" @color-changed="newValue => board.hoverColor = newValue" />
        </div>
        <p class="text-center text-green-500 font-bold">...And we're done!</p>
    </div>
</template>

<script setup>
import { useWizardStore } from '@/stores/StoreWizard';
import { useSiteStore } from '@/stores/StoreSite';
import { ref } from 'vue';

const board = useWizardStore();
const site = useSiteStore();

// Convert colors from hex to rgb
const toRGB = hex => {
    const h = hex.slice(1);
    const values = [h.slice(0, 2), h.slice(2, 4), h.slice(4, 6)];

    return values.map(x => parseInt(x, 16)).join();
}
</script>