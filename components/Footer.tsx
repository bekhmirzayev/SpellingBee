import React from 'react';

interface FooterProps {
  onViewTeacher: () => void;
  currentView: string;
}

const Footer: React.FC<FooterProps> = ({ onViewTeacher, currentView }) => {
  if (currentView === 'teacher') return null;

  return (
    <footer className="w-full py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex justify-center">
        <button
          onClick={onViewTeacher}
          className="text-sm font-bold text-indigo-300 hover:text-indigo-600 bg-white/50 hover:bg-white px-4 py-2 rounded-full transition-all duration-300"
        >
          O'qituvchi Paneli
        </button>
      </div>
    </footer>
  );
};

export default Footer;