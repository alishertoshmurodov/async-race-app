import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import Garage from './components/Garage/garage';
import Header from './components/Header/header';
import Winners from './components/Winners/winners';
import './tailwind.css';
import './App.css';
import { useStateContext, CarData } from './StateContext';

function App() {
  const { cars, setCars } = useStateContext();
  const winners = cars?.filter((car) => car.wins && car.wins > 0);

  const fetchData = async () => {
    const garageUrl = 'http://127.0.0.1:3000/garage';
    const winnersUrl = 'http://127.0.0.1:3000/winners';

    try {
      const [garageResponse, winnersResponse] = await Promise.all([
        fetch(garageUrl),
        fetch(winnersUrl),
      ]);

      if (!garageResponse.ok || !winnersResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [garageData, winnersData] = await Promise.all([
        garageResponse.json(),
        winnersResponse.json(),
      ]);

      const combinedData = garageData.map((car: CarData) => {
        const winner = winnersData.find((w: CarData) => w.id === car.id);
        return {
          name: car.name,
          color: car.color,
          id: car.id,
          isDriving: 'initial',
          isFinished: false,
          time: winner ? winner.time : 0,
          wins: winner ? winner.wins : 0,
          best: winner ? winner.time : 0,
        };
      });

      setCars(combinedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="px-4">
          <Routes>
            <Route
              path="/winners"
              element={
                cars && cars.length > 0 && <Winners winnersData={winners} />
              }
            />
            <Route
              path="/"
              element={
                cars && cars.length > 0 && <Garage getGarage={fetchData} />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
