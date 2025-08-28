import { FilterCondition } from "../components/common/GenericTable";

// Helper to translate AI filters to your backend's specific format
export const translateAiFiltersToApiFilters = (aiFilters: FilterCondition[]) => {
  return aiFilters.map((filter) => ({
    field: filter.field,
    value: filter.value,
    condition: "AND",
    operator: filter.operator === "contains" ? "LIKE" : "EQUALS",
  }));
};