import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { MenuAlt2Icon, PhotographIcon, FilmIcon, DocumentIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmLeftIcon, ArrowSmRightIcon } from '@heroicons/react/outline'

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

// <Zone zone={} index={} onClick={} onMouseEnter={} onMouseLeave={} isDisabled={} isSelected={} isHovered={} onChange={} adjusmentWidth={} />

const Zone = ({ zone, index, onClick, onMouseEnter, onMouseLeave, isDisabled, isSelected, isHovered, isPlaying, onChange, adjusmentWidth, mouseX, mouseY, mouseDown, mouseHover }) => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const gridSize = 24;
    const [tempFinalPosition, setTempFinalPosition] = useState({});
    const [startMousePosition, setStartMousePosition] = useState(null);
  
    // UI LOGIC STATES
    const [mouseIsDown, setMouseIsDown] = useState(false);
    const [selectedPositionEditor, setSelectedPositionEditor] = useState(null);


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

    const handleChangeTempFinalPosition = (newX, newY) => {

        let newTempFinalPosition = {}
        let position = [zone.position[0], zone.position[1]];        

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
                if (startMousePosition !== null) {
                    let xDiff = startMousePosition.x - newX;
                    let yDiff = startMousePosition.y - newY;

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

    const getValueDiff = (currentValue, newValue) => {
        if (newValue > currentValue) {
            return currentValue - newValue;
        } else {
            return newValue - currentValue;
        }
    }

    useEffect(() => {
        if (selectedPositionEditor !== null) {
            if (mouseDown) {
                setMouseIsDown(true);
                let realX = getRealPixelSize(mouseX);
                let realY = getRealPixelSize(mouseY);
    
                let x = realX - realX % gridSize;
                let y = realY - realY % gridSize;                

                handleChangeTempFinalPosition(x, y);

            } else if (mouseIsDown && !mouseDown && mouseHover) {
                setMouseIsDown(false);
                setSelectedPositionEditor(null);
                setStartMousePosition(null);
                onChange(index, 'finalPosition', tempFinalPosition);
                setTempFinalPosition({});
            }
        } else {
            setMouseIsDown(false);
            /* setSelectedPositionEditor(null);
            setTempFinalPosition({}); */
        }
    }, [mouseDown, isSelected, mouseX, mouseY]);

    const getRealMousePosition = () => {
        let realX = getRealPixelSize(mouseX);
        let realY = getRealPixelSize(mouseY);

        let x = realX - realX % gridSize;
        let y = realY - realY % gridSize;

        return { x: x, y: y };
    }

  
    return <button key={`zones-${zone.id}`} disabled={isDisabled}  onClick={() => { if (selectedPositionEditor === null) onClick(index) }}  onMouseEnter={() => onMouseEnter(index)} onMouseLeave={() => onMouseLeave(null)} style={{ position: "absolute", left: getComputedPixelSize(tempFinalPosition.left !== undefined ? tempFinalPosition.left : zone.finalPosition.left), top: getComputedPixelSize(tempFinalPosition.top !== undefined ? tempFinalPosition.top : zone.finalPosition.top), width: getComputedPixelSize(tempFinalPosition.width !== undefined ? tempFinalPosition.width : zone.finalPosition.width), height: getComputedPixelSize(tempFinalPosition.height !== undefined ? tempFinalPosition.height : zone.finalPosition.height) }} className={`${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'} ${[toolTypes.Image].includes(zone.type) && isPlaying ? '' : 'rounded'} flex flex-row items-center justify-center ${isPlaying ? '' : isSelected ? 'border border-blue-600' : isHovered ? 'border border-blue-400' : 'border border-gray-200'}`}>
        <div id={zone.id} className={`${isSelected ? 'bg-blue-400' : isHovered ? 'bg-blue-200' : isPlaying && zone.type === toolTypes.Shape ? 'bg-gray-100' : 'bg-gray-400'} overflow-hidden ${[toolTypes.Image].includes(zone.type) && isPlaying ? '' : 'rounded-sm'} opacity-75 w-full h-full pointer-events-none flex flex-row items-center justify-center`}>
            {zone.type === toolTypes.Text && <MenuAlt2Icon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
            {zone.type === toolTypes.Image && <img id={`image-${zone.id}`} src={zone.src ? zone.src : images[index]} alt={`${zone.id}`} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white`} />}
            {zone.type === toolTypes.Shape && <DocumentIcon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
            {zone.type === toolTypes.Video && <FilmIcon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
        </div>
        <div className={`bg-gray-200 pointer-events-none absolute top-0 left-0 flex flex-row items-center justify-center rounded-br rounded-tl-sm space-x-1 p-1 ${isDisabled || !isSelected ? 'hidden' : ''}`}>
            <div className='h-5 w-5 shrink-0 flex rounded text-xs bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-400 items-center justify-center cursor-pointer pointer-events-auto' onClick={(e) => { e.stopPropagation(); onChange(index, 'sequence')}}>
                {zone.sequence}
            </div>
            {animationTypes.map((animation, animIdx) => {
                return <div key={`animationSamll-${zone.id}-${animIdx}`} onClick={() => onChange(index, 'animations', animation.type)} className={`pointer-events-auto cursor-pointer rounded ${zone.animations.includes(animation.type) ? 'bg-blue-200 text-blue-600' : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-400'}`}>
                    <animation.icon className='h-5 w-5' />
                </div>
            })}
        </div>
        {isSelected && <div className='absolute top-0 left-0 w-full h-full pointer-events-auto'>
            <button id="tl" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('tl')}} className='absolute -top-1 -left-1 rounded-full w-2 h-2 bg-blue-600'></button>
            <button id="tr" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('tr')}} className='absolute -top-1 -right-1 rounded-full w-2 h-2 bg-blue-600'></button>
            <button id="bl" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('bl')}} className='absolute -bottom-1 -left-1 rounded-full w-2 h-2 bg-blue-600'></button>
            <button id="br" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('br')}} className='absolute -bottom-1 -right-1 rounded-full w-2 h-2 bg-blue-600'></button>


            <div className='absolute -top-1 left-0 w-full h-2 flex flex-row justify-center pointer-events-none'>
                <button id="t" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('t')}} className='rounded-full w-6 h-2 bg-blue-600 pointer-events-auto'></button>
            </div>

            <div className='absolute -bottom-1 left-0 w-full h-2 flex flex-row justify-center pointer-events-none'>
                <button id="b" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('b')}} className='rounded-full w-6 h-2 bg-blue-600 pointer-events-auto'></button>
            </div>

            <div className='absolute top-0 -left-1 h-full w-2 flex flex-row items-center pointer-events-none'>
                <button id="l" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('l')}} className='rounded-full w-2 h-6 bg-blue-600 pointer-events-auto'></button>
            </div>

            <div className='absolute top-0 -right-1 h-full w-2 flex flex-row items-center pointer-events-none'>
                <button id="r" onMouseDown={(event) => {if (event.button === 0) setSelectedPositionEditor('r')}} className='rounded-full w-2 h-6 bg-blue-600 pointer-events-auto'></button>
            </div>

            <div className='absolute top-0 left-0 h-full w-full flex flex-row items-center justify-center pointer-events-none'>
                <button id="m" onMouseDown={(event) => {if (event.button === 0) setStartMousePosition(getRealMousePosition()); setSelectedPositionEditor('m')}} className='rounded-full w-6 h-6 bg-blue-600 pointer-events-auto'></button>
            </div>
        </div>}
    </button>
}

export default Zone;