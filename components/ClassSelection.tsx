import React from 'react';

interface ClassSelectionProps {
  classes: string[];
  onSelect: (className: string) => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({ classes, onSelect }) => {
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
        <div className="bg-white/60 backdrop-blur-sm p-8 rounded-full shadow-xl mb-6 text-7xl animate-bounce">
          🏫
        </div>
        <h2 className="text-3xl font-extrabold text-indigo-900 mb-3">Sinflar mavjud emas</h2>
        <p className="text-lg text-indigo-600/80 font-medium">Iltimos, o'qituvchi panelidan sinf qo'shing.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-indigo-900 mb-2 drop-shadow-sm">Sinfni Tanlang</h2>
        <p className="text-indigo-600 font-semibold text-lg">O'yinni boshlash uchun o'z sinfingizni bosing!</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => onSelect(cls)}
            className="group relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-[0_10px_40px_rgba(8,112,184,0.08)] border border-white/60 hover:border-indigo-300 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-300 ease-out transform hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-[4rem] rounded-tr-3xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="text-6xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              📚
            </div>
            <h3 className="text-3xl font-extrabold text-gray-800 group-hover:text-indigo-600 transition-colors">
              {cls}
            </h3>
            <div className="mt-4 inline-flex items-center text-indigo-400 font-bold text-sm group-hover:text-indigo-600">
              Boshlash <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassSelection;