import React, { useState, useEffect, useCallback } from 'react';
import { WordItem } from '../types';

interface GameLoopProps {
  className: string;
  allWords: WordItem[];
  onExit: () => void;
  isSoundOn: boolean;
}

const GameLoop: React.FC<GameLoopProps> = ({ className, allWords, onExit, isSoundOn }) => {
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [options, setOptions] = useState<string[]>([]);

  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const classWords = allWords.filter(w => w.classes.includes(className));
    const randomized = [...classWords].sort(() => Math.random() - 0.5);
    setShuffledWords(randomized);
    setCurrentIndex(0);
  }, [className, allWords]);

  const currentWordItem = shuffledWords[currentIndex];

  const playAudio = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      // utterance.pitch = 1.1; // Slightly higher pitch for friendlier voice if browser supports
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    if (!currentWordItem) return;

    setIsImageLoaded(false);
    setFeedback('none');

    const correctOption = currentWordItem.text;
    const wrong1 = currentWordItem.wrongOption1;
    const wrong2 = currentWordItem.wrongOption2;

    let roundOptions: string[] = [];

    if (!wrong1 || !wrong2) {
       const otherWords = allWords
        .filter(w => w.text.toLowerCase() !== correctOption.toLowerCase())
        .map(w => w.text);
       const randomDistractors = shuffle(otherWords).slice(0, 2);
       if (randomDistractors.length < 2) {
          randomDistractors.push("Apple", "Banana");
       }
       roundOptions = [correctOption, ...randomDistractors.slice(0, 2)];
    } else {
       roundOptions = [correctOption, wrong1, wrong2];
    }

    setOptions(shuffle(roundOptions));

  }, [currentIndex, currentWordItem, allWords]);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
    if (currentWordItem && isSoundOn) {
      playAudio(currentWordItem.text);
    }
  };

  const handleOptionClick = (selectedWord: string) => {
    if (feedback !== 'none') return;

    if (selectedWord === currentWordItem.text) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
  };

  const nextWord = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert("Sinfdagi barcha so'zlar tugadi! Qayta aralashtirilmoqda...");
      const reshuffled = [...shuffledWords].sort(() => Math.random() - 0.5);
      setShuffledWords(reshuffled);
      setCurrentIndex(0);
    }
  };

  if (shuffledWords.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl mx-4">
        <h2 className="text-2xl font-bold text-gray-700">Bu sinf uchun so'zlar yo'q.</h2>
        <button onClick={onExit} className="mt-4 text-indigo-600 underline font-bold">Ortga qaytish</button>
      </div>
    );
  }

  if (!currentWordItem) return null;

  // EXTREME SPEED OPTIMIZATION URL: "kawaii sticker" style, small dimensions
  const imageUrl = `https://image.pollinations.ai/prompt/cute%20minimalist%20kawaii%20sticker%20of%20${encodeURIComponent(currentWordItem.text)},%20white%20background,%20thick%20outlines,%20vector?width=300&height=300&nologo=true`;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      
      {/* Header Info */}
      <div className="w-full flex justify-between items-center mb-6 text-sm md:text-base font-bold text-indigo-900/60 px-2">
        <div className="bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
           Sinf: <span className="text-indigo-600">{className}</span>
        </div>
        <div className="bg-white/60 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
           So'z: {currentIndex + 1} / {shuffledWords.length}
        </div>
      </div>

      {/* Main Game Card */}
      <div className="w-full bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.15)] overflow-hidden border border-white/60">
        
        {/* Image Area */}
        <div className="relative w-full h-72 sm:h-96 bg-gradient-to-b from-indigo-50/50 to-white/0 flex items-center justify-center p-8">
          
          {/* Custom CUTE Spinner */}
          <div 
            className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 ${isImageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="flex space-x-2 mb-4">
              <div className="w-5 h-5 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-5 h-5 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-5 h-5 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
            <p className="text-indigo-300 font-bold tracking-wide animate-pulse">Rasm chizilmoqda...</p>
          </div>

          {/* Actual Image */}
          <img 
            src={imageUrl} 
            alt="Guess the word" 
            onLoad={handleImageLoad}
            className={`w-full h-full object-contain filter drop-shadow-xl transition-all duration-500 transform ${isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
          />
          
          {/* Audio Replay Button */}
          {isImageLoaded && (
            <button 
              onClick={() => playAudio(currentWordItem.text)}
              className="absolute top-6 right-6 bg-white p-3 rounded-2xl shadow-lg border border-indigo-100 text-indigo-500 hover:text-indigo-600 hover:scale-110 hover:rotate-3 transition-all active:scale-95"
              title="So'zni qayta eshitish"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </button>
          )}
        </div>

        {/* Interaction Area */}
        <div className="p-6 sm:p-10 bg-white">
          
          {!isImageLoaded ? (
            <div className="h-32 flex items-center justify-center">
              <div className="text-gray-300 font-bold text-xl animate-pulse">Tayyorlaning...</div>
            </div>
          ) : (
            <>
              {feedback === 'none' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(opt)}
                      className="py-5 px-4 bg-white border-[3px] border-indigo-50 rounded-2xl shadow-sm hover:border-indigo-400 hover:bg-indigo-50/50 text-xl font-extrabold text-slate-700 hover:text-indigo-700 transition-all active:scale-95 active:bg-indigo-100 transform hover:-translate-y-1"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center animate-fade-in-up">
                  {feedback === 'correct' ? (
                    <div className="mb-8">
                      <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-500 mb-4 animate-bounce shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <h3 className="text-4xl font-extrabold text-green-500 mb-2 drop-shadow-sm">Barakalla!</h3>
                      <p className="text-gray-400 text-xl font-bold">{currentWordItem.text}</p>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <div className="mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-500 mb-4 animate-shake shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="text-4xl font-extrabold text-red-500 mb-2 drop-shadow-sm">Oh, yo'q...</h3>
                      <p className="text-gray-500 text-lg">To'g'ri javob: <span className="font-extrabold text-indigo-600 text-xl">{currentWordItem.text}</span></p>
                    </div>
                  )}

                  <button
                    onClick={nextWord}
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transition-all active:scale-95"
                  >
                    Keyingi So'z &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLoop;