import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import ReactDOM from 'react-dom';

import { MenuAlt2Icon, PhotographIcon, FilmIcon, DocumentIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmLeftIcon, ArrowSmRightIcon, TrashIcon } from '@heroicons/react/outline'

import { useWindowSize } from '../hooks';

import useMouse from '@react-hook/mouse-position';

import ZoneContent from './ZoneContent';


const toolTypes = {
    Cursor: 0,
    Text: 1,
    Image: 2,
    Shape: 3,
    Video: 4,
}

const animationTypes = [
    { type: 4, icon: ArrowSmRightIcon, oppositeType: 1 },
    { type: 2, icon: ArrowSmUpIcon, oppositeType: 3 },
    { type: 3, icon: ArrowSmDownIcon, oppositeType: 2 },
    { type: 1, icon: ArrowSmLeftIcon, oppositeType: 4 },
]

const zoneTypes = {
    1: 'Text',
    2: 'Image',
    3: 'Shape',
    4: 'Video',
}

const images = [
    'https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
    'https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644869432047-fa8bdbe849cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644574739831-d19ded59cae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644748865694-2db1be00e13a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1637336659506-93ee3acccd85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644840379571-2a973eee0726?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1644805424176-e426671f33ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1644773741827-d635af7357b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1644707386365-117da5d3fdc4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1644667621462-4938986c3a41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2077&q=80',
    'https://images.unsplash.com/photo-1644604992281-5c07ca56fa5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1644657167747-49910669ac24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644530633761-094c893a6558?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644601397307-ae67d3024d46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80'

 ]

const CURSOR_TYPE = {
    tl: 'cursor-nwse-resize',
    tr: 'cursor-nesw-resize',
    bl: 'cursor-nesw-resize',
    br: 'cursor-nwse-resize',
    t: 'cursor-ns-resize',
    b: 'cursor-ns-resize',
    l: 'cursor-ew-resize',
    r: 'cursor-ew-resize',
    m: 'cursor-move',
}

// <ZoneEditor zone={} index={} onClick={} onMouseEnter={} onMouseLeave={} isDisabled={} isSelected={} isHovered={} onChange={} adjusmentWidth={} />

