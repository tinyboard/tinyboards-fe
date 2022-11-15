<template>
	<div class="fixed bottom-4 md:bottom-6 left-0 md:left-auto right-0 md:right-6 block w-96 bg-clip-padding z-50 mx-auto">
		<div class="space-y-3">
			<transition-group name="toasts"
			enter-active-class="transition-all duration-200 ease-in"
			enter-from-class="opacity-0 translate-y-10"
			enter-to-class="opacity-100"
			leave-active-class="transition-all duration-200 ease-out"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0">
				<DialogsToast v-for="toast in toast.notifications" :key="toast.id" :notification="toast"/>
			</transition-group>
		</div>
	</div>
</template>

<script setup>
	import { useToastStore } from '@/stores/StoreToast';

	const toast = useToastStore();
</script>