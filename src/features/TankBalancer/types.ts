export type TankData = {
  id: number;
  level: number;
  tankCapacity: number;
  tankRate: number;
  incrementAmount: number;
};

export type TankConfigData = Pick<
  TankData,
  "tankCapacity" | "incrementAmount" | "tankRate"
>;
