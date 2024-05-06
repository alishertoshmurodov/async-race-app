import './winners.css';
import { useState } from 'react';
import IconCarComponent from '../Garage/iconCarComponent';
import { CarData } from '../../StateContext';
import PaginationNav from '../Garage/paginationNav';

interface WinnersProps {
  winnersData: CarData[];
}

function Winners({ winnersData }: WinnersProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPageCount = Math.ceil(winnersData.length / itemsPerPage);

  return (
    <section className="winners max-w-6xl mx-auto mt-10">
      {winnersData.length > 0 ? (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>№</th>
                <th>Car</th>
                <th>Name</th>
                <th>Wins</th>
                <th>Best Records (Seconds)</th>
              </tr>
            </thead>
            <tbody>
              {winnersData
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((winner: CarData) => (
                  <tr key={winner.id}>
                    <td>{winner.id}</td>
                    <td>
                      <IconCarComponent color={winner.color} />
                    </td>
                    <td>{winner.name}</td>
                    <td>{winner.wins}</td>
                    <td>{Number(winner.best).toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {winnersData.length > 10 && (
            <PaginationNav
              currentPage={currentPage}
              totalPageCount={totalPageCount}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      ) : (
        <div className="grid place-items-center h-60">
          <h2 className="text-3xl text-center text-gray-500 font-medium">
            No winners found
          </h2>
        </div>
      )}
    </section>
  );
}

export default Winners;
