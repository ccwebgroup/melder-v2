import { date } from "quasar";
import { formatDistance } from "date-fns";

export function useFilters() {
  function formatBlogDate(timestamp) {
    return date.formatDate(timestamp, "MMM D, YYYY");
  }

  function formatFns(timestamp) {
    return formatDistance(timestamp, new Date(), {
      addSuffix: true,
    });
  }

  return { formatBlogDate, formatFns };
}
