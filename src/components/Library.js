import React, { useEffect, useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { useMediaQuery } from 'react-responsive';
import CloudNaturalLanguageAPI from '../modules/CloudNaturalLanguageAPI';
import PixaBayAPI from '../modules/PixaBayAPI'
import LoadingSpinner from './LoadingSpinner';
import TagSearchBar from './TagSearchBar';
import MediaGrid from './MediaGrid';

const Library = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [searchedText, setSearchedText] = useState("");
    const [medias, setMedias] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [language, setLanguage] = useState("fr");
  
    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMedias, setIsLoadingMedias] = useState(false);

    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

    useEffect(() => {

        if (!props.isHidden && props.preSearchText !== searchedText) {
            setSearchedText(props.preSearchText);
            initTagSearchBar(props.preSearchText);
        }
        
    }, [props.isHidden])

    const initTagSearchBar = (text) => {
        CloudNaturalLanguageAPI.analyzeEntities(text).then((Result)=>{
          console.log('analyzeEntities', Result);
    
          setIsLoading(false);
    
          if (Result.entities.length > 0) {
    
            let wordsArray = [];
            let searchWords = [];
    
            setLanguage(Result.language);
    
            Result.entities.forEach((words, index) => {
    
              let word = {};
    
              word.considered = false;
              word.text = words.name.toLowerCase();
              word.salience = words.salience;
              word.searched = false;
              word.addedSearch = false;
    
              if (words.salience >= 0.07 && wordsArray.findIndex(word => word.text.toUpperCase() === words.name.toUpperCase()) == -1) {
                word.considered = true;
    
                if (((index > 0 && words.salience >= 0.50) || index < 1)) {
                  searchWords.push(words.name.toLowerCase());
                  word.searched = true;
                }
              }
    
              wordsArray.push(word);
            });
    
            let filteredWordsArray = wordsArray.filter(word => word.considered);
    
            /* setSearchQueryWords(filteredWordsArray); */

            let newTags = filteredWordsArray.map(word => word.text);

            setTags(newTags)
            setSelectedTags(searchWords);
    
            getCorrespondingImages(searchWords, Result.language);
    
            console.log('wordsArray', wordsArray);
    
          } else {
            getCorrespondingImages([], Result.language);
          }
    
          setIsLoading(false);
    
        }).catch((Err)=>{
          console.log('Saving API errors', Err);
          setIsLoading(false);
        });
    }

    const getCorrespondingImages = (words, lang = language) => {

        setIsLoadingMedias(true);

        PixaBayAPI.getCorrespondingImages(words, lang).then((Result)=>{
            console.log('getCorrespondingImages', Result);

            setMedias(Result.hits);

            setIsLoading(false);
            setIsLoadingMedias(false);

            /* let customTags = getCustomTags(Result.hits, words);
            setCustomSearchTags(customTags); */

        }).catch((Err)=>{
            console.log('Saving API errors', Err);
            setIsLoading(false);
        });

        /* PixaBayAPI.getCorrespondingImagesUnsplash(words, lang).then((Result)=>{
            console.log('getCorrespondingImagesUnsplash', Result);

            setImages(Result.hits);

            setIsLoading(false);

        }).catch((Err)=>{
            console.log('getCorrespondingImagesUnsplash', Err);
            setIsLoading(false);
        }); */
    }

    return <div className={`${isMobile || props.modal ? "fixed z-50 top-0 left-0" : "absolute top-0 left-0"} pointer-events-auto p-4 lg:p-12 w-full h-full flex flex-col space-y-2 items-center justify-start bg-gray-800 bg-opacity-30 ${props.isHidden ? 'hidden' : ''}`} style={{ background: 'rgba(16,18,27,0.4)', backdropFilter: 'blur(6px)' }}>

        <div className={`pointer-events-auto relative flex flex-col lg:max-w-2xl w-full h-full items-start justify-start bg-gray-100 rounded`}>
            {isLoading && <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
            <XIcon onClick={() => props.setShowLibrary(false)} className="absolute top-2 right-2 text-gray-700 hover:text-gray-600 cursor-pointer h-5 w-5 lg:h-6 lg:w-6" />
            <TagSearchBar className="mb-2 pt-3 pl-3 pr-8" onChange={getCorrespondingImages} tags={tags} selectedTags={selectedTags} />
            <MediaGrid className="rounded-sm mb-3 pl-3 mr-3" isLoading={isLoadingMedias} setSrc={props.setSrc} medias={medias} />
        </div>

    </div>
}

export default Library;