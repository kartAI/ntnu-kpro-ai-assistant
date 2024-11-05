'use client';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Icons from './Icons';
import shortcuts from '../app/data/shortcuts';

// Updated OpenDropdown to accept props correctly
const OpenDropdown = ({
  openedNavbarSection,
  handleClick,
}: {
  openedNavbarSection: number | null;
  handleClick: (index: number) => void;
}) => (
<div className="absolute right-0 mt-11 w-screen max-h-[calc(100vh-170px)] overflow-y-auto bg-white z-30">
{shortcuts.map((shortcut, index) => {
      const isActive = index === openedNavbarSection;
      return (
        <div key={index} className="border-b border-gray-200">
          <button
            onClick={() => handleClick(index)}
            className={`${
              isActive ? 'font-bold' : ''
            } tracking-[0.08em] px-4 py-3 gap-2 text-sm text-black flex flex-row justify-between items-center`}
          >
            <h3 className="flex whitespace-pre-wrap items-center">
              {shortcut.header.toUpperCase()}
            </h3>
            <Icons name={isActive ? 'ArrowUp_sm' : 'ArrowDown_sm'} />
          </button>
          {/* Subgroups: reveal when active */}
          <div
            className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
              isActive ? 'max-h-screen' : 'max-h-0'
            }`}
          >
            {isActive &&
              shortcut.subgroups.map((subgroup, subgroupIndex) => (
                <div key={subgroupIndex} className="px-6 py-4">
                  <h3 className="text-lg font-bold mb-2">{subgroup.title}</h3>
                  <div className={`flex flex-wrap flex-col`}>
                    {subgroup.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        className="block text-sm text-black hover:text-gray-600 py-1"
                      >
                        {link.label}
                        {link.text && (
                        <span className='text-xs font-light py-1 flex flex-row gap-4'>
                          {link.text}
                        </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    })}
  </div>
);

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openedNavbarSection, setOpenedNavbarSection] = useState<number | null>(null); // Track which section is opened
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleClick = (index: number) => {
    setOpenedNavbarSection(index === openedNavbarSection ? null : index); // Close if clicked again
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };
    // Attach the event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      {isOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-black bg-opacity-75 z-10"></div>,
          document.body
        )}
      <div
        className="px-4 py-2 top-0 relative group text-kartAI-blue flex z-20"
        ref={dropdownRef}
      >
        <button onClick={toggleDropdown}>
          {isOpen ? <Icons name="Cross" /> : <Icons name="Dropdown" />}
        </button>
        {/* Dropdown content */}
        {isOpen && (
          <OpenDropdown
            openedNavbarSection={openedNavbarSection}
            handleClick={handleClick}
          />
        )}
      </div>
    </>
  );
};

export default Dropdown;
