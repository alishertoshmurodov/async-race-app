import { useState } from "react";
import { useStateContext } from "../../StateContext";

interface Data {
  name: string;
  color: string;
}

const UpdateCar = ({ selectedCar, setSelectedCar, getGarage }: any) => {
  const { cars, setCars } = useStateContext();

  const [updateCarData, setUpdateCarData] = useState(null);
  const [carData, setCarData] = useState<Data>({
    name: selectedCar.name,
    color: selectedCar.color,
  });

  const handleUpdateCar = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://127.0.0.1:3000/garage/${selectedCar.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          body: JSON.stringify(carData), // Add the data to be updated
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update resource");
      }

      const data = await response.json();
      setUpdateCarData(data); // Update state with response data

      const newCars = [...cars].map((car) => {
        if (car.id === selectedCar.id) {
          return {
            ...car,
            name: carData.name,
            color: carData.color,
          };
        } else {
          return car;
        }
      });

      setCars(newCars);

      setCarData({ name: "", color: "#000000" });
      setSelectedCar({ name: "", color: "#000000", id: null });
      console.log(updateCarData);
    } catch (error) {
      console.error("Error updating resource:", error);
      // Handle error
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
          defaultValue={"#000000"}
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
};

export default UpdateCar;
