import { useState } from "react";
import IconCarComponent from "./iconCarComponent";

async function setEngine(
  url: string,
  id: number,
  status: string,
  setTime: any,
  isDriving: any,
  setIsDriving: any,
  setFinished: any,
  handleReset: any
) {
  try {
    const patchUrl = `${url}?id=${id}&status=${status}`;
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

    if (status === "started") {
      setTime(result.distance / result.velocity);
      setIsDriving("driving");
    }

    if (isDriving === "reached") {
      setIsDriving("initial");
    }
    if (status === "drive") {
      setIsDriving("reached");
      setFinished(true);
    }

    return response;
  } catch (error) {
    if (status === "drive") {
      setIsDriving("reached");
      setFinished(true);
    }

    console.error("Error patching data:", error);
    throw error; // Rethrow the error for handling at higher levels
  }
}

function CarElement({ car, selectedCar, handleSelect, handleDelete }: any) {
  const [isDriving, setIsDriving] = useState("initial");
  const [time, setTime] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleReset = () => {
    setIsDriving("initial");
    setFinished(false);
    setTime(0);
  };

  async function handleSetEngine(status: string) {
    try {
      await setEngine(
        "http://localhost:3000/engine",
        car.id,
        status,
        setTime,
        isDriving,
        setIsDriving,
        setFinished,
        handleReset
      );

      await setEngine(
        "http://localhost:3000/engine",
        car.id,
        "drive",
        setTime,
        isDriving,
        setIsDriving,
        setFinished,
        handleReset
      );
      console.log("Data patched successfully");
      console.log(time);
      // Optionally, reset form fields or update state upon successful patching
    } catch (error) {
      console.error("Error patching data:", error);
      // Optionally, display an error message to the user
    }
  }

  const getClassName = () => {
    if (isDriving === "initial") {
      return "";
    } else if (isDriving === "driving") {
      return "car-animation";
    } else {
      return "car-animation paused";
    }
  };

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
          onClick={() => handleSetEngine("started")}
          disabled={isDriving === "driving" || finished}
          className={`button text-sm !py-1 !px-2 font-medium order-2  hover:!bg-amber-500 hover:text-white transition ease-in-out ${
            isDriving === "driving" || finished ? "bg-amber-500 text-white" : ""
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
          className={`${getClassName()} car-icon`}
          style={{
            animationDuration: `${String(time)}ms`,
            left:
              finished && isDriving !== "initial"
                ? "calc(100% - 120px)"
                : "unset",
          }}
        >
          <IconCarComponent color={car.color} />
        </div>
      </div>
    </div>
  );
}

export default CarElement;
