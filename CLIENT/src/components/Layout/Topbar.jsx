import { TbBrandMeta } from "react-icons/tb";
import {IoLogoInstagram} from 'react-icons/io';
import {RiTwitterXLine} from 'react-icons/ri'

const Topbar = () => {
  return (
    <div className="bg-primaryRed text-white">
      <div className="container mx-auto flex justify-between py-3">
        {/** Icons */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="hover:text-gray-300">
            <TbBrandMeta className="h-7 w-7" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <IoLogoInstagram className="h-7 w-7" />
          </a>
          <a href="#" className="hover:text-gray-300">
            <RiTwitterXLine className="h-7 w-7" />
          </a>
        </div>
        {/** TAGLINE */}
        <div className="text-sm text-center flex-grow">
            <span>We Ship worlwide - Fast and reliable shipping!</span>
        </div>
        {/** number */}
        <div className="text-sm hidden md:block">
            <a href="tel:+1234567890" className="hover:text-gray-300">+91 8452688521</a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
