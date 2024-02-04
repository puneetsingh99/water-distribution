import { useEffect, useRef, useState } from "react";
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
import TankConfig from "./components/Tank/TankConfig";

type TankData = {
  id: number;
  level: number;
};

const initialTanks: TankData[] = [
  {
    id: 1,
    level: 0,
  },
  {
    id: 2,
    level: 0,
  },
  {
    id: 3,
    level: 0,
  },
  {
    id: 4,
    level: 0,
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
                DEFAULT_TANK_CAPACITY_IN_LITRE,
                tank.level + DEFAULT_TANK_INCREMENT_IN_LITRE
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

  const onSetTransition = (id: number) => {
    const ref = tankLevelRef.current?.[id];
    if (ref) {
      const duration =
        DEFAULT_TANK_INCREMENT_IN_LITRE / DEFAULT_TANK_RATE_IN_LITRE;
      ref.style.transition = `height ${duration}s ease`;
    }
  };

  useEffect(() => {
    if (tankLevelRef.current) {
      Object.keys(tankLevelRef.current).forEach((tankId) =>
        onSetTransition(Number(tankId))
      );
    }
  }, [tanks]);

  return (
    <>
      <h1>Tank level Balancer</h1>
      <ul className="tankContainer">
        {tanks.map((tank) => {
          const tankLevel = tank.level / DEFAULT_TANK_CAPACITY_IN_LITRE;
          return (
            <li key={tank.id}>
              <TankActions
                onAdd={() => onAdd(tank.id)}
                onEmpty={() => onEmpty(tank.id)}
              />
              <Tank
                ref={(element) => (tankLevelRef.current[tank.id] = element)}
                level={tankLevel}
                capacityInLitre={DEFAULT_TANK_CAPACITY_IN_LITRE}
                dimensions={{
                  height: TANK_HEIGHT,
                  width: TANK_WIDTH,
                  borderRadius: BORDER_RADIUS,
                }}
                onTransitionEnd={onBalanceLevel}
              />
              <TankConfig
                onSetConfig={(params) => {
                  console.log("ON SET CONFIG ", params);
                }}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
