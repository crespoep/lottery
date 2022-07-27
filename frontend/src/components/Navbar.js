import { NavLink } from "react-router-dom";

const Navbar = () => (
  <nav className="hidden md:block text-white">
    <ul className="flex">
      <li>
        <NavLink
          to="/"
          className={({isActive}) => ("mr-4" + (isActive ? " text-light-green" : ""))}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({isActive}) => ("mr-4" + (isActive ? " text-light-green" : ""))}
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/my-participations"
          className={({isActive}) => ("mr-4" + (isActive ? " text-light-green" : ""))}
        >
          My participations
        </NavLink>
      </li>
    </ul>
  </nav>
)

export default Navbar;
