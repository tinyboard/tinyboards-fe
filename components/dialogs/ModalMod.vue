<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog
            as="div"
            @close="modalStore.closeModal"
            class="modal relative z-50"
        >
            <!-- Backdrop -->
            <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="fixed inset-0 bg-black/80" />
            </TransitionChild>
            <!-- Modal -->
            <div class="fixed inset-0 overflow-y-auto">
                <div
                    class="flex min-h-full items-center justify-center p-2.5 sm:p-4 text-center"
                >
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-[cubic-bezier(.2,0,0,1.4)]"
                        enter-from="opacity-0 scale-90"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-[cubic-bezier(.2,0,0,1.4)]"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-90"
                    >
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-md bg-white p-4 text-left align-middle shadow-xl transition-all"
                        >
                            <!-- Header -->
                            <DialogTitle
                                v-if="hasUser && mode === 'update'"
                                as="h3"
                                class="text-lg font-bold leading-6 text-gray-900"
                            >
                                Edit mod permissions for @{{
                                    options.user.name
                                }}
                            </DialogTitle>
                            <DialogTitle
                                v-else-if="hasUser && mode === 'remove'"
                                as="h3"
                                class="text-lg font-bold leading-6 text-gray-900"
                            >
                                <span v-if="hasAcceptedInvite"
                                    >Remove @{{ options.user.name }} as
                                    mod</span
                                >
                                <span v-else
                                    >Revoke mod invite to @{{
                                        options.user.name
                                    }}</span
                                >
                            </DialogTitle>
                            <DialogTitle
                                v-else
                                as="h3"
                                class="text-lg font-bold leading-6 text-gray-900"
                            >
                                Invite mod to +{{ board.name }}
                            </DialogTitle>
                            <!-- Body -->
                            <div class="mt-2">
                                <p
                                    v-if="mode === 'remove'"
                                    class="text-sm text-gray-500"
                                >
                                    {{ options.user.name }} will no longer be
                                    {{
                                        hasAcceptedInvite
                                            ? "a moderator of"
                                            : "invited to moderate"
                                    }}
                                    +{{ board.name }}.
                                    <br />
                                    <br />
                                    You will be able to invite them back
                                    anytime.
                                </p>
                                <div v-if="mode === 'add'" class="mt-2">
                                    <label
                                        for="target"
                                        class="text-md text-gray-600 font-semibold"
                                        >User</label
                                    >
                                    <!--<input type="text" name="target" id="target" v-model="target"
                    class="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary text-base"
                    placeholder="username without the @" maxlength="255" />-->
                                    <InputsUser
                                        v-model="target"
                                        :allow-banned="true"
                                        :limit="5"
                                    />
                                </div>
                                <h3
                                    v-if="!isRemoving"
                                    class="mt-2 text-md text-gray-600 font-semibold"
                                >
                                    Permissions
                                </h3>
                                <div
                                    v-if="!isRemoving"
                                    class="space-y-2 divide-y-[1px]"
                                >
                                    <div
                                        v-for="perm in permissions"
                                        :key="perm.code"
                                        class="flex justify-between items-center"
                                    >
                                        <div class="my-2 mr-2">
                                            <h5
                                                class="text-gray-800 font-semibold"
                                                :class="{
                                                    'text-opacity-60':
                                                        fullPermsEnabled,
                                                }"
                                            >
                                                {{ perm.name }}
                                            </h5>
                                            <p
                                                class="text-sm text-gray-600"
                                                :class="{
                                                    'text-opacity-60':
                                                        fullPermsEnabled,
                                                }"
                                            >
                                                {{ perm.description }}
                                            </p>
                                        </div>
                                        <InputsSwitch
                                            :id="perm.name"
                                            :isEnabled="
                                                (permissionCode & perm.code) > 0
                                            "
                                            :is-disabled="fullPermsEnabled"
                                            @enabled="
                                                permissionCode & perm.code
                                                    ? (permissionCode -=
                                                          perm.code)
                                                    : (permissionCode +=
                                                          perm.code)
                                            "
                                        />
                                    </div>
                                    <div
                                        class="flex justify-between items-center mt-2 border-t-[1px] border-red-500"
                                    >
                                        <div class="my-2 mr-2">
                                            <h5
                                                class="text-red-500 font-semibold"
                                            >
                                                Full Permissions
                                            </h5>
                                            <p class="text-sm text-gray-600">
                                                Every single permission. Can add
                                                and remove other mods below
                                                themself.
                                            </p>
                                        </div>
                                        <InputsSwitch
                                            id="full"
                                            :isEnabled="
                                                (permissionCode &
                                                    MOD_PERMISSIONS.full) >
                                                0
                                            "
                                            @enabled="
                                                permissionCode &
                                                MOD_PERMISSIONS.full
                                                    ? (permissionCode -=
                                                          MOD_PERMISSIONS.full)
                                                    : (permissionCode =
                                                          MOD_PERMISSIONS.full)
                                            "
                                        />
                                    </div>
                                </div>
                                <p
                                    v-if="noPermissions && mode !== 'remove'"
                                    class="text-md text-red-500 font-semibold"
                                >
                                    This mod will have no permissions. They will
                                    be displayed on the mod list, but won't be
                                    able to do anything.
                                </p>
                            </div>
                            <div class="mt-6 flex space-x-2 justify-end">
                                <button
                                    type="button"
                                    class="button gray"
                                    @click="modalStore.closeModal"
                                >
                                    No, cancel
                                </button>
                                <button
                                    class="button"
                                    :class="[mode === 'add' ? 'green' : 'red']"
                                    @click="submit"
                                    :disabled="mode === 'add' && !target"
                                >
                                    {{ BUTTON_TEXT[mode] }}
                                </button>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
