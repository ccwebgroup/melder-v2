import { date } from "quasar";

export function useFilters() {
  function formatBlogDate(timestamp) {
    return date.formatDate(timestamp, "MMM D, YYYY");
  }

  return { formatBlogDate };
}
