import React from "react";

type TankActionsProps = {
  onAdd: () => void;
  onEmpty: () => void;
};

const TankActions: React.FunctionComponent<TankActionsProps> = ({
  onAdd,
  onEmpty,
}) => {
  return (
    <div className="btnContainer mb-1">
      <button onClick={onAdd} className="btnPrimary mb-1 fullWidth">
        Add
      </button>
      <button onClick={onEmpty} className="btnSecondary fullWidth">
        Empty
      </button>
    </div>
  );
};

export default TankActions;
