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
  // Initialize with empty arrays to prevent "map of undefined" errors before effect runs
  const [classes, setClasses] = useState<string[]>([]);
  const [words, setWords] = useState<WordItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);

  // ROBUST INITIALIZATION: Auto-Seed data if LocalStorage is empty (Fixes White Screen)
  useEffect(() => {
    const initializeApp = () => {
      try {
        const loadedClassesStr = localStorage.getItem(STORAGE_KEY_CLASSES);
        const loadedWordsStr = localStorage.getItem(STORAGE_KEY_WORDS);
        const loadedSoundStr = localStorage.getItem(STORAGE_KEY_SOUND);

        let initialClasses: string[] = [];
        let initialWords: WordItem[] = [];
        let hasData = false;

        // 1. Safely Parse Classes
        if (loadedClassesStr) {
          try {
            const parsed = JSON.parse(loadedClassesStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              initialClasses = parsed;
              hasData = true;
            }
          } catch (e) {
            console.warn("Failed to parse classes from storage:", e);
          }
        }

        // 2. Safely Parse Words
        if (loadedWordsStr) {
          try {
            const parsed = JSON.parse(loadedWordsStr);
            if (Array.isArray(parsed)) {
              initialWords = parsed;
            }
          } catch (e) {
            console.warn("Failed to parse words from storage:", e);
          }
        }

        // 3. AUTO-SEED DEMO DATA (If no data exists, inject it to prevent blank screen)
        if (!hasData) {
          console.log("New deployment detected. Seeding demo data...");
          
          initialClasses = ["1-Sinf (Demo)"];
          initialWords = [
            {
              id: "demo_1",
              text: "Apple",
              wrongOption1: "Epple",
              wrongOption2: "Aplle",
              classes: ["1-Sinf (Demo)"]
            },
            {
              id: "demo_2",
              text: "School",
              wrongOption1: "Skool",
              wrongOption2: "Scool",
              classes: ["1-Sinf (Demo)"]
            }
          ];

          // Save immediately so it persists on reload
          localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(initialClasses));
          localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(initialWords));
        }

        // 4. Update State
        setClasses(initialClasses);
        setWords(initialWords);

        // 5. Sound Settings
        if (loadedSoundStr !== null) {
          try {
            setIsSoundOn(JSON.parse(loadedSoundStr));
          } catch (e) { /* ignore */ }
        }

      } catch (criticalError) {
        console.error("CRITICAL APP ERROR:", criticalError);
        // Emergency fallback
        setClasses(["Demo"]);
        setWords([]);
      }
    };

    initializeApp();
  }, []);

  // Save data effects (Keep these to sync changes made by user)
  useEffect(() => {
    if (classes.length > 0) { // Only save if we have data (prevents overwriting with empty on initial render)
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
    }
  }, [classes]);

  useEffect(() => {
    if (words.length > 0 || classes.length > 0) {
      localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    }
  }, [words, classes]);

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