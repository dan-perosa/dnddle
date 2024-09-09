"use client";

import Head from 'next/head';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Cost {
  quantity: number;
  unit: string
}

interface Equipment {
  index: string;
  name: string;
  equipmentCategory: EquipmentCategory;
  cost: Cost;
  weight: number;
}


interface RandomEquipment {
  name: string;
  equipmentCategory: EquipmentCategory;
  cost: Cost;
  weight: number;
}

interface SelectedEquipment {
    index: string;
    name: string;
    equipmentCategory: EquipmentCategory;
    cost: Cost;
    weight: number;
}

interface EquipmentColors {
    index: string;
    name: string;
    equipmentCategory: EquipmentCategory;
    cost: Cost;
    weight: number;
    nameColor: string 
    equipmentCategoryColor: string
    costColor: string 
    weightColor: string
    costArrow: string 
    weightArrow: string
}

interface EquipmentCategory {
  index: string;
  name: string;
  url: string;
}


const EquipmentPage = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [randomEquipment, setRandomEquipment] = useState<RandomEquipment | null>(null);
  const [userInput, setUserInput] = useState('');
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [selectedEquipments, setSelectedEquipments] = useState<SelectedEquipment[]>([]);
  const [equipmentColors, setEquipmentColors] = useState<EquipmentColors[]>([]);
  const [loading, setLoading] = useState(true);
  const [winBoard, setWinBoard] = useState<true | false>(false);
  const router = useRouter();

  const fetchEquipments = async () => {
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/equipment');
      const data = await response.json();
      setEquipments(data.results);

      const randomIndex = Math.floor(Math.random() * data.results.length);
      const foundEquipment = data.results[randomIndex].index;

      const secondResponse = await fetch(`https://www.dnd5eapi.co/api/equipment/${foundEquipment}`);
      const secondData = await secondResponse.json();

      setRandomEquipment(await {
        name: secondData.name,
        equipmentCategory: secondData.equipment_category,
        cost: {'quantity': secondData.cost.quantity, 'unit': secondData.cost.unit},
        weight: secondData.weight,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch equipments', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);


  useEffect(() => {
    if (userInput === '') {
      setFilteredEquipments([]);
      return;
    }

    const lowercasedInput = userInput.toLowerCase();
    const filtered = equipments.filter(equipment =>
      equipment.name.toLowerCase().includes(lowercasedInput)
    );

    setFilteredEquipments(filtered);
  }, [userInput]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSelectEquipment = async (equipment: Equipment) => {
    const tempEquipment = equipment.index;
    const response = await fetch(`https://www.dnd5eapi.co/api/equipment/${tempEquipment}`);
    const data = await response.json();

    const equipmentToAdd: SelectedEquipment = {
      'index': data.index,
      'name': data.name,
      'equipmentCategory': data.equipment_category,
      'cost': data.cost,
      'weight': data.weight,
    };

    checkWin(equipmentToAdd)
    const coloredEquipment = decideEquipmentColors(equipmentToAdd);
    
    setEquipmentColors([...equipmentColors, coloredEquipment]);
    const updatedEquipments = equipments.filter(oldEquipment => oldEquipment.index != equipment.index)
    setEquipments(updatedEquipments)
    setUserInput('');
  };

  const checkWin = (equipmentToAdd: SelectedEquipment) => {
    if (randomEquipment) {
      const checkedName = equipmentToAdd.name === randomEquipment.name
      const checkedEquipmentCategory = equipmentToAdd.equipmentCategory.index === randomEquipment.equipmentCategory.index
      const checkedCost = equipmentToAdd.cost.quantity === randomEquipment.cost.quantity && equipmentToAdd.cost.unit === randomEquipment.cost.unit
      const checkedWeight = equipmentToAdd.weight === randomEquipment.weight

      if (
        checkedName === true &&
        checkedEquipmentCategory === true &&
        checkedCost === true &&
        checkedWeight === true
      ) {
        setWinBoard(true)
      }
    }
  }

  const green = "bg-green-600";
  const orange = "bg-orange-600";
  const red = "bg-red-600";

  const checkName = (equipmentName: string) => {
    if (randomEquipment) {      
      if (equipmentName !== randomEquipment.name) {
        return red;
      }
      return green;
    }
  };
  
  const checkEquipmentCategory = (equipmentCategory: EquipmentCategory) => {
    if (randomEquipment) {      
      if (equipmentCategory.index !== randomEquipment.equipmentCategory.index) {
        return red;
      }
      return green;
    }
  };

  const checkCost = (equipmentCost: Cost) => {
    if (randomEquipment) {    

      if (equipmentCost.quantity !== randomEquipment.cost.quantity) {
        return red;
      }
      else if (equipmentCost.unit !== randomEquipment.cost.unit) {
        return red;
      }
      return green;
    }
  };

  const checkWeight = (equipmentWeight: number) => {
    if (randomEquipment) {      
      if (equipmentWeight !== randomEquipment.weight) {
        return red;
      }
      return green;
    }
  };

  const decideEquipmentColors = (equipment: SelectedEquipment) => {
    const nameColor = checkName(equipment.name) || '';
    const equipmentCategoryColor = checkEquipmentCategory(equipment.equipmentCategory) || '';
    const costColor = checkCost(equipment.cost) || '';
    const weightColor = checkWeight(equipment.weight) || '';

    const separatedSelectedCostQuantity: number = equipment.cost.quantity
    const separatedSelectedCostUnit: string = equipment.cost.unit
    let selectedCostMultiplier: number = 0
    if (separatedSelectedCostUnit === 'cp') {
      selectedCostMultiplier = 1
    } 
    if (separatedSelectedCostUnit === 'sp') {
      selectedCostMultiplier = 10
    } 
    if (separatedSelectedCostUnit === 'ep') {
      selectedCostMultiplier = 50
    } 
    if (separatedSelectedCostUnit === 'gp') {
      selectedCostMultiplier = 100
    } 
    if (separatedSelectedCostUnit === 'pp') {
      selectedCostMultiplier = 1000
    }
    const selectedFinalCost = separatedSelectedCostQuantity * selectedCostMultiplier
    
    let randomFinalCost = 0
    if (randomEquipment) {
      const separatedRandomCostQuantity: number = randomEquipment.cost.quantity
      const separatedRandomCostUnit: string = randomEquipment.cost.unit
      let randomCostMultiplier: number = 0
      if (separatedRandomCostUnit === 'cp') {
        randomCostMultiplier = 1
      } 
      if (separatedRandomCostUnit === 'sp') {
        randomCostMultiplier = 10
      } 
      if (separatedRandomCostUnit === 'ep') {
        randomCostMultiplier = 50
      } 
      if (separatedRandomCostUnit === 'gp') {
        randomCostMultiplier = 100
      } 
      if (separatedRandomCostUnit === 'pp') {
        randomCostMultiplier = 1000
      }
      randomFinalCost = separatedRandomCostQuantity * randomCostMultiplier
    }


    const costArrow = selectedFinalCost > (randomFinalCost || 0) ? '↓' : selectedFinalCost < (randomFinalCost || 0) ? '↑' : '';
    const weightArrow = equipment.weight > (randomEquipment?.weight || 0) ? '↓' : equipment.weight < (randomEquipment?.weight || 0) ? '↑' : '';

    const equipmentColors: EquipmentColors = {
      index: equipment.index,
      name: equipment.name,
      equipmentCategory: equipment.equipmentCategory,
      cost: equipment.cost,
      weight: equipment.weight,
      nameColor: nameColor, 
      equipmentCategoryColor: equipmentCategoryColor,
      costColor: costColor,
      weightColor: weightColor,
      costArrow: costArrow,
      weightArrow: weightArrow,
    };

    return equipmentColors;
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
        <title>Equipment Minigame</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8">Find out the equipment</h1>
      <p className="text-lg mb-12">Try to guess the random equipment!</p>

      {randomEquipment && (
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Equipamento Aleatório:</h2>
          <div className="text-xl">{randomEquipment.name}</div>
        </div>
      )}

      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="bg-light-beige text-gray-800 px-4 py-2 rounded-lg w-full"
          placeholder="Try an equipment name"
        />

        {filteredEquipments.length > 0 && (
          <ul className="absolute z-10 w-full bg-light-beige text-gray-800 rounded-lg shadow-lg max-h-48 mt-1 overflow-y-auto">
            {filteredEquipments.map(equipment => (
              <li
                key={equipment.index}
                onClick={() => handleSelectEquipment(equipment)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200 flex justify-between"
              >
                <span>{equipment.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {equipmentColors.length > 0 && (
        <div className="w-full max-w-5xl mt-8 bg-light-beige text-gray-800 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-4 bg-dark-green opacity-100 shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-2 py-3">Name</th>
                <th className="px-2 py-3">Equip. Category</th>
                <th className="px-2 py-3">Cost</th>
                <th className="px-2 py-3">Weight</th>
              </tr>
            </thead>
            <tbody>
              {equipmentColors.toReversed().map(equipment => (
                <tr
                  key={equipment.index}
                  className={`text-center items-center`}
                >
                  <td className={`py-3 ${equipment.nameColor} text-gray-800`}>{equipment.name}</td>
                  <td className={`py-3 ${equipment.equipmentCategoryColor} text-gray-800`}>{equipment.equipmentCategory.name}</td>
                  <td className={`py-3 ${equipment.costColor} text-gray-800`}>
                    {equipment.cost.quantity + '' + equipment.cost.unit} <span className="ml-2">{equipment.costArrow}</span>
                    </td>
                  <td className={`py-3 ${equipment.weightColor} text-gray-800`}>
                    {equipment.weight} <span className="ml-2">{equipment.weightArrow}</span>
                    </td>
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
            <p className="text-lg mb-4">You guessed the equipment correctly!</p>
            <p className="text-lg mb-4">The equipment was: <span className="font-semibold">{randomEquipment && randomEquipment.name}</span></p>
            <button
              onClick={() => router.push('/')}
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

export default EquipmentPage;
