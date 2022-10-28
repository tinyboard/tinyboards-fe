import { isValid, formatDistanceToNowStrict } from "@/node_modules/date-fns";

export function formatDate(date) {
  const timestamp = date;
  // date-fns format
  try {
    if (isValid(timestamp)) {
      return formatDistanceToNowStrict(new Date(timestamp), {
        addSuffix: true,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
