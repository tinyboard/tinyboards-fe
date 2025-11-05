<template>
  <div></div>
</template>

<script setup>
import { useBoardStore } from "@/stores/StoreBoard";
import { useGraphQLQuery } from "@/composables/useGraphQL";

const route = useRoute();
const boardStore = useBoardStore();

// Fetch board data if we have a board parameter
if (route.params?.board) {
    const boardName = route.params.board;

    const boardQuery = `
        query GetBoard($name: String!) {
            board(name: $name) {
                id
                name
                title
                description
                icon
                banner
                isNSFW
                subscribedType
                subscribers
                postCount
                commentCount
                myModPermissions
                primaryColor
                secondaryColor
                creationDate
                isRemoved
                sidebarHTML
                hasFeed
                hasThreads
                hasWiki
                wikiEnabled
                sectionOrder
                defaultSection
            }
        }
    `;

    try {
        const { data: boardData, error: boardError } = await useGraphQLQuery(boardQuery, {
            variables: { name: boardName }
        });

        if (boardError.value || !boardData.value?.board) {
            throw createError({
                statusCode: 404,
                statusMessage: `Board "${boardName}" not found`,
                fatal: true
            });
        }

        // Set board data in store
        boardStore.setBoard(boardData.value.board);

        // Determine where to redirect based on configuration
        const defaultSection = boardData.value.board.defaultSection;
        const hasFeed = boardData.value.board.hasFeed;
        const hasThreads = boardData.value.board.hasThreads;
        const hasWiki = boardData.value.board.hasWiki && boardData.value.board.wikiEnabled;

        // Redirect to the default section
        if (defaultSection === 'wiki' && hasWiki) {
            await navigateTo(`/b/${boardName}/wiki`, { replace: true });
        } else if (defaultSection === 'threads' && hasThreads) {
            await navigateTo(`/b/${boardName}/threads`, { replace: true });
        } else if (defaultSection === 'feed' && hasFeed) {
            await navigateTo(`/b/${boardName}/feed`, { replace: true });
        } else if (hasWiki) {
            // Fallback to wiki if available
            await navigateTo(`/b/${boardName}/wiki`, { replace: true });
        } else if (hasFeed) {
            // Fallback to feed if available
            await navigateTo(`/b/${boardName}/feed`, { replace: true });
        } else if (hasThreads) {
            // Fallback to threads if feed not available
            await navigateTo(`/b/${boardName}/threads`, { replace: true });
        } else {
            throw createError({
                statusCode: 404,
                statusMessage: 'No content sections enabled for this board',
                fatal: true
            });
        }
    } catch (error) {
        console.error('Error fetching board:', error);
        throw createError({
            statusCode: 404,
            statusMessage: `Board "${boardName}" not found`,
            fatal: true
        });
    }
}
</script>
