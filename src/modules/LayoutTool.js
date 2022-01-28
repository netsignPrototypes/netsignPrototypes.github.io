import React, { useState, useRef, useEffect } from 'react';
import { } from '@heroicons/react/outline'

import { useMediaQuery } from 'react-responsive';

import { Slide } from '../components';

const layoutMatrix = [
    [30,30,48,48],[72,30,108,48],[132,30,168,48],[192,30,228,48],[252,30,288,48],[312,30,348,48],[372,30,408,48],[432,30,468,48],[492,30,528,48],[552,30,588,48],[612,30,648,48],[672,30,708,48],[732,30,768,48],[792,30,828,48],[852,30,888,48],[912,30,948,48],[972,30,1008,48],[1032,30,1068,48],[1092,30,1128,48],[1152,30,1188,48],[1212,30,1248,48],[1272,30,1308,48],[1332,30,1368,48],[1392,30,1428,48],[1452,30,1488,48],[1512,30,1548,48],[1572,30,1608,48],[1632,30,1668,48],[1692,30,1728,48],[1752,30,1788,48],[1812,30,1848,48],[1872,30,1890,48],
    [30,72,48,108],[72,72,108,108],[132,72,168,108],[192,72,228,108],[252,72,288,108],[312,72,348,108],[372,72,408,108],[432,72,468,108],[492,72,528,108],[552,72,588,108],[612,72,648,108],[672,72,708,108],[732,72,768,108],[792,72,828,108],[852,72,888,108],[912,72,948,108],[972,72,1008,108],[1032,72,1068,108],[1092,72,1128,108],[1152,72,1188,108],[1212,72,1248,108],[1272,72,1308,108],[1332,72,1368,108],[1392,72,1428,108],[1452,72,1488,108],[1512,72,1548,108],[1572,72,1608,108],[1632,72,1668,108],[1692,72,1728,108],[1752,72,1788,108],[1812,72,1848,108],[1872,72,1890,108],
    [30,132,48,168],[72,132,108,168],[132,132,168,168],[192,132,228,168],[252,132,288,168],[312,132,348,168],[372,132,408,168],[432,132,468,168],[492,132,528,168],[552,132,588,168],[612,132,648,168],[672,132,708,168],[732,132,768,168],[792,132,828,168],[852,132,888,168],[912,132,948,168],[972,132,1008,168],[1032,132,1068,168],[1092,132,1128,168],[1152,132,1188,168],[1212,132,1248,168],[1272,132,1308,168],[1332,132,1368,168],[1392,132,1428,168],[1452,132,1488,168],[1512,132,1548,168],[1572,132,1608,168],[1632,132,1668,168],[1692,132,1728,168],[1752,132,1788,168],[1812,132,1848,168],[1872,132,1890,168],
    [30,192,48,228],[72,192,108,228],[132,192,168,228],[192,192,228,228],[252,192,288,228],[312,192,348,228],[372,192,408,228],[432,192,468,228],[492,192,528,228],[552,192,588,228],[612,192,648,228],[672,192,708,228],[732,192,768,228],[792,192,828,228],[852,192,888,228],[912,192,948,228],[972,192,1008,228],[1032,192,1068,228],[1092,192,1128,228],[1152,192,1188,228],[1212,192,1248,228],[1272,192,1308,228],[1332,192,1368,228],[1392,192,1428,228],[1452,192,1488,228],[1512,192,1548,228],[1572,192,1608,228],[1632,192,1668,228],[1692,192,1728,228],[1752,192,1788,228],[1812,192,1848,228],[1872,192,1890,228],
    [30,252,48,288],[72,252,108,288],[132,252,168,288],[192,252,228,288],[252,252,288,288],[312,252,348,288],[372,252,408,288],[432,252,468,288],[492,252,528,288],[552,252,588,288],[612,252,648,288],[672,252,708,288],[732,252,768,288],[792,252,828,288],[852,252,888,288],[912,252,948,288],[972,252,1008,288],[1032,252,1068,288],[1092,252,1128,288],[1152,252,1188,288],[1212,252,1248,288],[1272,252,1308,288],[1332,252,1368,288],[1392,252,1428,288],[1452,252,1488,288],[1512,252,1548,288],[1572,252,1608,288],[1632,252,1668,288],[1692,252,1728,288],[1752,252,1788,288],[1812,252,1848,288],[1872,252,1890,288],
    [30,312,48,348],[72,312,108,348],[132,312,168,348],[192,312,228,348],[252,312,288,348],[312,312,348,348],[372,312,408,348],[432,312,468,348],[492,312,528,348],[552,312,588,348],[612,312,648,348],[672,312,708,348],[732,312,768,348],[792,312,828,348],[852,312,888,348],[912,312,948,348],[972,312,1008,348],[1032,312,1068,348],[1092,312,1128,348],[1152,312,1188,348],[1212,312,1248,348],[1272,312,1308,348],[1332,312,1368,348],[1392,312,1428,348],[1452,312,1488,348],[1512,312,1548,348],[1572,312,1608,348],[1632,312,1668,348],[1692,312,1728,348],[1752,312,1788,348],[1812,312,1848,348],[1872,312,1890,348],
    [30,372,48,408],[72,372,108,408],[132,372,168,408],[192,372,228,408],[252,372,288,408],[312,372,348,408],[372,372,408,408],[432,372,468,408],[492,372,528,408],[552,372,588,408],[612,372,648,408],[672,372,708,408],[732,372,768,408],[792,372,828,408],[852,372,888,408],[912,372,948,408],[972,372,1008,408],[1032,372,1068,408],[1092,372,1128,408],[1152,372,1188,408],[1212,372,1248,408],[1272,372,1308,408],[1332,372,1368,408],[1392,372,1428,408],[1452,372,1488,408],[1512,372,1548,408],[1572,372,1608,408],[1632,372,1668,408],[1692,372,1728,408],[1752,372,1788,408],[1812,372,1848,408],[1872,372,1890,408],
    [30,432,48,468],[72,432,108,468],[132,432,168,468],[192,432,228,468],[252,432,288,468],[312,432,348,468],[372,432,408,468],[432,432,468,468],[492,432,528,468],[552,432,588,468],[612,432,648,468],[672,432,708,468],[732,432,768,468],[792,432,828,468],[852,432,888,468],[912,432,948,468],[972,432,1008,468],[1032,432,1068,468],[1092,432,1128,468],[1152,432,1188,468],[1212,432,1248,468],[1272,432,1308,468],[1332,432,1368,468],[1392,432,1428,468],[1452,432,1488,468],[1512,432,1548,468],[1572,432,1608,468],[1632,432,1668,468],[1692,432,1728,468],[1752,432,1788,468],[1812,432,1848,468],[1872,432,1890,468],
    [30,492,48,528],[72,492,108,528],[132,492,168,528],[192,492,228,528],[252,492,288,528],[312,492,348,528],[372,492,408,528],[432,492,468,528],[492,492,528,528],[552,492,588,528],[612,492,648,528],[672,492,708,528],[732,492,768,528],[792,492,828,528],[852,492,888,528],[912,492,948,528],[972,492,1008,528],[1032,492,1068,528],[1092,492,1128,528],[1152,492,1188,528],[1212,492,1248,528],[1272,492,1308,528],[1332,492,1368,528],[1392,492,1428,528],[1452,492,1488,528],[1512,492,1548,528],[1572,492,1608,528],[1632,492,1668,528],[1692,492,1728,528],[1752,492,1788,528],[1812,492,1848,528],[1872,492,1890,528],
    [30,552,48,588],[72,552,108,588],[132,552,168,588],[192,552,228,588],[252,552,288,588],[312,552,348,588],[372,552,408,588],[432,552,468,588],[492,552,528,588],[552,552,588,588],[612,552,648,588],[672,552,708,588],[732,552,768,588],[792,552,828,588],[852,552,888,588],[912,552,948,588],[972,552,1008,588],[1032,552,1068,588],[1092,552,1128,588],[1152,552,1188,588],[1212,552,1248,588],[1272,552,1308,588],[1332,552,1368,588],[1392,552,1428,588],[1452,552,1488,588],[1512,552,1548,588],[1572,552,1608,588],[1632,552,1668,588],[1692,552,1728,588],[1752,552,1788,588],[1812,552,1848,588],[1872,552,1890,588],
    [30,612,48,648],[72,612,108,648],[132,612,168,648],[192,612,228,648],[252,612,288,648],[312,612,348,648],[372,612,408,648],[432,612,468,648],[492,612,528,648],[552,612,588,648],[612,612,648,648],[672,612,708,648],[732,612,768,648],[792,612,828,648],[852,612,888,648],[912,612,948,648],[972,612,1008,648],[1032,612,1068,648],[1092,612,1128,648],[1152,612,1188,648],[1212,612,1248,648],[1272,612,1308,648],[1332,612,1368,648],[1392,612,1428,648],[1452,612,1488,648],[1512,612,1548,648],[1572,612,1608,648],[1632,612,1668,648],[1692,612,1728,648],[1752,612,1788,648],[1812,612,1848,648],[1872,612,1890,648],
    [30,672,48,708],[72,672,108,708],[132,672,168,708],[192,672,228,708],[252,672,288,708],[312,672,348,708],[372,672,408,708],[432,672,468,708],[492,672,528,708],[552,672,588,708],[612,672,648,708],[672,672,708,708],[732,672,768,708],[792,672,828,708],[852,672,888,708],[912,672,948,708],[972,672,1008,708],[1032,672,1068,708],[1092,672,1128,708],[1152,672,1188,708],[1212,672,1248,708],[1272,672,1308,708],[1332,672,1368,708],[1392,672,1428,708],[1452,672,1488,708],[1512,672,1548,708],[1572,672,1608,708],[1632,672,1668,708],[1692,672,1728,708],[1752,672,1788,708],[1812,672,1848,708],[1872,672,1890,708],
    [30,732,48,768],[72,732,108,768],[132,732,168,768],[192,732,228,768],[252,732,288,768],[312,732,348,768],[372,732,408,768],[432,732,468,768],[492,732,528,768],[552,732,588,768],[612,732,648,768],[672,732,708,768],[732,732,768,768],[792,732,828,768],[852,732,888,768],[912,732,948,768],[972,732,1008,768],[1032,732,1068,768],[1092,732,1128,768],[1152,732,1188,768],[1212,732,1248,768],[1272,732,1308,768],[1332,732,1368,768],[1392,732,1428,768],[1452,732,1488,768],[1512,732,1548,768],[1572,732,1608,768],[1632,732,1668,768],[1692,732,1728,768],[1752,732,1788,768],[1812,732,1848,768],[1872,732,1890,768],
    [30,792,48,828],[72,792,108,828],[132,792,168,828],[192,792,228,828],[252,792,288,828],[312,792,348,828],[372,792,408,828],[432,792,468,828],[492,792,528,828],[552,792,588,828],[612,792,648,828],[672,792,708,828],[732,792,768,828],[792,792,828,828],[852,792,888,828],[912,792,948,828],[972,792,1008,828],[1032,792,1068,828],[1092,792,1128,828],[1152,792,1188,828],[1212,792,1248,828],[1272,792,1308,828],[1332,792,1368,828],[1392,792,1428,828],[1452,792,1488,828],[1512,792,1548,828],[1572,792,1608,828],[1632,792,1668,828],[1692,792,1728,828],[1752,792,1788,828],[1812,792,1848,828],[1872,792,1890,828],
    [30,852,48,888],[72,852,108,888],[132,852,168,888],[192,852,228,888],[252,852,288,888],[312,852,348,888],[372,852,408,888],[432,852,468,888],[492,852,528,888],[552,852,588,888],[612,852,648,888],[672,852,708,888],[732,852,768,888],[792,852,828,888],[852,852,888,888],[912,852,948,888],[972,852,1008,888],[1032,852,1068,888],[1092,852,1128,888],[1152,852,1188,888],[1212,852,1248,888],[1272,852,1308,888],[1332,852,1368,888],[1392,852,1428,888],[1452,852,1488,888],[1512,852,1548,888],[1572,852,1608,888],[1632,852,1668,888],[1692,852,1728,888],[1752,852,1788,888],[1812,852,1848,888],[1872,852,1890,888],
    [30,912,48,948],[72,912,108,948],[132,912,168,948],[192,912,228,948],[252,912,288,948],[312,912,348,948],[372,912,408,948],[432,912,468,948],[492,912,528,948],[552,912,588,948],[612,912,648,948],[672,912,708,948],[732,912,768,948],[792,912,828,948],[852,912,888,948],[912,912,948,948],[972,912,1008,948],[1032,912,1068,948],[1092,912,1128,948],[1152,912,1188,948],[1212,912,1248,948],[1272,912,1308,948],[1332,912,1368,948],[1392,912,1428,948],[1452,912,1488,948],[1512,912,1548,948],[1572,912,1608,948],[1632,912,1668,948],[1692,912,1728,948],[1752,912,1788,948],[1812,912,1848,948],[1872,912,1890,948],
    [30,972,48,1008],[72,972,108,1008],[132,972,168,1008],[192,972,228,1008],[252,972,288,1008],[312,972,348,1008],[372,972,408,1008],[432,972,468,1008],[492,972,528,1008],[552,972,588,1008],[612,972,648,1008],[672,972,708,1008],[732,972,768,1008],[792,972,828,1008],[852,972,888,1008],[912,972,948,1008],[972,972,1008,1008],[1032,972,1068,1008],[1092,972,1128,1008],[1152,972,1188,1008],[1212,972,1248,1008],[1272,972,1308,1008],[1332,972,1368,1008],[1392,972,1428,1008],[1452,972,1488,1008],[1512,972,1548,1008],[1572,972,1608,1008],[1632,972,1668,1008],[1692,972,1728,1008],[1752,972,1788,1008],[1812,972,1848,1008],[1872,972,1890,1008],
    [30,1032,48,1050],[72,1032,108,1050],[132,1032,168,1050],[192,1032,228,1050],[252,1032,288,1050],[312,1032,348,1050],[372,1032,408,1050],[432,1032,468,1050],[492,1032,528,1050],[552,1032,588,1050],[612,1032,648,1050],[672,1032,708,1050],[732,1032,768,1050],[792,1032,828,1050],[852,1032,888,1050],[912,1032,948,1050],[972,1032,1008,1050],[1032,1032,1068,1050],[1092,1032,1128,1050],[1152,1032,1188,1050],[1212,1032,1248,1050],[1272,1032,1308,1050],[1332,1032,1368,1050],[1392,1032,1428,1050],[1452,1032,1488,1050],[1512,1032,1548,1050],[1572,1032,1608,1050],[1632,1032,1668,1050],[1692,1032,1728,1050],[1752,1032,1788,1050],[1812,1032,1848,1050],[1872,1032,1890,1050]
];

