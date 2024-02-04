import React, { useEffect, useRef, useState } from "react";
import {
  DEFAULT_TANK_CAPACITY_IN_LITRE,
  DEFAULT_TANK_INCREMENT_IN_LITRE,
  DEFAULT_TANK_RATE_IN_LITRE,
  MAX_TANK_CAPACITY_IN_LITRE,
  MAX_TANK_RATE_IN_LITRE,
  MIN_TANK_CAPACITY_IN_LITRE,
  MIN_TANK_RATE_IN_LITRE,
} from "../constants";
import { TankConfigData } from "../types";

type TankConfigProps = {
  onSetConfig: (config: TankConfigData) => void;
};

const defaultTankConfig: TankConfigData = {
  tankCapacity: DEFAULT_TANK_CAPACITY_IN_LITRE,
  tankRate: DEFAULT_TANK_RATE_IN_LITRE,
  incrementAmount: DEFAULT_TANK_INCREMENT_IN_LITRE,
};
const useTankConfig = (
  onTankConfigUpdate: (config: TankConfigData) => void
) => {
  const [tankConfig, setTankConfig] =
    useState<TankConfigData>(defaultTankConfig);
  const onTankConfigUpdateRef = useRef(onTankConfigUpdate);

  const updateTankConfig = <K extends keyof TankConfigData>(
    key: K,
    value: TankConfigData[K]
  ) => {
    setTankConfig((prev) => ({ ...prev, [key]: value }));
  };

  const onTankCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTankConfig("tankCapacity", e.target.valueAsNumber);
  };
  const onTankRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTankConfig("tankRate", e.target.valueAsNumber);
  };
  const onIncrementAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTankConfig("incrementAmount", e.target.valueAsNumber);
  };

  useEffect(() => {
    onTankConfigUpdateRef.current = onTankConfigUpdate;
  }, [onTankConfigUpdate]);

  useEffect(() => {
    onTankConfigUpdateRef.current?.(tankConfig);
  }, [tankConfig]);

  return {
    tankConfig,
    onTankCapacityChange,
    onTankRateChange,
    onIncrementAmountChange,
  };
};

const RANGE_SLIDER_STEP = 5;
const TankConfig: React.FunctionComponent<TankConfigProps> = ({
  onSetConfig,
}) => {
  const {
    tankConfig: { tankCapacity, tankRate, incrementAmount },
    onIncrementAmountChange,
    onTankCapacityChange,
    onTankRateChange,
  } = useTankConfig(onSetConfig);
  return (
    <section className="tankConfigContainer">
      <p>
        <i>values in litre*</i>
      </p>
      <div className="mb-1">
        <label className="textStart" htmlFor="tankCapacity">
          Tank capacity: {tankCapacity} L
        </label>
        <input
          className="blockElement"
          type="range"
          name="tankCapacity"
          id="tankCapacity"
          value={tankCapacity}
          onChange={onTankCapacityChange}
          min={MIN_TANK_CAPACITY_IN_LITRE}
          max={MAX_TANK_CAPACITY_IN_LITRE}
          step={RANGE_SLIDER_STEP}
        />
      </div>

      <div className="mb-1">
        <label className="textStart" htmlFor="tankRate">
          Tank fill/empty rate: {tankRate} l/sec
        </label>
        <input
          className="blockElement"
          type="range"
          name="tankRate"
          id="tankRate"
          value={tankRate}
          onChange={onTankRateChange}
          min={MIN_TANK_RATE_IN_LITRE}
          max={MAX_TANK_RATE_IN_LITRE}
          step={RANGE_SLIDER_STEP}
        />
      </div>

      <div className="mb-1">
        <label className="textStart" htmlFor="incrementAmount">
          Increment level by: {incrementAmount} L
        </label>
        <input
          className="blockElement"
          type="range"
          name="incrementAmount"
          id="incrementAmount"
          value={incrementAmount}
          onChange={onIncrementAmountChange}
          min={MIN_TANK_CAPACITY_IN_LITRE}
          max={MAX_TANK_CAPACITY_IN_LITRE}
          step={RANGE_SLIDER_STEP}
        />
      </div>
    </section>
  );
};

export default TankConfig;
