import {
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import mainLogo from "../../assets/main-icon-white.png";

import { Icon } from "@repo/ui/icon";

function Footer() {
  return (
    <footer className="bg-[#2b2b2b] text-gray-400 text-sm">
      <div className="border-t border-gray-600 w-full" />
      <div className="flex flex-col items-center py-6">
        {/* Logo */}
        <img src={mainLogo} alt="BookMyScreen Logo" className="w-28 mb-4" />

        {/* Social Icons */}
        <div className="flex space-x-4 mb-4 mx-auto">
          <Icon variant="social" Icon={FaTwitter} />
          <Icon variant="social" Icon={FaLinkedinIn} />
          <Icon variant="social" Icon={FaInstagram} />
        </div>

        {/* Copyright */}
        <p className="text-center text-xs px-4 max-w-4xl">
          Copyright 2025 © bookMyScreen Pvt Ltd. Ltd. All Rights Reserved.
          <br />
        </p>
        <small>
          The content and images used on this site are copyright protected and
          copyrights vests with the respective owners. The usage of the content
          and images on this website is intended to promote the works and no
          endorsement of the artist shall be implied.
        </small>
      </div>
    </footer>
  );
}

export default Footer;
