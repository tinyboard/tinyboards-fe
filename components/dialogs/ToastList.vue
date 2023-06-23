<template>
	<div v-if="canShow" class="toast-list fixed bottom-8 md:bottom-6 left-0 md:left-auto right-0 md:right-6 block w-96 bg-clip-padding z-50 mx-auto">
		<div class="space-y-3">
			<transition-group name="toasts"
			enter-active-class="origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.3,0,0,1.3)]"
			enter-from-class="opacity-0 scale-90 translate-y-10"
			enter-to-class="opacity-100 scale-100"
			leave-active-class="transition-all duration-200 ease-out"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
			appear>
				<LazyDialogsToast v-for="toast in toast.notifications" :key="toast.id" :notification="toast"/>
			</transition-group>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';

	import { useToastStore } from '@/stores/StoreToast';

	const toast = useToastStore();

	let canShow = ref(false);
	// Enter animation does not work by itself. Queue this value instead.
	setTimeout(() => {
		canShow.value = true;
	}, 0)
</script>