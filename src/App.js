import React, { useState, useEffect } from 'react'
import './App.css';
import { CreationTool, CreationFromDataTool, LayoutTool, ObjectDetectionTool, DataSourceTool, VisualQueryBuilderTool, BirthdayTool } from './modules';
import { DatabaseIcon, PhotographIcon, TableIcon, GiftIcon, CollectionIcon, TemplateIcon, QrcodeIcon, CakeIcon } from '@heroicons/react/outline'
import { useMediaQuery } from 'react-responsive';

function App() {

  const [currentTool, setCurrentTool] = useState("CreationTool");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState([]);

  const [isWrongPassword, setIsWrongPassword] = useState(false);

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const handleChangePassword = (e, index) => {
    const { target } = e;
    const { value } = target;
    e.persist();

    if (isWrongPassword) {
      setIsWrongPassword(false);
    }

    let newPassword = [...password];

    newPassword.push(value);

    if (newPassword.length === 6) {
      let authorized = (parseInt(newPassword[0]) * 10 + parseInt(newPassword[1])) + (parseInt(newPassword[2]) * 10 + parseInt(newPassword[3])) + (parseInt(newPassword[4]) * 10 + parseInt(newPassword[5])) === 150;

      if (authorized) {
        setIsAuthorized(authorized);
      } else {
        newPassword = [];
        setIsWrongPassword(true)
      }
    }

    const nextfield = document.querySelector(
      `input[name=password-${parseInt(newPassword.length) + 1}]`
    );

    // If found, focus the next field
    if (nextfield !== null) {
      nextfield.focus();
    }

    setPassword(newPassword);
  };

  const handleOnFocusPassword = (e, current) => {
    e.preventDefault();
    e.stopPropagation();
    if (current !== (password.length + 1)) {
      const nextfield = document.querySelector(
        `input[name=password-${password.length + 1}]`
      );
  
      // If found, focus the next field
      if (nextfield !== null) {
        nextfield.focus();
      }
    }
  }

  const handleKeyDownPassword = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      let newPassword = [...password];

      if (newPassword.length > 0) {
        newPassword.splice(newPassword.length - 1, 1);
      }
      
      const nextfield = document.querySelector(
        `input[name=password-${newPassword.length + 1}]`
      );
  
      // If found, focus the next field
      if (nextfield !== null) {
        nextfield.focus();
      }

      setPassword(newPassword);
    }
  }

  return (
    <>
    {isAuthorized ? 
    <>
      <div className="z-50 absolute top-0 left-0 flex flex-row lg:flex-col lg:max-w-min lg:min-h-screen p-3 space-x-4 lg:space-x-0 lg:space-y-4 rounded-br-md bg-white shadow lg:bg-transparent lg:shadow-none">
        <PhotographIcon onClick={() => setCurrentTool("CreationTool")} className={`h-6 w-6 text-${currentTool === "CreationTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
        <CollectionIcon onClick={() => setCurrentTool("CreationFromDataTool")} className={`h-6 w-6 text-${currentTool === "CreationFromDataTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
        <TemplateIcon onClick={() => setCurrentTool("LayoutTool")} className={`h-6 w-6 text-${currentTool === "LayoutTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
        <QrcodeIcon onClick={() => setCurrentTool("ObjectDetectionTool")} className={`h-6 w-6 text-${currentTool === "ObjectDetectionTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
        <CakeIcon onClick={() => setCurrentTool("BirthdayTool")} className={`h-6 w-6 text-${currentTool === "BirthdayTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
        <DatabaseIcon onClick={() => setCurrentTool("DataSourceTool")} className={`h-6 w-6 text-${currentTool === "DataSourceTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
        <TableIcon onClick={() => setCurrentTool("VisualQueryBuilderTool")} className={`h-6 w-6 text-${currentTool === "VisualQueryBuilderTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
      </div>
      <CreationTool isHidden={currentTool !== "CreationTool"} />
      {currentTool === "CreationFromDataTool" && <CreationFromDataTool isHidden={currentTool !== "CreationFromDataTool"} />}
      {currentTool === "LayoutTool" && <LayoutTool isHidden={currentTool !== "LayoutTool"} />}
      {currentTool === "ObjectDetectionTool" && <ObjectDetectionTool isHidden={currentTool !== "ObjectDetectionTool"} />}
      <BirthdayTool isHidden={currentTool !== "BirthdayTool"} />
      <DataSourceTool isHidden={currentTool !== "DataSourceTool"} />
      <VisualQueryBuilderTool isHidden={currentTool !== "VisualQueryBuilderTool"} />
    </>
    :
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-4">
        <div className="flex flex-col items-center justify-center">
          <h3 className="text-center text-xl font-medium text-gray-900">Netsign.tv</h3>
          <h2 className="mt-1 text-center text-3xl font-extrabold text-gray-900">Création simplifiée</h2>
          <p className="mt-3 text-center text-sm text-blue-500">
            Entrez le code d'accès
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`flex flex-row item-center justify-center align-middle space-x-2 bg-gray-100 p-2 rounded-md ${isWrongPassword && 'shake'}`}>
              <input
                id="password-1"
                name="password-1"
                type="password"
                pattern="[0-9]*" 
                inputMode="numeric"
                onChange={event => handleChangePassword(event, 0)}
                value={password[0] ? password[0] : ''}
                autoFocus={!isMobile}
                onClick={event => handleOnFocusPassword(event, 1)}
                onKeyDown={event => handleKeyDownPassword(event, 0)}
                required
                className="appearance-none relative block text-center w-8 px-1 lg:px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder=""
              />
              <input
                id="password-2"
                name="password-2"
                type="password"
                pattern="[0-9]*" 
                inputMode="numeric"
                onChange={event => handleChangePassword(event, 1)}
                value={password[1] ? password[1] : ''}
                onClick={event => handleOnFocusPassword(event, 2)}
                onKeyDown={event => handleKeyDownPassword(event, 1)}
                required
                className="appearance-none relative block text-center w-8 px-1 lg:px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder=""
              />
              <input
                id="password-3"
                name="password-3"
                type="password"
                pattern="[0-9]*" 
                inputMode="numeric"
                onChange={event => handleChangePassword(event, 2)}
                value={password[2] ? password[2] : ''}
                onClick={event => handleOnFocusPassword(event, 3)}
                onKeyDown={event => handleKeyDownPassword(event, 2)}
                required
                className="appearance-none relative block text-center w-8 px-1 lg:px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder=""
              />
              <input
                id="password-4"
                name="password-4"
                type="password"
                pattern="[0-9]*" 
                inputMode="numeric"
                onChange={event => handleChangePassword(event, 3)}
                value={password[3] ? password[3] : ''}
                onClick={event => handleOnFocusPassword(event, 4)}
                onKeyDown={event => handleKeyDownPassword(event, 3)}
                required
                className="appearance-none relative block text-center w-8 px-1 lg:px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder=""
              />
              <input
                id="password-5"
                name="password-5"
                type="password"
                pattern="[0-9]*" 
                inputMode="numeric"
                onChange={event => handleChangePassword(event, 4)}
                value={password[4] ? password[4] : ''}
                onClick={event => handleOnFocusPassword(event, 5)}
                onKeyDown={event => handleKeyDownPassword(event, 4)}
                required
                className="appearance-none relative block text-center w-8 px-1 lg:px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder=""
              />
              <input
                id="password-6"
                name="password-6"
                type="password"
                pattern="[0-9]*" 
                inputMode="numeric"
                onChange={event => handleChangePassword(event, 5)}
                value={password[5] ? password[5] : ''}
                onClick={event => handleOnFocusPassword(event, 6)}
                onKeyDown={event => handleKeyDownPassword(event, 5)}
                required
                className="appearance-none relative block text-center w-8 px-1 lg:px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder=""
              />
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-center text-xs text-gray-300">
              v 1.5.0
            </p>
          </div>
        </div>
      </div>
    </div>
    }
    {/* <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8"> */}
        
        {/* ÉTAPE 1 */}
        {/* <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Que voulez vous créer ?</h2>
        </div>
        <div className="flex flex-row item-center justify-center space-x-6">
          <div className="rounded-md py-4 px-6 shadow w-48 align-middle bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600">
            <p className="font-medium text-white text-center align-middle">
              Vignette
            </p>
          </div>

          <div className="rounded-md py-4 px-6 shadow w-48 align-middle bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600">
            <p className="font-medium text-white text-center">
              Liste de lecture
            </p>
          </div>
        </div> */}

        {/* ÉTAPE 2 */}

        {/* VIGNETTE */}
        {/* <div className="flex flex-col items-center justify-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Contenu de la vignette</h2>
          <p className="mt-2 text-center text-sm text-indigo-500">
            Ajoutez un titre, des textes, images, etc
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-row item-center justify-center align-middle space-x-2 bg-gray-100 p-2 rounded-md">
            <div className="self-center font-medium text-center text-lg text-gray-500 mx-1">
              Titre
            </div>
            <div>
              <label htmlFor="prenom" className="sr-only">
                Titre
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder=""
              />
            </div>
          </div>
          <div className="rounded-full font-medium text-center text-2xl text-white shadow align-middle bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500 h-8 w-8 flex items-center justify-center">
              +
          </div>
        </div> */}

        {/* LISTE DE LECTURE */}
        {/* <div className="flex flex-col items-center justify-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Contenu de la liste de lecture</h2>
          <p className="mt-2 text-center text-sm text-indigo-500 w-1/2">
            Choisissez un format de contenu prédéfini ou créez en un adapter à vos besoins
          </p>
        </div>
        <div className="flex flex-row item-center justify-center space-x-6 ">
          <div className="rounded-md py-4 px-6 shadow w-48 align-middle bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500">
            <p className="font-medium text-white text-center align-middle">
              Anniversaires
            </p>
          </div>

          <div className="rounded-md py-4 px-6 text-gray-400 hover:text-indigo-500 border-dashed border-gray-400 hover:border-indigo-500 border-2 shadow w-48 align-middle cursor-pointer">
            <p className="font-medium text-center">
              Créer +
            </p>
          </div>
        </div> */}

        {/* ANNIVERSAIRES */}
        {/* <div className="flex flex-col items-center justify-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Anniversaires à souligner</h2>
          <p className="mt-2 text-center text-sm text-indigo-500 w-1/2 align-middle">
            Ajoutez les anniversaires que vous souhaitez souligner chaque année
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-row item-center justify-center align-middle space-x-2 bg-gray-100 p-2 rounded-md">
            <div className="self-center font-medium text-center text-lg text-gray-500 mx-1">
                1
            </div>
            <div>
              <label htmlFor="prenom" className="sr-only">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label htmlFor="nom" className="sr-only">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nom"
              />
            </div>
            <div>
              <label htmlFor="dateNaissance" className="sr-only">
                Date de naissance
              </label>
              <input
                id="dateNaissance"
                name="dateNaissance"
                type="date"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Date de naissance"
              />
            </div>
          </div>
          <div className="rounded-full font-medium text-center text-2xl text-white shadow align-middle bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500 h-8 w-8 flex items-center justify-center">
              +
          </div>
        </div> */}

        {/* <div className="flex flex-col items-center justify-center">
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">Que voulez-vous annoncer ?</h2>
          <p className="mt-2 text-center text-sm text-indigo-500 w-1/2 align-middle">
            Écrivez le texte qui s'affichera dans la vignette
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 w-full">
          <div className="flex flex-row item-center justify-center align-middle space-x-2 bg-gray-100 p-2 rounded-md w-full">
            <div className="w-full">
              <label htmlFor="texte" className="sr-only">
                Texte
              </label>
              <textarea
                id="texte"
                name="texte"
                type="textarea"
                required
                className="appearance-none rounded-none relative block w-full min-h-28 max-h-28 px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Texte"
              />
            </div>
          </div>
          <div className="rounded-md font-medium py-1 px-3 text-center text-sm text-white shadow align-middle bg-indigo-600 hover:bg-indigo-500 cursor-pointer border-2 border-indigo-600 hover:border-indigo-500 flex items-center justify-center">
              Créer la vignette!
          </div>
        </div> */}
        
        {/* <form className="flex flex-row mt-8 space-x-4" action="#" method="POST">
          <div>
            <label htmlFor="prenom" className="sr-only">
              Prénom
            </label>
            <input
              id="prenom"
              name="prenom"
              type="prenom"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Prénom"
            />
          </div>
          <div>
            <label htmlFor="nom" className="sr-only">
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="nom"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nom"
            />
          </div>
          <div>
            <label htmlFor="dateNaissance" className="sr-only">
              Date de naissance
            </label>
            <input
              id="dateNaissance"
              name="dateNaissance"
              type="date"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Date de naissance"
            />
          </div>
          

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember
              </label>
            </div>
          </div>
        </form> */}
      {/* </div>
    </div> */}
    </>
  );
}

export default App;
