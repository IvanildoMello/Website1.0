
import React, { useState } from 'react';
import { Section } from '../types';

interface NavbarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { label: 'HOME', section: Section.Home },
    { label: 'ADMIN', section: Section.Admin },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/30 backdrop-blur-xl border-b border-white/5 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-300">
      <div 
        className="text-2xl font-black font-orbitron text-white cursor-pointer tracking-tighter hover:scale-105 transition-transform group"
        onClick={() => setActiveSection(Section.Home)}
      >
        IM<span className="text-cyan-500 group-hover:animate-pulse">.SYSTEMS</span>
      </div>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-12">
        {navItems.map((item) => (
          <button
            key={item.section}
            onClick={() => setActiveSection(item.section)}
            className={`text-[10px] font-black font-orbitron tracking-[0.3em] transition-all relative group ${
              activeSection === item.section ? 'text-cyan-400' : 'text-slate-500 hover:text-white'
            }`}
          >
            {item.label}
            <span className={`absolute -bottom-2 left-0 h-0.5 bg-cyan-500 transition-all duration-300 ${
              activeSection === item.section ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </button>
        ))}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-cyan-500 focus:outline-none"
      >
        <div className="w-8 h-8 flex flex-col justify-center items-center gap-1.5">
          <span className={`w-full h-1 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
          <span className={`w-full h-1 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-full h-1 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
        </div>
      </button>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-slate-800 p-8 flex flex-col items-center gap-8 animate-[reveal-up_0.3s_ease-out] md:hidden">
          {navItems.map((item) => (
            <button
              key={item.section}
              onClick={() => {
                setActiveSection(item.section);
                setIsMenuOpen(false);
              }}
              className={`text-sm font-black font-orbitron tracking-widest ${
                activeSection === item.section ? 'text-cyan-400' : 'text-slate-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
