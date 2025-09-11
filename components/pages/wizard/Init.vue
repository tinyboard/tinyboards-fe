<template>
    <div class="space-y-4">
        <h1 class="text-4xl text-gray-800 font-bold">Welcome to the Board Creator Wizard 🧙</h1>
        <p class="text-gray-700">Without further ado, let's initiate the procedure by naming your board.</p>
        <div>
            <label for="name" class="text-md font-bold text-gray-900">Enter name</label>
            <div
                class="bg-white border rounded px-4 py-2 focus-within:ring-2 flex flex-row items-center" :class="`border-${status}`">
                <h3 class="text-gray-400 font-bold">+</h3>
                <input v-model="name" maxlength="26"
                    class="border-0 p-0 text-gray-800 font-bold bg-white focus:ring-0 w-full focus-visible:outline-none"
                    placeholder="Enter name..." />
            </div>
            <div class="flex justify-between mt-2">
                <p class="text-xs" :class="`text-${status}`" v-show="name !== ''">{{ message }}</p>
                <p class="text-xs" :class="name.length > 20 ? 'text-red-600' : 'text-gray-500'">{{
                    name.length }} / 26</p>
            </div>
        </div>
        <div class="hidden border border-green-600"></div>
    </div>
</template>

<script setup>
import { useWizardStore } from '@/stores/StoreWizard';
import { ref, computed } from 'vue';
import { useAPI } from '@/composables/api';

const board = useWizardStore();

const name = ref(board.name ?? '');
const pending = ref(false);
const taken = ref(false);
const regexMatch = ref(true);

const NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9_]{0,29}$/g;
const praise = [
    "Nice.",
    "Alright.",
    "Mediocre.",
    "Really? This could be better.",
    "It passes, I guess...",
    "Good, good. Let's put this on the fridge.",
    "SUCKS! That aside, it's okay.",
    "meh. -_-",
    "FINALLY"
]

let timeoutID = 0;

watch(
    () => name.value,
    async newValue => {
        if (name.value.includes(' ')) {
            name.value = name.value.replace(' ', '_');
        }

        board.name = name.value;

        /*if (name.value !== '') {
            console.log("fetching");
           let { data, error } = await useAPI("/board/exists", {
                key: `check_${name.value}`,
                query: {
                    board_name: name.value
                }
            });

            taken.value = data.value.result;
            console.log(data.value);        }
        */

        // One second after the user finishes typing, send a request to check if the board name is taken. This is to avoid spamming the server. Any prior timeouts are canceled.
        clearTimeout(timeoutID);
        pending.value = false;
        regexMatch.value = name.value.match(NAME_REGEX);

        if (regexMatch.value) {
            pending.value = true;
            timeoutID = setTimeout(
                async () => {

                    let { data, error } = await useAPI("/boards/exists", {
                        key: `check_${name.value}`,
                        query: {
                            board_name: name.value
                        }
                    });

                    pending.value = false;
                    taken.value = data.value.result;

                    //board.boarding.canProceed = !taken;
                },
                1000
            );
        }
        

        //board.boarding.canProceed = regexMatch.value;
    }
)

const status = computed(() => {
    if (name.value === "" || pending.value) {
        // initial status and pending
        return "gray-300"
    }
    if (taken.value || !regexMatch.value) {
        // error
        return "red-600";
    } else if (!taken.value && regexMatch.value) {
        // valid
        return "green-600";
    } else {
        // fallback
        return "gray-300"
    }
});

const message = computed(() => {
    if (pending.value) {
        return "Checking...";
    } else if (taken.value) {
        return "A board with that name already exists.";
    } else if (!regexMatch.value) {
        return "Board name contains invalid characters.";
    } else {
        return praise[Math.floor(Math.random() * praise.length)];
    }
});

const canProceed = computed(() => {
    if (pending.value || taken.value || !regexMatch.value) {
        return false;
    } else {
        return true;
    }
})

watch(
    () => canProceed.value,
    nv => {
        board.boarding.canProceed = nv;
    }
)
</script>