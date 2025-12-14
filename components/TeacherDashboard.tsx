import React, { useState, useRef } from 'react';
import { WordItem } from '../types';

interface TeacherDashboardProps {
  classes: string[];
  words: WordItem[];
  onAddClass: (name: string) => void;
  onAddWord: (text: string, wrong1: string, wrong2: string, classes: string[]) => void;
  onDeleteWord: (id: string) => void;
  onImport: (data: any) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  classes,
  words,
  onAddClass,
  onAddWord,
  onDeleteWord,
  onImport
}) => {
  const [newClass, setNewClass] = useState('');
  
  // Word Input (Only Correct Word needed now)
  const [newWord, setNewWord] = useState('');
  
  const [selectedClassesForWord, setSelectedClassesForWord] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Advanced Phonetic Distractor Logic (Kept Intact)
  const generateDistractors = (word: string): [string, string] => {
    const clean = word.trim();
    if (clean.length < 2) return [clean + "s", clean + "e"];

    const replaceRandom = (str: string, target: string, replacement: string) => {
      const indices = [];
      let i = 0;
      while ((i = str.indexOf(target, i)) > -1) {
        indices.push(i);
        i += target.length;
      }
      if (indices.length === 0) return str;
      const idx = indices[Math.floor(Math.random() * indices.length)];
      return str.substring(0, idx) + replacement + str.substring(idx + target.length);
    };

    const makePhoneticMistake = (source: string): string => {
      let res = source.toLowerCase();
      
      const rules = [
        (s: string) => replaceRandom(s, 'a', 'e'),
        (s: string) => replaceRandom(s, 'e', 'i'),
        (s: string) => replaceRandom(s, 'i', 'ee'),
        (s: string) => replaceRandom(s, 'ee', 'i'),
        (s: string) => replaceRandom(s, 'o', 'u'),
        (s: string) => replaceRandom(s, 'u', 'o'),
        (s: string) => replaceRandom(s, 'ea', 'ee'),
        (s: string) => replaceRandom(s, 'ai', 'ay'),
        (s: string) => replaceRandom(s, 'ay', 'ai'),
        (s: string) => replaceRandom(s, 'c', 'k'),
        (s: string) => replaceRandom(s, 'k', 'c'),
        (s: string) => replaceRandom(s, 'ph', 'f'),
        (s: string) => replaceRandom(s, 'f', 'ph'),
        (s: string) => replaceRandom(s, 's', 'z'),
        (s: string) => replaceRandom(s, 'z', 's'),
        (s: string) => replaceRandom(s, 'tion', 'shun'),
        (s: string) => replaceRandom(s, 'ck', 'k'),
        (s: string) => replaceRandom(s, 'tt', 't'),
        (s: string) => replaceRandom(s, 'pp', 'p'),
        (s: string) => replaceRandom(s, 'll', 'l'),
        (s: string) => replaceRandom(s, 'mm', 'm'),
        (s: string) => replaceRandom(s, 'nn', 'n'),
        (s: string) => replaceRandom(s, 't', 'tt'),
        (s: string) => replaceRandom(s, 'p', 'pp'),
        (s: string) => replaceRandom(s, 'l', 'll'),
        (s: string) => replaceRandom(s, 'm', 'mm'),
        (s: string) => s.length > 3 && s.endsWith('e') ? s.slice(0, -1) : s
      ];

      let safety = 0;
      let modified = res;
      const numMistakes = Math.random() > 0.6 ? 2 : 1;
      
      for (let n = 0; n < numMistakes; n++) {
         safety = 0;
         let currentTry = modified;
         while (currentTry === modified && safety < 15) {
            const rule = rules[Math.floor(Math.random() * rules.length)];
            currentTry = rule(modified);
            safety++;
         }
         modified = currentTry;
      }

      if (source[0] === source[0].toUpperCase()) {
        return modified.charAt(0).toUpperCase() + modified.slice(1);
      }
      return modified;
    };

    let d1 = makePhoneticMistake(clean);
    let d2 = makePhoneticMistake(clean);
    
    let loopGuard = 0;
    while ((d1 === clean) && loopGuard < 10) { d1 = makePhoneticMistake(clean); loopGuard++; }
    loopGuard = 0;
    while ((d2 === clean || d2 === d1) && loopGuard < 10) { d2 = makePhoneticMistake(clean); loopGuard++; }

    if (d1 === clean) d1 = clean + "s";
    if (d2 === clean || d2 === d1) d2 = clean + "z";

    return [d1, d2];
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClass.trim()) {
      onAddClass(newClass.trim());
      setNewClass('');
    }
  };

  const handleToggleClass = (cls: string) => {
    const next = new Set(selectedClassesForWord);
    if (next.has(cls)) {
      next.delete(cls);
    } else {
      next.add(cls);
    }
    setSelectedClassesForWord(next);
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    const w = newWord.trim();

    if (w && selectedClassesForWord.size > 0) {
      const [w1, w2] = generateDistractors(w);
      onAddWord(w, w1, w2, Array.from(selectedClassesForWord));
      setNewWord('');
      setSelectedClassesForWord(new Set());
    } else {
      alert("Iltimos, so'z kiriting va sinfni tanlang.");
    }
  };

  const handleDeleteWord = (id: string) => {
    if (window.confirm("Haqiqatan ham bu so'zni o'chirmoqchimisiz?")) {
      onDeleteWord(id);
    }
  };

  const handleExport = () => {
    const data = { classes, words };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `najot-talim-db-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.classes && json.words) {
          onImport(json);
        } else {
          alert("Noto'g'ri fayl formati.");
        }
      } catch (err) {
        alert("Faylni o'qishda xatolik yuz berdi.");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset
  };

  const filteredWords = words.filter(word => 
    word.text.toLowerCase().includes(searchTerm.toLowerCase())
  ).reverse();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900">O'qituvchi Paneli</h1>
        <p className="text-indigo-600 font-medium">Sinflar va so'zlarni boshqaring</p>
      </div>

      {/* Section 1: Create Class */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.1)] border border-white/50 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">1</span>
          Sinf Yaratish
        </h2>
        <form onSubmit={handleCreateClass} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Sinf nomi (masalan: 1-A)"
            className="flex-1 rounded-2xl border-gray-200 bg-gray-50 focus:bg-white text-gray-900 shadow-inner focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 py-4 px-6 border-2 transition-all outline-none font-bold placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-2xl px-8 py-4 font-bold tracking-wide"
          >
            Yaratish
          </button>
        </form>
      </div>

      {/* Section 2: Add Word */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.1)] border border-white/50 p-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-10"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="bg-purple-100 text-purple-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">2</span>
          So'z Qo'shish
        </h2>
        <form onSubmit={handleSaveWord} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider ml-1">So'z (To'g'ri variant)</label>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Masalan: Apple"
              className="w-full rounded-2xl border-gray-200 bg-gray-50 focus:bg-white text-gray-900 shadow-inner focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 py-4 px-6 border-2 transition-all outline-none font-bold text-lg placeholder-gray-400"
            />
            <p className="text-xs text-indigo-500 mt-2 font-medium bg-indigo-50 inline-block px-3 py-1 rounded-full">
              ✨ Xato variantlar fonetik qoidalar asosida avtomatik yaratiladi!
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-3 uppercase tracking-wider ml-1">Qaysi sinflarga tegishli?</label>
            {classes.length === 0 ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 italic">Avval yuqorida sinf yarating.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {classes.map((cls) => (
                  <label key={cls} className={`
                    group flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none
                    ${selectedClassesForWord.has(cls) 
                      ? 'bg-indigo-50 border-indigo-500 shadow-md transform scale-105' 
                      : 'bg-white border-gray-100 hover:border-indigo-200 hover:bg-gray-50'}
                  `}>
                    <div className={`
                      w-5 h-5 rounded-md border-2 mr-3 flex items-center justify-center transition-colors
                      ${selectedClassesForWord.has(cls) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 bg-white'}
                    `}>
                      {selectedClassesForWord.has(cls) && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedClassesForWord.has(cls)}
                      onChange={() => handleToggleClass(cls)}
                      className="hidden"
                    />
                    <span className={`font-bold ${selectedClassesForWord.has(cls) ? 'text-indigo-700' : 'text-gray-600'}`}>{cls}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={classes.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] rounded-2xl px-8 py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Saqlash va Generatsiya Qilish
            </button>
          </div>
        </form>
      </div>

      {/* Section 3: Existing Words */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.1)] border border-white/50 p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-100 gap-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-green-100 text-green-600 w-8 h-8 flex items-center justify-center rounded-full text-sm">3</span>
            Mavjud So'zlar
          </h2>
          <input 
            type="text" 
            placeholder="Qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 py-2 px-4 border-2 transition-all outline-none font-medium"
          />
        </div>
        
        <div className="overflow-x-auto max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
          <table className="w-full text-left text-sm text-gray-600 border-separate border-spacing-y-2">
            <thead className="bg-transparent text-gray-500 font-bold uppercase text-xs">
              <tr>
                <th className="px-4 py-2">So'z va Variantlar</th>
                <th className="px-4 py-2">Sinflar</th>
                <th className="px-4 py-2 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="">
              {filteredWords.length === 0 ? (
                 <tr><td colSpan={3} className="px-4 py-12 text-center text-gray-400 font-medium italic bg-gray-50/50 rounded-2xl">So'zlar topilmadi</td></tr>
              ) : (
                 filteredWords.map(word => (
                   <tr key={word.id} className="bg-white hover:bg-indigo-50/50 transition-colors group shadow-sm rounded-2xl">
                     <td className="px-4 py-4 rounded-l-2xl border-t border-b border-l border-gray-50">
                       <div className="font-extrabold text-gray-800 text-lg">{word.text}</div>
                       <div className="text-xs font-mono mt-1 flex gap-2">
                         <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded">{word.wrongOption1}</span>
                         <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded">{word.wrongOption2}</span>
                       </div>
                     </td>
                     <td className="px-4 py-4 align-top border-t border-b border-gray-50">
                       <div className="flex gap-1 flex-wrap mt-1">
                         {word.classes.map(c => (
                           <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 shadow-sm">
                             {c}
                           </span>
                         ))}
                       </div>
                     </td>
                     <td className="px-4 py-4 text-right align-middle rounded-r-2xl border-t border-b border-r border-gray-50">
                       <button 
                         onClick={() => handleDeleteWord(word.id)}
                         className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                         title="O'chirish"
                       >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                       </button>
                     </td>
                   </tr>
                 ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Data Management */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.1)] border border-white/50 p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">4. Bazani Boshqarish</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            className="flex-1 flex justify-center items-center gap-2 bg-emerald-500 text-white px-6 py-4 rounded-2xl hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/30 transition-all font-bold"
          >
            <span>📥 Bazani Yuklab Olish</span>
          </button>
          <button
            onClick={handleImportClick}
            className="flex-1 flex justify-center items-center gap-2 bg-sky-500 text-white px-6 py-4 rounded-2xl hover:bg-sky-600 shadow-lg hover:shadow-sky-500/30 transition-all font-bold"
          >
            <span>📤 Bazani Yuklash</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />
        </div>
        <p className="text-sm text-gray-500 mt-6 text-center font-medium">
          Jami so'zlar: <span className="font-bold text-indigo-600 text-lg mx-1">{words.length}</span> | 
          Jami sinflar: <span className="font-bold text-indigo-600 text-lg mx-1">{classes.length}</span>
        </p>
      </div>
    </div>
  );
};

export default TeacherDashboard;