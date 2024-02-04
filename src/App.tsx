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

const initialTanks: TankData[] = [
  {
    id: 1,
    level: 0,
    tankCapacity: DEFAULT_TANK_CAPACITY_IN_LITRE,
    tankRate: DEFAULT_TANK_RATE_IN_LITRE,
    incrementAmount: DEFAULT_TANK_INCREMENT_IN_LITRE,
  },
  {
    id: 2,
    level: 0,
    tankCapacity: DEFAULT_TANK_CAPACITY_IN_LITRE,
    tankRate: DEFAULT_TANK_RATE_IN_LITRE,
    incrementAmount: DEFAULT_TANK_INCREMENT_IN_LITRE,
  },
  {
    id: 3,
    level: 0,
    tankCapacity: DEFAULT_TANK_CAPACITY_IN_LITRE,
    tankRate: DEFAULT_TANK_RATE_IN_LITRE,
    incrementAmount: DEFAULT_TANK_INCREMENT_IN_LITRE,
  },
  {
    id: 4,
    level: 0,
    tankCapacity: DEFAULT_TANK_CAPACITY_IN_LITRE,
    tankRate: DEFAULT_TANK_RATE_IN_LITRE,
    incrementAmount: DEFAULT_TANK_INCREMENT_IN_LITRE,
  },
];

const balanceTankLevels = (tanks: TankData[]) =>
  tanks.reduce((sum, tank) => sum + tank.level, 0) / tanks.length;

function App() {
  const [tanks, setTanks] = useState(initialTanks);
  const tankLevelRef = useRef<Record<number, HTMLDivElement | null>>({});

  const onBalanceLevel = () => {
    const balancedLevel = balanceTankLevels(tanks);
    setTanks((prev) => prev.map((tank) => ({ ...tank, level: balancedLevel })));
  };

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

  return (
    <>
      <h1>Tank level Balancer</h1>
      <ul className="tankContainer">
        {tanks.map((tank) => {
          const tankLevel = tank.level / tank.tankCapacity;
          return (
            <li key={tank.id}>
              <TankActions
                onAdd={() => onAdd(tank.id)}
                onEmpty={() => onEmpty(tank.id)}
              />
              <Tank
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
