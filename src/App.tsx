import { useEffect, useState } from "react";
import Garage from "./components/Garage/garage";
import Header from "./components/Header/header";
import Winners from "./components/Winners/winners";
import "./tailwind.css";
import "./App.css";

interface CarData {
  name: string;
  color: string;
  id: number;
}

function App() {
  const [garageData, setGarageData] = useState<CarData[] | null>(null);
  const [page, setPage] = useState("garage");

  const getGarageData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/garage");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setGarageData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGarageData();
  }, []);

  return (
    <div className="App">
      <Header setPage={setPage} />
      <main>
        {page === "garage" ? (
          garageData && <Garage garage={garageData} getGarage={getGarageData} />
        ) : (
          <Winners />
        )}
      </main>
    </div>
  );
}

export default App;
