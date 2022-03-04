import React, { } from 'react';

import { MenuAlt2Icon, FilmIcon, DocumentIcon } from '@heroicons/react/outline'

import Img from './Img';

const toolTypes = {
    Cursor: 0,
    Text: 1,
    Image: 2,
    Shape: 3,
    Video: 4,
}

const zoneTypes = {
    1: 'Text',
    2: 'Image',
    3: 'Shape',
    4: 'Video',
}

// <ZoneContent zone={} onChange={} isSelected={} isHovered={} isPlaying={} adjusmentWidth={} isPreview={} />

const ZoneContent = ({ zone, index = 1, onChange, onClick = () => {}, onMouseDown = () => {}, isSelected = false, isHovered = false, isDisabled = true, isPlaying = true, adjusmentWidth = 0, isPreview = false }) => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
  
    // UI LOGIC STATES

    // UTILITY FUNCTIONS
    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    const handleOnClick = (event) => {
        if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation(); 
            onClick(event);
        }
    }

    const handleMouseDown = (event) => {
        if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation(); 
            onMouseDown(zone);
        }
    }
  
    return (<>
        {!isPreview ?
        <button key={`zones-${zone.id}`} disabled={isDisabled} onClick={handleOnClick} onMouseDown={handleMouseDown} /* onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} */ 
        style={{ position: "absolute", left: getComputedPixelSize(zone.finalPosition.left), top: getComputedPixelSize(zone.finalPosition.top), width: getComputedPixelSize(zone.finalPosition.width), height: getComputedPixelSize(zone.finalPosition.height), zIndex: index + 50 }} 
        className={`${isDisabled ? 'pointer-events-none' : 'pointer-events-auto'} ${[toolTypes.Image].includes(zone.type) && isPlaying ? '' : 'rounded'} group flex flex-row items-center justify-center ${isPlaying ? '' : isSelected ? 'border border-blue-500' /* : isHovered ? 'border border-blue-400' */ : 'border border-gray-200 hover:border-blue-400'}`}>
            <div id={`${zoneTypes[zone.type]}-${zone.id}`} className={`${isSelected ? 'bg-blue-400' /* : isHovered ? 'bg-blue-200' */ : isPlaying && zone.type === toolTypes.Shape ? 'bg-gray-100' : isPlaying && zone.type === toolTypes.Text ? 'bg-gray-200' : 'bg-gray-400 group-hover:bg-blue-200'} overflow-hidden ${[toolTypes.Image].includes(zone.type) && isPlaying ? '' : 'rounded-sm'} ${isPlaying ? '' : 'opacity-75'} w-full h-full pointer-events-none flex flex-row items-center justify-center`}>
                {zone.type === toolTypes.Text && <MenuAlt2Icon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
                {/* {zone.type === toolTypes.Image && <img id={`image-${zone.id}`} src={zone.src} alt={`${zone.id}`} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white`} />} */}

                {zone.type === toolTypes.Image && <ImgV2 zone={zone} />}

                {/* {zone.type === toolTypes.Image && <Img src={zone.src}
                    onChange={media => {
                        onChange(zone, 'src', media);
                    }} 
                    alt={zone.id} 
                    disabled={isPlaying}
                    id={`img-${zone.id}`}
                    style={{ width: '100%', opacity: 1 }}
                    preSearchText={``}
                    modalLibrary={true} /> } */}

                {zone.type === toolTypes.Shape && <DocumentIcon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
                {zone.type === toolTypes.Video && <FilmIcon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
            </div>
        </button>
        :
        <div id={`${zoneTypes[zone.type]}-${zone.id}`}
            style={{ position: "absolute", left: getComputedPixelSize(zone.finalPosition.left), top: getComputedPixelSize(zone.finalPosition.top), width: getComputedPixelSize(zone.finalPosition.width), height: getComputedPixelSize(zone.finalPosition.height) }}
            className={`${isSelected ? 'bg-blue-400' /* : isHovered ? 'bg-blue-200' */ : isPlaying && zone.type === toolTypes.Shape ? 'bg-gray-100' : isPlaying && zone.type === toolTypes.Text ? 'bg-gray-200' : 'bg-gray-400 group-hover:bg-blue-200'} overflow-hidden ${[toolTypes.Image].includes(zone.type) && isPlaying ? '' : 'rounded-sm'} ${isPlaying ? '' : 'opacity-75'} w-full h-full pointer-events-none flex flex-row items-center justify-center`}>
            
            {zone.type === toolTypes.Text && <MenuAlt2Icon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
            {/* {zone.type === toolTypes.Image && <img id={`image-${zone.id}`} src={zone.src} alt={`${zone.id}`} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white`} />} */}
            {zone.type === toolTypes.Image && <ImgV2 zone={zone} />}
            {zone.type === toolTypes.Shape && <DocumentIcon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
            {zone.type === toolTypes.Video && <FilmIcon key={`zones-${zone.id}-icon`} className={`h-12 w-12 text-white`} />}
        </div>
        }
    </>)
}

const ImgV2 = ({ zone }) => {
    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
  
    // UI LOGIC STATES

    // UTILITY FUNCTIONS

    return <img id={`image-${zone.id}`} onLoad={(e) => console.log(zone.id, JSON.stringify({ height: e.target.naturalHeight, width: e.target.naturalWidth }))} src={zone.src} alt={`${zone.id}`} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white `} />
}

const TextV2 = ({ zone }) => {
    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
  
    // UI LOGIC STATES

    // UTILITY FUNCTIONS

    return <img id={`image-${zone.id}`} src={zone.src} alt={`${zone.id}`} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white`} />
}

export default ZoneContent;