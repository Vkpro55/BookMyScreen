import { NavLink } from "react-router-dom";

interface NavItemProps {
  to?: string;
  children: string;
}

function NavItem({ to, children }: NavItemProps) {
  return (
    <NavLink
      to={to ?? "#"}
      className="text-gray-700 hover:text-red-500 transition-colors"
    >
      {children}
    </NavLink>
  );
}

export default NavItem;
