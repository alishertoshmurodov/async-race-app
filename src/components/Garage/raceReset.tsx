import { useState } from "react";
import { ReactComponent as IconPlay } from "../../assets/icon-play.svg";
import { ReactComponent as IconReset } from "../../assets/icon-reset.svg";

async function setEngine(
  url: string,
  carIndex: number,
  updatedCars: any[],
  status: string,
  setCars: (updateFunction: (prevCars: any[]) => any[]) => void
) {
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
    setCars((prevCars) => {
      const newCars = [...prevCars];
      const updatedCar = { ...newCars[carIndex] };

      const getTime = () =>
        result.velocity > 0 ? result.distance / result.velocity : undefined;

      // Ensure the time value is only set during the "started" status and preserved during the "drive" status
      if (status === "started") {
        updatedCar.isDriving = "driving";
        updatedCar.time = getTime();
      } else if (status === "drive") {
        updatedCar.isDriving = "reached";
        updatedCar.isFinished = true;
        // No need to set time again, it should already be set
      }

      newCars[carIndex] = updatedCar;
      return newCars;
    });

    return [...updatedCars];
  } catch (error) {
    setCars((prevCars) => {
      const newCars = [...prevCars];
      const updatedCar = {
        ...newCars[carIndex],
        isDriving: "stopped",
        isFinished: true,
      };
      newCars[carIndex] = updatedCar;
      return newCars;
    });
    throw error;
  }
}

function RaceReset({ cars, indexOfLastItem, indexOfFirstItem, setCars }: any) {
  const [raceStatus, setRaceStatus] = useState("start");

  async function updateCarEngine(
    url: string,
    index: number,
    cars: any,
    setCars: any
  ) {
    try {
      let updatedCars = await setEngine(url, index, cars, "started", setCars);
      updatedCars = await setEngine(url, index, updatedCars, "drive", setCars);
      console.log(`Car ${index}: Data patched successfully`);
      return updatedCars; // Return updated state if needed
    } catch (error) {
      console.error(`Car ${index}: Error patching data`, error);
      throw error; // Rethrow to handle in allSettled results
    }
  }

  async function handleSetEngine() {
    setRaceStatus("racing");
    const carPromises = cars
      .slice(indexOfFirstItem, indexOfLastItem)
      .map((index: number) =>
        updateCarEngine(
          "http://localhost:3000/engine",
          indexOfFirstItem + index,
          [...cars],
          setCars
        )
      );

    const results = await Promise.allSettled(carPromises);
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(`Car ${index}: Updated successfully`);
      } else {
        console.error(`Car ${index}: Failed to update`, result.reason);
      }
    });
    setRaceStatus("ended");
  }

  function handleReset() {
    const updatedCars = [...cars];
    for (let i = indexOfFirstItem; i < indexOfLastItem; i++) {
      updatedCars[i].isDriving = "initial";
      updatedCars[i].isFinished = false;
      updatedCars[i].time = 0;
    }
    setCars(updatedCars);
  }

  return (
    <div className="flex gap-3 order-1 md:order-3">
      <button
        onClick={handleSetEngine}
        disabled={raceStatus === "racing" || raceStatus === "ended"}
        className={`button bg-green-500 text-gray-50 !border-green-500 hover:!border-white hover:bg-green-400 hover:text-white transition ${
          raceStatus !== "start" && "opacity-50"
        }`}
      >
        <span>Race</span>
        <IconPlay />
      </button>
      <button
        onClick={handleReset}
        className="button bg-violet-500 text-gray-50 !border-violet-500 hover:!border-white hover:bg-violet-400 hover:text-white transition"
      >
        <span>Reset</span>
        <IconReset />
      </button>
    </div>
  );
}

export default RaceReset;
