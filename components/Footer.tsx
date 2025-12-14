import React from 'react';

interface FooterProps {
  onViewTeacher: () => void;
  currentView: string;
}

const Footer: React.FC<FooterProps> = ({ onViewTeacher, currentView }) => {
  return (
    <footer className="w-full py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
        {/* Only show Teacher Panel button if not currently in Teacher View */}
        {currentView !== 'teacher' && (
          <button
            onClick={onViewTeacher}
            className="text-sm font-bold text-indigo-300 hover:text-indigo-600 bg-white/50 hover:bg-white px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
          >
            O'qituvchi Paneli
          </button>
        )}
        
        {/* Developer Signature - Always Visible */}
        <div className="text-gray-400 text-sm font-semibold tracking-wide mt-4">
          Dasturchi: <span className="text-indigo-400">Otabek Bekmirzayev</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;