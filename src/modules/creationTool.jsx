import React, { useState } from 'react'
import CloudNaturalLanguageAPI from './CloudNaturalLanguageAPI';
import PixaBayAPI from './PixaBayAPI'
import { ArrowCircleLeftIcon, ArrowLeftIcon, BeakerIcon, SparklesIcon, PlusSmIcon, MinusSmIcon, XCircleIcon, PlusCircleIcon, MinusCircleIcon, PlayIcon, StopIcon, CollectionIcon, ViewGridAddIcon } from '@heroicons/react/outline'
import {  } from '@heroicons/react/solid'
import Resizer from './resizer';

//const defaultText = "La beauté est dans le regard de celui qui regarde.";

//const defaultText = "A sign of the return of the beautiful season, this unique exhibition in the country, which showcases the poetry of the shape of the egg, is coming to Quebec for the first time. A dozen emerging and established artists take over the spaces of the mall, giving the public free rein to their imagination."

const defaultText = "";
const NB_IMAGE_TO_DISPLAY = 20;

/* const TEXT_ZONE_POSITION_SPACE = "1";
const TEXT_ZONE_BG = "rounded-md bg-gray-800 bg-opacity-20"; */

const TEXT_ZONE_POSITION_SPACE = "0";
const TEXT_ZONE_BG_DEFAULT = "cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 rounded-md text-transparent"; //rounded-md bg-gray-800 bg-opacity-20

//const TEXT_ZONE_BG = "cursor-pointer border-2 border-transparent hover:border-blue-600 hover:border-opacity-50 rounded-md";
//const TEXT_ZONE_BG = '';

//const DEV_POSITION_ZONES_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
const DEV_POSITION_ZONES_NUMBERS = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',];

const DEFAULT_TEXT_MAX_WIDTH = 60;

