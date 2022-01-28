import React, { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import { ViewGridAddIcon, UploadIcon, PhotographIcon } from '@heroicons/react/outline';
import LoadingSpinner from './LoadingSpinner';
import Library from './Library';

const Img = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [src, setSrc] = useState(props.src)
    const [images, setImages] = useState([]);

    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(true);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);

    const { id, imgId, useCanvas, canvasId } = props;

    const handleSwitchImg = (e) => {
        e.preventDefault();
        const { target } = e;
    
        setShowLibrary(!showLibrary);
    };

    useEffect(() => {
        setSrc(props.src);
        if (useCanvas) {
            /* var cnvs = document.getElementById("objectDetectionCanvas");
            var ctx = cnvs.getContext("2d");
            ctx.clearRect(0,0, cnvs.width, cnvs.height); */
            document.getElementById("objectDetectionCanvas").innerHTML = '';
        }
    }, [props.src]);

    const handleOnChange = (media) => {
        setShowLibrary(false);
        setIsLoading(true);
        props.onChange(media);
    }

    const onChange = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setImages(imageList);
        setIsMouseOver(false);
        setIsLoading(true);

        props.onChange(imageList[addUpdateIndex[0]].data_url);
      };

    return <ImageUploading
            value={images}
            onChange={onChange}
            maxNumber={2}
            dataURLKey="data_url"
        >
            {({
            imageList,
            onImageUpload,
            onImageRemoveAll,
            onImageUpdate,
            onImageRemove,
            isDragging,
            dragProps
            }) => (
            <div id={id} {...dragProps} onMouseOver={() => setIsMouseOver(!props.disabled && true)} onMouseLeave={() => setIsMouseOver(!props.disabled && false)} className={`relative pointer-events-auto bg-white h-full overflow-hidden ${props.className ? props.className : ''}`} style={props.style}>
                {src && <img id={imgId} onLoad={() => setIsLoading(false)} src={src} alt={props.alt} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white ${props.imgClassName && props.imgClassName}`} />}
                {useCanvas && <div id={canvasId} className='absolute top-0 left-0 w-full h-full pointer-events-none select-none' style={{ backgroundColor: "transparent" }} ></div>}
                {src && isLoading && <div className="pointer-events-none absolute top-0 left-0 flex w-full h-full items-center justify-center bg-gray-800 bg-opacity-30"><LoadingSpinner className="text-white h-8 w-8 lg:h-12 lg:w-12" /></div>}
                {((isMouseOver && !isLoading && !isDragging && !showLibrary && !props.disabled) || (!src && !props.disabled && !props.controlsOnly && !isDragging )) && <div className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center bg-gray-800 bg-opacity-30"><ViewGridAddIcon onClick={event => handleSwitchImg(event)} className="text-white m-2 hover:text-white cursor-pointer h-8 w-8 lg:h-12 lg:w-12" /><UploadIcon onClick={onImageUpload} className="text-white m-2 hover:text-white cursor-pointer h-8 w-8 lg:h-12 lg:w-12" /></div>}
                {(props.controlsOnly) && <div className="w-full h-full flex flex-row items-center justify-center"><ViewGridAddIcon onClick={event => handleSwitchImg(event)} className="mr-2 text-gray-700 hover:text-gray-600 cursor-pointer h-4 w-4 lg:h-6 lg:w-6" /><UploadIcon onClick={onImageUpload} className="ml-2 text-gray-700 hover:text-gray-600 cursor-pointer h-4 w-4 lg:h-6 lg:w-6" /></div>}
                {<Library modal={props.modalLibrary} isHidden={showLibrary ? (props.disabled ? true : false) : true} preSearchText={props.preSearchText} setSrc={handleOnChange} setShowLibrary={setShowLibrary} />}
                {(!src && props.disabled) && <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center bg-gray-800 bg-opacity-30"><PhotographIcon className="text-white w-1/2" /></div>}
                {isDragging && <div className="pointer-events-none absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center bg-gray-800 bg-opacity-30"><UploadIcon className="text-white hover:text-white cursor-pointer h-12 w-12" /></div>}
            </div>
        )}
    </ImageUploading>
}

export default Img;