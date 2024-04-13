import "../../tailwind.css";
import "./garage.css";
import { useState } from "react";
import CreateCar from "./createCar";
import UpdateCar from "./updateCar";
import GenerateCars from "./generateCars";
import CarElement from "./carElement";
import RaceReset from "./raceReset";

interface Car {
  name: string;
  color: string;
  id: number | null;
}

function Garage({ garage, getGarage, getWinnersData }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPageCount = Math.ceil(garage.length / itemsPerPage);

  const [deleteResult, setDeleteResult] = useState(null);
  const [selectedCar, setSelectedCar] = useState<Car>({
    name: "",
    color: "",
    id: null,
  });

  const handleDelete = async (id: any) => {
    try {
      const response = await fetch(`http://127.0.0.1:3000/garage/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        // Add any request body if required for DELETE request
        // body: JSON.stringify({ /* your request body */ }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      const data = await response.json();
      setDeleteResult(data); // Update state with response data
      console.log(deleteResult);
      getGarage();
    } catch (error) {
      console.error("Error deleting resource:", error);
      // Handle error
    }
  };

  const handleSelect = (car: Car) => {
    selectedCar === car
      ? setSelectedCar({ name: "", color: "#000000", id: null })
      : setSelectedCar(car);
  };

  const garageItemEls = garage.map((item: any) => {
    return (
      <li key={item.id}>
        <CarElement
          item={item}
          garage={garage}
          selectedCar={selectedCar}
          handleSelect={handleSelect}
          handleDelete={handleDelete}
        />
      </li>
    );
  });

  const handlePageChange = (page: any) => {
    if (page > 0 && page <= totalPageCount) {
      setCurrentPage(page);
    }
  };

  const PaginationNav = () => {
    return (
      <div className="flex gap-x-4 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`text-xl py-1 px-3 rounded-md border transition ${
            currentPage > 1
              ? "hover:bg-gray-800 hover:text-white hover:border-white"
              : "cursor-default opacity-50"
          }`}
        >
          Prev
        </button>
        <span className="text-xl border text-white bg-gray-800 size-10 aspect-square grid place-items-center rounded-md ">
          {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`text-xl py-1 px-3 rounded-md border transition ${
            currentPage < totalPageCount
              ? "hover:bg-gray-800 hover:text-white hover:border-white"
              : "cursor-default opacity-50"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <section className="garage max-w-6xl mx-auto">
      <div className="grid grid-cols-1 grid-rows-4 justify-items-center lg:justify-items-end md:grid-rows-2 lg:grid-rows-1 md:grid-cols-2 lg:grid-cols-4 items-center  mt-10 gap-3">
        <RaceReset garage={garage} />
        <CreateCar getGarage={getGarage} />
        <UpdateCar
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          getGarage={getGarage}
          getWinnersData={getWinnersData}
        />
        <GenerateCars getGarage={getGarage} />
      </div>
      <div className="garage-list mt-4">
        <ul className="garage_list flex flex-col gap-5 border-r-4 border-gray-700 relative">
          {garageItemEls.slice(indexOfFirstItem, indexOfLastItem)}
        </ul>
      </div>
      <div className="flex items-center justify-between px-4 my-4">
        <div className="text-2xl font-bold uppercase tracking-widest">
          Garage({garageItemEls.length})
        </div>
        {totalPageCount > 1 ? <PaginationNav /> : null}
      </div>
    </section>
  );
}

export default Garage;
