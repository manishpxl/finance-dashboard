import { useAppContext } from "../context/AppContext";

export default function RoleSwitcher() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="role-switcher">
      <label htmlFor="role">Access mode</label>
      <select
        id="role"
        value={state.role}
        onChange={(e) =>
          dispatch({ type: "SET_ROLE", payload: e.target.value })
        }
      >
        <option value="viewer">Viewer</option>
        <option value="admin">Admin</option>
      </select>
    </div>
  );
}