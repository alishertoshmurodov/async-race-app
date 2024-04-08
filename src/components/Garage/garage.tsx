import "../../tailwind.css";
import "./garage.css";
import { ReactComponent as IconPlay } from "../../assets/icon-play.svg";
import { ReactComponent as IconReset } from "../../assets/icon-reset.svg";
import IconCarComponent from "./iconCarComponent";
import { useState } from "react";
import CreateCar from "./createCar";
import UpdateCar from "./updateCar";
import GenerateCars from "./generateCars";

const RaceReset = () => {
  return (
    <div className="flex gap-3 order-1 md:order-3">
      <button className="button">
        <span>Race</span>
        <IconPlay />
      </button>
      <button className="button">
        <span>Reset</span>
        <IconReset />
      </button>
    </div>
  );
};

function Garage({ garage, getGarage }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPageCount = Math.ceil(garage.length / itemsPerPage);

  const [deleteResult, setDeleteResult] = useState(null);
  const [selectedCar, setSelectedCar] = useState(false);

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

  const handleSelect = (id: any) =>
    selectedCar === id ? setSelectedCar(false) : setSelectedCar(id);

  const garageItemEls = garage.map((item: any) => {
    return (
      <li key={item.id}>
        <div className="flex">
          <div className="grid grid-cols-2 gap-x gap-y-2 w-auto py-4 justify-items-center">
            <button
              className={`button text-sm !py-1 !px-2 font-medium order-1 transition duration-300 ease-in-out ${
                selectedCar === item.id ? "bg-gray-900 text-white" : ""
              }`}
              onClick={() => handleSelect(item.id)}
            >
              Select
            </button>
            <button
              className="button text-sm !py-1 !px-2 font-medium order-3"
              onClick={() => handleDelete(item.id)}
            >
              Remove
            </button>
            <button className="button text-sm !py-1 !px-2 font-medium order-2">
              A
            </button>
            <button className="button text-sm !py-1 !px-2 font-medium order-4">
              B
            </button>
          </div>
          <div className="flex w-full border-y-2 border-gray-700 items-center justify-start relative">
            <div className="absolute top-2 right-2">
              <h2 className="text-2xl">{item.name}</h2>
            </div>
            <IconCarComponent color={item.color} />
          </div>
        </div>
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
      <div className="my-3 max-w-6xl mx-auto flex gap-x-4 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="text-xl hover:bg-gray-800 hover:text-white hover:border-white py-1 px-3 rounded-md border"
        >
          Prev
        </button>
        <span className="text-xl border text-white bg-gray-800 size-10 aspect-square grid place-items-center rounded-md ">
          {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="text-xl hover:bg-gray-800 hover:text-white hover:border-white py-1 px-3 rounded-md border"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <section className="garage">
      <div className="grid grid-cols-1 grid-rows-4 md:grid-rows-2 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto items-center  mt-10 justify-items-center gap-3">
        <RaceReset />
        <CreateCar getGarage={getGarage} />
        <UpdateCar
          selectedCar={selectedCar}
          setSelectedCar={setSelectedCar}
          getGarage={getGarage}
        />
        <GenerateCars getGarage={getGarage} />
      </div>
      <div className="garage-list max-w-6xl mx-auto">
        <ul className="flex flex-col gap-5">
          {garageItemEls.slice(indexOfFirstItem, indexOfLastItem)}
        </ul>
      </div>
      {totalPageCount > 1 ? <PaginationNav /> : null}
    </section>
  );
}

export default Garage;
