<template>
    <div class="flex flex-col space-y-4 md:flex-row col-span-full p-4 md:px-8 border-b sm:rounded border-gray-200"
        :class="[
            user.banner ? '' : 'bg-primary bg-opacity-20',
            user.profileBackground ? 'sm:border-0 shadow-md' : 'sm:border',
        ]" :style="{
            backgroundImage: `url(${isEditing ? (imageStore.banner ?? settings.banner) : user.banner})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
        }">
        <div class="flex flex-row space-x-4 flex-grow">
            <!-- Avatar and FRAME!! :DD -->
            <div class="relative w-24 h-24 md:w-44 md:h-44">
                <!--<img v-if="user.avatarFrame" id="frame" :src="user.avatarFrame" class="z-10 absolute w-full h-full" />-->
                <CardsAvatar
                    :src="isEditing ? (imageStore.avatar ?? settings.avatar) : user.avatar"
                    :alt="`${user.name} avatar`"
                    size="lg"
                    class="!w-full !h-full !rounded-sm"
                />
            </div>
            <div class="flex flex-col" :class="{ 'mt-2': !isEditing }">
                <input v-if="isEditing" type="text" id="display-name" name="display-name" maxlength="30"
                    v-model="settings.displayName" placeholder="Display name"
                    class="border border-gray-800 bg-gray-800/20 w-full rounded-md font-bold text-white drop-shadow-md" />
                <h1 v-else class="font-bold text-xl sm:text-3xl text-white drop-shadow-md">
                    {{ user.displayName ?? user.name }}
                </h1>
                <p class="text-md text-white drop-shadow-xl">
                    {{ user.name }}
                    <span v-if="user.instance">@{{ user.instance }}</span>
                    <span v-if="user.isAdmin" class="ml-2 badge badge-large badge-red">
                        Admin
                    </span>
                </p>
                <!-- Bio (desktop) -->
                <div id="bio" v-if="isEditing || user.bio"
                    class="hidden sm:block relative mt-2 rounded w-full sm:w-72 bg-white/70 px-4 py-2">
                    <h6 class="font-semibold text-xs text-gray-900">
                        About me
                    </h6>
                    <div v-if="isEditing">
                        <textarea id="biography" name="biography" maxlength="255" rows="2"
                            class="block w-full rounded-md border-gray-200 bg-gray-100/70 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
                            v-model="settings.bio"
                            placeholder="Brief description about yourself. Max 255 characters." />
                        <div class="flex justify-end">
                            <p class="text-xs" :class="[
                                settings.bio ? settings.bio.length > 240 : false
                                    ? 'text-red-600'
                                    : 'text-gray-400',
                            ]">
                                {{ settings.bio?.length || 0 }} / 255
                            </p>
                        </div>
                    </div>
                    <div v-else class="text-md text-gray-700 user-bio" v-html="user.bioHTML" />
                </div>
                <p v-else class="hidden sm:block mt-2 font-italic text-gray-400 text-md">
                    This user has no bio. How boring.
                </p>
            </div>
        </div>
        <div class="flex flex-col space-y-2 flex-grow-0 w-full sm:w-72">
            <!-- Bio (mobile) -->
            <div id="bio-mobile" v-if="user.bio"
                class="mb-2 block sm:hidden relative mt:mt-2 rounded w-full sm:w-72 bg-white/70 p-2 pl-4">
                <h6 class="font-semibold text-xs text-gray-900">About me</h6>
                <div v-if="isEditing">
                    <textarea id="biography" name="biography" maxlength="255" rows="2"
                        class="block w-full rounded-md border-gray-200 bg-gray-100 shadow-inner-xs focus:bg-white focus:border-primary focus:ring-primary"
                        v-model="settings.bio" placeholder="Brief description about yourself. Max 255 characters." />
                    <div class="flex justify-end">
                        <p class="text-xs" :class="[
                            settings.bio ? settings.bio.length > 240 : false
                                ? 'text-red-600'
                                : 'text-gray-400',
                        ]">
                            {{ settings.bio?.length || 0 }} / 255
                        </p>
                    </div>
                </div>
                <div v-else class="text-md text-gray-700 user-bio" v-html="user.bioHTML" />
            </div>
            <p v-else class="block sm:hidden mt-2 font-italic text-gray-400 text-md">
                This user has no bio. How boring.
            </p>
            <!-- Editing: Change avatar and banner -->
            <div v-if="isEditing" class="w-full flex flex-col space-y-2 text-center">
                <div>
                    <label for="avatar-upload" class="button white w-full cursor-pointer">
                        Change avatar
                    </label>
                    <input id="avatar-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif"
                        @change="(e) => onFileChange(e, 'avatar')" />
                </div>
                <div>
                    <label for="banner-upload" class="button white w-full cursor-pointer">
                        Change banner
                    </label>
                    <input id="banner-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif"
                        @change="(e) => onFileChange(e, 'banner')" />
                </div>
                <div>
                    <label for="bg-upload" class="button white w-full cursor-pointer">
                        Change background
                    </label>
                    <input id="bg-upload" type="file" class="hidden" accept="image/png, image/jpeg, image/gif"
                        @change="(e) => onFileChange(e, 'background')" />
                </div>
            </div>
            <!-- Else: Counts -->
            <div v-else class="w-full rounded bg-white bg-opacity-70 px-4 py-2 space-y-2">
                <!-- Stats Row -->
                <div class="flex flex-row justify-around divide-x divide-gray-300">
                    <div class="flex flex-col flex-grow text-center">
                        <p class="text-xl text-gray-700 font-semibold">
                            {{ user.rep }}
                        </p>
                        <p class="text-md text-gray-600 font-semibold">Rep</p>
                    </div>
                    <div class="flex flex-col flex-grow text-center">
                        <p class="text-xl text-gray-700 font-semibold">
                            {{ user.postCount }}
                        </p>
                        <p class="text-md text-gray-600 font-semibold">Posts</p>
                    </div>
                    <div class="flex flex-col flex-grow text-center">
                        <p class="text-xl text-gray-700 font-semibold">
                            {{ user.commentCount }}
                        </p>
                        <p class="text-md text-gray-600 font-semibold">Comments</p>
                    </div>
                </div>
                <!-- Last Seen -->
                <div v-if="user.lastSeen" class="text-center text-sm text-gray-600 pt-1 border-t border-gray-300">
                    <span class="font-medium">Last seen:</span>
                    {{ formatLastSeen(user.lastSeen) }}
                </div>
            </div>
            <!-- Actions -->
            <ul v-if="isEditing" class="flex flex-row space-x-2 w-full text-center">
                <li class="flex-grow">
                    <button class="button red w-full" @click="discard" :disabled="isLoading">
                        Discard
                    </button>
                </li>
                <li class="flex-grow">
                    <button class="button green w-full" @click="submitSettings" :disabled="isLoading">
                        Save changes
                    </button>
                </li>
            </ul>
            <ul v-else-if="isAuthed" class="flex flex-col space-y-2 w-full text-center">
                <!-- Primary Actions -->
                <li class="flex flex-row space-x-2">
                    <button v-if="isSelf" class="button white w-full" @click="isEditing = true">
                        Edit my profile
                    </button>
                    <button
                        v-if="!isSelf"
                        class="button white flex-grow"
                        @click="toggleFollow"
                        :disabled="isFollowLoading"
                    >
                        {{ followButtonText }}
                    </button>
                    <NuxtLink v-if="!isSelf" :to="`/inbox/messages/${user.id}`" class="button white flex-grow">
                        Send message
                    </NuxtLink>
                    <div v-if="!isSelf">
                        <LazyMenusActionsProfile :user="user" :isAdmin="isAdmin" :isSelf="isSelf" :isLeft="true" />
                    </div>
                </li>
                <!-- Admin: Board Creation Approval Button -->
                <li v-if="isAdmin && !isSelf">
                    <button
                        class="button w-full"
                        :class="isBoardCreationApproved ? 'red' : 'green'"
                        @click="toggleBoardCreationApproval"
                        :disabled="boardCreationApprovalLoading"
                    >
                        {{ boardCreationApprovalLoading ? 'Loading...' : (isBoardCreationApproved ? 'Revoke Board Creation' : 'Trust for Board Creation') }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { format, parseISO } from "date-fns";
import { requirePermission } from "@/composables/admin";
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useImageStore } from "@/stores/StoreImages";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { onFileChange } from "@/composables/images";
import { useGqlMultipart } from "@/composables/graphql_multipart";
import { useGraphQLQuery, useGraphQLMutation } from "@/composables/useGraphQL";
import type { User } from "@/types/types";
import { formatDistanceToNow } from "date-fns";

const userStore = useLoggedInUser();
const imageStore = useImageStore();
const modalStore = useModalStore();
const toast = useToastStore();
//const frame = 'https://i.ibb.co/PZ4rj8Z/6e1b5f5977036a189465f5455f2c54722c12883d.png';
const isEditing = ref(false);
const isLoading = ref(false);

// Follow state management
const isFollowing = ref(false);
const isFollowLoading = ref(false);
const followStatusChecked = ref(false);

// Board creation approval state
const isBoardCreationApproved = ref(false);
const boardCreationApprovalLoading = ref(false);

const props = defineProps<{
    user: User;
}>();

// Format last seen timestamp
const formatLastSeen = (lastSeen: string) => {
    try {
        const lastSeenDate = parseISO(lastSeen);
        const now = new Date();
        const diffInMinutes = (now.getTime() - lastSeenDate.getTime()) / (1000 * 60);

        if (diffInMinutes < 10) {
            return 'Online now';
        } else {
            return formatDistanceToNow(lastSeenDate, { addSuffix: true });
        }
    } catch (e) {
        return 'Unknown';
    }
};

const SAVE_SETTINGS_QUERY = `
    mutation saveSettings(
    $displayName: String,
    $bio: String,
    $avatar: Upload,
    $banner: Upload,
    $profileBackground: Upload
    ) {
    updateSettings(
    displayName: $displayName,
    bio: $bio,
    avatar: $avatar,
    banner: $banner,
    profileBackground: $profileBackground
    ) { id }
    }
 `;


const settings = ref({
    displayName: props.user.displayName ?? props.user.name,
    avatar: props.user.avatar,
    background: props.user.profileBackground,
    banner: props.user.banner,
    bio: props.user.bio,
});

// Is Authed
const isAuthed = userStore.isAuthed;

// Is Self
const isSelf = computed(() => {
    return !!userStore.user && userStore.user.name === props.user.name;
});

// Admin
/*const isAdmin = computed(() => {
        return !!userStore.user && userStore.user.isAdmin
    });*/
const isAdmin = requirePermission("users");

// Follow button text
const followButtonText = computed(() => {
    if (isFollowLoading.value) {
        return 'Loading...';
    }
    if (!followStatusChecked.value) {
        return 'Follow';
    }
    return isFollowing.value ? 'Unfollow' : 'Follow';
});

// Check if currently following user
const checkFollowStatus = async () => {
    if (!isAuthed || isSelf.value) {
        return;
    }

    try {
        const query = `
            query IsFollowingUser($userId: Int!) {
                isFollowingUser(userId: $userId)
            }
        `;

        const { data: result } = await useGraphQLQuery(query, {
            variables: {
                userId: props.user.id
            }
        });
        isFollowing.value = result.value?.isFollowingUser || false;
        followStatusChecked.value = true;
    } catch (error) {
        console.error('Error checking follow status:', error);
        followStatusChecked.value = true;
    }
};

// Toggle follow/unfollow
const toggleFollow = async () => {
    if (!isAuthed || isSelf.value || isFollowLoading.value) {
        return;
    }

    isFollowLoading.value = true;

    try {
        if (isFollowing.value) {
            // Unfollow user
            const mutation = `
                mutation UnfollowUser($userId: Int!) {
                    unfollowUser(userId: $userId) {
                        success
                    }
                }
            `;

            const { data: result } = await useGraphQLMutation(mutation, {
                userId: props.user.id
            });
            if (result.value?.unfollowUser) {
                isFollowing.value = false;
                toast.addNotification({
                    header: "User unfollowed",
                    message: `You are no longer following @${props.user.name}`,
                    type: "success"
                });
            }
        } else {
            // Follow user
            const mutation = `
                mutation FollowUser($userId: Int!) {
                    followUser(userId: $userId) {
                        success
                    }
                }
            `;

            const { data: result } = await useGraphQLMutation(mutation, {
                userId: props.user.id
            });
            if (result.value?.followUser) {
                isFollowing.value = true;
                toast.addNotification({
                    header: "User followed",
                    message: `You are now following @${props.user.name}`,
                    type: "success"
                });
            }
        }
    } catch (error) {
        console.error('Error toggling follow:', error);
        toast.addNotification({
            header: "Action failed",
            message: error.message || "An error occurred while processing your request.",
            type: "error"
        });
    } finally {
        isFollowLoading.value = false;
    }
};

// Toggle board creation approval (admin only)
const toggleBoardCreationApproval = async () => {
    if (!isAdmin || isSelf.value || boardCreationApprovalLoading.value) {
        return;
    }

    boardCreationApprovalLoading.value = true;

    try {
        const newApprovalStatus = !isBoardCreationApproved.value;

        // NOTE: This mutation needs to be implemented in the backend
        const mutation = `
            mutation UpdateUserBoardCreationApproval($userId: Int!, $approved: Bool!) {
                updateUserBoardCreationApproval(userId: $userId, approved: $approved) {
                    id
                }
            }
        `;

        const { data: result } = await useGraphQLMutation(mutation, {
            variables: {
                userId: props.user.id,
                approved: newApprovalStatus
            }
        });

        if (result.value?.updateUserBoardCreationApproval) {
            isBoardCreationApproved.value = newApprovalStatus;
            toast.addNotification({
                header: newApprovalStatus ? "Trust granted" : "Trust revoked",
                message: newApprovalStatus
                    ? `@${props.user.name} can now create boards`
                    : `@${props.user.name} can no longer create boards`,
                type: "success"
            });
        }
    } catch (error) {
        console.error('Error updating board creation approval:', error);
        toast.addNotification({
            header: "Action failed",
            message: "Could not update board creation approval. This feature requires backend implementation.",
            type: "error"
        });
    } finally {
        boardCreationApprovalLoading.value = false;
    }
};

// Check follow status on component mount
onMounted(() => {
    checkFollowStatus();
    // Initialize boardCreationApproved from props
    isBoardCreationApproved.value = props.user.boardCreationApproved ?? false;
});

// Settings
const discard = () => {
    imageStore.purge();
    isEditing.value = false;
};
// File inputs
const files: {
    avatar?: File;
    banner?: File;
    profileBackground?: File;
} = {};
const submitSettings = async () => {
    isLoading.value = true;

    // upload images
    if (imageStore.avatar) {
        files["avatar"] = dataURLtoFile(imageStore.avatar);
        // after converting to file is finished, delete the original b64 url
        imageStore.purgeAvatar();
    }

    if (imageStore.banner) {
        files["banner"] = dataURLtoFile(imageStore.banner);
        imageStore.purgeBanner();
    }

    if (imageStore.background) {
        files["profileBackground"] = dataURLtoFile(imageStore.background);
        imageStore.purgeBackground();
    }

    try {
        const result = await useGqlMultipart({
            query: SAVE_SETTINGS_QUERY,
            variables: {
                displayName: settings.value.displayName,
                bio: settings.value.bio,
                avatar: null,
                banner: null,
                profileBackground: null
            },
            files
        });

        isLoading.value = false;

        if (result.data?.updateSettings) {
            // Update local user data
            const updatedData = result.data.updateSettings;
            Object.assign(user, {
                displayName: updatedData.displayName,
                bio: updatedData.bio,
                avatar: updatedData.avatar,
                banner: updatedData.banner,
                profileBackground: updatedData.profileBackground
            });

            // Clear image store
            imageStore.purgeImages();

            // Exit editing mode
            isEditing.value = false;

            toast.addNotification({
                header: "Profile updated",
                message: "Your profile has been updated successfully.",
                type: "success"
            });
        } else {
            throw new Error("Failed to update settings");
        }
    } catch (error) {
        isLoading.value = false;
        console.error("Error saving settings:", error);
        toast.addNotification({
            header: "Failed to save settings",
            message: error.message || "An error occurred while saving your settings.",
            type: "error"
        });
    }
};
</script>

<style>
#frame {
    transform: scale(1.2);
}

/* restrict usable html tags for bio */
.user-bio ul {
    margin-left: 0.5rem;
    list-style-type: disc;
}

.user-bio ol {
    list-style-type: decimal;
}

.user-bio strong {
    font-weight: bold;
}

.user-bio h1,
.user-bio h2,
.user-bio h3,
.user-bio h4,
.user-bio h5,
.user-bio h6 {
    font-weight: bold;
}

/* mobile */
@media screen and (max-width: 640px) {
    #display-name {
        font-size: 1.25rem !important;
        line-height: 1.75rem !important;
    }

    /*#bio::before {
			content: "";
		    position: absolute;
		    z-index: 0;
		    top: -5px;
		    left: 40px;
		    display: block;
		    width: 12px;
		    height: 12px;
		    background-color: rgb(255, 255, 255, 0.6);
		    background-opacity: 0.7;
		    transform: rotate(45deg);
		}*/
}

/* Tailwind breakpoint: sm */
@media screen and (min-width: 640px) {
    #display-name {
        font-size: 1.875rem !important;
        line-height: 2.25rem !important;
    }

    /*#bio::before {
			content: "";
		    position: absolute;
		    z-index: 0;
		    top: 10px;
		    left: -5px;
		    display: block;
		    width: 12px;
		    height: 12px;
		    background-color: rgb(255, 255, 255, 0.5);
		    background-opacity: 0.7;
		    transform: rotate(45deg);
		}*/
}
</style>
