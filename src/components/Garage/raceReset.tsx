import { useEffect, useState } from "react";
import { CarData } from "../../StateContext";
import { ReactComponent as IconPlay } from "../../assets/icon-play.svg";
import { ReactComponent as IconReset } from "../../assets/icon-reset.svg";
import { useStateContext } from "../../StateContext";

interface RaceResetProps {
  indexOfFirstItem: number;
  indexOfLastItem: number;
  getGarage: any;
}

async function setEngine(
  url: string,
  carIndex: number,
  updatedCars: CarData[],
  status: string,
  setCars: (updateFunction: (prevCars: CarData[]) => CarData[]) => void
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
        result.velocity > 0 ? result.distance / result.velocity / 1000 : 0;

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

async function handleWinner(winner: CarData | null, getGarage: any) {
  if (winner) {
    const method = winner.wins > 0 ? "PUT" : "POST";
    const getWinningTime = () => {
      if (winner.best === 0) {
        return winner.time;
      } else {
        return Math.min(winner.best, winner.time);
      }
    };

    const winnerData = (method: string) => {
      if (method === "POST") {
        return {
          id: winner.id,
          wins: ++winner.wins,
          time: getWinningTime(),
        };
      } else {
        return {
          wins: ++winner.wins,
          time: getWinningTime(),
        };
      }
    };

    const url = `http://127.0.0.1:3000/winners${
      method === "PUT" ? `/${winner.id}` : ""
    }`;
    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(winnerData(method)),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON-encoded response body
      })
      .then((data) => {
        getGarage();
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with your fetch operation:", error);
      });
  } else {
    throw new Error("Winner cannot be empty to execute this funtion");
  }
}

function RaceReset({
  indexOfLastItem,
  indexOfFirstItem,
  getGarage,
}: RaceResetProps) {
  const { cars, setCars } = useStateContext();
  const [raceStatus, setRaceStatus] = useState("start");
  const [winner, setWinner] = useState<CarData | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  async function updateCarEngine(
    url: string,
    index: number,
    cars: CarData[],
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

  useEffect(() => {
    const carsWithTimes = cars.filter(
      (car) => car.isFinished && car.time != null && car.isDriving === "reached"
    );
    if (carsWithTimes.length > 0) {
      const winnerCar = carsWithTimes.reduce((prev, current) =>
        prev.time < current.time ? prev : current
      );
      setWinner(winnerCar);
    }
  }, [cars]);

  useEffect(() => {
    if (raceStatus === "ended" && winner) {
      handleWinner(winner, getGarage);
    }
  }, [raceStatus, winner]);

  async function handleSetEngine() {
    setRaceStatus("racing");
    const carPromises = cars
      .slice(indexOfFirstItem, indexOfLastItem)
      .map((car: CarData, index: number) =>
        updateCarEngine(
          "http://127.0.0.1:3000/engine",
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
    setShowWinner(true);
    setRaceStatus("ended");
  }

  function handleReset() {
    setRaceStatus("start");
    setShowWinner(false);
    const updatedCars = [...cars];

    if (updatedCars.length < 7) {
      for (let i = 0; i < updatedCars.length; i++) {
        updatedCars[i].isDriving = "initial";
        updatedCars[i].isFinished = false;
        updatedCars[i].time = 0;
      }
    } else
      for (let i = indexOfFirstItem; i < indexOfLastItem; i++) {
        updatedCars[i].isDriving = "initial";
        updatedCars[i].isFinished = false;
        updatedCars[i].time = 0;
      }
    setCars(updatedCars);
  }

  useEffect(() => {
    setShowWinner(false);
  }, [indexOfFirstItem]);

  return (
    <>
      {showWinner ? (
        <div className="winner-notice text-center border-1 bg-gray-800 z-10 rounded-lg p-10 text-white">
          <button
            className="absolute top-2 right-2"
            onClick={() => setShowWinner(false)}
          >
            ❌
          </button>
          <div className="flex flex-col gap-4">
            <div className="text-4xl">
              {winner ? "🏁We Have a Winner!🥇" : "No Winner This Time"}
            </div>
            {winner && (
              <div>
                <p className="text-3xl font-medium mb-2">{winner.name}</p>
                <p className="text-2xl font-bold">{winner.time.toFixed(2)} s</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

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
    </>
  );
}

export default RaceReset;
