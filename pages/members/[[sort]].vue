<template>
    <main class="flex flex-col pt-12 sm:pt-14">
        <!-- Sub Navigation & Banner -->
        <section class="flex flex-col">
            <NavigationNavbarSub :links="links" class="sm:order-first" />
            <div
                class="order-first sm:order-last container mx-auto max-w-8xl grid grid-cols-12 sm:mt-16 sm:px-4 md:px-6"
            >
                <!-- Banner -->
                <CardsBanner
                    title="Members"
                    :sub-title="`Showing ${members?.members?.length || 0} members`"
                    image-url="https://forum.porpl.net/image/51bc2d71-6c70-4add-a7b0-03fed9024fb6.webp"
                    class="col-span-full"
                />
            </div>
        </section>
        <!-- Main Content -->
        <section
            class="container mx-auto max-w-8xl grid grid-cols-12 my-4 sm:my-6 sm:px-4 md:px-6"
        >
            <div class="col-span-full">
                <ul
                    v-if="members?.members?.length"
                    class="w-full grid grid-cols-4 gap-2 sm:gap-4 overflow-hidden"
                >
                    <li
                        v-for="(member, i) in members.members"
                        :key="i"
                        class="w-full col-span-full md:col-span-2 lg:col-span-1"
                    >
                        <NuxtLink
                            :to="`/@${member.person.name}`"
                            class="relative flex flex-col sm:rounded-md bg-white hover:bg-gray-50 border-y sm:border shadow-inner-white"
                        >
                            <div class="w-full flex flex-col">
                                <!-- Banner -->
                                <div
                                    class="h-24 w-full sm:rounded-t-md bg-primary/20"
                                    :style="{
                                        backgroundImage: `url(${member.person.banner})`,
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                    }"
                                />
                                <!-- Pfp and username -->
                                <div class="flex flex-row p-2 space-x-2">
                                    <img
                                        :src="member.person.avatar"
                                        class="w-16 h-16 rounded-md bg-white p-0.5 mt-[-20px]"
                                    />
                                    <div class="flex flex-col">
                                        <h3
                                            class="text-lg font-semibold text-gray-800"
                                        >
                                            {{
                                                member.person.display_name ??
                                                member.person.name
                                            }}
                                        </h3>
                                        <p class="text-sm text-gray-600">
                                            {{ member.person.name }}
                                            <span
                                                v-if="member.person.isAdmin"
                                                class="ml-2 badge badge-large badge-red"
                                            >
                                                Admin
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <!-- Counts -->
                                <div
                                    class="m-2 p-2 bg-gray-100 rounded-md flex flex-col text-center divide-y space-y-2"
                                >
                                    <!-- Rep, posts and comments -->
                                    <div
                                        class="flex flex-row justify-around divide-x"
                                    >
                                        <div
                                            class="flex flex-col flex-grow text-center"
                                        >
                                            <p
                                                class="text-md text-gray-700 font-semibold"
                                            >
                                                {{ member.counts.rep }}
                                            </p>
                                            <p
                                                class="text-xs text-gray-600 font-semibold"
                                            >
                                                Rep
                                            </p>
                                        </div>
                                        <div
                                            class="flex flex-col flex-grow text-center"
                                        >
                                            <p
                                                class="text-md text-gray-700 font-semibold"
                                            >
                                                {{ member.counts.post_count }}
                                            </p>
                                            <p
                                                class="text-xs text-gray-600 font-semibold"
                                            >
                                                Posts
                                            </p>
                                        </div>
                                        <div
                                            class="flex flex-col flex-grow text-center"
                                        >
                                            <p
                                                class="text-md text-gray-700 font-semibold"
                                            >
                                                {{
                                                    member.counts.comment_count
                                                }}
                                            </p>
                                            <p
                                                class="text-xs text-gray-600 font-semibold"
                                            >
                                                Comments
                                            </p>
                                        </div>
                                    </div>
                                    <!-- Registration date -->
                                    <div
                                        class="text-xs text-gray-400 pt-2 text-center"
                                    >
                                        Registered
                                        <span class="text-gray-900">{{
                                            format(
                                                parseISO(
                                                    member.creation_date,
                                                ),
                                                "yyyy MMM. dd",
                                            )
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </li>
                </ul>
                <!-- Empty State -->
                <div v-else-if="!pending && !error" class="px-4 py-24 text-center text-gray-500 bg-white border-y sm:border sm:rounded-md sm:shadow-inner-xs">
                    <p>
                        <span class="font-medium">
                            No members found.
                        </span>
                        <br/>
                        Try a different sort option.
                    </p>
                </div>
                <!-- Error State -->
                <div v-else-if="error" class="px-4 py-24 text-center text-gray-500 bg-white border-y sm:border sm:rounded-md sm:shadow-inner-xs">
                    <p>
                        <span class="font-medium">
                            There was an error loading members.
                        </span>
                        <br/>
                        Please try again later.
                    </p>
                </div>
            </div>
            <div
                v-if="totalPages > 1"
                class="col-span-full mt-4 px-2.5 sm:px-0"
            >
                <NavigationPaginate
                    :total-pages="totalPages"
                    :per-page="limit"
                    :current-page="page"
                />
            </div>
        </section>
    </main>
</template>

<script setup>
import { useSiteStore } from "@/stores/StoreSite";
import { useGraphQLQuery } from '@/composables/useGraphQL';
const site = useSiteStore();

// useHead({
//   title: `${site.name} | Members`,
//   meta: [
//     {
//       property: "og:title",
//       content: `${site.name} | Members`,
//     },
//   ],
// });

import { useRoute } from "vue-router";
import { format, parseISO } from "date-fns";

const router = useRouter();
const route = useRoute();

// Pagination
const page = computed(() => Number.parseInt(route.query.page) || 1);
const limit = computed(() => Number.parseInt(route.query.limit) || 24);

// Members
const sorts = ["new", "old", "mostcomments", "mostposts", "mostrep"];

const sort = computed(() => {
    return sorts.includes(route.params?.sort) ? route.params?.sort : "new";
});

// Map REST sort options to GraphQL enum values
const gqlSortMap = {
    "new": "new",
    "old": "old",
    "mostcomments": "mostComments",
    "mostposts": "mostPosts",
    "mostrep": "mostRep"
};

const gqlSort = computed(() => gqlSortMap[sort.value] || "new");

// Use GraphQL query instead of REST API
const {
    data: membersData,
    pending,
    error,
    refresh,
} = await useGraphQLQuery(`
    query listMembers($page: Int!, $limit: Int!, $sort: String!, $listingType: String!) {
        listUsers(page: $page, limit: $limit, sort: $sort, listingType: $listingType) {
            id
            name
            displayName
            avatar
            banner
            profileBackground
            bio
            isAdmin
            rep
            postCount
            commentCount
            creationDate
        }
    }
`, {
    variables: {
        page: page.value,
        limit: limit.value,
        sort: gqlSort.value,
        listingType: 'all'
    }
});

// Transform data to match expected structure
const members = computed(() => {
    if (!membersData.value?.listUsers) return null;

    return {
        members: membersData.value.listUsers.map(user => ({
            person: {
                name: user.name,
                display_name: user.displayName,
                avatar: user.avatar,
                banner: user.banner || user.profileBackground,
                bio: user.bio,
                isAdmin: user.isAdmin
            },
            counts: {
                rep: user.rep,
                post_count: user.postCount,
                comment_count: user.commentCount
            },
            creation_date: user.creationDate
        }))
    };
});

if (error.value && error.value.response) {
    throw createError({
        statusCode: 500,
        statusMessage:
            "Something broke on the server and we couldn't fetch members. Why would you do this? You monster.",
        fatal: true,
    });
}

const totalPages = computed(() => {
    return Math.ceil((members.value?.total_count || 0) / limit.value) || 1;
});

// Links for sub navigation bar.
const links = [
    { name: "Newest", href: `/members` },
    { name: "Oldest", href: `/members/old` },
    { name: "Most Posts", href: `/members/mostposts` },
    { name: "Most Comments", href: `/members/mostcomments` },
    { name: "Most Reputation", href: `/members/mostrep` },
];
</script>
