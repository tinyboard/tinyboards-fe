<template>
    <div
        class="h-full"
        :class="{ 'overflow-hidden': route.meta.isScrollDisabled }"
    >
        <NuxtLoadingIndicator color="rgba(255,255,255,0.45)" :height="3" />
        <!-- Navigation Bar -->
        <!-- Use v-show instead of v-if to prevent component destruction/recreation -->
        <!-- This prevents board colors from resetting when auth state changes -->
        <NavbarAuthenticated v-show="isAuthed" />
        <Navbar v-show="!isAuthed" />
        <!-- Side Navigation -->
        <!--<NavbarLeft
            v-if="site.enableBoards && !route.meta.isLeftNavbarDisabled"
        />-->
        <!-- Main content with bottom padding for mobile nav -->
        <div :class="{ 'pb-16 md:pb-0': isAuthed }">
            <slot />
        </div>
        <NavigationFooter v-if="!route.meta.isFooterDisabled" />
        <!-- Mobile Bottom Navigation -->
        <NavigationBottomNav />
        <LazyDialogsToastList v-if="toastStore.hasInit" />
        <LazyDialogsModalList v-if="modalStore.hasInit" />
    </div>
</template>

<script setup>
import { useLoggedInUser } from "@/stores/StoreAuth";
import { useModalStore } from "@/stores/StoreModal";
import { useToastStore } from "@/stores/StoreToast";
import { useSiteStore } from "@/stores/StoreSite";
import { useBoardStore } from "@/stores/StoreBoard";
// import { ref } from "vue";

//import { onMounted } from 'vue;'

const site = useSiteStore();
const route = useRoute();
const router = useRouter();
const boardStore = useBoardStore();

// Track if we're on a board route to preserve colors during hydration
const isOnBoardRoute = computed(() => {
    return route.path.startsWith('/b/') && !!route.params?.board;
});

// Store last known board colors to prevent flash during hydration
// Try to restore from sessionStorage if available
const getStoredColors = () => {
    if (process.client) {
        try {
            const stored = sessionStorage.getItem('lastBoardColors');
            return stored ? JSON.parse(stored) : { primary: null, secondary: null, hover: null };
        } catch {
            return { primary: null, secondary: null, hover: null };
        }
    }
    return { primary: null, secondary: null, hover: null };
};

const lastBoardColors = ref(getStoredColors());

// Save colors to sessionStorage when they change
watch(lastBoardColors, (newColors) => {
    if (process.client) {
        try {
            sessionStorage.setItem('lastBoardColors', JSON.stringify(newColors));
        } catch {
            // Ignore storage errors
        }
    }
}, { deep: true });

// Helper function to normalize color format (handles both hex and RGB string formats)
function normalizeColor(color) {
    if (!color) return null;

    // If already in RGB format (e.g., "60, 105, 145"), return as-is
    if (/^\d+,\s*\d+,\s*\d+$/.test(color)) {
        return color;
    }

    // If hex format, convert to RGB
    const hex = color.replace('#', '');
    if (hex.length === 6) {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `${r}, ${g}, ${b}`;
    }

    return null;
}

// Make colors reactive computed values so they update when board changes
// During hydration, if we're on a board route but board data isn't loaded yet,
// keep the current colors (don't flash to site colors)
const primaryColor = computed(() => {
    const hasBoard = boardStore.hasBoard;
    // If we have board data, use and cache board colors
    if (hasBoard) {
        const normalizedBoardColor = normalizeColor(boardStore.board?.primaryColor);
        const normalizedSiteColor = normalizeColor(site.primaryColor);
        const color = normalizedBoardColor || normalizedSiteColor || "60, 105, 145";
        lastBoardColors.value.primary = color;
        return color;
    }
    // If we're on a board route but data isn't loaded, use last known color
    // This happens during hydration
    if (isOnBoardRoute.value && lastBoardColors.value.primary) {
        return lastBoardColors.value.primary;
    }
    // Otherwise use site colors - if site colors aren't loaded yet, use cached colors
    const normalizedSiteColor = normalizeColor(site.primaryColor);
    if (normalizedSiteColor) {
        lastBoardColors.value.primary = normalizedSiteColor;
        return normalizedSiteColor;
    }
    // During hydration before site data loads, use cached color if available
    if (lastBoardColors.value.primary) {
        return lastBoardColors.value.primary;
    }
    return "60, 105, 145";
});

const secondaryColor = computed(() => {
    const hasBoard = boardStore.hasBoard;
    if (hasBoard) {
        const normalizedBoardColor = normalizeColor(boardStore.board?.secondaryColor);
        const normalizedSiteColor = normalizeColor(site.secondaryColor);
        const color = normalizedBoardColor || normalizedSiteColor || "96, 128, 63";
        lastBoardColors.value.secondary = color;
        return color;
    }
    if (isOnBoardRoute.value && lastBoardColors.value.secondary) {
        return lastBoardColors.value.secondary;
    }
    const normalizedSiteColor = normalizeColor(site.secondaryColor);
    if (normalizedSiteColor) {
        lastBoardColors.value.secondary = normalizedSiteColor;
        return normalizedSiteColor;
    }
    if (lastBoardColors.value.secondary) {
        return lastBoardColors.value.secondary;
    }
    return "96, 128, 63";
});

