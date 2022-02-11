import React, { useState, useRef, useEffect } from 'react';
import { } from '@heroicons/react/outline';

import { useMediaQuery } from 'react-responsive';

import { Slide, Img, Layer, LoadingSpinner, Library } from '../components';

import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { height } from 'tailwindcss/defaultTheme';


const ObjectDetectionTool = ({ isHidden }) => {

    const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const thumbPreview = useRef(null);

    const [imgSrc, setImgSrc] = useState('');
    const [processing, setProcessing] = useState(true);
    const [searchText, setSearchText] = useState('');

    const [showLibrary, setShowLibrary] = useState(false);

    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

    const screenSize = useWindowSize();

    const [model, setModel] = useState();
    async function loadModel() {
        try {
            const model = await cocoSsd.load({ base: 'mobilenet_v2' });
            setModel(model);
            console.log("set loaded Model");
            setProcessing(false);
        } 
            catch (err) {
            console.log(err);
            console.log("failed load model");
        }
    }

    useEffect(() => {
        if (!isHidden) {
            tf.ready().then(() => {
                loadModel();
            });
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

    async function predictionFunction() {
        //Clear the canvas for each prediction
        document.getElementById("objectDetectionCanvas").innerHTML = '';
        //Start prediction
        
        const predictions = await model.detect(document.getElementById("objectDetectionImg"));
        if (predictions.length > 0) {
            console.log(predictions);

            for (let n = 0; n < predictions.length; n++) {
                // Description text
                const p = document.createElement('p');
                p.setAttribute('class', 'identifier');
                p.innerText = predictions[n].class  + ' - with ' 
                    + Math.round(parseFloat(predictions[n].score) * 100) 
                    + '% confidence.';
                // Positioned at the top left of the bounding box.
                // Height is whatever the text takes up.
                // Width subtracts text padding in CSS so fits perfectly.
                p.style = 'left: ' + predictions[n].bbox[0] + 'px;' + 
                    'top: ' + predictions[n].bbox[1] + 'px; ' + 
                    'width: ' + (predictions[n].bbox[2] - 10) + 'px;';
          
                const highlighter = document.createElement('div');
                highlighter.setAttribute('class', 'highlighter');
                highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px;' +
                    'top: ' + predictions[n].bbox[1] + 'px;' +
                    'width: ' + predictions[n].bbox[2] + 'px;' +
                    'height: ' + predictions[n].bbox[3] + 'px;';
          
                    document.getElementById("objectDetectionCanvas").appendChild(highlighter);
                    document.getElementById("objectDetectionCanvas").appendChild(p);
              }
        }
        //Rerun prediction by timeout
        /* setTimeout(() => predictionFunction(), 500); */
        setProcessing(false);
    }

    const handlePrediction = async () => {
        if (!processing && imgSrc !== '') { 
            setProcessing(true);
            predictionFunction();
        }
    }

    const handleChangeSearchText = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();
        setSearchText(value);    
    };

    const handleShowLibrary = () => {
        if (searchText !== '') {
            setShowLibrary(!showLibrary);
        }
    }

    const handleChangeSrc = (media) => {
        setShowLibrary(false);
        setImgSrc(media);
    }


    return (
        <>
        <Library modal={true} isHidden={showLibrary ? false : true} preSearchText={searchText} setSrc={handleChangeSrc} setShowLibrary={setShowLibrary} />
        <div className={`min-h-screen flex-col items-center justify-center bg-gray-900 py-20 lg:py-12 px-4 sm:px-6 lg:px-52 space-y-4 lg:space-y-8 ${isHidden ? 'hidden' : 'flex'}`}>
            <div className="w-full flex flex-col space-x-0 lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0 md:flex-row md:space-x-6 md:space-y-0 items-center justify-center">
                {/* <h2 className="ml-2 text-left text-3xl md:text-xl font-extrabold text-white select-none">Création à partir de données</h2> */}
                <div className="flex flex-row items-center mt-3 md:mt-0 lg:space-x-4 space-x-2">
                    <input
                        id="searchText"
                        onChange={handleChangeSearchText}
                        value={searchText}
                        name="searchText"
                        type="text"
                        required
                        className="resize-none appearance-none relative block h-9 md:w-96 w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Description de l'image"
                    />
                    <div onClick={handleShowLibrary} className="rounded-md select-none font-medium py-1 px-2 text-center text-sm text-white shadow align-middle bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500 flex items-center justify-center">
                        {'Chercher'}
                    </div>
                </div>
                {imgSrc !== '' && <div onClick={handlePrediction} className="rounded-md select-none font-medium py-1 px-2 text-center text-sm text-white shadow align-middle bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500 flex items-center justify-center">
                    {processing ? <LoadingSpinner className="h-5 w-5 text-white" /> : 'Analyser'}
                </div>}
            </div>
            {!isHidden && <div className="flex flex-col lg:flex-row w-full pointer-events-none">
                
                <div className="w-full overflow-hidden shadow lg:px-28 w-full">
                
                    {/* <div id="thumbPreview" className="w-full aspect-w-16 aspect-h-9 bg-white overflow-hidden rounded-md" ref={thumbPreview}>

                        {thumbPreview.current && thumbPreviewWidth > 0 &&  */}
                            <>
                                <Img src={imgSrc}
                                        onChange={setImgSrc} 
                                        alt={'image'}
                                        id={`img-1`}
                                        imgClassName="object-contain"
                                        imgId={'objectDetectionImg'} 
                                        /* style={{ width: `${100}%` }} */
                                        disabled={true} 
                                        useCanvas={true}
                                        canvasId={'objectDetectionCanvas'}
                                        modalLibrary={true}
                                        controlsOnly={false}
                                        preSearchText={searchText} />
                            </> 
                        {/* }

                    </div> */}
                </div>
                    {/* <Slide>
                        <Layer id={`layer-1`}>
                            <Img src={imgSrc}
                                onChange={setImgSrc} 
                                alt={'image'}
                                id={`img-1`}
                                imgId={'objectDetectionImg'} 
                                style={{ width: `${100}%` }} 
                                preSearchText={`Social activities`} />
                        </Layer>
                        <div style={{ position: "absolute", top: "0", zIndex: "9999" }}>
                            <canvas
                                id="myCanvas"
                                width={thumbPreviewWidth}
                                height={thumbPreviewWidth / 16 * 9}
                                style={{ backgroundColor: "transparent" }}
                            />
                        </div>
                    </Slide> */}
                {/* <div className="mt-4 lg:ml-4 lg:mt-0 space-x-4 lg:space-y-4 lg:space-x-0 flex flex-row lg:flex-col" style={{ width: `${isMobile ? 100 : 18.25}%`}}> */}
                {/* <div className="mt-2 lg:ml-4 lg:mt-0 container grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-2" style={{ width: `${isMobile ? 100 : 18.25}%`}}>
                    
                </div> */}

            </div>}

            {/* <section className={`container grid md:grid-cols-4 grid-cols-3 gap-1 lg:grid-cols-12 lg:gap-2 w-full`}></section> */}
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

export default ObjectDetectionTool;