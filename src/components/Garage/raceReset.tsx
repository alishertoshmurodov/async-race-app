import { ReactComponent as IconPlay } from "../../assets/icon-play.svg";
import { ReactComponent as IconReset } from "../../assets/icon-reset.svg";

function RaceReset({ cars, indexOfLastItem, indexOfFirstItem, setCars }: any) {
  return (
    <div className="flex gap-3 order-1 md:order-3">
      <button className="button bg-green-500 text-gray-50 !border-green-500 hover:!border-white hover:bg-green-400 hover:text-white transition">
        <span>Race</span>
        <IconPlay />
      </button>
      <button className="button bg-violet-500 text-gray-50 !border-violet-500 hover:!border-white hover:bg-violet-400 hover:text-white transition">
        <span>Reset</span>
        <IconReset />
      </button>
    </div>
  );
}

export default RaceReset;
