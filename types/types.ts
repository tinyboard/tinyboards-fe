import type { GetPostQuery, GetSiteQuery, UserProfileQuery } from "#gql";
import { CommentSortType, ListingType, SortType } from "#gql/default";

export type { CommentSortType, ListingType, SortType } from "#gql/default";

export type PostFragment = {
    id: number;
    title: string;
    titleChunk: string;
    isDeleted: boolean;
    isLocked: boolean;
    creatorId: number;
}

export type Post = GetPostQuery["post"];
export type Comment = Post["comments"][0] & {
    replies?: Comment[];
    post?: PostFragment;
};

export type Person = UserProfileQuery["user"];

// User interaction types
export type UserFollowersResponse = {
    userFollowers: Person[];
};

export type UserFollowingResponse = {
    userFollowing: Person[];
};

export type PendingFollowRequestsResponse = {
    pendingFollowRequests: Person[];
};

export type Site = GetSiteQuery["site"];

export type Board = GetSiteQuery["board"];

export type BoardFragment = {
    id: number;
    name: string;
    title: string;
    icon?: string | null;
    subscribers: number;
    primaryColor?: string;
    secondaryColor?: string;
    hoverColor?: string;
    myModPermissions?: number;
};

export type ContentType = "post" | "comment";

export type ModPermission = 'none' | 'config' | 'appearance' |
    'content' | 'users' | 'full';

export type AdminPermission = 'none' | 'config' | 'content' |
    'users' | 'boards' | 'full' | 'owner' | 'system';

// Input types for board mutations
export type CreateBoardInput = {
    name: string;
    title: string;
    description?: string;
    isNsfw?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    hoverColor?: string;
};

export type UpdateBoardSettingsInput = {
    boardId: number;
    title?: string;
    description?: string;
    isNsfw?: boolean;
    primaryColor?: string;
    secondaryColor?: string;
    hoverColor?: string;
    sidebar?: string;
    postingRestrictedToMods?: boolean;
    isHidden?: boolean;
    excludeFromAll?: boolean;
    icon?: string;
    banner?: string;
};

// Response types for board mutations
export type CreateBoardResponse = {
    board: Board;
};

export type UpdateBoardSettingsResponse = {
    board: Board;
};

/*export type SortType = "hot" | "new" | "topAll" | "topMonth" | "topWeek" | "topDay" | "mostComments" | "newComments";
export type ListingType = "all" | "local" | "subscribed" | "moderated";



/**
 * Use to convert a string (from user input) to a SortType
 */
/*export function mapToSortType(sort: string, fallback: SortType = "hot"): SortType {
    if (SORT_TYPES.includes(sort)) {
        return sort as SortType;
    } else {
        return fallback;
    }
}*/

// const SORT_TYPES = [
//     "hot",
//     "new",
//     "topAll",
//     "topMonth",
//     "topWeek",
//     "topDay",
//     "mostComments",
//     "newComments",
// ];

//export type SortType = GqlSortType;

export function mapToSortType(sort: string, fallback: SortType = SortType.Hot): SortType {
    switch (sort.toLowerCase()) {
        case "hot":
            return SortType.Hot;
        case "new":
            return SortType.New;
        case "topall":
            return SortType.TopAll;
        case "topmonth":
            return SortType.TopMonth;
        case "topweek":
            return SortType.TopWeek;
        case "topday":
            return SortType.TopDay;
        case "mostcomments":
            return SortType.MostComments;
        case "newcomments":
            return SortType.NewComments;
        default:
            return fallback;
    }
}

export function mapToCommentSortType(sort: string, fallback: CommentSortType = CommentSortType.Hot): CommentSortType {
    switch (sort.toLowerCase()) {
        case "hot":
            return CommentSortType.Hot;
        case "new":
            return CommentSortType.New;
        case "old":
            return CommentSortType.Old;
        case "top":
            return CommentSortType.Top;
        default:
            return fallback;
    }
}

export function mapToListingType(sort: string, fallback: ListingType = ListingType.Local): ListingType {
    switch (sort.toLowerCase()) {
        case "local":
            return ListingType.Local;
        case "subscribed":
        case "joined":
            return ListingType.Subscribed;
        case "moderated":
            return ListingType.Moderated;
        case "all":
            return ListingType.All;
        default:
            return fallback;
    }
}
