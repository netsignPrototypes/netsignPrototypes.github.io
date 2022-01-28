import React, { useState, useRef, useEffect } from 'react';
import { } from '@heroicons/react/outline'

import { useMediaQuery } from 'react-responsive';

import { Slide } from '../components';


const LayoutTool = ({ isHidden }) => {

    const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const thumbPreview = useRef(null);


    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

    const screenSize = useWindowSize();

    useEffect(() => {
        if (!isHidden) {
            
        }
    }, [isHidden]);

    useEffect(() => {
        if (thumbPreview.current) {
           setThumbPreviewWidth(thumbPreview.current.offsetWidth);
        }
    }, [screenSize]);

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = thumbPreviewWidth;

        if (thumbPreviewWidth === 0 || (thumbPreview.current && thumbPreview.current.offsetWidth !== thumbPreviewWidth)) {
            currentThumbPreviewWidth = thumbPreview.current.offsetWidth;
            setThumbPreviewWidth(currentThumbPreviewWidth);
        }

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }


    return (
        <>

        <div className={`min-h-screen flex-col items-start justify-start bg-gray-900 py-20 lg:py-12 px-4 sm:px-6 lg:px-52 space-y-4 lg:space-y-8 ${isHidden ? 'hidden' : 'flex'}`}>
            {!isHidden && <div className="flex flex-col lg:flex-row w-full pointer-events-none">
                
                <div className="w-full overflow-hidden shadow">
                    <div id="thumbPreview" className="w-full aspect-w-16 aspect-h-9 bg-white overflow-hidden rounded-md" ref={thumbPreview}>

                        {thumbPreview.current && thumbPreviewWidth > 0 && 

                            <Slide>

                            </Slide>

                        }

                    </div>
                </div>

                {/* <div className="mt-4 lg:ml-4 lg:mt-0 space-x-4 lg:space-y-4 lg:space-x-0 flex flex-row lg:flex-col" style={{ width: `${isMobile ? 100 : 18.25}%`}}> */}
                <div className="mt-2 lg:ml-4 lg:mt-0 container grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-2" style={{ width: `${isMobile ? 100 : 18.25}%`}}>
                    
                </div>

            </div>}

            <section className={`container grid md:grid-cols-4 grid-cols-3 gap-1 lg:grid-cols-12 lg:gap-2 w-full`}></section>
        </div></>
    );
}

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export default LayoutTool;