const ZoneEditor = ({ zone, index, onClick, onMouseEnter, onMouseLeave, isDisabled, isSelected, isHovered, isPlaying, onChange, adjusmentWidth, mouseX, mouseY, mouseDown, mouseHover, mouseRef = null, gridSize }) => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    /* const gridSize = 24; */
    const [tempFinalPosition, setTempFinalPosition] = useState({});
    const [startMousePosition, setStartMousePosition] = useState(null);
    const [lastEditedZoneId, setLastEditedZoneId] = useState(null);
  
    // UI LOGIC STATES
    const [mouseIsDown, setMouseIsDown] = useState(false);
    const [selectedPositionEditor, setSelectedPositionEditor] = useState(null);
    const [mouseUp, setMouseUp] = useState(false);

    // REFS
    const zoneRef = useRef(null);

    const mouse = useMouse(mouseRef, { fps: 120 });
    const screenSize = useWindowSize();


    // UTILITY FUNCTIONS

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    const getRealPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = adjusmentWidth;

        computedPixelSize = 1920 / currentThumbPreviewWidth * pixel;

        return computedPixelSize;
    }

    const handleChangeTempFinalPosition = (newX, newY, startPosition) => {

        let newTempFinalPosition = {}
        let position = [[...zone.position[0]], [...zone.position[1]]];        

        switch (selectedPositionEditor) {
            case 'tl':
                position[0] = [newX, newY, newX + gridSize, newY + gridSize];
            break;
            case 'tr':
                position[0][1] = newY;
                position[0][3] = newY + gridSize;
                position[1][0] = newX;
                position[1][2] = newX + gridSize;
            break;
            case 'bl':
                position[1][1] = newY;
                position[1][3] = newY + gridSize;
                position[0][0] = newX;
                position[0][2] = newX + gridSize;
            break;
            case 'br':
                position[1] = [newX, newY, newX + gridSize, newY + gridSize];
            break;
            case 't':
                position[0][1] = newY;
                position[0][3] = newY + gridSize;
            break;
            case 'b':
                position[1][1] = newY;
                position[1][3] = newY + gridSize;
            break;
            case 'l':
                position[0][0] = newX;
                position[0][2] = newX + gridSize;
            break;
            case 'r':
                position[1][0] = newX;
                position[1][2] = newX + gridSize;
            break;
            case 'm':
                if (startPosition !== null) {
                    let xDiff = startPosition.x - newX;
                    let yDiff = startPosition.y - newY;

                    position[0] = [position[0][0] - xDiff, position[0][1] - yDiff, position[0][2] - xDiff, position[0][3] - yDiff];
                    position[1] = [position[1][0] - xDiff, position[1][1] - yDiff, position[1][2] - xDiff, position[1][3] - yDiff];
                }
            break;
            default:
        }

        newTempFinalPosition = {
            left: position[0][0] < position[1][0] ? position[0][0] : position[1][0], 
            top: position[0][1] < position[1][1] ? position[0][1] : position[1][1], 
            width: position[1][2] > position[0][0] ? position[1][2] - position[0][0] : position[0][2] - position[1][0], 
            height: position[1][3] > position[0][1] ? position[1][3] - position[0][1] : position[0][3] - position[1][1],
        }

        newTempFinalPosition.position = [[newTempFinalPosition.left, newTempFinalPosition.top, newTempFinalPosition.left + gridSize, newTempFinalPosition.top + gridSize], 
        [newTempFinalPosition.left + newTempFinalPosition.width - gridSize, newTempFinalPosition.top + newTempFinalPosition.height - gridSize, newTempFinalPosition.left + newTempFinalPosition.width, newTempFinalPosition.top + newTempFinalPosition.height]];

        setTempFinalPosition(newTempFinalPosition);
    }

    const handleOnClick = (zone) => {
        if (selectedPositionEditor === null) {
            onClick(zone);
        }
    }

    /* const handleMouseEnter = (event) => {
        if (selectedPositionEditor === null) onMouseEnter(zone.id)
    }

    const handleMouseLeave = (event) => {
        if (selectedPositionEditor === null) onMouseLeave(null)
    } */

    useEffect(() => {
        if (zone !== null) {
            
            if (selectedPositionEditor !== null) {
                //console.log('mouse change editor');
                if (mouse.isDown) {
                    setMouseIsDown(true);
                    console.log('mouse down and moving');
                    let realX = getRealPixelSize(mouse.x);
                    let realY = getRealPixelSize(mouse.y);
        
                    let x = realX - realX % gridSize;
                    let y = realY - realY % gridSize;
    
                    if (!mouseIsDown) {
                        setStartMousePosition({ x: x, y: y });
                        handleChangeTempFinalPosition(x, y, { x: x, y: y });
                    } else {
                        handleChangeTempFinalPosition(x, y, startMousePosition);
                    }
                } else if (mouseIsDown && !mouse.isDown && mouse.isOver) {
                    //console.log('mouse up and save zone');
                    setMouseIsDown(false);
                    setMouseUp(false);
                    setLastEditedZoneId(zone.id);
                    setSelectedPositionEditor(null);
                    setStartMousePosition(null);
                    if ( tempFinalPosition.left !== undefined) {
                        onChange(zone, 'finalPosition', {...tempFinalPosition});
                    }
                    setTempFinalPosition({});
                } else if (!mouse.isDown && !mouseIsDown && tempFinalPosition.left !== undefined) {
                    setSelectedPositionEditor(null);
                    onClick(zone);
                }
            } else {
                if (mouseIsDown || mouseUp) {
                    //console.log('mouse out');
                    setMouseIsDown(false);
                    setMouseUp(false);
                    setLastEditedZoneId(zone.id);
                } else if (!mouseIsDown && !mouseUp && mouse.isDown && zone.id !== lastEditedZoneId) {
                    //console.log('mouse first down', zone.id !== lastEditedZoneId);
                    setLastEditedZoneId(zone.id);
                    setTempFinalPosition({});
                    setSelectedPositionEditor('m');
                    setMouseIsDown(true);
    
                    let realX = getRealPixelSize(mouse.x);
                    let realY = getRealPixelSize(mouse.y);
        
                    let x = realX - realX % gridSize;
                    let y = realY - realY % gridSize;
    
                    if (!mouseIsDown) {
                        setStartMousePosition({ x: x, y: y });
                        handleChangeTempFinalPosition(x, y, { x: x, y: y });
                    } else {
                        handleChangeTempFinalPosition(x, y, startMousePosition);
                    }
                } else if (!mouse.isDown && zone.id !== lastEditedZoneId) {
                    //console.log('mouse first up', zone.id !== lastEditedZoneId);
                    setMouseIsDown(false);
                    setMouseUp(false);
                    setLastEditedZoneId(zone.id);
                    setTempFinalPosition({});
                    setSelectedPositionEditor(null);
                    setStartMousePosition(null);
                }
            }
        }
        
    }, [mouse.isDown, mouse.x, mouse.y]);

    useEffect(() => {
        setTempFinalPosition({});
        setMouseIsDown(false);
        /* if (zone !== null && !mouseIsDown) {
            console.log('zone change', zone.id);
        } else {
            console.log('zone change', null);
        } */
        setStartMousePosition(null);
        setSelectedPositionEditor(null);
        
    }, [zone])

    const getRealMousePosition = () => {
        let realX = getRealPixelSize(mouse.x);
        let realY = getRealPixelSize(mouse.y);

        let x = realX - realX % gridSize;
        let y = realY - realY % gridSize;

        return { x: x, y: y };
    }

    
    return (
        <>
            {/* <button key={`zones-${zone.id}`} disabled={isDisabled} onClick={handleOnClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: "absolute", left: getComputedPixelSize(tempFinalPosition.left !== undefined ? tempFinalPosition.left : zone.finalPosition.left), top: getComputedPixelSize(tempFinalPosition.top !== undefined ? tempFinalPosition.top : zone.finalPosition.top), width: getComputedPixelSize(tempFinalPosition.width !== undefined ? tempFinalPosition.width : zone.finalPosition.width), height: getComputedPixelSize(tempFinalPosition.height !== undefined ? tempFinalPosition.height : zone.finalPosition.height) }} className={`${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'} ${[toolTypes.Image].includes(zone.type) && isPlaying ? '' : 'rounded'} group flex flex-row items-center justify-center ${isPlaying ? '' : isSelected ? 'border border-blue-500' : isHovered ? 'border border-blue-400' : 'border border-gray-200 hover:border-blue-400'} ${CURSOR_TYPE[selectedPositionEditor] ? CURSOR_TYPE[selectedPositionEditor] : 'cursor-pointer'}`}> */}
            {zone !== null && !isPlaying && <ZoneContent index={index} zone={tempFinalPosition.left !== undefined && mouseIsDown ? {...zone, finalPosition: tempFinalPosition }: zone} isSelected={isSelected} isDisabled={isDisabled} onClick={handleOnClick} /* isHovered={isHovered} */ onChange={onChange} isPlaying={isPlaying} adjusmentWidth={adjusmentWidth} />}
            {/* </button> */}
            {zone !== null && isSelected && !isPlaying && 
                <>
                    {mouseIsDown && <div className={`absolute top-0 left-0 h-full w-full pointer-events-auto ${CURSOR_TYPE[selectedPositionEditor]}`} style={{ zIndex: 400}}></div>}
                    <div style={{ position: "absolute", left: getComputedPixelSize(tempFinalPosition.left !== undefined ? tempFinalPosition.left : zone.finalPosition.left), top: getComputedPixelSize(tempFinalPosition.top !== undefined ? tempFinalPosition.top : zone.finalPosition.top), width: getComputedPixelSize(tempFinalPosition.width !== undefined ? tempFinalPosition.width : zone.finalPosition.width), height: getComputedPixelSize(tempFinalPosition.height !== undefined ? tempFinalPosition.height : zone.finalPosition.height), zIndex: 600 }} className={`pointer-events-auto border border-blue-500 ${CURSOR_TYPE[selectedPositionEditor]}`}>

                        <div className='absolute top-0 left-0 h-full w-full flex flex-row items-center justify-center pointer-events-none'>
                            <button id="m" onMouseDown={(event) => {if (event.button === 0) event.stopPropagation(); setSelectedPositionEditor('m')}} className={`w-full h-full cursor-move ${selectedPositionEditor === 'm' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                        </div>

                        {!mouseIsDown && mouseRef.current && screenSize.height && 
                        <div style={{ position: "fixed", 
                            zIndex: 500,
                            left: getComputedPixelSize(tempFinalPosition.left !== undefined ? tempFinalPosition.left : zone.finalPosition.left) + mouseRef.current.getBoundingClientRect().left, 
                            bottom: (screenSize.height - getComputedPixelSize(tempFinalPosition.top !== undefined ? tempFinalPosition.top : zone.finalPosition.top) - mouseRef.current.getBoundingClientRect().top), 
                            width: getComputedPixelSize(tempFinalPosition.width !== undefined ? tempFinalPosition.width : zone.finalPosition.width)}} className={`flex flex-row items-center justify-center pointer-events-none`}>
                        <div id='propertyBubble' className={`bg-gray-200 pointer-events-none flex flex-row items-center justify-center rounded-lg space-x-1 p-1.5 m-2 shadow-lg border border-gray-300 pointer-events-auto`}>
                                <div className='h-5 w-5 shrink-0 flex rounded text-xs bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-400 items-center justify-center cursor-pointer pointer-events-auto' onClick={(e) => { e.stopPropagation(); onChange(zone, 'sequence')}}>
                                    {zone.sequence}
                                </div>
                                {animationTypes.map((animation, animIdx) => {
                                    return <div key={`animationSamll-${zone.id}-${animIdx}`} onClick={(event) => {event.stopPropagation(); onChange(zone, 'animations', animation.type)}} className={`pointer-events-auto cursor-pointer rounded ${zone.animations.includes(animation.type) ? 'bg-blue-200 text-blue-600' : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-400'}`}>
                                        <animation.icon className='h-5 w-5' />
                                    </div>
                                })}
                                <div className='h-5 w-5 shrink-0 flex rounded text-xs bg-white text-gray-500 hover:bg-red-100 hover:text-red-600 items-center justify-center cursor-pointer pointer-events-auto' onClick={(e) => { e.stopPropagation(); onChange(zone, 'delete')}}>
                                    <TrashIcon className='h-4 w-4' />
                                </div>
                            </div>        
                        </div>}

                        <button id="t" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('t')}} className={`absolute -top-1 left-0 w-full h-2 cursor-ns-resize ${selectedPositionEditor === 't' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                        <button id="b" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('b')}} className={`absolute -bottom-1 left-0 w-full h-2 cursor-ns-resize ${selectedPositionEditor === 'b' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                        <button id="l" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('l')}} className={`absolute top-0 -left-1 h-full w-2 cursor-ew-resize ${selectedPositionEditor === 'l' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                        <button id="r" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('r')}} className={`absolute top-0 -right-1 h-full w-2 cursor-ew-resize ${selectedPositionEditor === 'r' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>

                        <button id="tl" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('tl')}} className={`absolute cursor-nwse-resize -top-1 -left-1 rounded-full w-2 h-2 bg-blue-500 ${selectedPositionEditor === 'tl' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                        <button id="tr" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('tr')}} className={`absolute cursor-nesw-resize -top-1 -right-1 rounded-full w-2 h-2 bg-blue-500 ${selectedPositionEditor === 'tr' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                        <button id="bl" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('bl')}} className={`absolute cursor-nesw-resize -bottom-1 -left-1 rounded-full w-2 h-2 bg-blue-500 ${selectedPositionEditor === 'bl' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                        <button id="br" onMouseDown={(event) => {event.stopPropagation(); if (event.button === 0) setSelectedPositionEditor('br')}} className={`absolute cursor-nwse-resize -bottom-1 -right-1 rounded-full w-2 h-2 bg-blue-500 ${selectedPositionEditor === 'br' || selectedPositionEditor === null ? 'pointer-events-auto' : 'pointer-events-none'}`}></button>
                    </div>
                </>
            }
        </>
    )
}

export default ZoneEditor;