const hoverColor = computed(() => {
    const hasBoard = boardStore.hasBoard;
    if (hasBoard) {
        const normalizedBoardColor = normalizeColor(boardStore.board?.hoverColor);
        const normalizedSiteColor = normalizeColor(site.hoverColor);
        const color = normalizedBoardColor || normalizedSiteColor || "54, 94, 129";
        lastBoardColors.value.hover = color;
        return color;
    }
    if (isOnBoardRoute.value && lastBoardColors.value.hover) {
        return lastBoardColors.value.hover;
    }
    const normalizedSiteColor = normalizeColor(site.hoverColor);
    if (normalizedSiteColor) {
        lastBoardColors.value.hover = normalizedSiteColor;
        return normalizedSiteColor;
    }
    if (lastBoardColors.value.hover) {
        return lastBoardColors.value.hover;
    }
    return "54, 94, 129";
});


useHead({
    bodyAttrs: {
        class: useCookie("theme", { default: () => "" }),
    },
    //title: `${site.name} | ${route.meta.title ?? 'feed'}`,
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} | ${site.name}` : site.name;
    },
    meta: [
        {
            property: "og:title",
            content: `${site.name} | ${route.meta.title ?? "feed"}`,
        },
    ],
    style: [
        () => `
			:root {
				--color-primary: ${primaryColor.value} !important;
				--color-secondary: ${secondaryColor.value} !important;
				--color-primary-hover: ${hoverColor.value} !important;
			}
			`,
    ],
    link: [
        {
            rel: "icon",
            type: `image/png`,
            href: site.icon,
        },
    ],
});

watch(
    () => boardStore.board,
    (newBoard) => {
        // DOM manipulation must be client-side only
        if (process.client && typeof document !== 'undefined') {
            let r = document.querySelector(":root");
            if (r) {
                if (boardStore.hasBoard) {
                    r.style.setProperty(
                        "--color-primary",
                        normalizeColor(boardStore.board?.primaryColor) || "60, 105, 145",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-secondary",
                        normalizeColor(boardStore.board?.secondaryColor) || "96, 128, 63",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-primary-hover",
                        normalizeColor(boardStore.board?.hoverColor) || "54, 94, 129",
                        "important",
                    );
                } else {
                    r.style.setProperty(
                        "--color-primary",
                        normalizeColor(site.primaryColor) || "60, 105, 145",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-secondary",
                        normalizeColor(site.secondaryColor) || "96, 128, 63",
                        "important",
                    );
                    r.style.setProperty(
                        "--color-primary-hover",
                        normalizeColor(site.hoverColor) || "54, 94, 129",
                        "important",
                    );
                }
            }
        }
    },
    { immediate: true }
);

const userStore = useLoggedInUser();
const isAuthed = computed(() => userStore.isAuthed && !!userStore.user);

const modalStore = useModalStore();
const toastStore = useToastStore();

/*onBeforeMount(() => {
	window.document.body.style.setProperty('--color-primary', site.color);
});*/

const Navbar = defineAsyncComponent(
    () => import("@/components/navigation/Navbar"),
);
const NavbarAuthenticated = defineAsyncComponent(
    () => import("@/components/navigation/NavbarAuthenticated"),
);
const NavbarLeft = defineAsyncComponent(
    () => import("@/components/navigation/NavbarLeft"),
);

// Expand image
const getImages = () => {
    if (process.client && typeof document !== 'undefined') {
        const imageNodes = document.querySelectorAll(".img-expand");
        // Loop through images and attach event listener
        for (let i = 0; i < imageNodes.length; i++) {
            imageNodes[i].addEventListener("click", (e) => {
                modalStore.setModal({
                    modal: "ModalImage",
                    id: i,
                    isOpen: true,
                    options: {
                        img: e.target,
                    },
                });
            });
        }
    }
};

// Dropzone - DISABLED (was causing issues with dragging UI elements)
// const hasDragged = ref(false);
// const isDragging = ref(false);

// const dropzone = () => {
//     if (process.client && typeof window !== 'undefined') {
//         window.addEventListener("dragenter", (event) => {
//             // Check boolean to fix multiple events from invoking modalStore method.
//             // We cannot use pointer-events: none; until headless-ui supports portal root styling.
//             // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
//             if (!modalStore.isOpen) {
//                 modalStore.setModal({
//                     modal: "ModalDrop",
//                     id: 1,
//                     isOpen: true,
//                 });
//             }
//             isDragging.value = true;
//         });
//         window.addEventListener("dragleave", (event) => {
//             event.preventDefault();
//             if (!isDragging.value) {
//                 modalStore.closeModal();
//                 isDragging.value = false;
//             }
//         });
//         window.addEventListener("dragover", (event) => {
//             event.preventDefault();
//             isDragging.value = false;
//         });
//         window.addEventListener("drop", (event) => {
//             event.preventDefault();
//             event.stopImmediatePropagation();
//             // Redirect to submit page with encoded image
//             const file = event.dataTransfer?.files?.[0];
//             // Check for valid image file type and size
//             if (file && /\.(jpe?g|png|gif)$/i.test(file.name) && file.size <= 1000000) {
//                 if (typeof FileReader !== 'undefined') {
//                     let reader = new FileReader();
//                     reader.onload = () => {
//                         if (process.client && typeof sessionStorage !== 'undefined') {
//                             sessionStorage.setItem("image", reader.result);
//                             router.push("/submit");
//                         }
//                     };
//                     reader.readAsDataURL(file);
//                 }
//             } else {
//                 toastStore.addNotification({
//                     header: "Wrong format or size",
//                     message: "Try a PNG, JPG and GIF up to 1MB.",
//                     type: "error",
//                 });
//             }
//             // Close modal
//             isDragging.value = false;
//             modalStore.closeModal();
//         });
//     }
// };

// Watch for route changes
watch(
    route,
    (to) => {
        if (process.client) {
            // Get all images from DOM
            getImages();
            // dropzone(); // DISABLED - was causing issues with dragging UI elements
        }
    },
    { immediate: true },
);
</script>
