<template>
    <main class="flex flex-col pt-12 sm:pt-14">
        <!-- Main Content -->
        <section class="container mx-auto max-w-xl my-48 px-4 sm:px-6">
            <div class="flex flex-col items-center justify-center w-full">
                <!-- Alert -->
                <div
                    class="w-full p-4 bg-white border rounded-md shadow-inner-white"
                >
                    <div class="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5 text-red-600 mr-2"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                            ></path>
                            <path
                                d="M14.274 10.291a4 4 0 1 0 -5.554 -5.58m-.548 3.453a4.01 4.01 0 0 0 2.62 2.65"
                            ></path>
                            <path
                                d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 1.147 .167m2.685 2.681a4 4 0 0 1 .168 1.152v2"
                            ></path>
                            <line x1="3" y1="3" x2="21" y2="21"></line>
                        </svg>
                        <h1
                            class="text-lg md:text-xl leading-normal font-bold dark:text-gray-100"
                        >
                            @{{ user.name }}
                            {{
                                user.isBanned
                                    ? "is banned"
                                    : "has deleted their account"
                            }}
                        </h1>
                    </div>
                    <hr class="my-2" />
                    <p v-if="user.is_banned" class="text-gray-600">
                        This user has been
                        {{
                            user.unbanDate
                                ? `suspended from ${site.name} for ${unbanDays} day(s). Check
						back later.`
                                : `permanently banned from ${site.name}.`
                        }}
                    </p>
                    <p v-else class="text-gray-600">
                        Their profile is no longer available.
                    </p>
                    <ul class="mt-2 pl-4 flex flex-col list-disc">
                        <li>
                            <NuxtLink to="/feed">Go to home</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div
                    v-if="isAdmin"
                    class="w-full mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-md shadow-inner-white"
                >
                    <h2 class="text-base font-bold leading-6 text-gray-900">
                        Mod Tools
                    </h2>
                    <!-- Deleted -->
                    <p v-if="user.is_deleted" class="italic">
                        This user was deleted. There are no mod actions
                        available.
                    </p>
                    <!-- Removed -->
                    <ul v-else class="mt-2 pl-4 flex flex-col list-disc">
                        <li>
                            <button
                                @click="confirmUnban"
                                class="text-red-600 hover:underline"
                            >
                                Unban {{ user.username }}
                            </button>
                        </li>
                        <li>
                            <button class="text-red-600">
                                Purge {{ user.username }}'s posts and comments
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useModalStore } from "@/stores/StoreModal";
import { useSiteStore } from "@/stores/StoreSite";
import { format, parseISO } from "date-fns";

const props = defineProps({
    personView: {
        type: Object,
        required: true,
    },
});

const user = props.personView.person;

const userStore = useLoggedInUser();
const modalStore = useModalStore();
const site = useSiteStore();

// Admin
const isAdmin = computed(() => {
    return !!userStore.user && userStore.user.is_admin;
});

// Number of days until unban
const unbanDays = computed(() => {
    if (user.unbanDate) {
        const date = new Date(user.unbanDate);

        return Math.ceil(
            (Math.floor(date.getTime() / 1000) -
                Math.floor(Date.now() / 1000)) /
                (60 * 60 * 24),
        );
    } else {
        return null;
    }
});

// Unban
const confirmUnban = () => {
    modalStore.setModal({
        modal: "ModalBan",
        id: user.id,
        isOpen: true,
        options: {
            is_banned: user.isBanned,
            user: user,
        },
    });
};

// Purge
const confirmPurge = () => {
    modalStore.setModal({
        modal: "ModalPurge",
        id: props.item.post.id,
        isOpen: true,
    });
};
</script>
