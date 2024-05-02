import IconCarComponent from "./iconCarComponent";

async function setEngine(
  url: string,
  carIndex: number,
  updatedCars: any,
  status: string,
  setCars: any
) {
  const newCars = [...updatedCars];
  const updatedCar = { ...newCars[carIndex] };

  try {
    const patchUrl = `${url}?id=${updatedCars[carIndex].id}&status=${status}`;
    const data = { status }; // Assuming status is the key in the patch data

    const response = await fetch(patchUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers if needed
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to patch data: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    // Create a copy of the cars array to modify
    const getTime = () => {
      if (result.velocity > 0) {
        return result.distance / result.velocity / 1000;
      }
    };
    // Update the car object based on the status
    if (status === "started") {
      updatedCar.isDriving = "driving";
      updatedCar.time = getTime();
    } else if (status === "drive") {
      updatedCar.isDriving = "reached";
      updatedCar.isFinished = true;
    }

    newCars[carIndex] = updatedCar;
    setCars(newCars);
    return newCars;
  } catch (error) {
    if (status === "drive") {
      updatedCar.isDriving = "stopped";
      updatedCar.isFinished = true;
    }
    newCars[carIndex] = updatedCar;
    setCars(() => {
      newCars[carIndex] = updatedCar;
      return newCars;
    });

    console.error("Error patching data:", error);
    throw error; // Rethrow the error for handling at higher levels
  }
}

function CarElement({
  car,
  cars,
  setCars,
  selectedCar,
  handleSelect,
  handleDelete,
}: any) {
  const carIndex = cars.findIndex((carItem: any) => carItem.id === car.id);

  const handleReset = () => {
    let newCars = [...cars];
    newCars[carIndex] = {
      ...newCars[carIndex],
      isDriving: "initial",
      isFinished: false,
      time: 0,
    };
    setCars(newCars);
  };

  async function handleSetEngine() {
    let updatedCars = [...cars];
    try {
      updatedCars = await setEngine(
        "http://localhost:3000/engine",
        carIndex,
        updatedCars,
        "started",
        setCars
      );

      await setEngine(
        "http://localhost:3000/engine",
        carIndex,
        updatedCars,
        "drive",
        setCars
      );

      console.log("Data patched successfully");

      // Optionally, reset form fields or update state upon successful patching
    } catch (error) {
      console.error("Error patching data:", error);
      // Optionally, display an error message to the user
    }
  }

  return (
    <div className="flex">
      <div className="grid grid-cols-2 gap-x gap-y-2 w-auto py-4 justify-items-center">
        <button
          className={`button text-sm !py-1 !px-2 font-medium order-1 transition duration-300 ease-in-out ${
            selectedCar.id === car.id ? "bg-gray-900 text-white" : ""
          }`}
          onClick={() => handleSelect(car)}
        >
          Select
        </button>
        <button
          className="button text-sm !py-1 !px-2 font-medium order-3 hover:bg-rose-500 hover:text-white transition ease-in-out"
          onClick={() => handleDelete(car.id)}
        >
          Remove
        </button>
        <button
          onClick={() => handleSetEngine()}
          disabled={car.isDriving === "driving" || car.isFinished}
          className={`button text-sm !py-1 !px-2 font-medium order-2  hover:!bg-amber-500 hover:text-white transition ease-in-out ${
            car.isDriving === "driving" || car.isFinished
              ? "bg-amber-500 text-white"
              : ""
          }`}
        >
          A
        </button>
        <button
          onClick={() => handleReset()}
          className="button text-sm !py-1 !px-2 font-medium order-4 hover:!bg-cyan-500 hover:text-white transition ease-in-out"
        >
          B
        </button>
      </div>
      <div className="flex w-full border-y-2 border-gray-700 items-center justify-start relative">
        <div className="absolute top-1 left-2">
          <h2 className="text-2xl">{car.name}</h2>
        </div>
        <div
          className={`car driving`}
          style={{
            animationPlayState:
              car.isDriving === "initial" || car.isDriving === "stopped"
                ? "paused"
                : "running",
            animationName:
              car.isDriving === "initial" ? "none" : "driveAnimation",
            animationDuration: `${String(car.time)}s`,
            left:
              car.isFinished && car.isDriving !== "initial"
                ? "calc(100% - 120px)"
                : "0",
          }}
        >
          <IconCarComponent color={car.color} />
        </div>
      </div>
    </div>
  );
}

export default CarElement;