const grayScale = [
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-gray-800",
    "bg-gray-900",
]

const LayoutTool = ({ isHidden }) => {

    const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const thumbPreview = useRef(null);

    const [matrix, setMatrix] = useState([]);

    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

    const screenSize = useWindowSize();

    const [zones, setZones] = useState([]);
    const [zoneIdx, setZoneIdx] = useState(0);
    const [tempZone, setTempZone] = useState([]);

    useEffect(() => {
        if (!isHidden) {
            let newMatrix = [];

            for (let i = 0; i < 45;i++) {
                for (let y = 0; y < 80;y++) {
                    newMatrix.push([y * 24 /* + 4 */, i * 24 /* + 4 */, (y + 1) * 24 /* - 4 */, (i + 1) * 24 /* - 4 */])
                }
            }

            setMatrix(newMatrix);
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

    const handleZoneClick = (square) => {
        let newZones = zones;
        let newZone = zones[zoneIdx];

        if (newZones.length === 0) {
            setZones([[ square, null ]]);
            setTempZone([ square, square ]);
        } else if (newZone[1] === null) {
            if (newZone[0][0] <= square[2] && newZone[0][1] <= square[3]) {

                newZones[zoneIdx] = [newZone[0], square];
            } else {
                newZones[zoneIdx] = [square, newZone[0]];
            }

            setZones(newZones);
            setTempZone([]);
        } else {
            newZones.push([ square, null ]);
            setZoneIdx(zoneIdx + 1);
            setZones(newZones);
            setTempZone([ square, square ]);
        }
    }

    const handleZoneHover = (square) => {
        let newZone = zones[zoneIdx];

        if (newZone && newZone.length > 0 && newZone[1] === null) {
            if (newZone[0][0] <= square[2] && newZone[0][1] <= square[3]) {
                setTempZone([newZone[0], square]);
            } else {
                setTempZone([square, newZone[0]]);
            }
        }
    }

    return (
        <>

        <div className={`min-h-screen flex-col items-start justify-start bg-gray-900 py-20 lg:py-12 px-4 sm:px-6 lg:px-52 space-y-4 lg:space-y-8 ${isHidden ? 'hidden' : 'flex'}`}>
            <div className="w-full flex flex-col-reverse space-x-0 lg:flex-row lg:space-x-6 lg:space-y-0 md:flex-row md:space-x-6 md:space-y-0 items-center justify-end">
                {/* <h2 className="ml-2 text-left text-3xl md:text-xl font-extrabold text-white select-none">Création à partir de données</h2> */}
            </div>
            {!isHidden && <div className="flex flex-col lg:flex-row w-full">
                
                <div className="w-full overflow-hidden shadow">
                    <div id="thumbPreview" className="w-full aspect-w-16 aspect-h-9 bg-white overflow-hidden rounded" ref={thumbPreview}>

                        {thumbPreview.current && thumbPreviewWidth > 0 && 

                            <Slide className={'pointer-events-auto'}>
                                {zones.map((zone, index) => {
                                    if (zone[0] && zone[1] !== null) {
                                     return <div style={{ position: "absolute", left: getComputedPixelSize(zone[0][0] < zone[1][0] ? zone[0][0] : zone[1][0]), top: getComputedPixelSize(zone[0][1] < zone[1][1] ? zone[0][1] : zone[1][1]), width: getComputedPixelSize(zone[1][2] > zone[0][0] ? zone[1][2] - zone[0][0] : zone[0][2] - zone[1][0]), height: getComputedPixelSize(zone[1][3] > zone[0][1] ? zone[1][3] - zone[0][1] : zone[0][3] - zone[1][1]) }} className={`bg-gray-${index + 1}00 pointer-event-none rounded-sm`}></div>
                                    }

                                    return <></>
                                })}
                                {tempZone.length > 0 && <div style={{ position: "absolute", left: getComputedPixelSize(tempZone[0][0] < tempZone[1][0] ? tempZone[0][0] : tempZone[1][0]), top: getComputedPixelSize(tempZone[0][1] < tempZone[1][1] ? tempZone[0][1] : tempZone[1][1]), width: getComputedPixelSize(tempZone[1][2] > tempZone[0][0] ? tempZone[1][2] - tempZone[0][0] : tempZone[0][2] - tempZone[1][0]), height: getComputedPixelSize(tempZone[1][3] > tempZone[0][1] ? tempZone[1][3] - tempZone[0][1] : tempZone[0][3] - tempZone[1][1]) }} className='bg-orange-500 pointer-event-none rounded-sm'></div>}
                                <Grid matrix={matrix} adjusmentWidth={thumbPreviewWidth} onClick={handleZoneClick} onHover={handleZoneHover} />
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

const GridSquare = props => {

    const handleZoneClick = () => {
        props.onClick(props.square);
    }

    const handleZoneHover = () => {
        props.onHover(props.square);
    }

    return <button onMouseEnter={() => props.onHover(props.square)} onClick={() => props.onClick(props.square)} style={props.style} className='hover:bg-blue-600 hover:rounded-sm'></button>
}

const Grid = props => {

    const matrix = props.matrix;
    const adjusmentWidth = props.adjusmentWidth;

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    return matrix.map((square, index) => {
        return <GridSquare square={square} onClick={props.onClick} onHover={props.onHover} key={`refSquare-${index}`} style={{ position: "absolute", left: getComputedPixelSize(square[0]), top: getComputedPixelSize(square[1]), width: getComputedPixelSize(square[2] - square[0]), height: getComputedPixelSize(square[3] - square[1]) }} />
    })
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