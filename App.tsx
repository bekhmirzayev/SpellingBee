import React, { useState, useEffect } from 'react';
import { WordItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ClassSelection from './components/ClassSelection';
import TeacherDashboard from './components/TeacherDashboard';
import GameLoop from './components/GameLoop';

const STORAGE_KEY_CLASSES = 'nt_spelling_bee_classes';
const STORAGE_KEY_WORDS = 'nt_spelling_bee_words';
const STORAGE_KEY_SOUND = 'nt_spelling_bee_sound';

const App: React.FC = () => {
  const [view, setView] = useState<'student' | 'teacher' | 'game'>('student');
  const [classes, setClasses] = useState<string[]>([]);
  const [words, setWords] = useState<WordItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  // Load data on mount
  useEffect(() => {
    const loadedClasses = localStorage.getItem(STORAGE_KEY_CLASSES);
    const loadedWords = localStorage.getItem(STORAGE_KEY_WORDS);
    const loadedSound = localStorage.getItem(STORAGE_KEY_SOUND);

    if (loadedClasses) setClasses(JSON.parse(loadedClasses));
    if (loadedWords) setWords(JSON.parse(loadedWords));
    if (loadedSound !== null) setIsSoundOn(JSON.parse(loadedSound));
  }, []);

  // Save data effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
  }, [words]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  const toggleSound = () => {
    setIsSoundOn(prev => !prev);
  };

  const handleClassSelect = (className: string) => {
    setSelectedClass(className);
    setView('game');
  };

  const goHome = () => {
    setView('student');
    setSelectedClass(null);
  };

  const goToTeacher = () => {
    setView('teacher');
  };

  // Data Management Handlers
  const addClass = (name: string) => {
    if (!classes.includes(name)) {
      setClasses([...classes, name]);
    }
  };

  const addWord = (text: string, wrong1: string, wrong2: string, assignedClasses: string[]) => {
    const newWord: WordItem = {
      id: Date.now().toString(),
      text: text.trim(),
      wrongOption1: wrong1.trim(),
      wrongOption2: wrong2.trim(),
      classes: assignedClasses,
    };
    setWords([...words, newWord]);
  };

  const deleteWord = (id: string) => {
    setWords((prevWords) => prevWords.filter((word) => word.id !== id));
  };

  const importData = (data: { classes: string[], words: WordItem[] }) => {
    setClasses(data.classes);
    setWords(data.words);
    alert('Ma\'lumotlar muvaffaqiyatli yuklandi!');
  };

  return (
    <div className="flex flex-col h-full">
      <Header onHome={goHome} isSoundOn={isSoundOn} onToggleSound={toggleSound} />

      {/* Added pt-28 to account for the fixed/floating header space */}
      <main className="flex-1 overflow-y-auto pt-28 pb-8 px-4 md:px-6 w-full max-w-5xl mx-auto scrollbar-hide">
        {view === 'student' && (
          <ClassSelection 
            classes={classes} 
            onSelect={handleClassSelect} 
          />
        )}

        {view === 'teacher' && (
          <TeacherDashboard 
            classes={classes} 
            words={words}
            onAddClass={addClass}
            onAddWord={addWord}
            onDeleteWord={deleteWord}
            onImport={importData}
          />
        )}

        {view === 'game' && selectedClass && (
          <GameLoop 
            className={selectedClass}
            allWords={words}
            onExit={goHome}
            isSoundOn={isSoundOn}
          />
        )}
      </main>

      <Footer onViewTeacher={goToTeacher} currentView={view} />
    </div>
  );
};

export default App;