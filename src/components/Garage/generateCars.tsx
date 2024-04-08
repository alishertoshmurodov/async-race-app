const GenerateCars = ({ getGarage }: any) => {
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

  // Function to select a random item from an array
  const getRandomItem = (array: any) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Function to generate a random car name
  const generateRandomName = () => {
    const part1 = getRandomItem(nameParts1);
    const part2 = getRandomItem(nameParts2);
    return `${part1} ${part2}`;
  };

  // Function to generate a random color in hexadecimal format
  const generateRandomColor = () => {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256); // Random number between 0 and 255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert RGB values to hexadecimal format
    const hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return hexColor;
  };

  const handleGenerate = () => {
    const requestPromises = [];

    for (let i = 0; i < 100; i++) {
      // Send a POST request for each iteration
      const requestPromise = fetch("http://127.0.0.1:3000/garage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: generateRandomName(),
          color: generateRandomColor(),
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Parse the JSON-encoded response body
        })
        .then((data) => {
          // Handle the response data
          console.log("Request successful:", data);
        })
        .catch((error) => {
          // Handle errors
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });

      requestPromises.push(requestPromise);
    }

    Promise.all(requestPromises)
      .then(() => {
        // All requests completed successfully
        console.log("All requests completed successfully");
        getGarage();
      })
      .catch((error) => {
        // Handle errors
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
};

export default GenerateCars;
