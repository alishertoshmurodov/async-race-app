import { useState } from "react";

const UpdateCar = ({ selectedCar, setSelectedCar, getGarage }: any) => {
  interface Data {
    name: string;
    color: string;
  }

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
      getGarage();
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
          className={`button ease-in-out duration-700 transition-all ${
            selectedCar.id ? "" : "opacity-50"
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
