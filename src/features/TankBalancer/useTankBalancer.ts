import { useState, useRef, useCallback, useEffect } from "react";
import {
  DEFAULT_TANK_CAPACITY_IN_LITRE,
  DEFAULT_TANK_INCREMENT_IN_LITRE,
  DEFAULT_TANK_LEVEL_IN_LITRE,
  DEFAULT_TANK_RATE_IN_LITRE,
} from "./constants";
import { TankConfigData, TankData } from "./types";

export const createDefaultTank = (id: number) => {
  return {
    id,
    level: DEFAULT_TANK_LEVEL_IN_LITRE,
    tankCapacity: DEFAULT_TANK_CAPACITY_IN_LITRE,
    tankRate: DEFAULT_TANK_RATE_IN_LITRE,
    incrementAmount: DEFAULT_TANK_INCREMENT_IN_LITRE,
  };
};

const initialTanks: TankData[] = [createDefaultTank(1), createDefaultTank(2)];

const balanceTankLevels = (tanks: TankData[]) =>
  tanks.reduce((sum, tank) => sum + tank.level, 0) / tanks.length;

export const useTankBalancer = () => {
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

  return {
    tanks,
    tankLevelRef,
    onAdd,
    onEmpty,
    onSetConfig,
    onAddNewTank,
    onBalanceLevel,
  };
};
