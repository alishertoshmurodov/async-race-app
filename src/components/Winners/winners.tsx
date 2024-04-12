import "./winners.css";
import IconCarComponent from "../Garage/iconCarComponent";

function Winners({ winnersData }: any) {
  interface Winner {
    id: number;
    name: string;
    color: string;
    wins: number;
    time: number;
  }

  return (
    <section className="winners max-w-6xl mx-auto mt-10">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>№</th>
            <th>Car</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best Records</th>
          </tr>
        </thead>
        <tbody>
          {winnersData.map((winner: Winner) => {
            return (
              <tr key={winner.id}>
                <td>{winner.id}</td>
                <td>
                  <IconCarComponent color={winner.color} />
                </td>
                <td>{winner.name}</td>
                <td>{winner.wins}</td>
                <td>{winner.time}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default Winners;