// import { baseURL } from "@/server/constants";
import { useApi } from "@/composables/api";
import { useToastStore } from "@/stores/StoreToast";
import { useModalStore } from "@/stores/StoreModal";
import { useBoardStore } from "@/stores/StoreBoard";
import { MOD_PERMISSIONS } from "@/composables/mod";
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from "@headlessui/vue";

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    /*username: {
    type: String,
    default: null,
    required: true
  },*/
    options: {
        type: Object,
    },
});

const permissions = [
    {
        name: "Manage Settings",
        description: "Change board settings and general appearance.",
        code: MOD_PERMISSIONS["config"],
    },
    {
        name: "Manage Appearance",
        description: "Edit board CSS (WIP).",
        code: MOD_PERMISSIONS["appearance"],
    },
    {
        name: "Manage Content",
        description: "Remove and approve posts and comments. Access mod queue.",
        code: MOD_PERMISSIONS["content"],
    },
    {
        name: "Manage Users",
        description: "Ban and unban users. Manage list of approved users.",
        code: MOD_PERMISSIONS["users"],
    },
];

const permissionCode = ref(props.options.modPerms || 0);
const hasAcceptedInvite = ref(props.options.hasAcceptedInvite ?? true);
const noPermissions = computed(() => permissionCode.value == 0);
const fullPermsEnabled = computed(
    () => (permissionCode.value & MOD_PERMISSIONS["full"]) > 0,
);

watch(
    () => props.options.modPerms,
    (newPerms) => (permissionCode.value = newPerms || 0),
);
watch(
    () => props.options.hasAcceptedInvite,
    (newVal) => (hasAcceptedInvite.value = newVal ?? true),
);

// const remove = computed(() => props.options.user?.is_admin || props.options.remove);
const isRemoving = computed(() => props.options.isRemoving);
const hasUser = computed(() => props.options.hasOwnProperty("user"));
const target = ref("");

const modalStore = useModalStore();

// Removal
const toast = useToastStore();

// Board
const boardStore = useBoardStore();
const board = boardStore.board;

// Mode
const mode = computed(() => {
    if (isRemoving.value) {
        // remove mod
        return "remove";
    } else if (hasUser.value) {
        // update mod permission
        return "update";
    } else {
        // add mod
        return "add";
    }
});

const METHODS = {
    remove: "DELETE",
    update: "PATCH",
    add: "PUT",
};

const MESSAGE = {
    remove: "removed",
    update: "permissions updated",
    add: "invited",
};

const BUTTON_TEXT = {
    remove: "Remove mod",
    update: "Save permissions",
    add: "Invite mod",
};

const submit = async () => {
    //const isAdmin = props.options.user.is_admin;
    const username = props.options.user?.name || target.value;

    const apiRoute = (function () {
        if (mode.value === "add") {
            // Addoing mod
            return `/boards/${board.id}/mods`;
        } else {
            // Removing or editing mod
            return `/boards/${board.id}/mods/${props.options.user.id}`;
        }
    })();

    const requestBody = {};
    if (mode.value !== "remove") {
        requestBody["permissions"] = permissionCode.value;

        if (mode.value === "add") {
            requestBody["username"] = target.value;
        }
    }
    let { data, error } = await useApi(apiRoute, {
        body: requestBody,
        method: METHODS[mode.value],
    });
    if (data.value) {
        // Parse response.
        data = JSON.parse(JSON.stringify(data.value));
        console.log(data);
        // Show success toast.
        toast.addNotification({
            header: `Moderator ${MESSAGE[mode.value]}`,
            message: "Reload the page to see changes.",
            type: "success",
        });
    } else {
        //console.error(JSON.stringify(error.value, null, 4));
        // Show error toast.
        toast.addNotification({
            header: "An error occured.",
            message: "Something went wrong on our end. Please try again.",
            type: "error",
        });
    }
    // Close the modal.
    modalStore.closeModal();
};
</script>
