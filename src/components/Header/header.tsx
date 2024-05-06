import { NavLink } from "react-router-dom";
import "../../tailwind.css";
import "./header.css";

function Header() {
  return (
    <header className="flex flex-col justify-center items-center max-w-6xl mx-auto gap-y-5">
      <h1 className="text-3xl font-bold md:text-6xl text-center uppercase">
        Async
        <br />
        Race
      </h1>

      <nav className="flex gap-3 flex-col sm:flex-row ">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-button ${
              isActive
                ? "bg-gray-900 text-white border-gray-white cursor-default"
                : "hover:border-gray-900 shadow-lg transition"
            }`
          }
        >
          Garage
        </NavLink>
        <NavLink
          to="/winners"
          className={({ isActive }) =>
            `nav-button ${
              isActive
                ? "bg-gray-900 text-white border-gray-white cursor-default"
                : "hover:border-gray-900 shadow-lg transition"
            }`
          }
        >
          Winners
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
