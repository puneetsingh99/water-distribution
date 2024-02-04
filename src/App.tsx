import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Tank from "./components/Tank/Tank";
import TankActions from "./components/Tank/TankActions";
import {
  BORDER_RADIUS,
  DEFAULT_TANK_CAPACITY_IN_LITRE,
  TANK_HEIGHT,
  DEFAULT_TANK_RATE_IN_LITRE,
  TANK_WIDTH,
  DEFAULT_TANK_INCREMENT_IN_LITRE,
} from "./components/Tank/constants";
import TankConfig, { TankConfigData } from "./components/Tank/TankConfig";

export type TankData = {
  id: number;
  level: number;
  tankCapacity: number;
  tankRate: number;
  incrementAmount: number;
};

const createDefaultTank = (id: number) => {
  return {
    id,
    level: 0,
    tankCapacity: DEFAULT_TANK_CAPACITY_IN_LITRE,
    tankRate: DEFAULT_TANK_RATE_IN_LITRE,
    incrementAmount: DEFAULT_TANK_INCREMENT_IN_LITRE,
  };
};

const initialTanks: TankData[] = [createDefaultTank(1), createDefaultTank(2)];

const balanceTankLevels = (tanks: TankData[]) =>
  tanks.reduce((sum, tank) => sum + tank.level, 0) / tanks.length;

function App() {
  const [tanks, setTanks] = useState(initialTanks);
  const tankLevelRef = useRef<Record<number, HTMLDivElement | null>>({});

  const onBalanceLevel = useCallback(() => {
    setTanks((prevTanks) =>
      prevTanks.map((tank) => ({
        ...tank,
        level: balanceTankLevels(prevTanks),
      }))
    );
  }, []);

  const onAdd = (id: number) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === id
          ? {
              ...tank,
              level: Math.min(
                tank.tankCapacity,
                tank.level + tank.incrementAmount
              ),
            }
          : tank
      )
    );
  };

  const onEmpty = (id: number) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === id
          ? {
              ...tank,
              level: 0,
            }
          : tank
      )
    );
  };

  const onSetConfig = ({
    id,
    incrementAmount,
    tankCapacity,
    tankRate,
  }: { id: number } & TankConfigData) => {
    setTanks((prev) =>
      prev.map((tank) =>
        tank.id === id
          ? { ...tank, incrementAmount, tankCapacity, tankRate }
          : tank
      )
    );
  };

  const onAddNewTank = () => {
    setTanks((prev) => [...prev, createDefaultTank(tanks.length + 1)]);
  };

  const onSetTransition = useCallback(
    (id: number) => {
      const ref = tankLevelRef.current?.[id];
      const tank = tanks.find((tank) => tank.id === id);
      if (ref && tank) {
        const duration = tank.incrementAmount / tank.tankRate;
        ref.style.transition = `height ${duration}s ease`;
      }
    },
    [tanks]
  );

  useEffect(() => {
    if (tankLevelRef.current) {
      Object.keys(tankLevelRef.current).forEach((tankId) =>
        onSetTransition(Number(tankId))
      );
    }
  }, [onSetTransition, tanks]);

  useEffect(() => {
    onBalanceLevel();
  }, [onBalanceLevel, tanks.length]);

  return (
    <>
      <h1>Tank level Balancer</h1>
      <button onClick={onAddNewTank}>Add new tank</button>
      <ul className="tankContainer">
        {tanks.map((tank) => {
          const tankLevel = tank.level / tank.tankCapacity;
          return (
            <li key={tank.id} className="mb-2">
              <TankActions
                onAdd={() => onAdd(tank.id)}
                onEmpty={() => onEmpty(tank.id)}
              />
              <Tank
                id={tank.id}
                ref={(element) => (tankLevelRef.current[tank.id] = element)}
                level={tankLevel}
                capacityInLitre={tank.tankCapacity}
                dimensions={{
                  height: TANK_HEIGHT,
                  width: TANK_WIDTH,
                  borderRadius: BORDER_RADIUS,
                }}
                onTransitionEnd={onBalanceLevel}
              />
              <TankConfig
                onSetConfig={(config) =>
                  onSetConfig({ id: tank.id, ...config })
                }
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
