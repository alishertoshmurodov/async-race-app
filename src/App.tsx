import { useEffect, useState } from "react";
import Garage from "./components/Garage/garage";
import Header from "./components/Header/header";
import Winners from "./components/Winners/winners";
import "./tailwind.css";
import "./App.css";

interface CarsData {
  name: string;
  color: string;
  id: number;
  isDriving: string;
  isFinished: boolean;
  time: number;
}

interface WinnerData {
  name: string;
  color: string;
  id: number;
  wins: number;
  time: number;
}

function App() {
  const [garageData, setGarageData] = useState<CarsData[] | null>(null);
  const [winnersData, setWinnersData] = useState<WinnerData[] | null>(null);
  const [page, setPage] = useState("garage");

  const getGarageData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/garage");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      const carsData = jsonData.map((car: any) => {
        const carData = {
          name: car.name,
          color: car.color,
          id: car.id,
          isDriving: "initial",
          isFinished: false,
          time: 0,
        };
        return carData;
      });
      setGarageData(carsData);
      return carsData;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getWinnersData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/winners");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const winnersData = await response.json();
      const garageData = await getGarageData();

      const combinedData = garageData
        .filter((car: CarsData) =>
          winnersData.some((winner: WinnerData) => winner.id === car.id)
        )
        .map((car: CarsData) => {
          const winner = winnersData.find(
            (winner: WinnerData) => winner.id === car.id
          );
          return {
            ...car,
            wins: winner ? winner.wins : 0,
            time: winner ? winner.time : 0,
          };
        });

      setWinnersData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGarageData();
    getWinnersData();
  }, []);

  return (
    <div className="App">
      <Header setPage={setPage} page={page} />
      <main className="px-4">
        {page === "garage"
          ? garageData && (
              <Garage
                garage={garageData}
                getGarage={getGarageData}
                getWinnersData={getWinnersData}
              />
            )
          : winnersData && <Winners winnersData={winnersData} />}
      </main>
    </div>
  );
}

export default App;
