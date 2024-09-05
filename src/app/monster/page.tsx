"use client";

import Head from 'next/head';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Monster {
  index: string;
  name: string;
  url: string;
  size: string;
  type: string;
  hit_points: number;
  xp: number;
  ac: number;
  img: string
}

interface RandomMonster {
  name: string;
  size: string;
  type: string;
  hit_points: number;
  xp: number;
  ac: number;
  img: string
}

interface SelectedMonster {
  index: string;
  name: string;
  size: string;
  type: string;
  hit_points: number;
  xp: number;
  ac: number;
  img: string
}

interface MonsterColors {
    index: string;
    name: string;
    size: string;
    type: string;
    hit_points: number;
    xp: number;
    ac: number;
    nameColor: string 
    sizeColor: string
    typeColor: string
    hpColor: string 
    xpColor: string
    acColor: string
    hpArrow: string,
    xpArrow: string,
    acArrow: string,
    img: string
}

interface MonIma {
    index: string;
    img: string;
}

const SpellPage = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [randomMonster, setRandomMonster] = useState<RandomMonster | null>(null);
  const [userInput, setUserInput] = useState('');
  const [filteredMonsters, setFilteredMonsters] = useState<Monster[]>([]);
  const [selectedMonsters, setSelectedMonsters] = useState<SelectedMonster[]>([]);
  const [monsterColors, setMonsterColors] = useState<MonsterColors[]>([]);
  const [loading, setLoading] = useState(true);
  const [fadeKey, setFadeKey] = useState<number | null>(null);
  const [winBoard, setWinBoard] = useState<true | false>(false);
  const [tempMonstersWithImages, setTempMonstersWithImages] = useState<MonIma[]>([]);
  const router = useRouter();

  const fetchMonsters = async () => {
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/monsters');
      const data = await response.json();
      const mappedMonstersWithImage = data.results.map((result: { index: any; }) => {
        const image = tempMonstersWithImages.find(imageItem => imageItem.index === result.index);
        return {
        ...result,
        img: image ? image.img : ''
        }
      })
      setMonsters(mappedMonstersWithImage);
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const foundMonster = data.results[randomIndex].index;

      const secondResponse = await fetch(`https://www.dnd5eapi.co/api/monsters/${foundMonster}`);
      const secondData = await secondResponse.json();
      setRandomMonster({
        name: secondData.name,
        size: secondData.size,
        type: secondData.type,
        hit_points: secondData.hit_points,
        xp: secondData.xp,
        ac: secondData.armor_class[0].value,
        img: secondData.image !== undefined ? "https://www.dnd5eapi.co" + secondData.image : '',
      });
    } catch (error) {
      console.error('Failed to fetch monsters', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonsters();
  }, [tempMonstersWithImages]);

  useEffect(() => {
    setLoading(false);
  }, [randomMonster]);

  const startMonsterImages = async () => {
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/monsters');
      const data = await response.json();
      let tempMonsters: MonIma[] = []

      data.results.map(async (monster: Monster) => {
        const response2 = await fetch(`https://www.dnd5eapi.co/api/monsters/${monster.index}`);
        const data2 = await response2.json();
        if (data2.image !== undefined) {
          tempMonsters.push({index: monster.index, img: `https://www.dnd5eapi.co${data2.image}`})
        } else {
          tempMonsters.push({index: monster.index, img: ''})
        }
      })

      setTempMonstersWithImages(tempMonsters)
    } catch (error) {
      console.error('Failed to fetch monsters', error);
    }
  };

  useEffect(() => {
      startMonsterImages()
  }, []);

  const checkIfThereIsImg = async (monsterIndex: string) => {
    const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${monsterIndex}`);
    const data = await response.json();
    if (data.image !== undefined) {
      return `https://www.dnd5eapi.co/api/images/monsters/${monsterIndex}.png`
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (userInput === '') {
      setFilteredMonsters([]);
      return;
    }

    const lowercasedInput = userInput.toLowerCase();
    const filtered = monsters.filter(monster =>
      monster.name.toLowerCase().includes(lowercasedInput)
    );

    setFilteredMonsters(filtered);
  }, [userInput]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSelectMonster = async (monster: Monster) => {
    const tempMonster = monster.index;
    const response = await fetch(`https://www.dnd5eapi.co/api/monsters/${tempMonster}`);
    const data = await response.json();
    const monsterToAdd: SelectedMonster = {
      'index': data.index,
      'name': data.name,
      'size': data.size,
      'type': data.type,
      'hit_points': data.hit_points,
      'xp': data.xp,
      'ac': data.armor_class[0].value,
      'img': data.image !== undefined ? "https://www.dnd5eapi.co" + data.image : '',
    };

    checkWin(monsterToAdd)

    const coloredMonster = decideMonsterColors(monsterToAdd);
    setMonsterColors([...monsterColors, coloredMonster]);
    
    const updatedMonsters = monsters.filter(oldMonster => oldMonster.index != monster.index)
    setMonsters(updatedMonsters)
    setUserInput('');
  };

  const checkWin = (monsterToAdd: SelectedMonster) => {
    if (randomMonster) {
      const checkedName = monsterToAdd.name === randomMonster.name
      const checkedSize = monsterToAdd.size === randomMonster.size
      const checkedType = monsterToAdd.type === randomMonster.type
      const checkedHitPoints = monsterToAdd.hit_points === randomMonster.hit_points
      const checkedXp = monsterToAdd.xp === randomMonster.xp
      const checkedAc = monsterToAdd.ac === randomMonster.ac

      if (
        checkedName === true &&
        checkedSize === true &&
        checkedType === true &&
        checkedHitPoints === true &&
        checkedXp === true &&
        checkedAc === true
      ) {
        setWinBoard(true)
      }
    }
  }

  const green = "bg-green-600";
  const orange = "bg-orange-600";
  const red = "bg-red-600";

  const checkName = (monsterName: string) => {
    if (randomMonster) {      
      if (monsterName !== randomMonster.name) {
        return red;
      }
      return green;
    }
  };
  
  const checkSize = (monsterSize: string) => {
    if (randomMonster) {      
      if (monsterSize !== randomMonster.size) {
        return red;
      }
      return green;
    }
  };

  const checkType = (monsterType: string) => {
    if (randomMonster) {      
      if (monsterType !== randomMonster.type) {
        return red;
      }
      return green;
    }
  };

  const checkHp = (monsterHp: number) => {
    if (randomMonster) {      
      if (monsterHp !== randomMonster.hit_points) {
        return red;
      }
      return green;
    }
  };

  const checkXp = (monsterXp: number) => {
    if (randomMonster) {      
      if (monsterXp !== randomMonster.xp) {
        return red;
      }
      return green;
    }
  };

  const checkAc = (monsterAc: number) => {
    if (randomMonster) {      
      if (monsterAc !== randomMonster.ac) {
        return red;
      }
      return green;
    }
  };

  const decideMonsterColors = (monster: SelectedMonster) => {
    const nameColor = checkName(monster.name) || '';
    const sizeColor = checkSize(monster.size) || '';
    const typeColor = checkType(monster.type) || '';
    const hpColor = checkHp(monster.hit_points) || '';
    const xpColor = checkXp(monster.xp) || '';
    const acColor = checkAc(monster.ac) || '';


    const hpArrow = monster.hit_points > (randomMonster?.hit_points || 0) ? '↓' : monster.hit_points < (randomMonster?.hit_points || 0) ? '↑' : '';
    const xpArrow = monster.xp > (randomMonster?.xp || 0) ? '↓' : monster.xp < (randomMonster?.xp || 0) ? '↑' : '';
    const acArrow = monster.ac > (randomMonster?.ac || 0) ? '↓' : monster.ac < (randomMonster?.ac || 0) ? '↑' : '';

    const monsterColors: MonsterColors = {
      index: monster.index,
      name: monster.name,
      size: monster.size,
      type: monster.type,
      hit_points: monster.hit_points,
      xp: monster.xp,
      ac: monster.ac,
      img: monster.img,
      nameColor: nameColor, 
      sizeColor: sizeColor,
      typeColor: typeColor,
      hpColor: hpColor,
      xpColor: xpColor,
      acColor: acColor,
      hpArrow: hpArrow,
      xpArrow: xpArrow,
      acArrow: acArrow,
    };

    return monsterColors;
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
        <title>Monster Minigame</title>
      </Head>
      <h1 className="text-4xl font-bold mb-8">Find out the monster</h1>
      <p className="text-lg mb-12">Try to guess the random monster!</p>

      {randomMonster && (
        <div className="mb-8">
          <h2 className="text-2xl mb-4">Monstro Aleatório:</h2>
          <div className="text-xl">{randomMonster.name}</div>
        </div>
      )}

      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          className="bg-light-beige text-gray-800 px-4 py-2 rounded-lg w-full"
          placeholder="Digite o nome do monstro"
        />

        {filteredMonsters.length > 0 && (
          <ul className="absolute z-10 w-full bg-light-beige text-gray-800 rounded-lg shadow-lg max-h-48 mt-1 overflow-y-auto">
            {filteredMonsters.map(monster => (
              <li
                key={monster.index}
                onClick={() => handleSelectMonster(monster)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200 flex justify-between"
              >
                <span>{monster.name}</span> {monster.img !== '' ? <img className="h-[38px] w-[38px]" src={monster.img} alt={monster.img} /> : ''}
              </li>
            ))}
          </ul>
        )}
      </div>

      {monsterColors.length > 0 && (
        <div className="w-full max-w-5xl mt-8 bg-light-beige text-gray-800 rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full table-auto border-separate border-spacing-4 bg-dark-green opacity-100 shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="px-2 py-3">Image</th>
                <th className="px-2 py-3">Name</th>
                <th className="px-2 py-3">Size</th>
                <th className="px-2 py-3">Type</th>
                <th className="px-2 py-3">HP</th>
                <th className="px-2 py-3">XP</th>
                <th className="px-2 py-3">AC</th>
              </tr>
            </thead>
            <tbody>
              {monsterColors.toReversed().map(monster => (
                <tr
                  key={monster.index}
                  className={`text-center items-center`}
                >
                  <td className={``}>{monster.img !== '' ? <img className="h-[42px] w-[42px] m-auto" src={monster.img}></img> : ''}</td>
                  <td className={`py-3 ${monster.nameColor} text-gray-800`}>{monster.name}</td>
                  <td className={`py-3 ${monster.sizeColor} text-gray-800`}>{monster.size}</td>
                  <td className={`py-3 ${monster.typeColor} text-gray-800`}>{monster.type}</td>
                  <td className={`py-3 ${monster.hpColor} text-gray-800`}>
                    {monster.hit_points} <span className="ml-2">{monster.hpArrow}</span>
                    </td>
                  <td className={`py-3 ${monster.xpColor} text-gray-800`}>
                    {monster.xp} <span className="ml-2">{monster.xpArrow}</span>
                    </td>
                  <td className={`py-3 ${monster.acColor} text-gray-800`}>
                    {monster.ac} <span className="ml-2">{monster.acArrow}</span>
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
            <p className="text-lg mb-4">You guessed the monster correctly!</p>
            <p className="text-lg mb-4">The monster was: <span className="font-semibold">{randomMonster && randomMonster.name}</span></p>
            {randomMonster && randomMonster.img && (<img src={randomMonster.img}></img>)}
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

export default SpellPage;
