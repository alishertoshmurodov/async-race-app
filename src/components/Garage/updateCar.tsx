import { useState } from "react";
import { useStateContext } from "../../StateContext";
import { Car } from "./garage";

interface Data {
  name: string;
  color: string;
}

interface UpdateCarProps {
  selectedCar: Car;
  setSelectedCar: (car: Car) => void;
}

function UpdateCar({ selectedCar, setSelectedCar }: UpdateCarProps) {
  const { cars, setCars } = useStateContext();

  const [carData, setCarData] = useState<Data>({
    name: selectedCar.name,
    color: selectedCar.color,
  });

  const handleUpdateCar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:3000/garage/${selectedCar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update resource");
      }

      const data = await response.json();

      const newCars = [...cars].map((car) => {
        if (car.id === selectedCar.id) {
          return {
            ...car,
            name: data.name,
            color: data.color,
          };
        }
        return car;
      });

      setCars(newCars);

      setCarData({ name: "", color: "#000000" });
      setSelectedCar({ name: "", color: "#000000", id: null });
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  return (
    <div className="md:order-2 order-3">
      <form onSubmit={handleUpdateCar} className="flex items-center gap-2">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="TYPE CAR BRAND"
          name="name"
          value={carData.name}
          onChange={(e) => setCarData({ ...carData, name: e.target.value })}
          required
        />
        <input
          type="color"
          name="color"
          className="size-10 cursor-pointer"
          defaultValue="#000000"
          onChange={(e) => setCarData({ ...carData, color: e.target.value })}
        />
        <button
          type="submit"
          className={`button ease-in-out transition !border-blue-700 text-blue-700  ${
            selectedCar.id
              ? "hover:text-white hover:bg-blue-500 hover:!border-white"
              : "opacity-50"
          }`}
          disabled={!selectedCar.id}
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateCar;
