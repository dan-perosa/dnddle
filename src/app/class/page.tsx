"use client";

import Head from 'next/head';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { start } from 'repl';

interface Class {
    index: string;
    name: string;
    hitDie: number;
    proficiencies: Proficiency[];
    savingThrows: SavingThrows[];
    startingEquipment: StartingEquipment[];
}

interface Proficiency {
    index: string;
    name: string;
    url: string;
}

interface SavingThrows {
    index: string;
    name: string;
    url: string;
}

interface StartingEquipment {
    equipment: Equipment;
    quantity: string;
}

interface Equipment {
    index: string;
    name: string;
    url: string;
}

interface RandomClass {
    index: string;
    name: string;
    hitDie: number;
    proficiencies: Proficiency[];
    savingThrows: SavingThrows[];
    startingEquipment: StartingEquipment[];
}

interface SelectedClass {
    index: string;
    name: string;
    hitDie: number;
    proficiencies: Proficiency[];
    savingThrows: SavingThrows[];
    startingEquipment: StartingEquipment[];
}

interface ClassColors {
    index: string;
    name: string;
    hitDie: number;
    proficiencies: Proficiency[];
    savingThrows: SavingThrows[];
    startingEquipment: StartingEquipment[];
    nameColor: string 
    hitDieColor: string
    proficienciesColor: string
    savingThrowsColor: string 
    startingEquipmentColor: string
    hitDieArrow: string;
}

