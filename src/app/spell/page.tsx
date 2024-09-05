"use client";

import Head from 'next/head';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Spell {
  index: string;
  name: string;
  url: string;
  level: string;
  type: string;
  hit_points: number;
  xp: number;
  ac: number;
}

interface RandomSpell {
    name: string;
    range: string;
    ritual: boolean;
    duration: string;
    concentration: boolean;
    level: number;
    casting_time: string;
}

interface SelectedSpell {
  index: string;
  name: string;
  range: string;
  ritual: boolean;
  duration: string;
  concentration: boolean;
  level: number;
  casting_time: string;
}

interface SpellColors {
    index: string;
    name: string;
    range: string;
    ritual: boolean;
    duration: string;
    concentration: boolean;
    level: number;
    castingTime: string;
    nameColor: string 
    rangeColor: string
    ritualColor: string
    durationColor: string 
    concentrationColor: string
    levelColor: string
    castingTimeColor: string
    rangeArrow: string,
    levelArrow: string,
}

const MonsterPage = () => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [randomSpell, setRandomSpell] = useState<RandomSpell | null>(null);
  const [userInput, setUserInput] = useState('');
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [selectedMonsters, setSelectedMonsters] = useState<SelectedSpell[]>([]);
  const [spellColors, setSpellColors] = useState<SpellColors[]>([]);
  const [loading, setLoading] = useState(true);
  const [winBoard, setWinBoard] = useState<true | false>(false); // State for fade effect
  const router = useRouter();

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const response = await fetch('https://www.dnd5eapi.co/api/spells');
        const data = await response.json();
        setSpells(data.results);
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const foundSpell = data.results[randomIndex].index;

        const secondResponse = await fetch(`https://www.dnd5eapi.co/api/spells/${foundSpell}`);
        const secondData = await secondResponse.json();

        setRandomSpell({
          name: secondData.name,
          range: secondData.range,
          ritual: secondData.ritual,
          duration: secondData.duration,
          concentration: secondData.concentration,
          level: secondData.level,
          casting_time: secondData.casting_time,
        });

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch monsters', error);
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  useEffect(() => {
    if (userInput === '') {
      setFilteredSpells([]);
      return;
    }

    const lowercasedInput = userInput.toLowerCase();
    const filtered = spells.filter(spell =>
      spell.name.toLowerCase().includes(lowercasedInput)
    );

    setFilteredSpells(filtered);
  }, [userInput]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSelectSpell = async (spell: Spell) => {
    const tempSpell = spell.index;
    const response = await fetch(`https://www.dnd5eapi.co/api/spells/${tempSpell}`);
    const data = await response.json();
    const spellToAdd: SelectedSpell = {
      'index': data.index,
      'name': data.name,
      'range': data.range,
      'ritual': data.ritual,
      'duration': data.duration,
      'concentration': data.concentration,
      'level': data.level,
      'casting_time': data.casting_time
    };

    checkWin(spellToAdd)

    const coloredSpell = decideSpellColors(spellToAdd);
    setSpellColors([...spellColors, coloredSpell]);
    
    const updatedSpells = spells.filter(oldSpell => oldSpell.index != spell.index)
    setSpells(updatedSpells)
    setUserInput('');
  };

  const checkWin = (spellToAdd: SelectedSpell) => {
    if (randomSpell) {
      const checkedName = spellToAdd.name === randomSpell.name
      const checkedRange = spellToAdd.range === randomSpell.range
      const checkedRitual = spellToAdd.ritual === randomSpell.ritual
      const checkedDuration = spellToAdd.duration === randomSpell.duration
      const checkedConcentration = spellToAdd.concentration === randomSpell.concentration
      const checkedLevel = spellToAdd.level === randomSpell.level
      const checkedCastingTime = spellToAdd.casting_time === randomSpell.casting_time

      if (
        checkedName === true &&
        checkedRange === true &&
        checkedRitual === true &&
        checkedDuration === true &&
        checkedConcentration === true &&
        checkedLevel === true &&
        checkedCastingTime === true
      ) {
        setWinBoard(true)
      }
    }
  }

  const green = "bg-green-600";
  const orange = "bg-orange-600";
  const red = "bg-red-600";

  const checkName = (spellName: string) => {
    if (randomSpell) {      
      if (spellName !== randomSpell.name) {
        return red;
      }
      return green;
    }
  };
  
  const checkRange = (spellRange: string) => {
    if (randomSpell) {     
      if (spellRange !== randomSpell.range) {
        return red;
      }
      return green;
    }
  };

  const checkRitual = (spellRitual: boolean) => {
    if (randomSpell) {      
      if (spellRitual !== randomSpell.ritual) {
        return red;
      }
      return green;
    }
  };

  const checkDuration = (spellDuration: string) => {
    if (randomSpell) {      
      if (spellDuration !== randomSpell.duration) {
        return red;
      }
      return green;
    }
  };

  const checkConcentration = (spellConcentration: boolean) => {
    if (randomSpell) {      
      if (spellConcentration !== randomSpell.concentration) {
        return red;
      }
      return green;
    }
  };

  const checkLevel = (spellLevel: number) => {
    if (randomSpell) {      
      if (spellLevel !== randomSpell.level) {
        return red;
      }
      return green;
    }
  };

  const checkCastingTime = (castingTime: string) => {
    if (randomSpell) {      
      if (castingTime !== randomSpell.casting_time) {
        return red;
      }
      return green;
    }
  };

  const decideSpellColors = (spell: SelectedSpell) => {
    const nameColor = checkName(spell.name) || '';
    const rangeColor = checkRange(spell.range) || '';
    const ritualColor = checkRitual(spell.ritual) || '';
    const durationColor = checkDuration(spell.duration) || '';
    const concentrationColor = checkConcentration(spell.concentration) || '';
    const levelColor = checkLevel(spell.level) || '';
    const castingTime = checkCastingTime(spell.casting_time) || '';

    let formatedSpellRange: Number = 0
    if (spell.range === 'Self' || spell.range === 'Touch') {
      formatedSpellRange = 0
    } else {
      formatedSpellRange = parseInt(spell.range.split(' ')[0])
    }

    let formatedRandomSpellRange: Number = 0
    if (randomSpell) {
      if (randomSpell.range === 'Self' || randomSpell.range === 'Touch') {
        formatedRandomSpellRange = 0
      } else {
        formatedRandomSpellRange = parseInt(randomSpell.range.split(' ')[0])
      }
    }
    
    const rangeArrow = formatedSpellRange > (formatedRandomSpellRange || 0) ? '↓' : formatedSpellRange < (formatedRandomSpellRange || 0) ? '↑' : '';
    const levelArrow = spell.level > (randomSpell?.level || 0) ? '↓' : spell.level < (randomSpell?.level || 0) ? '↑' : '';

    const spellColors: SpellColors = {
      index: spell.index,
      name: spell.name,
      range: spell.range,
      ritual: spell.ritual,
      duration: spell.duration,
      concentration: spell.concentration,
      level: spell.level,
      castingTime: spell.casting_time,
      nameColor: nameColor, 
      rangeColor: rangeColor,
      ritualColor: ritualColor,
      durationColor: durationColor,
      concentrationColor: concentrationColor,
      levelColor: levelColor,
      castingTimeColor: castingTime,
      rangeArrow: rangeArrow,
      levelArrow: levelArrow,
    };

    return spellColors;
  };

  const handleBack = () => {
    router.push('/');
  };

  if (loading) {
    return <div className="w-screen h-screen bg-dark-green text-light-beige flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-green text-light-beige flex flex-col items-center justify-center p-4 relative">
      <Head>
        <title>Spell Minigame</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8">Find out the spell</h1>
      <p className="text-lg mb-12">Try to find the random spell!</p>

      {randomSpell && (
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Random spell:</h2>
          <div className="text-xl">{randomSpell.name}</div>
        </div>
      )}

      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="bg-light-beige text-gray-800 px-4 py-2 rounded-lg w-full"
          placeholder="Spell name"
        />

        {filteredSpells.length > 0 && (
          <ul className="absolute z-10 w-full bg-light-beige text-gray-800 rounded-lg shadow-lg max-h-48 mt-1 overflow-y-auto">
            {filteredSpells.map(spell => (
              <li
                key={spell.index}
                onClick={() => handleSelectSpell(spell)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              >
                {spell.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {spellColors.length > 0 && (
        <div className="w-full max-w-5xl mt-8 bg-light-beige text-gray-800 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-4 bg-dark-green opacity-100 shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Range</th>
                <th className="px-6 py-3">Ritual</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Concentration</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Casting Time</th>
              </tr>
            </thead>
            <tbody>
              {spellColors.toReversed().map(spell => (
                <tr
                  key={spell.index}
                  className={`text-center`}
                >
                  <td className={`py-3 rounded-lg ${spell.nameColor} text-gray-800`}>{spell.name}</td>
                  <td className={`py-3 rounded-lg ${spell.rangeColor} text-gray-800`}>
                    {spell.range} <span className="ml-2">{spell.rangeArrow}</span>
                    </td>
                  <td className={`py-3 rounded-lg ${spell.ritualColor} text-gray-800`}>{spell.ritual == true ? 'Yes' : "No"}</td>
                  <td className={`py-3 rounded-lg ${spell.durationColor} text-gray-800`}>{spell.duration}<span className="ml-2"></span></td>
                  <td className={`py-3 rounded-lg ${spell.concentrationColor} text-gray-800`}>{spell.concentration == true ? 'Yes' : "No"}</td>
                  <td className={`py-3 rounded-lg ${spell.levelColor} text-gray-800`}>
                    {spell.level} <span className="ml-2">{spell.levelArrow}</span>
                    </td>
                  <td className={`py-3 rounded-lg ${spell.castingTimeColor} text-gray-800`}>{spell.castingTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {winBoard && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-light-beige p-8 rounded-lg shadow-lg text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p className="text-lg mb-4">You guessed the spell correctly!</p>
            <p className="text-lg mb-4">The spell was: <span className="font-semibold">{randomSpell && randomSpell.name}</span></p>
            <button
              onClick={() => router.push('/spell')}
              className="bg-green-600 hover:bg-green-700 text-light-beige px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
      <div className="mt-8">
        <button
          onClick={handleBack}
          className="bg-gray-600 hover:bg-gray-700 text-light-beige px-6 py-3 rounded-lg transition-colors duration-300"
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default MonsterPage;
