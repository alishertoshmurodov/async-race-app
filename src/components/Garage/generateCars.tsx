function GenerateCars({ getGarage }: any) {
  const nameParts1 = [
    "Tesla",
    "Ford",
    "Chevrolet",
    "Toyota",
    "Honda",
    "BMW",
    "Mercedes",
    "Lamborghini",
    "Audi",
    "Volkswagen",
  ];
  const nameParts2 = [
    "Model S",
    "Mustang",
    "Civic",
    "Corvette",
    "Camry",
    "Accord",
    "3 Series",
    "Aventador",
    "A6",
    "Golf",
  ];

  const getRandomItem = (array: string[]) =>
    array[Math.floor(Math.random() * array.length)];

  const generateRandomName = () => {
    const part1 = getRandomItem(nameParts1);
    const part2 = getRandomItem(nameParts2);
    return `${part1} ${part2}`;
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return hexColor;
  };

  const handleGenerate = () => {
    const requestPromises = [];

    for (let i = 0; i < 100; i++) {
      const requestPromise = fetch("http://127.0.0.1:3000/garage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: generateRandomName(),
          color: generateRandomColor(),
        }),
      });

      requestPromises.push(requestPromise);
    }

    Promise.all(requestPromises)
      .then(() => {
        console.log("All requests completed successfully");
        getGarage();
      })
      .catch((error) => {
        console.error(
          "There was a problem with one or more fetch operations:",
          error
        );
      });
  };

  return (
    <button
      onClick={handleGenerate}
      className="button order-4 hover:bg-sky-400 hover:text-white hover:!border-white transition bg-sky-500 text-white !border-sky-600"
    >
      Generate Cars
    </button>
  );
}

export default GenerateCars;
