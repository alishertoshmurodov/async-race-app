import "../../tailwind.css";
import "./header.css";

function Header({ setPage }: any) {
  return (
    <header className="flex flex-col justify-center items-center max-w-6xl mx-auto gap-y-5">
      <h1 className="text-3xl font-bold md:text-6xl text-center uppercase">
        Async <br /> Race
      </h1>

      <nav className="flex gap-3 flex-col sm:flex-row ">
        <button onClick={() => setPage("garage")} className="nav-button">
          Garage
        </button>
        <button onClick={() => setPage("winners")} className="nav-button">
          Winners
        </button>
      </nav>
    </header>
  );
}

export default Header;