// Mock GraphQL default exports for build time

export enum CommentSortType {
  Hot = "Hot",
  Top = "Top",
  New = "New",
  Old = "Old"
}

export enum ListingType {
  All = "All",
  Subscribed = "Subscribed",
  Local = "Local",
  Moderated = "Moderated"
}

export enum SortType {
  Active = "Active",
  Hot = "Hot",
  New = "New",
  Old = "Old",
  TopDay = "TopDay",
  TopWeek = "TopWeek",
  TopMonth = "TopMonth",
  TopYear = "TopYear",
  TopAll = "TopAll",
  MostComments = "MostComments",
  NewComments = "NewComments"
}

export enum UserSortType {
  New = "New",
  Old = "Old",
  MostRep = "MostRep",
  MostPosts = "MostPosts",
  MostComments = "MostComments"
}

export enum UserListingType {
  All = "All",
  Admins = "Admins",
  Banned = "Banned"
}

export enum SubscribedType {
  Subscribed = "Subscribed",
  NotSubscribed = "NotSubscribed",
  Pending = "Pending"
}