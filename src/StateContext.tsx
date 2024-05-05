import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

export interface CarData {
  name: string;
  color: string;
  id: number;
  isDriving: string;
  isFinished: boolean;
  time: number;
  wins: number;
  best: number;
}

interface StateContextType {
  currentPage: number;
  setCurrentPage: (newState: number) => void;
  newCarData: NewCarData;
  setNewCarData: (newState: NewCarData) => void;
  cars: CarData[] | [];
  setCars: (newState: CarData[]) => void;
}

interface NewCarData {
  name: string;
  color: string;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cars, setCars] = useState<CarData[] | []>([]);

  const [currentPage, setCurrentPage] = useState<number>(
    Number(localStorage.getItem("currentPage") || 1)
  );
  const [newCarData, setNewCarData] = useState<NewCarData>({
    name: "",
    color: "#000000",
  });

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  return (
    <StateContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        newCarData,
        setNewCarData,
        cars,
        setCars,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export function useStateContext() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
}
