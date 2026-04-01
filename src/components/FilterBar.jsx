import { useAppContext } from "../context/AppContext";
import useTransactions from "../hooks/useTransactions";

export default function FilterBar() {
  const { state, dispatch } = useAppContext();
  const { categories } = useTransactions();

  const updateFilter = (key, value) => {
    dispatch({
      type: "SET_FILTERS",
      payload: { [key]: value },
    });
  };

  return (
    <div className="filter-bar">
      <input
        type="search"
        placeholder="Search transactions..."
        value={state.filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
      />

      <select
        value={state.filters.type}
        onChange={(e) => updateFilter("type", e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={state.filters.category}
        onChange={(e) => updateFilter("category", e.target.value)}
      >
        <option value="all">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        value={state.filters.sortBy}
        onChange={(e) => updateFilter("sortBy", e.target.value)}
      >
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="amount-desc">Amount High to Low</option>
        <option value="amount-asc">Amount Low to High</option>
      </select>
    </div>
  );
}