import { NavLink } from "react-router-dom";

const Navbar = ({ account }) => (
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
      {
        account &&
          <li>
            <NavLink
              to="/my-account"
              className={({isActive}) => ("mr-4" + (isActive ? " text-light-green" : ""))}
            >
              My account
            </NavLink>
          </li>
      }
    </ul>
  </nav>
)

export default Navbar;
