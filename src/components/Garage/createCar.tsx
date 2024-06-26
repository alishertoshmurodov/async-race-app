import { ChangeEvent } from "react";
import { useStateContext } from "../../StateContext";

function CreateCar() {
  const { newCarData, setNewCarData } = useStateContext();
  const { cars, setCars } = useStateContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCarData({
      ...newCarData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreate = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("http://127.0.0.1:3000/garage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCarData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const newCars = [...cars];

        const newCar = {
          name: data.name,
          color: data.color,
          id: data.id,
          isDriving: "initial",
          isFinished: false,
          time: 0,
          wins: 0,
          best: 0,
        };

        newCars.push(newCar);

        setCars(newCars);

        setNewCarData({ name: "", color: "#000000" });
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  return (
    <div className="order-2 md:order-3">
      <form className="flex items-center gap-2" onSubmit={handleCreate}>
        <input
          type="text"
          name="name"
          value={newCarData.name}
          className="border p-2 rounded"
          placeholder="TYPE CAR BRAND"
          onChange={handleChange}
          required
        />
        <input
          type="color"
          name="color"
          value={newCarData.color}
          className="size-10 cursor-pointer"
          onChange={handleChange}
        />
        <button
          type="submit"
          className="button hover:bg-green-500 hover:text-white hover:!border-white transition bg-white text-green-700 !border-green-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateCar;
