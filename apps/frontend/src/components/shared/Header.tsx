import mainLogo from "../../assets/main-icon.png";
import { FaSearch } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import NavItem from "../navbar/NavItem";

import { Icon } from "@repo/ui/icon";
import { Button } from "@repo/ui/button";

function Header() {
  return (
    <div className="w-full text-sm bg-white">
      {/* Top Navbar */}
      <div className="px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3">
          {/* Left Part */}
          <div className="flex items-center space-x-4">
            <img
              src={mainLogo}
              alt="logo"
              className="cursor-pointer h-8 object-contain"
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="border border-gray-300 rounded px-4 py-1.5 w-[400px] text-sm outline-none"
              />
              <Icon
                type="gray"
                Icon={FaSearch}
                className="absolute top-2 right-2"
              />
            </div>
          </div>
          {/* Right Part */}
          <div className="flex items-center space-x-6">
            <div className="text-sm font-normal cursor-pointer flex justify-center items-center gap-2">
              Mumbai
              <Icon type="gray" Icon={MdOutlineArrowDropDown} />
            </div>
            <Button children="Sign in" type="primary" />
          </div>
        </div>
      </div>
      {/* Bottom Navbar */}
      <div className="bg-[#f2f2f2] px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-2">
          {/* Left Part */}
          <nav>
            <ul className="flex items-center gap-6 group">
              <li>
                <NavItem to="#">Movies</NavItem>
              </li>

              <li>
                <NavItem to="#">Streams</NavItem>
              </li>

              <li>
                <NavItem to="#">Events</NavItem>
              </li>

              <li>
                <NavItem to="#">Plays</NavItem>
              </li>

              <li>
                <NavItem to="#">Sports</NavItem>
              </li>

              <li>
                <NavItem to="#">Activities</NavItem>
              </li>
            </ul>
          </nav>
          {/* Right Part */}
          <nav>
            <ul className="text-xs font-medium flex items-center gap-6 group">
              <li>
                <NavItem to="#">ListYourShow</NavItem>
              </li>

              <li>
                <NavItem to="#">Corporates</NavItem>
              </li>

              <li>
                <NavItem to="#">Offers</NavItem>
              </li>

              <li>
                <NavItem to="#">Gift Card</NavItem>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;
