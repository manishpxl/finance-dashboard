import { useAppContext } from "../context/AppContext";
import EmptyState from "./EmptyState";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function TransactionTable({ transactions }) {
  const { state, dispatch } = useAppContext();

  if (!transactions.length) {
    return (
      <EmptyState
        title="No matching transactions"
        description="Change filters or add a new transaction."
      />
    );
  }

  return (
    <div className="table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Note</th>
            {state.role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.category}</td>
              <td>
                <span className={`badge ${tx.type}`}>{tx.type}</span>
              </td>
              <td>{formatCurrency(tx.amount)}</td>
              <td>{tx.note}</td>
              {state.role === "admin" && (
                <td className="actions-cell">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "SET_EDITING_TRANSACTION",
                        payload: tx,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="danger"
                    onClick={() =>
                      dispatch({
                        type: "DELETE_TRANSACTION",
                        payload: tx.id,
                      })
                    }
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}