import React from "react";
import Banner from "./Banner";
import TopSellers from "./TopSellers";
import Recommened from "./Recommened";
import News from "./News";
import BecomeSeller from "./BecomeSeller";

const Home = () => {
  return (
    <>
      <Banner />
      <TopSellers />
      <Recommened />
      <News />
      <BecomeSeller />
    </>
  );
};

export default Home;
