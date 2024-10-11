'use client';

import shortcuts from '../app/data/shortcuts';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Dropdown from './Dropdown';
import BreakLine from './Breakline';
import Icons from './Icons';
import Link from 'next/link';
import Image from 'next/image';
import NextBreadcrumb from './BreadCrumbs';

const Navbar = () => {
  const [openedNavbarSection, setOpenedNavbarSection] = useState<number>(-1);
  const navbarRef = useRef<HTMLDivElement>(null); // Ref for the entire navbar

  const handleClick = (index: number) => {
    if (openedNavbarSection === index) {
      setOpenedNavbarSection(-1); // Close if the same section is clicked again
    } else {
      setOpenedNavbarSection(index); // Open the clicked section
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the navbar
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setOpenedNavbarSection(-1); // Close the opened section
      }
    };

    document.addEventListener('click', handleClickOutside);

    // Lock scrolling if a dropdown is open
    if (openedNavbarSection !== -1) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = ''; // Ensure overflow is reset on cleanup
    };
  }, [openedNavbarSection]); // Add openedNavbarSection as a dependency

  return (
    <>
      <nav ref={navbarRef} className="py-2 sticky top-0 bottom-auto z-50 font-semibold w-full bg-white shadow-xl">
        {/* Backdrop when a dropdown is open */}
        {openedNavbarSection !== -1 && ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-25 z-10" />,
          document.body
        )}
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center pl-4 mb-1 lg:pl-10">
            <Link href={"/"}>
              <Image
                src="/Kartai-logo_white.jpg" // Path to your image in the public folder
                alt="KartAI Logo"
                width={130}
                height={40}
                className="h-10 pr-2"
              />
            </Link>
          </div>
          <div className="hidden sm:flex justify-end items-center pr-4 lg:pr-10">
            {shortcuts.map((shortcut, index) => {
              const isActive = index === openedNavbarSection;
              return (
                <div key={index} className="relative">
                  <button
                    data-cy={`dropdown-button-${index}`} // Added data-cy for testing
                    onClick={() => handleClick(index)}
                    className={`relative group px-2 md:px-8 lg:px-5 py-2 text-md flex flex-row gap-2 cursor-hover items-center ${isActive ? 'text-kartAI-blue' : 'text-secondary-black'}`}
                    style={isActive ? { textDecoration: 'underline', textUnderlineOffset: '6px', textDecorationThickness: '2px' } : {}}
                  >
                    <p className="mt-1 whitespace-pre-wrap text-xs xl:text-sm hidden sm:block tracking-[0.15em]">
                      {shortcut.header.toUpperCase()}
                    </p>
                  </button>
                  {isActive && (
                    <div data-cy="dropdown-content" className="fixed left-0 right-0 pt-4 bg-white shadow-lg z-40 w-screen">
                      <BreakLine />
                      {/* Dynamically rendering subgroups and links for this section */}
                      <div className="w-screen-lg flex flex-col mt-4">
                        <div className="px-10 md:px-20 pb-10 flex flex-wrap">
                          {shortcut.subgroups.map((subgroup, subgroupIndex) => (
                            <div key={subgroupIndex} className="w-full md:w-1/2 xl:w-1/3 p-2">
                              <h3 className="text-xl font-bold mb-2">{subgroup.title}</h3>
                              <div className={`flex flex-wrap ${subgroup.links.length > 3 ? '' : 'flex-col'}`}> {/* Adjust flex direction based on number of links */}
                                {subgroup.links.map((link, linkIndex) => (
                                  <div key={linkIndex} className={`${subgroup.links.length > 3 ? 'w-1/2' : 'w-full'} py-1`}>
                                    <a
                                      data-cy={`link-${subgroupIndex}-${linkIndex}`} // Added data-cy for each link
                                      href={link.url}
                                      className="text-sm text-black hover:text-gray-600 py-1 flex flex-row gap-4"
                                    >
                                      {link.label}
                                      {subgroup.arrow && <Icons name="ArrowRight_sm" />}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="sm:hidden">
            <Dropdown />
          </div>
        </div>
      </nav>
      <NextBreadcrumb
        homeElement={'Home'}
        separator={'>'}
        activeClasses=''
        listClasses='hover:underline mx-2 font-light'
      />
    </>
  );
};

export default Navbar;
