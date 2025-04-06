import { useState } from "react";
import {
  FullpageContainer,
  FullpageSection,
} from "@shinyongjun/react-fullpage";
import "@shinyongjun/react-fullpage/css";

import LandingHeader from "../landing/LandingHeader";

import First from "../landing/First";
import Second from "../landing/Second";
import Third from "../landing/Third";
import Fourth from "../landing/Fourth";
import Fifth from "../landing/Fifth";
import Sixth from "../landing/Sixth";

const LandingPage = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <>
      <LandingHeader />
      <FullpageContainer
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      >
        <FullpageSection>
          <First />
        </FullpageSection>
        <FullpageSection>
          <Second />
        </FullpageSection>
        <FullpageSection>
          <Third />
        </FullpageSection>
        <FullpageSection>
          <Fourth />
        </FullpageSection>
        <FullpageSection>
          <Fifth />
        </FullpageSection>
        <FullpageSection>
          <Sixth />
        </FullpageSection>
      </FullpageContainer>
    </>
  );
};

export default LandingPage;
