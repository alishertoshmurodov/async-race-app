import "../../tailwind.css";
import "./garage.css";
import { useState } from "react";
import { useStateContext } from "../../StateContext";
import CreateCar from "./createCar";
import UpdateCar from "./updateCar";
import GenerateCars from "./generateCars";
import CarElement from "./carElement";
import RaceReset from "./raceReset";
import PaginationNav from "./paginationNav";

interface Car {
  name: string;
  color: string;
  id: number | null;
}

function Garage({ getGarage }: any) {
  const { cars, setCars } = useStateContext();
  const { currentPage, setCurrentPage } = useStateContext();

  const itemsPerPage = 7;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPageCount = Math.ceil(cars.length / itemsPerPage);

  const [selectedCar, setSelectedCar] = useState<Car>({
    name: "",
    color: "",
    id: null,
  });

  const handleDelete = async (id: number) => {
    try {
      // Define URLs for garage and winners
      const garageUrl = `http://127.0.0.1:3000/garage/${id}`;
      const winnersUrl = `http://127.0.0.1:3000/winners/${id}`;

      // Send DELETE requests to both URLs using Promise.allSettled
      const results = await Promise.allSettled([
        fetch(garageUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        fetch(winnersUrl, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }),
      ]);

      // Process results
      results.forEach((result: any, index) => {
        if (result.status === "fulfilled" && result.value.ok) {
          console.log(
            `Deletion successful for ${index === 0 ? "garage" : "winners"}`
          );
        } else if (result.status === "rejected" || !result.value.ok) {
          console.error(
            `Deletion failed for ${index === 0 ? "garage" : "winners"}`,
            result.reason || result.value.statusText
          );
        }
      });

      const newCars = [...cars].filter((car) => car.id !== id);
      setCars(newCars);
    } catch (error) {
      console.error("Error handling delete operation:", error);
    }
  };

  const handleSelect = (car: Car) => {
    selectedCar === car
      ? setSelectedCar({ name: "", color: "#000000", id: null })
      : setSelectedCar(car);
  };

  const garageItemEls = cars
    ? cars.map((car: any) => {
        return (
          <li key={car.id}>
            <CarElement
              car={car}
              selectedCar={selectedCar}
              handleSelect={handleSelect}
              handleDelete={handleDelete}
            />
          </li>
        );
      })
    : [];

  return (
    <section className="garage max-w-6xl mx-auto">
      <div className="grid grid-cols-1 grid-rows-4 justify-items-center lg:justify-items-end md:grid-rows-2 lg:grid-rows-1 md:grid-cols-2 lg:grid-cols-4 items-center  mt-10 gap-3">
        <RaceReset
          indexOfFirstItem={indexOfFirstItem}
          indexOfLastItem={indexOfLastItem}
          getGarage={getGarage}
        />
        <CreateCar />
        <UpdateCar selectedCar={selectedCar} setSelectedCar={setSelectedCar} />
        <GenerateCars getGarage={getGarage} />
      </div>
      <div className="garage-list mt-4">
        <ul className="garage_list flex flex-col gap-5 border-r-4 border-gray-700 relative">
          {indexOfFirstItem < garageItemEls.length
            ? garageItemEls.slice(indexOfFirstItem, indexOfLastItem)
            : []}
        </ul>
      </div>
      <div className="flex items-center justify-between px-4 my-4">
        <div className="text-2xl font-bold uppercase tracking-widest">
          Garage({garageItemEls.length})
        </div>
        {totalPageCount > 1 ? (
          <PaginationNav
            currentPage={currentPage}
            totalPageCount={totalPageCount}
            setCurrentPage={setCurrentPage}
          />
        ) : null}
      </div>
    </section>
  );
}

export default Garage;
