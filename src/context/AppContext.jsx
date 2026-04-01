import { createContext, useContext, useMemo, useReducer } from "react";
import initialTransactions from "../data/transactions";

const AppContext = createContext(null);

const initialState = {
  role: "viewer",
  transactions: initialTransactions,
  filters: {
    search: "",
    type: "all",
    category: "all",
    sortBy: "date-desc",
  },
  editingTransaction: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((tx) =>
          tx.id === action.payload.id ? action.payload : tx
        ),
        editingTransaction: null,
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((tx) => tx.id !== action.payload),
      };

    case "SET_EDITING_TRANSACTION":
      return {
        ...state,
        editingTransaction: action.payload,
      };

    case "CLEAR_EDITING_TRANSACTION":
      return {
        ...state,
        editingTransaction: null,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}