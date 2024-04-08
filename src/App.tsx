import { useEffect, useState } from "react";
import "./App.css";
import Garage from "./components/Garage/garage";
import Header from "./components/Header/header";
import "./tailwind.css";

interface GarageData {
  name: string;
  color: string;
  id: number;
}

function App() {
  const [garage, setGarage] = useState<GarageData[] | null>(null);

  const getGarage = async () => {
    try {
      const response = await fetch("http://127.0.0.1:3000/garage");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setGarage(jsonData);
      console.log(garage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getGarage();
  }, []);

  console.log(garage?.length);

  return (
    <div className="App">
      <Header />
      <main>{garage && <Garage garage={garage} getGarage={getGarage} />}</main>
    </div>
  );
}

export default App;
