import React, { useState } from 'react'
import './App.css';
import { CreationTool, BirthdayTool, DataSourceTool } from './modules';
import { DatabaseIcon, PhotographIcon } from '@heroicons/react/outline'

function App() {

  const [currentTool, setCurrentTool] = useState("CreationTool");

  return (
    <>
    {/* <BirthdayTool /> */}
    <div className="z-50 fixed flex flex-row lg:flex-col lg:max-w-min lg:min-h-screen p-3 space-x-4 lg:space-x-0 lg:space-y-4 rounded-br-md bg-white shadow lg:bg-transparent lg:shadow-none">
      <PhotographIcon onClick={() => setCurrentTool("CreationTool")} className={`h-6 w-6 text-${currentTool === "CreationTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
      <DatabaseIcon onClick={() => setCurrentTool("DataSourceTool")} className={`h-6 w-6 text-${currentTool === "DataSourceTool" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
    </div>
    <CreationTool isHidden={currentTool !== "CreationTool"} />
    <DataSourceTool isHidden={currentTool !== "DataSourceTool"} />
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
