import RoleSwitcher from "./RoleSwitcher";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__content">
        <p className="eyebrow">Finance Dashboard</p>
        <h1>Personal Finance Overview</h1>
        <p className="developer-credit">
          Developed by{" "}
          <a
            href="https://manishpxl.github.io/Portfolio-Manish-Kumar/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Manish Kumar
          </a>
        </p>
      </div>

      <div className="navbar__actions">
        <RoleSwitcher />
      </div>
    </header>
  );
}