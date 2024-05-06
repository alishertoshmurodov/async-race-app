import "./winners.css";
import { useState } from "react";
import IconCarComponent from "../Garage/iconCarComponent";
import { CarData } from "../../StateContext";
import PaginationNav from "../Garage/paginationNav";

interface WinnersProps {
  winnersData: CarData[];
}

function Winners({ winnersData }: WinnersProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState<"wins" | "best">("wins");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPageCount = Math.ceil(winnersData.length / itemsPerPage);

  const sortedData = [...winnersData].sort((a, b) => {
    if (sortCriteria === "wins") {
      return sortOrder === "asc" ? a.wins - b.wins : b.wins - a.wins;
    } else {
      return sortOrder === "asc" ? a.best - b.best : b.best - a.best;
    }
  });

  return (
    <section className="winners max-w-6xl mx-auto mt-10">
      {winnersData.length > 0 ? (
        <>
          <div className="flex gap-3 items-center mb-2">
            <div>
              <span>Sort by:</span>
              <select
                value={sortCriteria}
                onChange={(e) =>
                  setSortCriteria(e.target.value as "wins" | "best")
                }
              >
                <option value="wins">Wins</option>
                <option value="best">Best Time</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                className={`border rounded-sm border-gray-700 p-1 ${sortOrder === "asc" ? "bg-gray-500 text-white" : ""}`}
                onClick={() => setSortOrder("asc")}
              >
                asc
              </button>
              <button
                className={`border rounded-sm border-gray-700 p-1 ${sortOrder === "desc" ? "bg-gray-500 text-white" : ""} `}
                onClick={() => setSortOrder("desc")}
              >
                desc
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th>№</th>
                <th>Car</th>
                <th>Name</th>
                <th onClick={() => setSortCriteria("wins")}>Wins</th>
                <th onClick={() => setSortCriteria("best")}>
                  Best Records (Seconds)
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData
                .slice(indexOfFirstItem, indexOfLastItem)
                .map((winner: CarData, index: number) => (
                  <tr key={winner.id}>
                    <td>{indexOfFirstItem + index + 1}</td>
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
