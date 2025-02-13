import React from "react";
import { MagnifyingGlass } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <MagnifyingGlass
        visible={true}
        height="80"
        width="80"
        ariaLabel="magnifying-glass-loading"
        glassColor="#c0efff"
        color="#e15b64"
      />
    </div>
  );
};

export default Loader;
