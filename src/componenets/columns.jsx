import React from "react";

export const Columns = props => {
  return (
    <div className="columns">
      <ul>{props.listData}</ul>
    </div>
  );
};
