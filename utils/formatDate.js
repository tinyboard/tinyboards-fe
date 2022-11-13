import { formatDistanceToNowStrict, isValid } from "@/node_modules/date-fns";
import locale from 'date-fns/locale/en-US';

const formatDistanceLocale = {
  lessThanXSeconds: '{{count}}s',
  xSeconds: '{{count}}s',
  halfAMinute: '30s',
  lessThanXMinutes: '{{count}}min',
  xMinutes: '{{count}}min',
  aboutXHours: '{{count}}hr',
  xHours: '{{count}}hrs',
  xDays: '{{count}}d',
  aboutXWeeks: '{{count}}wks',
  xWeeks: '{{count}}w',
  aboutXMonths: '{{count}}m',
  xMonths: '{{count}}m',
  aboutXYears: '{{count}}yrs',
  xYears: '{{count}}y',
  overXYears: '{{count}}y',
  almostXYears: '{{count}}yrs',
}

function formatDistance(token, count, options) {
  options = options || {}

  const result = formatDistanceLocale[token].replace('{{count}}', count)

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'in ' + result
    } else {
      return result + ' ago'
    }
  }

  return result
}

export function formatDate(date) {
  let timestamp = date ? new Date(date) : '';
  try {
    if (isValid(timestamp)) {
      return formatDistanceToNowStrict(timestamp, {
        addSuffix: true,
        locale: {
          ...locale,
          formatDistance,
        },
      })
    }
  } catch (error) {
    console.error(error);
  }
}