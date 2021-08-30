import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import DataSource from './DataSource';

const LoadingSpinner = ({ className }) => {
    return (
      <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
}

const DATASOURCE_DEFAULT_OPTIONS = {
    GOOGLESHEET: { spreadsheetId: '', range: '' }
};

const DataSourceTool = ({ isHidden }) => {

    const [url, setUrl] = useState("");
    const [type, setType] = useState("");
    const [options, setOptions] = useState({});

    const [isLoading, setIsLoading] = useState(false);
    const [isValidSource, setIsValidSource] = useState(false)

    const handleChange = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();

        if (value.indexOf("https://docs.google.com/spreadsheets/") > -1) {
            setType("GOOGLESHEET");

            let newOptions = DATASOURCE_DEFAULT_OPTIONS["GOOGLESHEET"];

            newOptions.spreadsheetId = value.substring(value.indexOf("/d/") + 3, value.lastIndexOf("/"))
            setOptions(DATASOURCE_DEFAULT_OPTIONS["GOOGLESHEET"]);
            setIsValidSource(true);
        } else {
            setType("");
            setIsValidSource(false);
        }
        
    
        setUrl(value);
    };

    const handleChangeOption = (e) => {
        const { target } = e;
        const { value, name } = target;
        e.persist();

        const newOptions = { ...options, [name]: value };
    
        setOptions(newOptions);
    };

    const handleAddDataSource = (e) => {
        e.preventDefault();
        setIsLoading(true);
    }

    return (
        <div className={`min-h-screen flex-col lg:flex-row items-start justify-center bg-gray-50 py-20 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-0 lg:space-x-40 ${isHidden ? 'hidden' : 'flex'}`}>
            <div className="max-w-2xl w-full space-y-3">
                <div className="flex flex-col items-start justify-start">
                    <h2 className="ml-2 text-left text-3xl font-extrabold text-gray-900 select-none">Source de données</h2>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 w-full">
                    <div className="flex flex-row item-center justify-center align-middle space-x-2 bg-gray-100 p-2 rounded-md w-full">
                        <div className="w-full flex flex-col">
                            <input
                                id="texte"
                                onChange={handleChange}
                                value={url}
                                name="dataSourceUrl"
                                type="text"
                                required
                                className="resize-none appearance-none rounded-none relative block h-9 w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Entrez l'url de la source de données"
                                /* onKeyDown={handleKeyDown} */
                            />
                            {type === "GOOGLESHEET" && 
                                <div className="w-full flex flex-row mt-1 space-x-1">
                                    <input
                                        id="range"
                                        onChange={handleChangeOption}
                                        value={options.range}
                                        name="range"
                                        type="text"
                                        required
                                        className="resize-none appearance-none rounded-none relative block h-9 w-1/3 px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                        placeholder="Plage de données (A1:D6)"
                                        /* onKeyDown={handleKeyDown} */
                                    />
                                </div>
                            }
                        </div>
                        <div onClick={handleAddDataSource} className={`rounded-md select-none h-9 w-9 font-medium text-center text-sm text-white align-middle border-2 flex items-center justify-center ${isValidSource ? 'cursor-pointer shadow bg-blue-600 hover:bg-blue-500 border-blue-600 hover:border-blue-500' : 'pointer-event-none bg-gray-100 border-gray-100'}`}>
                            {isLoading ? <LoadingSpinner className="h-5 w-5 text-white" /> : isValidSource ? <CheckCircleIcon className="h-6 w-6 text-white" /> : <XCircleIcon className="h-6 w-6 text-gray-300" />}
                        </div>
                    </div>                
                </div>
            </div>
            <div className="max-w-2xl w-full space-y-3">

            </div>
        </div>
    );
}

export default DataSourceTool;