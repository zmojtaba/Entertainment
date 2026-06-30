import React from "react";
import classes from "./style.module.scss";
import { ClipLoader, ScaleLoader } from "react-spinners";
import type { CSSProperties } from "@mui/material/styles";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};
type propsType = {
  loading: boolean;
};

function BarLoadingComponent(props: propsType) {
  const { loading } = props;
  if (!loading) return null;
  return (
    <div className={classes.container}>
      <ScaleLoader
        className={classes.lodingItem}
        color=" var(--imdb-color)"
        height={80}
        width={8}
        loading={true}
        // cssOverride={override}

        // aria-label="Loading Spinner"
        // data-testid=""
      />
    </div>
  );
}

export default BarLoadingComponent;
