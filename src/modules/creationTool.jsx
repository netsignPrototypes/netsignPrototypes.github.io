import React, { useState } from 'react'
import CloudNaturalLanguageAPI from './CloudNaturalLanguageAPI';
import PixaBayAPI from './PixaBayAPI'
import { ArrowCircleLeftIcon, ArrowLeftIcon, BeakerIcon, SparklesIcon, PlusSmIcon, MinusSmIcon, XCircleIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/outline'
import {  } from '@heroicons/react/solid'

//const defaultText = "La beauté est dans le regard de celui qui regarde.";

//const defaultText = "A sign of the return of the beautiful season, this unique exhibition in the country, which showcases the poetry of the shape of the egg, is coming to Quebec for the first time. A dozen emerging and established artists take over the spaces of the mall, giving the public free rein to their imagination."

const defaultText = "";
const NB_IMAGE_TO_DISPLAY = 20;

/* const TEXT_ZONE_POSITION_SPACE = "1";
const TEXT_ZONE_BG = "rounded-md bg-gray-800 bg-opacity-20"; */

const TEXT_ZONE_POSITION_SPACE = "1";
const TEXT_ZONE_BG_DEFAULT = "cursor-pointer hover:bg-indigo-600 hover:bg-opacity-20 rounded-md"; //rounded-md bg-gray-800 bg-opacity-20

//const TEXT_ZONE_BG = "cursor-pointer border-2 border-transparent hover:border-indigo-600 hover:border-opacity-50 rounded-md";
//const TEXT_ZONE_BG = '';

const CreationTool = () => {
  const [text, setText] = useState(defaultText);
  const [searchQueryWords, setSearchQueryWords] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesToDisplay, setImagesToDisplay] = useState([]);
  const [language, setLanguage] = useState("fr");
  const [pixaBayData, setPixaBayData] = useState({});
  const [thumbBgImage, setThumbBgImage] = useState("");
  const [thumbText, setThumbText] = useState("");
  const [thumbTemplate, setThumbTemplate] = useState(4);

  const [thumbPreviewTextClass, setThumbPreviewTextClass] = useState({});
  const [thumbTextClass, setThumbTextClass] = useState({containerClass: 'items-center justify-center p-3', zoneClass: 'mx-20 text-center rounded-sm', textClass: 'py-3 px-4'});

  const [thumbTextZoneAllowPreview, setThumbTextZoneAllowPreview] = useState(true);

  const [costumSearchTags, setCustomSearchTags] = useState([]);
  const [selectedSearchTags, setSelectedSearchTags] = useState([]);
  const [searchData, setSearchData] = useState({});

  const [TEXT_ZONE_BG, setTextZoneBg] = useState(TEXT_ZONE_BG_DEFAULT);

  const [thumbFontSize, setThumbFontSize] = useState("thumb3");

  const [isLoading, setIsLoading] = useState(false);
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

        searchPixaBayData(filteredWordsArray, Result.language, filteredWordsArray, searchWords);

        console.log('wordsArray', wordsArray);
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

    setThumbBgImage(imagesToDisplay[index].fullHDURL);

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
  
  };

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

  const handleClickTextZonePosition = (e) => {
    e.preventDefault();
    const { target } = e;

    let newThumbTextClass = {...thumbPreviewTextClass};

    setThumbTextClass(newThumbTextClass);
    setThumbPreviewTextClass({});
    setThumbTextZoneAllowPreview(false);
    setTextZoneBg("");
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 space-x-40">
      <div className="max-w-2xl w-full space-y-3">
        <div className="flex flex-col items-start justify-start">
          <h2 className="ml-2 text-left text-3xl font-extrabold text-gray-900">Créez votre message</h2>
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
                className="appearance-none rounded-none relative block w-full h-20 max-h-20 px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Écrivez le texte qui s'affichera dans la vignette"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div onClick={handleCreateThumb} className="rounded-md font-medium py-1 px-2 text-center text-sm text-white shadow align-middle bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500 flex items-center justify-center">
              {/* <BeakerIcon className="h-5 w-5 text-white"/> */}OK
          </div>
          </div>
          
        </div>
        {searchQueryWords.length > 0 ? <>

        <div className="flex flex-col flex-wrap item-center justify-start align-middle bg-gray-100 p-1 rounded-md w-full">
          <div className="flex flex-row flex-wrap item-center justify-start align-middle">
            {/* {selectedSearchTags.map((tag, index) => {
              return <div onClick={event => handleChangeAutoSelectedSearchTags(event, index)} value={index} key={index + tag + '-selectedSearchTags'} className="flex flex-row flex-wrap item-center justify-start align-middle text-white rounded-full bg-blue-400 hover:bg-blue-200 m-1 cursor-pointer border-2 border-blue-400 hover:border-blue-200">
                <div className={"py-0.5 pr-0.5 pl-2 text-center text-xs flex items-center justify-center align-middle cursor-pointer " >
                  {tag}
                </div>
                <div className={"py-0.5 pr-1 pl-1 text-center text-xs flex items-center justify-center align-middle cursor-pointer "}>
                  <XCircleIcon className="h-4 w-4"/>
                </div>
              </div>
            })} */}
            {searchQueryWords.map((word, index) => {
              return <div className={`flex flex-row flex-wrap item-center justify-start align-middle rounded-full my-1 ml-1 ${(word.searched || word.addedSearch) && searchQueryWords[index + 1] && (!searchQueryWords[index + 1].addedSearch) ? 'mr-8' : (word.searched || word.addedSearch) ? 'mr-0.5' : 'mr-1' }`}>
                {(!word.searched && !(word.addedSearch && !word.searched)) && <div onClick={event => handleChangeAddSearchQueryWord(event, index)} value={index} key={index + '-words23'} className={"rounded-full mx-0.5 text-center text-xs flex items-center justify-center align-middle cursor-pointer border-2 text-indigo-600 hover:text-indigo-500 border-gray-100"}>
                  <PlusCircleIcon key={index + '-words23Ico'} className="h-5 w-5"/>
                </div>}
                <div onClick={event => handleChangeQueryWords(event, index)} value={index} key={index + '-words'} className={`${word.searched && searchQueryWords[index + 1] && (searchQueryWords[index + 1].addedSearch) ? 'rounded-l-full' : word.addedSearch && searchQueryWords[index + 1] && (searchQueryWords[index + 1].addedSearch) ? '' : word.addedSearch ? 'rounded-r-full' : 'rounded-full' } py-0.5 px-2 text-center text-xs flex items-center justify-center align-middle cursor-pointer border-2 ` + 
                  (word.searched || (word.addedSearch && !word.searched) ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-900 bg-gray-300 hover:bg-gray-200 border-gray-300 hover:border-gray-200 rounded-r-full")}>
                  {word.text} {word.addedSearch && <XCircleIcon key={index + '-wordsIco'} className="ml-1 h-4 w-4"/>}
                </div>
              </div>
            })}
          </div>
          <div className="flex flex-row flex-wrap item-center justify-start align-middle">
            {selectedSearchTags.length > 0 && <div onClick={handlePreviousSelectedSearchTag} className="flex flex-row flex-wrap item-center justify-start align-middle m-1 cursor-pointer"><ArrowCircleLeftIcon className="h-5 w-5 text-blue-400"/></div>}
            {selectedSearchTags.map((tag, index) => {
                return <div onClick={event => handleChangeAutoSelectedSearchTags(event, index)} value={index} key={index + '-selectedSearchTags'} className={"rounded-md ml-1 text-center text-xs flex items-center justify-center align-middle cursor-pointer " + 
                (selectedSearchTags.length - 1 === index ? "text-blue-400 cursor-pointer" : "text-gray-400 cursor-pointer")}>
                  {tag} {selectedSearchTags.length - 1 !== index && '/'}
                </div>
              })}
            {/* {selectedSearchTags.length > 0 && <div onClick={event => handleChangeAutoSelectedSearchTags(event, selectedSearchTags.length - 1)} className="flex flex-row flex-wrap item-center justify-start align-middle text-white rounded-full bg-blue-400 hover:bg-blue-200 m-1 cursor-pointer border-2 border-blue-400 hover:border-blue-200">
                <div className={"py-0.5 pr-0.5 pl-2 text-center text-xs flex items-center justify-center align-middle cursor-pointer "}>
                  {selectedSearchTags[selectedSearchTags.length - 1]}
                </div>
                <div className={"py-0.5 pr-1 pl-1 text-center text-xs flex items-center justify-center align-middle cursor-pointer "}>
                  <XCircleIcon className="h-4 w-4"/>
                </div>
              </div>
            } */}
          </div>
          

          {/* {selectedSearchTags.length > 0 && <div className="flex flex-row flex-wrap item-center justify-start align-middle rounded-md w-full">
            {selectedSearchTags.map((tag, index) => {
              return <div onClick={event => handleChangeAutoSelectedSearchTags(event, index)} value={index} key={index + '-selectedSearchTags'} className={"rounded-md m-1 py-0.5 px-2 text-center text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
              (selectedSearchTags.includes(tag) ? "text-white bg-purple-600 hover:bg-gray-200 cursor-pointer border-2 border-purple-600 hover:border-gray-200 hover:text-gray-500" : "text-gray-500 bg-gray-300 hover:bg-gray-200 border-gray-300 hover:border-gray-200")}>
                {tag}
              </div>
            })}
          </div>} */}
        </div>

        {/* {costumSearchTags.length > 0 && <div className="flex flex-row flex-wrap item-center justify-start align-middle bg-gray-100 p-1 rounded-md w-full">
          {costumSearchTags.map((tag, index) => {
            return <div onClick={event => handleChangeSelectedSearchTags(event, index)} value={index} key={index + '-words'} className={"rounded-md m-1 py-0.5 px-2 text-center text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
            (selectedSearchTags.includes(tag.word) ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-500 bg-gray-300 hover:bg-gray-200 border-gray-300 hover:border-gray-200")}>
              {tag.word}
            </div>
          })}
        </div>} */}

        <div className="container grid grid-cols-4 gap-2 mx-auto">
          {imagesToDisplay.map((image, index) => {
            return <div key={image.id} id={image.id} onClick={event => handleChangeThumbBgImage(event, index)} className="w-40 aspect-w-16 aspect-h-9 cursor-pointer"><img key={`${image.id}-img`} src={image.previewURL} alt={image.tags} className="rounded-sm shadow w-full h-full object-center object-cover" /></div>
          })}
        </div></> : <></>}
      </div>
      <div className="max-w-2xl w-full space-y-4">
        {isThumbCreated && <><div className="w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md shadow overflow-hidden">
          {thumbBgImage !== "" && <div className="overflow-hidden"><img src={thumbBgImage} alt="ThumbBg" className="zoom-in-zoom-out rounded-md w-full h-full object-center object-cover" /></div>}
          
          {/* {thumbTemplate === 1 && (!thumbPreviewTextClass.containerClass && !thumbTextClass.containerClass) && <>
          <div className="flex flex-row w-full h-full">
            <div className="h-full w-2/5 justify-center items-start align-middle flex flex-row bg-gray-50 bg-opacity-75">
              <div className={`py-12 px-8 text-gray-900 align-middle font-medium text-${thumbFontSize}`} style={{"textShadow": "0 0px 5px rgba(255,255,255,0.35), 0 0px 15px rgba(255,255,255,0.32)"}}>{thumbText}</div>
            </div>
            <div className="h-full flex-auto rounded-t-md"></div>
            <div className="h-full flex-auto rounded-b-md"></div>
          </div></>}

          {thumbTemplate === 2 && (!thumbPreviewTextClass.containerClass && !thumbTextClass.containerClass) && <>
          <div className="flex flex-col w-full h-full shadow justify-center items-center">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="mx-32 justify-center items-center text-center align-middle flex flex-row bg-gray-50 bg-opacity-75 rounded-sm">
                <div className={`py-6 px-6 text-center text-gray-900 align-middle font-medium text-${thumbFontSize}`}>{thumbText}</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div></>}

          {thumbTemplate === 3 && (!thumbPreviewTextClass.containerClass && !thumbTextClass.containerClass) && <>
          <div className="flex flex-row-reverse w-full h-full">
            <div className="h-full w-2/5 justify-center items-start align-middle flex flex-row bg-gray-50 bg-opacity-75">
              <div className={`py-12 px-8 text-gray-900 align-middle font-medium text-${thumbFontSize}`}>{thumbText}</div>
            </div>
            <div className="h-full flex-auto rounded-t-md"></div>
            <div className="h-full flex-auto rounded-b-md"></div>
          </div></>}

          {thumbTemplate === 4 && (!thumbPreviewTextClass.containerClass && !thumbTextClass.containerClass) && <><div className="bg-gray-800 bg-opacity-20"></div>
          <div className="flex flex-col w-full h-full">
          <div className="w-full justify-center items-center align-middle flex flex-row">
              <div className={`py-10 w-full px-10 text-white align-middle font-medium text-${thumbFontSize}`} style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>{thumbText}</div>
            </div>
            <div className="w-full flex-auto rounded-t-md"></div>
            <div className="w-full flex-auto rounded-b-md"></div>
          </div></>}

          {thumbTemplate === 5 && (!thumbPreviewTextClass.containerClass && !thumbTextClass.containerClass) && <><div className="bg-gray-800 bg-opacity-20"></div>
          <div className="flex flex-col w-full h-full">
            <div className="w-full flex-auto rounded-t-md"></div>
            <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
              <div className={`py-8 px-24 text-center text-white align-middle font-medium text-${thumbFontSize}`} style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>{thumbText}</div>
            </div>
            <div className="w-full flex-auto rounded-b-md"></div>
          </div></>}

          {thumbTemplate === 6 && (!thumbPreviewTextClass.containerClass && !thumbTextClass.containerClass) && <><div className="bg-gray-800 bg-opacity-20"></div>
          <div className="flex flex-col-reverse w-full h-full">
          <div className="w-full justify-center items-center align-middle flex flex-row">
              <div className={`py-10 w-full px-10 text-white align-middle font-medium text-${thumbFontSize}`} style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>{thumbText}</div>
            </div>
            <div className="w-full flex-auto rounded-t-md"></div>
            <div className="w-full flex-auto rounded-b-md"></div>
          </div></>} */}

          {thumbTextClass.containerClass && !thumbPreviewTextClass.containerClass && <div className={`pointer-events-none flex w-full h-full ${thumbTextClass.containerClass} ${thumbTemplate === 3 && 'bg-gray-900 bg-opacity-15'} ${thumbTemplate === 6 && 'bg-gray-50 bg-opacity-20'}`}>
            <div className={`pointer-events-none ${thumbTextClass.zoneClass} ${thumbTemplate === 1 && 'bg-gray-900 bg-opacity-50'} ${thumbTemplate === 4 && 'bg-gray-50 bg-opacity-70'}`}>
              <div className={`pointer-events-none align-middle font-medium text-${thumbFontSize} ${thumbTextClass.textClass} ${thumbTemplate >= 4 ? 'text-gray-900' : 'text-white'}`} style={thumbTemplate >= 4 ? {"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)"} : {"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>{thumbText}</div>
            </div>
          </div>}

          {/* <div className="container grid grid-cols-3 mx-auto">
            <div className="bg-gray-800 bg-opacity-5"></div>
            <div className="bg-gray-800 bg-opacity-20"></div>
            <div className="bg-gray-800 bg-opacity-5"></div>
            <div className="bg-gray-800 bg-opacity-20"></div>
            <div className="bg-gray-800 bg-opacity-5"></div>
            <div className="bg-gray-800 bg-opacity-20"></div>
            <div className="bg-gray-800 bg-opacity-5"></div>
            <div className="bg-gray-800 bg-opacity-20"></div>
            <div className="bg-gray-800 bg-opacity-5"></div>
          </div> */}

          <div className={`flex flex-col w-full h-full p-${TEXT_ZONE_POSITION_SPACE} space-y-${TEXT_ZONE_POSITION_SPACE}`} onMouseLeave={event => handleOutTextZonePosition(event)}>
            <div className={`flex flex-row h-8 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'w-2/5 rounded-br-sm', textClass: 'pt-8 pl-8 pb-4 pr-5'})}></div>
              <div className={`flex-grow h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'w-full', textClass: 'pt-8 px-8 pb-4'})}></div>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'w-2/5 rounded-bl-sm', textClass: 'pt-8 pr-8 pb-4 pl-5'})} ></div>
            </div>
            <div className={`flex flex-row flex-grow space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start', zoneClass: 'h-full w-2/5', textClass: 'py-8 pl-8 pr-7'})}></div>
              <div className="flex-grow h-full">

                <div className={`flex flex-col w-full h-full space-y-${TEXT_ZONE_POSITION_SPACE}`}>
                  <div className={`flex flex-row h-10 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start p-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'py-3 px-4'})}></div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start px-10 pb-3', zoneClass: 'w-2/5 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'})}></div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center px-3 pb-3', zoneClass: 'w-2/5 rounded-b-sm text-center', textClass: 'pt-8 pb-3 px-4'})}></div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end px-10 pb-3', zoneClass: 'w-2/5 rounded-b-sm', textClass: 'pt-8 pb-3 px-4'})}></div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end p-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'py-3 px-4'})}></div>
                  </div>
                  <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start py-10 pr-3', zoneClass: 'w-2/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}></div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start py-10 pr-3', zoneClass: 'w-4/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}></div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-start py-10 pl-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'px-4 py-3'})}></div>
                    </div>
                    <div className={`flex flex-col h-full flex-auto space-y-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center px-3 pb-3', zoneClass: 'mx-12 rounded-b-sm text-center', textClass: 'pt-8 pb-3 px-4'})}></div>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-center py-10 px-8', zoneClass: 'mx-12 rounded-sm text-center', textClass: 'py-3 px-4'})}></div>
                    </div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end py-10 pr-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'px-4 py-3'})}></div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end py-10 pl-3', zoneClass: 'w-4/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}></div>
                    </div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end py-10 pl-3', zoneClass: 'w-2/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}></div>
                  </div>
                  <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start py-10 pr-3', zoneClass: 'w-2/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}></div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start py-10 pr-3', zoneClass: 'w-4/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}></div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-start py-10 pl-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'px-4 py-3'})}></div>
                    </div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-center p-8', zoneClass: 'mx-12 rounded-sm text-center', textClass: 'py-3 px-4'})}></div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end py-10 pr-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'px-4 py-3'})}></div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end py-10 pl-3', zoneClass: 'w-4/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}></div>
                    </div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-center justify-end py-10 pl-3', zoneClass: 'w-2/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}></div>
                  </div>
                  <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start py-10 pr-3', zoneClass: 'w-2/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}></div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start py-10 pr-3', zoneClass: 'w-4/5 rounded-r-sm', textClass: 'pr-4 pl-8 py-3'})}></div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start py-10 pl-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'px-4 py-3'})}></div>
                    </div>
                    <div className={`flex flex-col h-full flex-auto space-y-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center py-10 px-8', zoneClass: 'mx-12 rounded-sm text-center', textClass: 'py-3 px-4'})}></div>
                      <div className={`flex-auto ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center px-3 pt-3', zoneClass: 'mx-12 rounded-t-sm text-center', textClass: 'pb-8 pt-3 px-4'})}></div>
                    </div>
                    <div className={`flex flex-row flex-auto space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end py-10 pr-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'px-4 py-3'})}></div>
                      <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end py-10 pl-3', zoneClass: 'w-4/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}></div>
                    </div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end py-10 pl-3', zoneClass: 'w-2/5 rounded-l-sm', textClass: 'pl-4 pr-8 py-3'})}></div>
                  </div>
                  <div className={`flex flex-row h-10 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
                  <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start p-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'py-3 px-4'})}></div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start px-10 pt-3', zoneClass: 'w-2/5 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'})}></div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-center px-3 pt-3', zoneClass: 'w-2/5 rounded-t-sm text-center', textClass: 'pb-8 pt-3 px-4'})}></div>
                    <div className={`flex-auto h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end px-10 pt-3', zoneClass: 'w-2/5 rounded-t-sm', textClass: 'pb-8 pt-3 px-4'})}></div>
                    <div className={`w-10 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end p-8', zoneClass: 'w-4/5 rounded-sm', textClass: 'py-3 px-4'})}></div>
                  </div>
                </div>

              </div>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-start justify-end', zoneClass: 'h-full w-2/5', textClass: 'py-8 pr-8 pl-7'})}></div>
            </div>
            <div className={`flex flex-row h-8 space-x-${TEXT_ZONE_POSITION_SPACE}`}>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'w-2/5 rounded-tr-sm', textClass: 'pb-8 pl-8 pt-4 pr-5'})}></div>
              <div className={`flex-grow h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-start', zoneClass: 'w-full', textClass: 'pb-8 px-8 pt-4'})}></div>
              <div className={`w-8 h-full ${TEXT_ZONE_BG}`} onClick={handleClickTextZonePosition} onMouseOver={event => handleOverTextZonePosition(event, {containerClass: 'items-end justify-end', zoneClass: 'w-2/5 rounded-tl-sm', textClass: 'pb-8 pr-8 pt-4 pl-5'})} ></div>
            </div>
          </div>

          {thumbPreviewTextClass.containerClass && thumbTextZoneAllowPreview && <div className={`pointer-events-none flex w-full h-full ${thumbPreviewTextClass.containerClass} ${thumbTemplate === 3 && 'bg-gray-800 bg-opacity-15'}  ${thumbTemplate === 6 && 'bg-gray-50 bg-opacity-20'}`}>
            <div className={`pointer-events-none ${thumbPreviewTextClass.zoneClass} ${thumbTemplate === 1 && 'bg-gray-900 bg-opacity-40'} ${thumbTemplate === 4 && 'bg-gray-50 bg-opacity-60'} ${'border-3 border-indigo-600 border-opacity-75'}`}>
              <div className={`pointer-events-none align-middle font-medium text-${thumbFontSize} ${thumbPreviewTextClass.textClass} ${thumbTemplate >= 4 ? 'text-gray-900' : 'text-white'}`} style={thumbTemplate >= 4 ? {"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)"} : {"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>{thumbText}</div>
            </div>
          </div>}

        </div>
        {/* {thumbBgImage !== "" && <div className="relative pt-1">
          <div className="overflow-hidden h-1 mb-4 text-xs flex rounded-full bg-indigo-200">
            <div className="animationProgress shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"></div>
          </div>
        </div>} */}
        <div className="flex flex-row flex-wrap item-center justify-start align-middle">
          <div className={"rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle cursor-pointer border-2 text-gray-600 bg-gray-50 border-gray-50"}>
            Taille du texte :
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb1')} className={"rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
            (thumbFontSize === "thumb1" ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-900 border-gray-50 hover:bg-indigo-100 hover:border-indigo-100")}>
            1
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb2')} className={"rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
            (thumbFontSize === "thumb2" ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-900 border-gray-50 hover:bg-indigo-100 hover:border-indigo-100")}> {/* text-gray-500 bg-gray-300 hover:bg-gray-200 border-gray-300 hover:border-gray-200 */}
            2
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb3')} className={"rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
            (thumbFontSize === "thumb3" ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-900 border-gray-50 hover:bg-indigo-100 hover:border-indigo-100")}>
            3
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb4')} className={"rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
            (thumbFontSize === "thumb4" ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-900 border-gray-50 hover:bg-indigo-100 hover:border-indigo-100")}>
            4
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb5')} className={"rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
            (thumbFontSize === "thumb5" ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-900 border-gray-50 hover:bg-indigo-100 hover:border-indigo-100")}>
            5
          </div>
          <div onClick={event => handleChangeThumbFontSize(event, 'thumb6')} className={"rounded-md m-1 py-0.5 px-2 text-center font-medium text-xs flex items-center justify-center align-middle cursor-pointer border-2 " + 
            (thumbFontSize === "thumb6" ? "text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500" : "text-gray-900 border-gray-50 hover:bg-indigo-100 hover:border-indigo-100")}>
            6
          </div>
        </div>
        <div className="container grid grid-cols-3 gap-2 mx-auto">
          <div onClick={event => handleChangeThumbTemplate(event, 4)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 4 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow justify-center items-center">
              <div className="w-full rounded-t-md"></div>
              <div className="w-3/5 justify-center items-center text-center align-middle flex flex-row bg-gray-50 bg-opacity-75 rounded-sm">
                <div className="pt-1 pb-3 px-4 text-center text-gray-900 align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)"}}>_________________ ______________ ____</div>
              </div>
              <div className="w-full rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 2)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 2 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-white align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 3)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 3 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="bg-gray-900 bg-opacity-20"></div>
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-white align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 1)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 1 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow justify-center items-center">
              <div className="w-full rounded-t-md"></div>
              <div className="w-3/5 justify-center items-center text-center align-middle flex flex-row bg-gray-900 bg-opacity-75 rounded-sm">
                <div className="pt-1 pb-3 px-4 text-center text-white align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>_________________ ______________ ____</div>
              </div>
              <div className="w-full rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 5)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 5 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-gray-900 align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)"}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 6)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 6 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-gray-200' : 'bg-gray-100'} cursor-pointer`}>
            {/* {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />} */}
            <div className="bg-gray-50 bg-opacity-20"></div>
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-gray-900 align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(255,255,255,0.28), 0 0px 15px rgba(255,255,255,0.25)"}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          
          
          {/* <div onClick={event => handleChangeThumbTemplate(event, 1)} className={`w-full aspect-w-16 aspect-h-9 rounded-md overflow-hidden border-2 ${thumbTemplate === 1 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-indigo-600' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-indigo-400' : 'bg-gray-100'} cursor-pointer`}>
            {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />}
            <div className="flex flex-row w-full h-full shadow">
              <div className="h-full w-2/5 items-start align-middle flex flex-row bg-gray-50 bg-opacity-75">
                <div className="py-2 px-4 text-gray-900 align-middle font-medium text-xs">_________ ________ _______ _________ ____</div>
              </div>
              <div className="h-full flex-auto rounded-t-md"></div>
              <div className="h-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 2)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 2 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-indigo-600' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-indigo-400' : 'bg-gray-100'} cursor-pointer`}>
            {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />}
            <div className="flex flex-col w-full h-full shadow justify-center items-center">
              <div className="w-full rounded-t-md"></div>
              <div className="w-3/5 justify-center items-center text-center align-middle flex flex-row bg-gray-50 bg-opacity-75 rounded-sm">
                <div className="pt-1 pb-3 px-4 text-center text-gray-900 align-middle font-medium text-xs">_________________ ______________ ____</div>
              </div>
              <div className="w-full rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 3)} className={`w-full aspect-w-16 aspect-h-9 rounded-md overflow-hidden border-2 ${thumbTemplate === 3 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-indigo-600' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-indigo-400' : 'bg-gray-100'} cursor-pointer`}>
            {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />}
            <div className="flex flex-row-reverse w-full h-full shadow">
              <div className="h-full w-2/5 items-start align-middle flex flex-row bg-gray-50 bg-opacity-75">
                <div className="py-2 px-4 text-gray-900 align-middle font-medium text-xs">_________ ________ _______ _________ ____</div>
              </div>
              <div className="h-full flex-auto rounded-t-md"></div>
              <div className="h-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 4)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 4 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-indigo-600' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-indigo-400' : 'bg-gray-100'} cursor-pointer`}>
            {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />}
            <div className="bg-gray-900 bg-opacity-20"></div>
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full justify-center items-center align-middle flex flex-row">
                <div className="py-2 px-4 text-white align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>_________________________ ___________________</div>
              </div>
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 5)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 5 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-indigo-600' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-indigo-400' : 'bg-gray-100'} cursor-pointer`}>
            {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />}
            <div className="bg-gray-900 bg-opacity-20"></div>
            <div className="flex flex-col w-full h-full shadow">
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto justify-center items-center text-center align-middle flex flex-row">
                <div className="py-2 px-24 text-center text-white align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>_________________ ______________ _______________ ____</div>
              </div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div>
          <div onClick={event => handleChangeThumbTemplate(event, 6)} className={`w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden border-2 ${thumbTemplate === 6 ? `border-indigo-600 shadow ${thumbBgImage !== "" ? 'bg-indigo-600' : 'bg-gray-100'}` : 'border-gray-100 bg-gray-100'} hover:border-indigo-400 hover:${thumbBgImage !== "" ? 'bg-indigo-400' : 'bg-gray-100'} cursor-pointer`}>
            {thumbBgImage !== "" && <img src={thumbBgImage} alt="ThumbBg" className="rounded-md w-full h-full object-center object-cover" />}
            <div className="bg-gray-900 bg-opacity-20"></div>
            <div className="flex flex-col-reverse w-full h-full shadow">
              <div className="w-full justify-center items-center align-middle flex flex-row">
                <div className="py-4 px-4 text-white align-middle font-medium text-xs" style={{"textShadow": "0 0px 5px rgba(0,0,0,0.28), 0 0px 15px rgba(0,0,0,0.25)"}}>_________________________ ___________________</div>
              </div>
              <div className="w-full flex-auto rounded-t-md"></div>
              <div className="w-full flex-auto rounded-b-md"></div>
            </div>
          </div> */}
        </div></>}
      </div>
    </div>
  )
}

export default CreationTool