const SpellPage = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [randomClass, setRandomClass] = useState<RandomClass | null>(null);
  const [userInput, setUserInput] = useState('');
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<SelectedClass[]>([]);
  const [classColors, setClassColors] = useState<ClassColors[]>([]);
  const [loading, setLoading] = useState(true);
  const [winBoard, setWinBoard] = useState<true | false>(false);
  const router = useRouter();

  const fetchClasses = async () => {
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/classes');
      const data = await response.json();

      setClasses(data.results);
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const foundClass = data.results[randomIndex].index;

      const secondResponse = await fetch(`https://www.dnd5eapi.co/api/classes/${foundClass}`);
      const secondData = await secondResponse.json();
      setRandomClass({
        index: secondData.index,
        name: secondData.name,
        hitDie: secondData.hit_die,
        proficiencies: secondData.proficiencies,
        savingThrows: secondData.saving_throws,
        startingEquipment: secondData.starting_equipment,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch classes', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);


  useEffect(() => {
    if (userInput === '') {
      setFilteredClasses([]);
      return;
    }

    const lowercasedInput = userInput.toLowerCase();
    const filtered = classes.filter(classx =>
      classx.name.toLowerCase().includes(lowercasedInput)
    );

    setFilteredClasses(filtered);
  }, [userInput]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSelectClass = async (classx: Class) => {
    const tempClass = classx.index;
    const response = await fetch(`https://www.dnd5eapi.co/api/classes/${tempClass}`);
    const data = await response.json();
    const classToAdd: SelectedClass = {
      'index': data.index,
      'name': data.name,
      'hitDie': data.hit_die,
      'proficiencies': data.proficiencies,
      'savingThrows': data.saving_throws,
      'startingEquipment': data.starting_equipment,
    };

    console.log(randomClass)

    checkWin(classToAdd)

    const coloredClass = decideClassColors(classToAdd);
    setClassColors([...classColors, coloredClass]);
    
    const updatedClasses = classes.filter(oldClass => oldClass.index != classx.index)
    setClasses(updatedClasses)
    setUserInput('');
  };

  const checkWin = (classToAdd: SelectedClass) => {
    if (randomClass) {
      const checkedName = classToAdd.name === randomClass.name
      const checkedHitDie = classToAdd.hitDie === randomClass.hitDie
      const checkedProficiencies = JSON.stringify(classToAdd.proficiencies) === JSON.stringify(randomClass.proficiencies)
      const checkedSavingThrows = JSON.stringify(classToAdd.savingThrows) === JSON.stringify(randomClass.savingThrows)
      const checkedStartingEquipment = JSON.stringify(classToAdd.startingEquipment) === JSON.stringify(randomClass.startingEquipment)

      // console.log(checkedProficiencies, checkedSavingThrows, checkedStartingEquipment)
      // console.log(JSON.stringify(classToAdd.savingThrows))
      // console.log(JSON.stringify(randomClass.savingThrows))

      if (
        checkedName === true &&
        checkedHitDie === true &&
        checkedProficiencies === true &&
        checkedSavingThrows === true &&
        checkedStartingEquipment === true
      ) {
        setWinBoard(true)
      }
    }
  }

  const green = "bg-green-600";
  const orange = "bg-orange-600";
  const red = "bg-red-600";

  const checkName = (className: string) => {
    if (randomClass) {      
      if (className !== randomClass.name) {
        return red;
      }
      return green;
    }
  };
  
  const checkHitDie = (classHitDie: number) => {
    if (randomClass) {      
      if (classHitDie !== randomClass.hitDie) {
        return red;
      }
      return green;
    }
  };

  const checkProficiencies = (classProficiencies: Proficiency[]) => {
    if (randomClass) {   

      const randomProficienciesListToOrangeCheck: string[] = randomClass.proficiencies.map(proficiency => proficiency.index)
      const selectedProficienciesListToOrangeCheck: string[] = classProficiencies.map(proficiency => proficiency.index)
    
      const selectedProficienciesSet = new Set(selectedProficienciesListToOrangeCheck);

      if (JSON.stringify(classProficiencies) !== JSON.stringify(randomClass.proficiencies)) {

        const hasCommonProficiencies = randomProficienciesListToOrangeCheck.some(proficiencyIndex => selectedProficienciesSet.has(proficiencyIndex));
        return hasCommonProficiencies ? red : orange;
      }
      return green;
    }
  };

  const checkSavingThrows = (classSavingThrows: SavingThrows[]) => {
    if (randomClass) {      

      const randomSavingThrowsListToOrangeCheck: string[] = randomClass.savingThrows.map(savingThrows => savingThrows.index)
      const selectedSavingThrowsListToOrangeCheck: string[] = classSavingThrows.map(savingThrows => savingThrows.index)

      const selectedSavingThrowsSet = new Set(selectedSavingThrowsListToOrangeCheck)

      if (JSON.stringify(classSavingThrows) !== JSON.stringify(randomClass.savingThrows)) {

        const hasCommonSavingThrows = randomSavingThrowsListToOrangeCheck.some(savingThrowIndex => selectedSavingThrowsSet.has(savingThrowIndex));
        return hasCommonSavingThrows ? red : orange;
      }
      return green;
    }
  };

  const checkStartingEquipment = (classStartingEquipment: StartingEquipment[]) => {
    if (randomClass) {      

      const randomStartingEquipmentListToOrangeCheck: string[] = randomClass.startingEquipment.map(startingEquipment => startingEquipment.equipment.index)
      const selectedStartingEquipmentListToOrangeCheck: string[] = classStartingEquipment.map(startingEquipment => startingEquipment.equipment.index)

      const selectedStartingEquipmentSet = new Set(selectedStartingEquipmentListToOrangeCheck)

      if (JSON.stringify(classStartingEquipment) !== JSON.stringify(randomClass.startingEquipment)) {
        const hasCommonProficiencies = randomStartingEquipmentListToOrangeCheck.some(startingEquipmentIndex => selectedStartingEquipmentSet.has(startingEquipmentIndex));
        return hasCommonProficiencies ? red : orange;
      }
      return green;
    }
  };


  const decideClassColors = (classx: SelectedClass) => {
    const nameColor = checkName(classx.name) || '';
    const hitDieColor = checkHitDie(classx.hitDie) || '';
    const proficienciesColor = checkProficiencies(classx.proficiencies) || '';
    const savingThrowsColor = checkSavingThrows(classx.savingThrows) || '';
    const startingEquipmentColor = checkStartingEquipment(classx.startingEquipment) || '';


    const hitDieArrow = classx.hitDie > (randomClass?.hitDie || 0) ? '↓' : classx.hitDie < (randomClass?.hitDie || 0) ? '↑' : '';

    const classColors: ClassColors = {
      index: classx.index,
      name: classx.name,
      hitDie: classx.hitDie,
      proficiencies: classx.proficiencies,
      savingThrows: classx.savingThrows,
      startingEquipment: classx.startingEquipment,
      nameColor: nameColor, 
      hitDieColor: hitDieColor,
      proficienciesColor: proficienciesColor,
      savingThrowsColor: savingThrowsColor,
      startingEquipmentColor: startingEquipmentColor,
      hitDieArrow: hitDieArrow
    };

    return classColors;
  };

  const handleBack = () => {
    router.push('/');
  };

  if (loading) {
    return <div className="w-screen h-screen bg-dark-green text-light-beige flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-dark-green text-light-beige flex flex-col items-center justify-center p-4 relative">
      <Head>
        <title>Class Minigame</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8">Find out the class</h1>
      <p className="text-lg mb-12">Try to guess the random class!</p>

      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="bg-light-beige text-gray-800 px-4 py-2 rounded-lg w-full"
          placeholder="Guess a class"
        />

        {filteredClasses.length > 0 && (
          <ul className="absolute z-10 w-full bg-light-beige text-gray-800 rounded-lg shadow-lg max-h-48 mt-1 overflow-y-auto">
            {filteredClasses.map(classx => (
              <li
                key={classx.index}
                onClick={() => handleSelectClass(classx)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200 flex justify-between"
              >
                <span>{classx.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {classColors.length > 0 && (
        <div className="w-full max-w-5xl mt-8 bg-light-beige text-gray-800 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-4 bg-dark-green opacity-100 shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-2 py-3">Name</th>
                <th className="px-2 py-3">Hit Die</th>
                <th className="px-2 py-3">Proficiencies</th>
                <th className="px-2 py-3">Saving Throws</th>
                <th className="px-2 py-3">Starting Equipment</th>
              </tr>
            </thead>
            <tbody>
              {classColors.toReversed().map(classx => (
                <tr
                  key={classx.index}
                  className={`text-center items-center`}
                >
                  <td className={`py-3 ${classx.nameColor} text-gray-800`}>{classx.name}</td>
                  <td className={`py-3 ${classx.hitDieColor} text-gray-800`}>
                    {classx.hitDie}<span className="ml-2"> {classx.hitDieArrow}</span>
                    </td> 
                    <td className={`py-3 ${classx.proficienciesColor} text-gray-800`}>
                      {classx.proficiencies
                        .filter((proficiency) => !proficiency.name.includes('Saving Throw'))
                        .map((proficiency) => proficiency.name)
                        .join(', ')}
                    </td>
                  <td className={`py-3 ${classx.savingThrowsColor} text-gray-800`}>{classx.savingThrows.map((savingThrowList: SavingThrows) => savingThrowList.name).join(', ')}</td>
                  <td className={`py-3 ${classx.startingEquipmentColor} text-gray-800`}>{classx.startingEquipment.map((startingEquipmentList: StartingEquipment) => startingEquipmentList.equipment.name).join(', ')}</td>
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
            <p className="text-lg mb-4">You guessed the class correctly!</p>
            <p className="text-lg mb-4">The class was: <span className="font-semibold">{randomClass && randomClass.name}</span></p>
            <button
              onClick={() => router.push('/equipment')}
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
          Back
        </button>
      </div>
    </div>
  );
};

export default SpellPage;
