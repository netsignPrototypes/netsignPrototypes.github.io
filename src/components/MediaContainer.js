import React, { Fragment, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import LoadingSpinner from './LoadingSpinner';
import LazyLoad from 'react-lazyload';

const MediaContainer = ({ src, alt, onClick, hoverOptions, selected, metadata }) => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [mediaData, setMediaData] = useState(metadata || {});
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState(src);
  
    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(true);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isSelected, setIsSelected] = useState(selected ? true : false);
  
    const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

    const handleOnClick = (e) => {
        setIsSelected(!isSelected);

        if (onClick) {
            onClick({ value: mediaData, selected: !isSelected });
        }
    }
  
    return (<>
      {isMobile ? 
        <div onClick={handleOnClick} className="aspect-w-16 aspect-h-9 cursor-pointer">
          {isLoading && <div className="flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
          <LazyLoad scrollContainer={"#MediaGrid"}><img onLoad={() => setIsLoading(false)} onError={() => setIsLoading(false)} src={mediaPreviewUrl} alt={mediaData.tags} className="select-none rounded-sm shadow w-full h-full object-center object-cover" /></LazyLoad>
          {((isMouseOver || isMobile || true) && hoverOptions && hoverOptions.length > 0) && <div className="flex flex-row items-end justify-end"><div className="p-1 bg-gray-800 bg-opacity-50 rounded-tl-lg rounded-br-sm">{hoverOptions.map(option => option)}</div></div>}
        </div>
      :
        <div onClick={handleOnClick} onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)} className="aspect-w-16 aspect-h-9 cursor-pointer">
          {isLoading && <div className="flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
          <LazyLoad scrollContainer={"#MediaGrid"}><img onLoad={() => setIsLoading(false)} onError={() => setIsLoading(false)} src={mediaPreviewUrl} alt={mediaData.tags} className="select-none rounded-sm shadow w-full h-full object-center object-cover" /></LazyLoad>
          {((isMouseOver || isMobile || true) && hoverOptions && hoverOptions.length > 0) && <div className="flex flex-row items-end justify-end"><div className="p-1 bg-gray-800 bg-opacity-50 rounded-tl-lg rounded-tl-lg rounded-br-sm">{hoverOptions.map(option => option)}</div></div>}
        </div>
      }
    </>);
}

export default MediaContainer;