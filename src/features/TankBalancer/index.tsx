import Tank from "./components/Tank";
import TankActions from "./components/TankActions";
import TankConfig from "./components/TankConfig";
import { BORDER_RADIUS, TANK_HEIGHT, TANK_WIDTH } from "./constants";
import { useTankBalancer } from "./useTankBalancer";

const TankBalancer = () => {
  const {
    tanks,
    tankLevelRef,
    onAddNewTank,
    onAdd,
    onEmpty,
    onSetConfig,
    onBalanceLevel,
  } = useTankBalancer();
  return (
    <main>
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
    </main>
  );
};

export default TankBalancer;
