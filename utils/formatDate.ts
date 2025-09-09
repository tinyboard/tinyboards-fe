import { formatDistanceToNowStrict, isValid } from "date-fns/esm";
import { zonedTimeToUtc } from "date-fns-tz/esm";
import locale from "date-fns/esm/locale/en-US";

const formatDistanceLocale: { [key: string]: string } = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}}min",
  xMinutes: "{{count}}min",
  aboutXHours: "{{count}}hr",
  xHours: "{{count}}hrs",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}wks",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}m",
  xMonths: "{{count}}m",
  aboutXYears: "{{count}}yrs",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}yrs",
};

function formatDistance(token: string, count: number, options?: { addSuffix?: boolean; comparison?: number }): string {
  options = options || {};

  const result = formatDistanceLocale[token].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison ? options.comparison > 0 : false) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }

  return result;
}

export function formatDate(date: string | Date | undefined, addSuffix = true): string | undefined {
  const timestamp = date ? new Date(date) : "";
  const zonedDate = zonedTimeToUtc(timestamp, "UTC");
  try {
    if (isValid(timestamp)) {
      return formatDistanceToNowStrict(zonedDate, {
        addSuffix,
        locale: {
          ...locale,
          formatDistance,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
}
