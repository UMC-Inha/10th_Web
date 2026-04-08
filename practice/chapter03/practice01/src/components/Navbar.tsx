import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        gap: "16px",
        padding: "12px 24px",
        background: "#333",
      }}
    >
      <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
        홈
      </Link>
      <Link to="/movies" style={{ color: "#fff", textDecoration: "none" }}>
        영화
      </Link>
    </nav>
  );
};

export default Navbar;