const TEXT_ZONE_POSITION_CLASS = {
	1: {containerClass: 'items-start justify-start', zoneClass: 'mr-10 mb-10 max-w-60 rounded-br-sm', textClass: 'pt-8 pl-8 pb-4 pr-5'},
	2: {containerClass: 'items-start justify-start', zoneClass: 'mx-10 mb-10 max-w-60 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'},
	3: {containerClass: 'items-start justify-center', zoneClass: 'mx-10 mb-10 max-w-60 rounded-b-sm text-center', textClass: 'pt-8 pb-3 px-4'},
	4: {containerClass: 'items-start justify-end', zoneClass: 'mx-10 mb-10 max-w-60 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'},
	5: {containerClass: 'items-start justify-end', zoneClass: 'ml-10 mb-10 max-w-60 rounded-bl-sm', textClass: 'pt-8 pr-8 pb-4 pl-5'},
	6: {containerClass: 'items-start justify-start', zoneClass: 'my-10 mr-10 max-w-60 rounded-r-sm pl-8 py-3 pr-4', textClass: ''},
	7: {containerClass: 'items-start justify-start', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'},
	8: {containerClass: 'items-start justify-center', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm text-center', textClass: 'py-3 px-4'},
	9: {containerClass: 'items-start justify-end', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'},
	10: {containerClass: 'items-start justify-end', zoneClass: 'my-10 ml-10 max-w-60 rounded-l-sm', textClass: 'pr-8 py-3 pl-4'},
	11: {containerClass: 'items-center justify-start', zoneClass: 'my-10 mr-10 max-w-60 rounded-r-sm', textClass: 'pl-8 py-3 pr-4'},
	12: {containerClass: 'items-center justify-start', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'},
	13: {containerClass: 'items-center justify-center', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm text-center', textClass: 'py-3 px-4'},
	14: {containerClass: 'items-center justify-end', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'},
	15: {containerClass: 'items-center justify-end', zoneClass: 'my-10 ml-10 max-w-60 rounded-l-sm', textClass: 'pr-8 py-3 pl-4'},
	16: {containerClass: 'items-end justify-start', zoneClass: 'my-10 mr-10 max-w-60 rounded-r-sm', textClass: 'pl-8 py-3 pr-4'},
	17: {containerClass: 'items-end justify-start', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'},
	18: {containerClass: 'items-end justify-center', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm text-center', textClass: 'py-3 px-4'},
	19: {containerClass: 'items-end justify-end', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'},
	20: {containerClass: 'items-end justify-end', zoneClass: 'my-10 ml-10 max-w-60 rounded-l-sm', textClass: 'pr-8 py-3 pl-4'},
	21: {containerClass: 'items-end justify-start', zoneClass: 'mr-10 mt-10 max-w-60 rounded-tr-sm', textClass: 'pb-8 pl-8 pt-4 pr-5'},
	22: {containerClass: 'items-end justify-start', zoneClass: 'mx-10 mt-10 max-w-60 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'},
	23: {containerClass: 'items-end justify-center', zoneClass: 'mx-10 mt-10 max-w-60 rounded-t-sm text-center', textClass: 'pb-8 pt-3 px-4'},
	24: {containerClass: 'items-end justify-end', zoneClass: 'mx-10 mt-10 max-w-60 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'},
	25: {containerClass: 'items-end justify-end', zoneClass: 'ml-10 mt-10 max-w-60 rounded-tl-sm', textClass: 'pb-8 pr-8 pt-4 pl-5'}
};

const LibraryMediaContainer = ({ src, alt, onClick, hoverOptions }) => {

  // STATES MANAGEMENT ------------------------------------------------------------------------------

  // DATA STATES
  const [mediaData, setMediaData] = useState({});
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(src);

  // UI LOGIC STATES
  const [isLoading, setIsLoading] = useState(true);
  const [isMouseOver, setIsMouseOver] = useState(false);

  return (
    <div onClick={onClick} onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)} className="aspect-w-16 aspect-h-9 cursor-pointer">
      {isLoading && <div className="flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
      <img onLoad={() => setIsLoading(false)} src={mediaPreviewUrl} alt={mediaData.tags} className="select-none rounded-sm shadow w-full h-full object-center object-cover" />
      {(isMouseOver && hoverOptions.length > 0) && <div className="flex flex-row items-end justify-end"><div className="p-1 bg-gray-800 bg-opacity-50 rounded-tl-lg">{hoverOptions.map(option => option)}</div></div>}
    </div>
  );
}

const LoadingSpinner = ({ className }) => {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

const CreationTool = ({ isHidden }) => {
  const [text, setText] = useState(defaultText);
  const [textMaxWidth, setTextMaxWidth] = useState(DEFAULT_TEXT_MAX_WIDTH);
  const [searchQueryWords, setSearchQueryWords] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesToDisplay, setImagesToDisplay] = useState([]);
  const [language, setLanguage] = useState("fr");
  const [pixaBayData, setPixaBayData] = useState({});
  const [thumbBgImage, setThumbBgImage] = useState("");
  const [thumbText, setThumbText] = useState("");
  const [thumbTemplate, setThumbTemplate] = useState(4);

  const [playingPreview, setPlayingPreview] = useState(true);

  const [thumbPreviewTextClass, setThumbPreviewTextClass] = useState({});
  const [thumbTextClass, setThumbTextClass] = useState({containerClass: 'items-center justify-center', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm text-center', textClass: 'py-3 px-4'});

  const [thumbTextZoneAllowPreview, setThumbTextZoneAllowPreview] = useState(true);

  const [costumSearchTags, setCustomSearchTags] = useState([]);
  const [selectedSearchTags, setSelectedSearchTags] = useState([]);
  const [searchData, setSearchData] = useState({});

  const [TEXT_ZONE_BG, setTextZoneBg] = useState(TEXT_ZONE_BG_DEFAULT);

  const [thumbFontSize, setThumbFontSize] = useState("thumb3");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingThumbImage, setIsLoadingThumbImage] = useState(false);
  const [isThumbCreated, setIsThumbCreated] = useState(false);

  const analyzeEntities = (text) => {
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

        getCorrespondingImages(searchWords, Result.language);
        setSelectedSearchTags([]);
        setPlayingPreview(true);

        searchPixaBayData(filteredWordsArray, Result.language, filteredWordsArray, searchWords);

        console.log('wordsArray', wordsArray);
      } else {
        getCorrespondingImages([], Result.language);
        setSelectedSearchTags([]);
        setSearchQueryWords([]);
        setPlayingPreview(true);
      }

      setIsLoading(false);

    }).catch((Err)=>{
      console.log('Saving API errors', Err);
      setIsLoading(false);
    });
  }

  const getCorrespondingImages = (words, lang) => {
    PixaBayAPI.getCorrespondingImages(words, lang).then((Result)=>{
      console.log('getCorrespondingImages', Result);

      setImages(Result.hits);

      let newImagesToDisplay = [...Result.hits];

      setImagesToDisplay(newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY))

      setIsLoading(false);

      let customTags = getCustomTags(Result.hits, words);
      setCustomSearchTags(customTags);

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

  const getCustomTags = (imagesFound, searchedWords) => {
    let importantTags = {};

    let importantTagsArr = [];

    let wordExistInTags = false;

    imagesFound.forEach(image => {
      image.tags.split(", ").forEach(tag => {
        tag = tag.toLowerCase();
        if (!importantTags[tag]) {
          importantTags[tag] = 1;
        } else {
          importantTags[tag] += 1;
        }
      });
    });

    const objectArray = Object.entries(importantTags);

    objectArray.forEach(([key, value]) => {
      let confidence = value / imagesFound.length * 100;

      if (/* confidence >= POURC_OF_CONFIDENCE */ value >= 3) {
        if (!searchedWords.includes(key)) {
          importantTagsArr.push({ word: key, confidence: confidence, nbImages: value });
        }
      }
    });

    console.log('getCustomTags', importantTagsArr);

    setSelectedSearchTags([]);

    return importantTagsArr;
  }

  const searchPixaBayData = (words, lang, newSearchWords, searchWords) => {

    let promises = [];

    const NB_TAG_OCCURENCE = 7;
    const NB_IMAGE_TO_ANALIZE = 100;
    const POURC_OF_CONFIDENCE = 0.5;

    words.forEach(word => {
      promises.push(PixaBayAPI.getCorrespondingImages([word.text], lang, NB_IMAGE_TO_ANALIZE).then((Result)=>{

        let importantTags = {};

        let importantTagsArr = [];

        let wordExistInTags = false;

        Result.hits.forEach(image => {
          image.tags.split(", ").forEach(tag => {
            tag = tag.toLowerCase();
            if (!importantTags[tag]) {
              importantTags[tag] = 1;
            } else {
              importantTags[tag] += 1;
            }
          });
        });

        const objectArray = Object.entries(importantTags);

        objectArray.forEach(([key, value]) => {
          let confidence = value / Result.hits.length * 100;

          if (/* confidence >= POURC_OF_CONFIDENCE */ value >= NB_TAG_OCCURENCE) {
            if (word.text.toLowerCase() === key) {
              wordExistInTags = true;
            }
            importantTagsArr.push({ word: key, confidence: confidence, nbImages: value });
          }
        });

        return { word: word.text, tags: importantTagsArr, result: Result.hits, total: Result.total, totalHits: Result.totalHits, wordExistInTags: wordExistInTags };
      }).catch((Err)=>{
        console.log('Saving API errors', Err);
      }));
    });

    Promise.all(promises).then(pixaBayDatas => {
      console.log(pixaBayDatas);

      let filteredWordsToRemoveArray = pixaBayDatas.filter(word => !word.wordExistInTags);

      let tagSearchData = {};

      let oneTagSearched = false;

      pixaBayDatas.forEach(wordSearched => {
        if (/* !wordSearched.wordExistInTags ||  */wordSearched.result.length < 10) {
          newSearchWords.splice(newSearchWords.findIndex(word => word.text === wordSearched.word),1);
        }
        tagSearchData[wordSearched.word] = wordSearched.tags;
      });

      setSearchQueryWords(newSearchWords);

      if (newSearchWords.length === 0) {
        getCorrespondingImages([], lang);
      }

      setSearchData(tagSearchData);

      /* if (searchWords.length === 1) {
        setCustomSearchTags(tagSearchData[searchWords[0]]);
      } else {
        setCustomSearchTags([]);
      } */

    }).catch(reason => {
      console.log(reason)
    });
    
  }

  const handleCreateThumb = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsThumbCreated(true);
    analyzeEntities(text);
    setThumbText(text);
    setThumbBgImage("");
  }

  const handleChange = (e) => {
    const { target } = e;
    const { value } = target;
    e.persist();

    setText(value);
  };

  const handleChangeQueryWords = (e, index) => {
    e.preventDefault();
    const { target } = e;
    /* const { value } = target; */

    let wordsArray = [...searchQueryWords];

    let searchWords = [];

    if (wordsArray[index].addedSearch) {
      wordsArray[index].addedSearch = false;
    } else if (wordsArray[index].searched) {
      wordsArray.forEach(word => {
        word.addedSearch = false;
      });
    } else {
      let currentSearchWordIndex = wordsArray.findIndex(word => word.searched);

      wordsArray[currentSearchWordIndex].searched = false;

      wordsArray[index].searched = true;

      wordsArray.forEach(word => {
        word.addedSearch = false;
      });
    }

    wordsArray.sort((a, b) => {
      if ( (a.searched ? 1 : a.addedSearch ? 2 : 3) < (b.searched ? 1 : b.addedSearch ? 2 : 3) ){
        return -1;
      }
      if ( (a.searched ? 1 : a.addedSearch ? 2 : 3) > (b.searched ? 1 : b.addedSearch ? 2 : 3) ){
        return 1;
      }
      return 0;
    });
    

    setSearchQueryWords(wordsArray);

    wordsArray.forEach(word => {
      if (word.searched || word.addedSearch) {
        searchWords.push(word.text);
      }
    });

    /* if (searchWords.length === 1) {
      setCustomSearchTags(searchData[searchWords[0]]);
    } else {
      setCustomSearchTags([]);
    } */

    PixaBayAPI.getCorrespondingImages(searchWords, language).then((Result)=>{

      console.log('getCorrespondingImages', Result);

      setImages(Result.hits);
      let newImagesToDisplay = [...Result.hits];
      setImagesToDisplay(newImagesToDisplay.splice(0, NB_IMAGE_TO_DISPLAY))
      setIsLoading(false);
      let customTags = getCustomTags(Result.hits, searchWords);
      setCustomSearchTags(customTags);
    }).catch((Err)=>{
      console.log('Saving API errors', Err);
      setIsLoading(false);
    });

    /* PixaBayAPI.getCorrespondingImagesUnsplash(searchWords, language).then((Result)=>{

      console.log('getCorrespondingImagesUnsplash', Result);

      setImages(Result.hits);
      setIsLoading(false);
    }).catch((Err)=>{
      console.log('Saving API errors', Err);
      setIsLoading(false);
    }); */
  };

  const handleChangeAddSearchQueryWord = (e, index) => {
    e.preventDefault();
    const { target } = e;

    let wordsArray = [...searchQueryWords];

    let searchWords = [];

    wordsArray[index].addedSearch = !wordsArray[index].addedSearch;
    

    wordsArray.sort((a, b) => {
      if ( (a.searched ? 1 : a.addedSearch ? 2 : 3) < (b.searched ? 1 : b.addedSearch ? 2 : 3) ){
        return -1;
      }
      if ( (a.searched ? 1 : a.addedSearch ? 2 : 3) > (b.searched ? 1 : b.addedSearch ? 2 : 3) ){
        return 1;
      }
      return 0;
    });
    

    setSearchQueryWords(wordsArray);

    wordsArray.forEach(word => {
      if (word.searched || word.addedSearch) {
        searchWords.push(word.text);
      }
    });

    /* if (searchWords.length === 1) {
      setCustomSearchTags(searchData[searchWords[0]]);
    } else {
      setCustomSearchTags([]);
    } */

    PixaBayAPI.getCorrespondingImages(searchWords, language).then((Result)=>{

      console.log('getCorrespondingImages', Result);

      setImages(Result.hits);
      let newImagesToDisplay = [...Result.hits];
      setImagesToDisplay(newImagesToDisplay.splice(0, NB_IMAGE_TO_DISPLAY))
      setIsLoading(false);
      let customTags = getCustomTags(Result.hits, searchWords);
      setCustomSearchTags(customTags);
    }).catch((Err)=>{
      console.log('Saving API errors', Err);
      setIsLoading(false);
    });
  }

  const handleChangeSelectedSearchTags = (e, index) => {
    e.preventDefault();
    const { target } = e;

    let newSelectedSearchTags = [...selectedSearchTags];

    let selectedTag = costumSearchTags[index].word;

    if (newSelectedSearchTags.includes(selectedTag)) {
      newSelectedSearchTags.splice(newSelectedSearchTags.findIndex(tag => tag === selectedTag),1);
    } else {
      newSelectedSearchTags.push(selectedTag);
    }

    setSelectedSearchTags(newSelectedSearchTags);

    let newImagesToDisplay = [...images];

    if (newSelectedSearchTags.length > 0) {
      newImagesToDisplay = newImagesToDisplay.filter(image => {
        let match = false;
        newSelectedSearchTags.forEach(tag => {
          if (!match) {
            match = image.tags.includes(tag);
          }
        })

        return match;
      });

      if (newImagesToDisplay.length > 0) {
        if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
          newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
        }
        setImagesToDisplay(newImagesToDisplay);
      }
    } else {
      if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
        newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
      }
      setImagesToDisplay(newImagesToDisplay);
    }
    
  };

  const handleChangeAutoSelectedSearchTags = (e, index) => {
    e.preventDefault();
    const { target } = e;

    let newSelectedSearchTags = [...selectedSearchTags].splice(0, index + 1);

    setSelectedSearchTags(newSelectedSearchTags);

    let newImagesToDisplay = [...images];
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
        setImagesToDisplay(newImagesToDisplay);
      }
    } else {
      if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
        newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
      }
      setImagesToDisplay(newImagesToDisplay);
    }
    
  };


  const handleChangeThumbBgImage = (e, index) => {
    e.preventDefault();
    const { target } = e;

    /* if (!playingPreview && thumbBgImage !== "") {
      setPlayingPreview(true);
    } */

    if (thumbBgImage !== imagesToDisplay[index].fullHDURL) {
      setIsLoadingThumbImage(true);
    }
    

    setThumbBgImage(imagesToDisplay[index].fullHDURL);
  };

  const handleShowSimilarImages = (e, index) => {
    e.preventDefault();
    e.stopPropagation();

    let tagToSelect = "";
    let nbImagesForTag = 0;
    let currentSelectedSearchTag = selectedSearchTags.length > 0 ? selectedSearchTags[selectedSearchTags.length - 1] : "";

    imagesToDisplay[index].tags.split(", ").forEach(tag => {
      let tagFound = costumSearchTags.find(costumTag => costumTag.word === tag);

      if (tagFound && tagFound.nbImages > nbImagesForTag && currentSelectedSearchTag !== tag && !selectedSearchTags.includes(tag)) {
        tagToSelect = tagFound.word;
        nbImagesForTag = tagFound.nbImages;
      }
    })

    if (tagToSelect !== "") {
      let newSelectedSearchTags = [...selectedSearchTags]; //.splice(0, selectedSearchTags.length - 1);

      /* let tagExistIdx = newSelectedSearchTags.findIndex(tag => tag === tagToSelect);

      if (tagExistIdx > -1) {
        newSelectedSearchTags.splice(tagExistIdx, 1);
      } */

      newSelectedSearchTags.push(tagToSelect);
      setSelectedSearchTags(newSelectedSearchTags);

      let newImagesToDisplay = [...images];

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
          setImagesToDisplay(newImagesToDisplay);
        }
      } else {
        if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
          newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
        }
        setImagesToDisplay(newImagesToDisplay);
      }
    }
  }

  const checkAsSimilarImages = (index) => {

    let currentSelectedSearchTag = selectedSearchTags.length > 0 ? selectedSearchTags[selectedSearchTags.length - 1] : "";

    let asSimilarImages = false;

    imagesToDisplay[index].tags.split(", ").forEach(tag => {
      let tagFound = costumSearchTags.find(costumTag => costumTag.word === tag);

      if (tagFound && currentSelectedSearchTag !== tag && !selectedSearchTags.includes(tag)) {
        asSimilarImages = true;
      }
    })

    return asSimilarImages;
  }

  const handleChangeThumbTemplate = (e, template) => {
    e.preventDefault();
    const { target } = e;

    setThumbTemplate(template);
  }

  const handleChangeThumbFontSize = (e, fontSize) => {
    e.preventDefault();
    const { target } = e;

    setThumbFontSize(fontSize);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsLoading(true);
      setIsThumbCreated(true);
      analyzeEntities(text);
      setThumbText(text);
      setThumbBgImage("");
    }
  }

  const handlePreviousSelectedSearchTag = (e) => {
    e.preventDefault();
    const { target } = e;

    let newSelectedSearchTags = [...selectedSearchTags].splice(0, selectedSearchTags.length - 1);

    setSelectedSearchTags(newSelectedSearchTags);

    let newImagesToDisplay = [...images];
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
        setImagesToDisplay(newImagesToDisplay);
      }
    } else {
      if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
        newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
      }
      setImagesToDisplay(newImagesToDisplay);
    }
  }

  const handleOverTextZonePosition = (e, classList) => {
    e.preventDefault();
    e.stopPropagation();
    const { target } = e;

    if (thumbTextZoneAllowPreview) {
      setThumbPreviewTextClass(classList);
    }
    
  }

  const handleOutTextZonePosition = (e) => {
    e.preventDefault();
    const { target } = e;

    setThumbPreviewTextClass({});
    setThumbTextZoneAllowPreview(true);
    setTextZoneBg(TEXT_ZONE_BG_DEFAULT);
  }

  const handleClickTextZonePosition = (e, positionNo) => {
    e.preventDefault();
    const { target } = e;

    let newThumbTextClass = {};

    if (thumbTextZoneAllowPreview) {
      newThumbTextClass = {...thumbPreviewTextClass};
      setThumbTextClass(TEXT_ZONE_POSITION_CLASS[positionNo]);
      setThumbPreviewTextClass({});
      setThumbTextZoneAllowPreview(false);
      setTextZoneBg("text-transparent");
    } else {
      newThumbTextClass = {...thumbTextClass};
      setThumbTextZoneAllowPreview(true);
      setTextZoneBg(TEXT_ZONE_BG_DEFAULT);
      setThumbPreviewTextClass(thumbTextClass);
    }
    
  }

  const handlePlayingPreview = (e, play) => {
    e.preventDefault();
    const { target } = e;

    setPlayingPreview(play);
  }

  /* const handleResize = (movementX, movementY) => {

    let currentMaxWidth = {...textMaxWidth};

    setTextMaxWidth(currentMaxWidth + movementX);

    console.log(handleResize, movementX);
  }; */

  return (
    <div className={`min-h-screen flex-col lg:flex-row items-start justify-center bg-gray-50 py-20 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-0 lg:space-x-40 ${isHidden ? 'hidden' : 'flex'}`}>
      <div className="max-w-2xl w-full space-y-3">
        <div className="flex flex-col items-start justify-start">
          <h2 className="ml-2 text-left text-3xl font-extrabold text-gray-900 select-none">Création simplifiée</h2>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 w-full">
          <div className="flex flex-row item-center justify-center align-middle space-x-2 bg-gray-100 p-2 rounded-md w-full">
            <div className="w-full">
              <label htmlFor="texte" className="sr-only">
                Écrivez le texte qui s'affichera dans la vignette
              </label>
              <textarea
                id="texte"
                onChange={handleChange}
                value={text}
                name="texte"
                type="textarea"
                required
                className="resize-none appearance-none rounded-none relative block w-full h-20 max-h-20 px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Écrivez le texte qui s'affichera dans la vignette"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div onClick={handleCreateThumb} className="rounded-md select-none font-medium py-1 px-2 text-center text-sm text-white shadow align-middle bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500 flex items-center justify-center">
              {isLoading ? <LoadingSpinner className="h-5 w-5 text-white" /> : 'GO'}
            </div>
          </div>
          
        </div>
        {isThumbCreated ? <>

        {(selectedSearchTags.length > 0 || searchQueryWords.length > 0) && <div className="flex flex-col flex-wrap item-center justify-start align-middle bg-gray-100 p-1 rounded-md w-full">
          <div className="flex flex-row flex-wrap item-center justify-start align-middle">
            {searchQueryWords.length > 0 && searchQueryWords.map((word, index) => {
              return <div className={`flex flex-row flex-wrap item-center justify-start align-middle rounded-full my-1 ${(word.searched || word.addedSearch) && searchQueryWords[index + 1] && (!searchQueryWords[index + 1].addedSearch) ? 'mr-8' : (word.searched || word.addedSearch) ? 'mr-px' : 'mr-1 ml-1' }`}>
                {(!word.searched && !(word.addedSearch && !word.searched)) && <div onClick={event => handleChangeAddSearchQueryWord(event, index)} value={index} key={index + '-words23'} className={"rounded-full mx-0.5 text-center text-xs flex items-center justify-center align-middle cursor-pointer border-2 text-blue-600 hover:text-blue-500 border-gray-100"}>
                  <PlusCircleIcon key={index + '-words23Ico'} className="h-5 w-5"/>
                </div>}
                <div onClick={event => handleChangeQueryWords(event, index)} value={index} key={word.text + '-words'} className={`${word.searched && searchQueryWords[index + 1] && (searchQueryWords[index + 1].addedSearch) ? 'rounded-l-full' : word.addedSearch && searchQueryWords[index + 1] && (searchQueryWords[index + 1].addedSearch) ? '' : word.addedSearch ? 'rounded-r-full' : 'rounded-full' } py-0.5 px-2 text-center text-xs flex items-center justify-center align-middle cursor-pointer border-2 select-none ` + 
                  (word.searched ? "text-white bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500" : (word.addedSearch && !word.searched) ? "text-white bg-blue-500 hover:bg-blue-400 cursor-pointer border-2 border-blue-500 hover:border-blue-400" : "text-gray-900 bg-gray-300 hover:bg-gray-200 border-gray-300 hover:border-gray-200 rounded-r-full")}>
                  {word.text} {word.addedSearch && <XCircleIcon key={index + '-wordsIco'} className="ml-2 h-4 w-4"/>}
                </div>
              </div>
            })}
          </div>
          <div className="flex flex-row flex-wrap item-center justify-start align-middle">
            {selectedSearchTags.length > 0 && <div onClick={handlePreviousSelectedSearchTag} className="flex flex-row flex-wrap item-center justify-start align-middle m-1 cursor-pointer"><ArrowCircleLeftIcon className="h-5 w-5 text-blue-500"/></div>}
            {selectedSearchTags.map((tag, index) => {
                return <div onClick={event => handleChangeAutoSelectedSearchTags(event, index)} value={index} key={tag + '-selectedSearchTags'} className={"select-none rounded-md ml-1 text-center text-xs flex items-center justify-center align-middle cursor-pointer " + 
                (selectedSearchTags.length - 1 === index ? "text-blue-500 cursor-pointer" : "text-gray-400 cursor-pointer")}>
                  {tag} {selectedSearchTags.length - 1 !== index && '/'}
                </div>
              })}
          </div>
        </div>}

        <div className="container grid grid-cols-4 gap-2 mx-auto">
          {imagesToDisplay.map((image, index) => {
            return <LibraryMediaContainer key={image.id} alt={image.tags} onClick={event => handleChangeThumbBgImage(event, index)} src={image.previewURL} hoverOptions={checkAsSimilarImages(index) ? [<ViewGridAddIcon onClick={event => handleShowSimilarImages(event, index)} className="h-5 w-5 text-white hover:text-opacity-75" />] : []} />
          })}
        </div></> : <></>}
      </div>
      <div className="max-w-2xl w-full space-y-4">
        {isThumbCreated && <><div className="w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md shadow overflow-hidden">
          {thumbBgImage !== "" && <div className="overflow-hidden"><img src={thumbBgImage} alt="ThumbBg" onLoad={event => {handlePlayingPreview(event, true); setIsLoadingThumbImage(false)}} onAnimationStart={event => handlePlayingPreview(event, true)} onAnimationEnd={event => handlePlayingPreview(event, false)} className={`${playingPreview ? 'zoom-in-zoom-out' : 'zoom-ended'} select-none rounded-md w-full h-full object-center object-cover`} /></div>}

          {/* <div className={`flex flex-col w-full h-full p-${TEXT_ZONE_POSITION_SPACE} space-y-${TEXT_ZONE_POSITION_SPACE}`} onMouseLeave={event => handleOutTextZonePosition(event)}>
            <div className={`flex flex-row h-8 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'w-2/5 rounded-br-sm', textClass: 'pt-8 pl-8 pb-4 pr-5'})}>{DEV_POSITION_ZONES_NUMBERS[1]}</div>
              <div className={`flex-grow h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'w-full', textClass: 'pt-8 px-8 pb-4'})}>{DEV_POSITION_ZONES_NUMBERS[2]}</div>
              <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'w-2/5 rounded-bl-sm', textClass: 'pt-8 pr-8 pb-4 pl-5'})} >{DEV_POSITION_ZONES_NUMBERS[3]}</div>
            </div>
            <div className={`flex flex-row flex-grow space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'h-full w-2/5', textClass: 'py-8 pl-8 pr-7'})}>{DEV_POSITION_ZONES_NUMBERS[4]}</div>
              <div className="flex-grow h-full">

                <div className={`flex flex-col w-full h-full space-y-${TEXT_ZONE_POSITION_SPACE}`}>
                  <div className={`flex flex-row h-10 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start py-10 pl-8', zoneClass: 'w-2/5 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[5]}</div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start px-10 pb-3', zoneClass: 'w-2/5 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[6]}</div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center px-3 pb-3', zoneClass: 'w-2/5 rounded-b-sm text-center', textClass: 'pt-8 pb-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[7]}</div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end px-10 pb-3', zoneClass: 'w-2/5 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[8]}</div>
                    <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end py-10 pr-8', zoneClass: 'w-2/5 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[9]}</div>
                  </div>
                  <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start py-10 pr-3', zoneClass: 'w-2/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[10]}</div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start py-10 pr-3', zoneClass: 'mr-20 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[11]}</div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start py-10 pl-8', zoneClass: 'mr-12 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[12]}</div>
                    </div>
                    <div className={`flex flex-col h-full flex-auto space-y-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center px-3 pb-3', zoneClass: 'mx-12 rounded-b-sm text-center', textClass: 'pt-8 pb-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[13]}</div>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center py-10 px-8', zoneClass: 'mx-12 rounded-sm text-center', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[14]}</div>
                    </div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end py-10 pr-8', zoneClass: 'ml-12 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[15]}</div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end py-10 pl-3', zoneClass: 'ml-20 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[16]}</div>
                    </div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end py-10 pl-3', zoneClass: 'w-2/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[17]}</div>
                  </div>
                  <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start py-10 pr-3', zoneClass: 'w-2/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[18]}</div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start py-10 pr-3', zoneClass: 'mr-20 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[19]}</div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start py-10 pl-8', zoneClass: 'mr-12 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[20]}</div>
                    </div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-center p-8', zoneClass: 'mx-12 rounded-sm text-center', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[21]}</div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end py-10 pr-8', zoneClass: 'ml-12 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[22]}</div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end py-10 pl-3', zoneClass: 'ml-20 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[23]}</div>
                    </div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end py-10 pl-3', zoneClass: 'w-2/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[24]}</div>
                  </div>
                  <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start py-10 pr-3', zoneClass: 'w-2/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[25]}</div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start py-10 pr-3', zoneClass: 'mr-20 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[26]}</div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start py-10 pl-8', zoneClass: 'mr-12 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[27]}</div>
                    </div>
                    <div className={`flex flex-col h-full flex-auto space-y-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center py-10 px-8', zoneClass: 'mx-12 rounded-sm text-center', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[28]}</div>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center px-3 pt-3', zoneClass: 'mx-12 rounded-t-sm text-center', textClass: 'pb-8 pt-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[29]}</div>
                    </div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end py-10 pr-8', zoneClass: 'ml-12 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[30]}</div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end py-10 pl-3', zoneClass: 'ml-20 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[31]}</div>
                    </div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end py-10 pl-3', zoneClass: 'w-2/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[32]}</div>
                  </div>
                  <div className={`flex flex-row h-10 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start py-10 pl-8', zoneClass: 'w-2/5 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[33]}</div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start px-10 pt-3', zoneClass: 'w-2/5 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[34]}</div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center px-3 pt-3', zoneClass: 'w-2/5 rounded-t-sm text-center', textClass: 'pb-8 pt-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[35]}</div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end px-10 pt-3', zoneClass: 'w-2/5 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[36]}</div>
                    <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end py-10 pr-8', zoneClass: 'w-2/5 rounded-sm', textClass: 'px-4 py-3'})}>{DEV_POSITION_ZONES_NUMBERS[37]}</div>
                  </div>
                </div>

              </div>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'h-full w-2/5', textClass: 'py-8 pr-8 pl-7'})}>{DEV_POSITION_ZONES_NUMBERS[38]}</div>
            </div>
            <div className={`flex flex-row h-8 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'w-2/5 rounded-tr-sm', textClass: 'pb-8 pl-8 pt-4 pr-5'})}>{DEV_POSITION_ZONES_NUMBERS[39]}</div>
              <div className={`flex-grow h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'w-full', textClass: 'pb-8 px-8 pt-4'})}>{DEV_POSITION_ZONES_NUMBERS[40]}</div>
              <div className={`w-20 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end', zoneClass: 'w-2/5 rounded-tl-sm', textClass: 'pb-8 pr-8 pt-4 pl-5'})} >{DEV_POSITION_ZONES_NUMBERS[41]}</div>
            </div>
          </div> */}

          <div className={`flex flex-col w-full h-full p-${TEXT_ZONE_POSITION_SPACE} space-y-${TEXT_ZONE_POSITION_SPACE}`} onMouseLeave={event => handleOutTextZonePosition(event)}>
            <div className={`flex flex-auto flex-row space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 1)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'mr-10 mb-10 max-w-60 rounded-br-sm', textClass: 'pt-8 pl-8 pb-4 pr-5'})}>{DEV_POSITION_ZONES_NUMBERS[5]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 2)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'mx-10 mb-10 max-w-60 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[6]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 3)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center', zoneClass: 'mx-10 mb-10 max-w-60 rounded-b-sm text-center', textClass: 'pt-8 pb-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[7]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 4)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'mx-10 mb-10 max-w-60 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[8]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 5)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'ml-10 mb-10 max-w-60 rounded-bl-sm', textClass: 'pt-8 pr-8 pb-4 pl-5'})}>{DEV_POSITION_ZONES_NUMBERS[9]}</div>
            </div>
            <div className={`flex flex-auto flex-row space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 6)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'my-10 mr-10 max-w-60 rounded-r-sm pl-8 py-3 pr-4', textClass: ''})}>{DEV_POSITION_ZONES_NUMBERS[33]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 7)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[34]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 8)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm text-center', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[35]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 9)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[36]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 10)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'my-10 ml-10 max-w-60 rounded-l-sm', textClass: 'pr-8 py-3 pl-4'})}>{DEV_POSITION_ZONES_NUMBERS[37]}</div>
            </div>
            <div className={`flex flex-auto flex-row space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 11)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start', zoneClass: 'my-10 mr-10 max-w-60 rounded-r-sm', textClass: 'pl-8 py-3 pr-4'})}>{DEV_POSITION_ZONES_NUMBERS[33]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 12)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[34]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 13)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-center', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm text-center', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[35]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 14)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[36]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 15)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end', zoneClass: 'my-10 ml-10 max-w-60 rounded-l-sm', textClass: 'pr-8 py-3 pl-4'})}>{DEV_POSITION_ZONES_NUMBERS[37]}</div>
            </div>
            <div className={`flex flex-auto flex-row space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 16)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'my-10 mr-10 max-w-60 rounded-r-sm', textClass: 'pl-8 py-3 pr-4'})}>{DEV_POSITION_ZONES_NUMBERS[33]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 17)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[34]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 18)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm text-center', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[35]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 19)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end', zoneClass: 'my-10 mx-10 max-w-60 rounded-sm', textClass: 'py-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[36]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 20)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end', zoneClass: 'my-10 ml-10 max-w-60 rounded-l-sm', textClass: 'pr-8 py-3 pl-4'})}>{DEV_POSITION_ZONES_NUMBERS[37]}</div>
            </div>
            <div className={`flex flex-auto flex-row space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 21)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'mr-10 mt-10 max-w-60 rounded-tr-sm', textClass: 'pb-8 pl-8 pt-4 pr-5'})}>{DEV_POSITION_ZONES_NUMBERS[33]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 22)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'mx-10 mt-10 max-w-60 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[34]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 23)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center', zoneClass: 'mx-10 mt-10 max-w-60 rounded-t-sm text-center', textClass: 'pb-8 pt-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[35]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 24)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end', zoneClass: 'mx-10 mt-10 max-w-60 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'})}>{DEV_POSITION_ZONES_NUMBERS[36]}</div>
              <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={event => handleClickTextZonePosition(event, 25)} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end', zoneClass: 'ml-10 mt-10 max-w-60 rounded-tl-sm', textClass: 'pb-8 pr-8 pt-4 pl-5'})}>{DEV_POSITION_ZONES_NUMBERS[37]}</div>
            </div>
          </div>

          {thumbPreviewTextClass.containerClass && thumbTextZoneAllowPreview && <div className={`pointer-events-none flex w-full h-full ${thumbPreviewTextClass.containerClass} ${thumbTemplate === 3 && 'bg-gray-800 bg-opacity-15'}  ${thumbTemplate === 6 && 'bg-gray-50 bg-opacity-20'}`}>
            <div className={`min-w-min pointer-events-none ${thumbPreviewTextClass.zoneClass} ${thumbTemplate === 1 && 'bg-gray-900 bg-opacity-40'} ${thumbTemplate === 4 && 'bg-gray-50 bg-opacity-60'} ${'border-3 border-blue-600 border-opacity-75'} rounded`} style={{maxWidth: `${parseInt(textMaxWidth) + 2}%`}}>
              <div className={`select-none pointer-events-none align-middle font-medium text-${thumbFontSize} rounded ${thumbPreviewTextClass.textClass} ${thumbTemplate >= 4 ? 'text-gray-900' : 'text-white'}`} style={thumbTemplate >= 4 ? {"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)"} : {"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>{thumbText}</div>
            </div>
          </div>}

          {thumbTextClass.containerClass && !thumbPreviewTextClass.containerClass && <div className={`pointer-events-none flex w-full h-full ${thumbTextClass.containerClass} ${thumbTemplate === 3 && 'bg-gray-900 bg-opacity-15'} ${thumbTemplate === 6 && 'bg-gray-50 bg-opacity-20'}`}>
            <div className={`min-w-min pointer-events-none ${thumbTextClass.zoneClass} ${thumbTemplate === 1 && 'bg-gray-900 bg-opacity-50'} ${thumbTemplate === 4 && 'bg-gray-50 bg-opacity-70'}`} style={{maxWidth: `${textMaxWidth}%`}}>
              {/* <Resizer onResize={handleResize} sides={["left", "right"]} /> */}
              <div className={`select-none pointer-events-none font-medium text-${thumbFontSize} ${thumbTextClass.textClass} ${thumbTemplate >= 4 ? 'text-gray-900' : 'text-white'}`} style={thumbTemplate >= 4 ? {"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)"} : {"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>{thumbText}</div>
            </div>
          </div>}

          {isLoadingThumbImage && <div className="flex w-full h-full bg-gray-800 bg-opacity-70 items-center justify-center p-3"><LoadingSpinner className="h-8 w-8 text-white" /></div>}

        </div>
        {/* {thumbBgImage !== "" && <div className="relative pt-1">
          <div className="overflow-hidden h-1 mb-4 text-xs flex rounded-full bg-blue-200">
            <div className="animationProgress shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
          </div>
        </div>} */}
        <div className="flex flex-row flex-wrap item-center justify-start align-middle w-full">
          {thumbBgImage !== "" && !playingPreview && <div className="relative w-full">
            {playingPreview ? <StopIcon onClick={event => handlePlayingPreview(event, false)} className="h-8 w-8 -mt-2 text-blue-600 hover:text-blue-500 cursor-pointer" /> : <PlayIcon onClick={event => handlePlayingPreview(event, true)} className="absolute right-0 top-0 h-8 w-8 -mt-2 text-blue-600 hover:text-blue-500 cursor-pointer" />}
          </div>}
          <div className={"select-none rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
            Taille du texte :
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb1')} className={"select-none rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 leading-none " + 
            (thumbFontSize === "thumb1" ? "text-white bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500" : "text-gray-900 border-gray-50 hover:bg-blue-100 hover:border-blue-100")}>
            1
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb2')} className={"select-none rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 leading-none " + 
            (thumbFontSize === "thumb2" ? "text-white bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500" : "text-gray-900 border-gray-50 hover:bg-blue-100 hover:border-blue-100")}> {/* text-gray-500 bg-gray-300 hover:bg-gray-200 border-gray-300 hover:border-gray-200 */}
            2
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb3')} className={"select-none rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 leading-none " + 
            (thumbFontSize === "thumb3" ? "text-white bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500" : "text-gray-900 border-gray-50 hover:bg-blue-100 hover:border-blue-100")}>
            3
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb4')} className={"select-none rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 leading-none " + 
            (thumbFontSize === "thumb4" ? "text-white bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500" : "text-gray-900 border-gray-50 hover:bg-blue-100 hover:border-blue-100")}>
            4
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb5')} className={"select-none rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 leading-none " + 
            (thumbFontSize === "thumb5" ? "text-white bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500" : "text-gray-900 border-gray-50 hover:bg-blue-100 hover:border-blue-100")}>
            5
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb6')} className={"select-none rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 leading-none " + 
            (thumbFontSize === "thumb6" ? "text-white bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500" : "text-gray-900 border-gray-50 hover:bg-blue-100 hover:border-blue-100")}>
            6
          </div>
          <div className={"select-none rounded-md m-1 lg:pl-6 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
            Largeur du texte :
          </div>
          <div className={"select-none rounded-md m-1 px-2 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
            <input type="range" id="textWidth" step={1} name="textWidth" min="0" max="100" onChange={e => setTextMaxWidth(e.target.value)} defaultValue={DEFAULT_TEXT_MAX_WIDTH} />
          </div>
        </div>
        <div className="container grid grid-cols-3 gap-2 mx-auto">
          <div onClick={event => handleChangeThumbTemplate(event, 4)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 4 ? `border-blue-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-blue-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow justify-center items-center">
              <div className="w-full rounded-t-md"></div>
              <div className="w-3/5 justify-center items-center text-center align-middle flex flex-row bg-gray-50 bg-opacity-75 rounded-sm">
                <div className="pt-1 pb-3 px-4 text-center text-gray-900 align-middle font-medium select-none" style={{"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)", fontSize: '0.625vw'}}>_________________ ______________ ________</div>
              </div>
              <div className="w-full rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 2)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 2 ? `border-blue-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-blue-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-white align-middle font-medium select-none" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)", fontSize: '0.625vw'}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 3)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 3 ? `border-blue-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-blue-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="bg-gray-900 bg-opacity-20"></div>
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-white align-middle font-medium select-none" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)", fontSize: '0.625vw'}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 1)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 1 ? `border-blue-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-blue-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow justify-center items-center">
              <div className="w-full rounded-t-md"></div>
              <div className="w-3/5 justify-center items-center text-center align-middle flex flex-row bg-gray-900 bg-opacity-75 rounded-sm">
                <div className="pt-1 pb-3 px-4 text-center text-white align-middle font-medium select-none" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)", fontSize: '0.625vw'}}>_________________ ______________ ________</div>
              </div>
              <div className="w-full rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 5)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 5 ? `border-blue-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-blue-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-gray-900 align-middle font-medium select-none" style={{"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)", fontSize: '0.625vw'}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 6)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 6 ? `border-blue-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-blue-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="bg-gray-50 bg-opacity-20"></div>
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-gray-900 align-middle font-medium select-none" style={{"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)", fontSize: '0.625vw'}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
        </div></>}
      </div>
    </div>
  )
}

export default CreationTool;