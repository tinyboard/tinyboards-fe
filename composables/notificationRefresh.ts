/**
 * Composable for refreshing notification counts across components
 */

const refreshCallbacks = new Set<() => void>();

export const useNotificationRefresh = () => {
	const registerRefreshCallback = (callback: () => void) => {
		refreshCallbacks.add(callback);

		// Return unregister function
		return () => {
			refreshCallbacks.delete(callback);
		};
	};

	const refreshNotificationCounts = () => {
		refreshCallbacks.forEach(callback => {
			try {
				callback();
			} catch (error) {
				console.warn('Error calling notification refresh callback:', error);
			}
		});
	};

	return {
		registerRefreshCallback,
		refreshNotificationCounts
	};
};