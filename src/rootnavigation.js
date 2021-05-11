import * as React from "react";

export const navigationRef = React.createRef();

export const isReadyRef = React.createRef();

export function navigate(name, params) {
  console.log("navigation ref", navigationRef);
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    setTimeout(() => {
      navigationRef.current.navigate(name, params);
    }, 200);
  }
}
