import React, { useEffect, useState } from 'react';
import MediaContainer from './MediaContainer';
import LoadingSpinner from './LoadingSpinner';

const MediaGrid = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [medias, setMedias] = useState(props.medias || []);
    const [selectedMedias, setSelectedMedias] = useState(props.selectedMedias || []);

    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMedias(props.medias);
    }, [props.medias])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading])
  
    // UI LOGIC STATES
    const [mediasToDisplay, setMediasToDisplay] = useState([]);

    const handleOnClickMedia = ({ value, isSelected }) => {
        let newSelectedTags = [...selectedMedias];

        if (isSelected) {
            newSelectedTags.push(value);
        } else {
            let index = newSelectedTags.indexOf(value);

            if (index > -1) {
                newSelectedTags.splice(index, 1);
            }
        }

        setSelectedMedias(newSelectedTags);

        props.setSrc(value.largeImageURL);
    }

    const checkAsSimilarMedias = (index) => {

        let currentSelectedSearchTag = props.selectedSearchTags.length > 0 ? props.selectedSearchTags[props.selectedSearchTags.length - 1] : "";
    
        let asSimilarImages = false;
    
        medias[index].tags.split(", ").forEach(tag => {
          let tagFound = props.costumSearchTags.find(costumTag => costumTag.word === tag);
    
          if (tagFound && currentSelectedSearchTag !== tag && !props.selectedSearchTags.includes(tag)) {
            asSimilarImages = true;
          }
        })
    
        return asSimilarImages;
    }

    const handleShowSimilarMedias = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const NB_IMAGE_TO_DISPLAY = 20
    
        let tagToSelect = "";
        let nbImagesForTag = 0;
        let currentSelectedSearchTag = props.selectedSearchTags.length > 0 ? props.selectedSearchTags[props.selectedSearchTags.length - 1] : "";
    
        medias[index].tags.split(", ").forEach(tag => {
          let tagFound = props.costumSearchTags.find(costumTag => costumTag.word === tag);
    
          if (tagFound && tagFound.nbImages > nbImagesForTag && currentSelectedSearchTag !== tag && !props.selectedSearchTags.includes(tag)) {
            tagToSelect = tagFound.word;
            nbImagesForTag = tagFound.nbImages;
          }
        })
    
        if (tagToSelect !== "") {
          let newSelectedSearchTags = [...props.selectedSearchTags]; //.splice(0, selectedSearchTags.length - 1);
    
          /* let tagExistIdx = newSelectedSearchTags.findIndex(tag => tag === tagToSelect);
    
          if (tagExistIdx > -1) {
            newSelectedSearchTags.splice(tagExistIdx, 1);
          } */
    
          newSelectedSearchTags.push(tagToSelect);
          props.setSelectedSearchTags(newSelectedSearchTags);
    
          let newImagesToDisplay = [...medias];
    
          let indexSelectedSearchTag = newSelectedSearchTags.length - 1;
    
          if (newSelectedSearchTags.length > 0) {
            newImagesToDisplay = newImagesToDisplay.filter(image => {
              let match = false;
              if (!match) {
                match = image.tags.includes(newSelectedSearchTags[indexSelectedSearchTag]);
              }
    
              return match;
            });
    
            if (newImagesToDisplay.length > 0) {
              if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
                newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
              }
              setMediasToDisplay(newImagesToDisplay);
            }
          } else {
            if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
              newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
            }
            setMediasToDisplay(newImagesToDisplay);
          }
        }
    }

    return (
        <div className={`container grid md:grid-cols-4 grid-cols-3 gap-1 lg:grid-cols-4 lg:gap-2 max-h-full overflow-auto ${props.className}`}>
            {medias.map((media, index) => {
                return <MediaContainer key={media.id} alt={media.tags} metadata={media} onClick={handleOnClickMedia} src={media.previewURL} /* hoverOptions={checkAsSimilarMedias(index) ? [<ViewGridAddIcon onClick={event => handleShowSimilarMedias(event, index)} className="h-4 w-4 lg:h-5 lg:w-5 text-white hover:text-opacity-75" />] : []} */ />
            })}
            {isLoading && <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center bg-white bg-opacity-30"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
        </div>
    )
}

export default MediaGrid;