import { curve, heroBackground, robot } from "../assets";
import Button from "../components/Button";
import { useState } from "react";
import Section from "../components/Section";
import { BackgroundCircles,BottomLine,Gradient } from "../components/design/Hero";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const parallaxRef = useRef(null);
  const navigate = useNavigate();
  const [showLogs,setShowLogs] = useState(false);

  return (
    <Section
      className="pt-[12rem] -mt-[5.25rem]"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="hero"
    >
      <div className="container relative" ref={parallaxRef}>
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="h1 mb-6" style={{marginTop:showLogs?'0vh':'10vh'}}>
          See Something? Say Something, Anonymously. 
           
          </h1>
         
        </div>
        <div className="relative max-w-[23rem] mx-auto md:max-w-5xl xl:mb-24">
          {showLogs && (
  <div className="relative z-1 p-0.5 rounded-2xl bg-conic-gradient">
    <div className="relative bg-n-8 rounded-[1rem]">
      <div className="h-[1.4rem] bg-n-10 rounded-t-[0.9rem]" />
      <div className="aspect-[33/40] rounded-b-[0.9rem] overflow-hidden md:aspect-[688/490] lg:aspect-[1024/490]">
        {/* Add your content or components here */}
      </div>
    </div>
    <Gradient />
  </div>)
 } 
 
 {!showLogs && (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{display:'flex',flexDirection:"column"}}>
    <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8">
          But first, let's start by verifying you on the platform.
          </p>
      <Button onClick={() => { setShowLogs(true) }} style={{ textAlign: 'center' }} className="body-1 max-w10xl mx-auto mb-6 text-n-2 lg:mb-8">
        VERIFY ME <b>ANONYMOUSLY</b>.
      </Button>
    </div>
    
  </div>
)}


          

          <BackgroundCircles />
        </div>

        
      </div>

      <BottomLine />
    </Section>
  );
};

export default GetStarted;
