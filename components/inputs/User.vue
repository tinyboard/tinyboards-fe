<!-- User input with autocomplete -->
<template>
    <Combobox as="div" v-model="selectedUser">
        <div class="flex items-center w-full p-1 border-[1px] border-gray-300 rounded">
            <div v-if="selectedUser.hasOwnProperty('person')" class="p-[2px] border-[0.5px] border-gray-400 mr-2">
                <img loading="lazy" :src="selectedUser.person.avatar" alt="avatar"
                    class="flex-shrink-0 object-cover w-8 h-8 md:w-10 md:h-10" />
            </div>
            <div v-else class="border-dashed border-[2px] border-gray-400 p-2 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                    <path d="M19 22v.01" />
                    <path d="M19 19a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483" />
                </svg>
            </div>
            <h3 class="text-gray-500 text-[15px] font-semibold">@</h3>
            <ComboboxInput class="border-0 px-0 font-semibold text-gray-800 flex-grow mr-2"
                style="font-size: 15px !important;" placeholder="Enter username..." @change="query = $event.target.value"
                :display-value="(v) => v.person?.name ?? ''" />
        </div>
        <ComboboxOptions>
            <div class="absolute bg-white w-full max-w-[26rem] z-[999] py-2 rounded  shadow-2xl overflow-visible">
                <ComboboxOption as="template" v-for="v in users" :key="v.person.id" :value="v" v-slot="{ active }">
                    <div class="flex items-center w-full p-1 hover:bg-gray-300 cursor-pointer" :class="{
                        'bg-primary bg-opacity-20 hover:bg-opacity-30': active,
                        'bg-transparent hover:bg-gray-300': !active
                    }">
                        <div class="p-[2px] border-[0.5px] border-gray-400 mr-2">
                            <img loading="lazy" :src="v.person.avatar" alt="avatar"
                                class="flex-shrink-0 object-cover w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        <h3 class="text-gray-500 text-[15px] font-semibold">@</h3>
                        <h3 class="text-gray-800 text-[15px] font-semibold">{{ v.person.name }}</h3>
                    </div>
                </ComboboxOption>
            </div>
        </ComboboxOptions>
    </Combobox>
</template>

<script setup>
import { ref } from 'vue';
import { useApi } from '@/composables/api';
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption
} from '@headlessui/vue';

const users = ref([]);

const selectedUser = ref('');
const query = ref('');

const props = defineProps(['modelValue', 'limit', 'allowBanned']);
const emit = defineEmits(['update:modelValue']);

const limit = props.limit || 3;
const allowBanned = props.allowBanned || false;

watch(
    () => selectedUser.value,
    u => {
        emit("update:modelValue", u.person.name);
    }
)

watch(
    () => query.value,
    async filter => {
        const params = {
            limit,
            page: 1,
            search_term: filter
        };

        if (!allowBanned) {
            params["is_banned"] = false;
        }

        const { data, pending, error, refresh } = await useApi("/members", {
            query: params,
            method: "get",
            key: `user_fetch_${params.search_term}_${params.limit}_`
        });

        users.value = data.value.members;
    }
)

</script>