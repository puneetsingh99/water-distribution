import React from "react";
import "./Tank.css";

type TankDimensions = {
  // all values in px
  height: number;
  width: number;
  borderRadius: number;
};

type TankProps = {
  id: number;
  level: number;
  capacityInLitre: number;
  dimensions: TankDimensions;
  onTransitionEnd: React.TransitionEventHandler<HTMLDivElement>;
};

const Tank = React.forwardRef<HTMLDivElement, TankProps>(
  ({ id, level = 0, capacityInLitre, dimensions, onTransitionEnd }, ref) => {
    const tankLevelHeight = Math.min(
      dimensions.height,
      dimensions.height * level
    );
    const tankLevel = Math.min(capacityInLitre, level * capacityInLitre);
    return (
      <>
        <div
          className="tank"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            borderRadius: dimensions.borderRadius,
          }}
        >
          <div
            ref={ref}
            className="tankLevel"
            style={{
              width: dimensions.width,
              height: tankLevelHeight,
              borderRadius: dimensions.borderRadius - 2, //decrementing by 2 to accommodate for the border radius of 2px in the parent div (tank)
            }}
            onTransitionEnd={onTransitionEnd}
          />
        </div>
        <h3 className="textLeft">
          Tank {id}: {tankLevel.toLocaleString()} L
        </h3>
      </>
    );
  }
);

export default Tank;
