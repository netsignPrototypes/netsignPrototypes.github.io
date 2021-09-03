import React, { useState } from 'react'
import { CheckCircleIcon, XCircleIcon, TableIcon, DatabaseIcon } from '@heroicons/react/outline'
import DataSource from './DataSource';
import DataSourceManager from './DataSourceManager';

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

const dataSourceManager = new DataSourceManager();

const DataSourceTool = ({ isHidden }) => {

    const [url, setUrl] = useState("https://docs.google.com/spreadsheets/d/1gwYEvp4q0Zp2-b1DJcO1k3NoBO-BS5pZa6FwmyiXH1w/edit?usp=sharing");
    const [type, setType] = useState("");
    const [options, setOptions] = useState({});
    const [dataSources, setDataSources] = useState([]);
    const [selectedDataSource, setSelectedDataSource] = useState([]);

    const [query, setQuery] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isValidSource, setIsValidSource] = useState(true)

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
        createDataSource();
    }

    const createDataSource = () => {
        let newDataSource = new DataSource();

        newDataSource.load(url).then(valid => {
            if (valid) {
                dataSourceManager.add(newDataSource);
                console.log(newDataSource);

                setDataSources(dataSourceManager.getDataSources());
                setUrl('');
                setIsLoading(false);
            }
        });
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsLoading(true);
            createDataSource();
        }
      }

    const handleSelectDataSource = (dataSourceIdx, dataSetId) => {
        setSelectedDataSource([dataSourceIdx, dataSetId]);

        let newQuery = dataSources[dataSourceIdx].getElementByProperty('dataSets', 'id', dataSetId).columns;

        setQuery(newQuery);
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
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div onClick={handleAddDataSource} className={`rounded-md select-none h-9 w-9 font-medium text-center text-sm text-white align-middle border-2 flex items-center justify-center ${isValidSource ? 'cursor-pointer shadow bg-blue-600 hover:bg-blue-500 border-blue-600 hover:border-blue-500' : 'pointer-event-none bg-gray-100 border-gray-100'}`}>
                            {isLoading ? <LoadingSpinner className="h-5 w-5 text-white" /> : isValidSource ? <CheckCircleIcon className="h-6 w-6 text-white" /> : <XCircleIcon className="h-6 w-6 text-gray-300" />}
                        </div>
                    </div>                
                </div>
                <div className="flex flex-row space-x-2 items-start justify-start">
                    {dataSources.map((dataSource, dSrcIndex) => {
                        return <div key={dSrcIndex} className={`cursor-pointer flex flex-row items-center py-3 px-4 space-x-4 justify-center rounded-md border shadow-sm ${false ? 'text-white bg-blue-500 hover:bg-blue-400 border-blue-500 hover:border-blue-400' : 'text-gray-900 bg-gray-100 hover:bg-gray-100 border-gray-100 hover:border-gray-100'}`}>
                            <div className="flex flex-col items-start justify-start space-y-1">
                                <div className="leading-none font-medium">{dataSource.name}</div>
                                <div className="leading-none font-light text-xs">{dataSource.type}</div>
                                <div className="flex flex-row items-start justify-start space-x-2 pt-2">
                                    {dataSource.dataSets.map((dataSet, rIndex) => {
                                        return <div key={rIndex} onClick={() => handleSelectDataSource(dSrcIndex, dataSet.id)}
                                                className={`cursor-pointer flex flex-row items-center justify-center py-0.5 px-2 rounded-sm border bg-transparent ${selectedDataSource.length > 0 && selectedDataSource[0] === dSrcIndex && selectedDataSource[1] === dataSet.id ? 'text-white bg-blue-500 border-blue-500' : 'text-gray-600 border-gray-300 hover:border-blue-500 hover:text-blue-500'}`}>
                                                    <div className="text-xs">{dataSet.name}</div>
                                                </div>
                                    })}
                                </div>
                            </div>
                            
                        </div>
                    })}
                    {/* {dataSources.map((dataSource, dSrcIndex) => {
                        return <div key={dSrcIndex} className="flex flex-row items-center justify-start space-x-4 py-2 px-4 rounded-md w-full">
                            <div className="font-bold pr-4">{dataSource.name}</div>
                            {dataSources.length > 0 && dataSource.ressources.map((ressource, rIndex) => {
                                return <div key={rIndex} className="flex flex-row items-center justify-start space-x-4">
                                    {ressource.dataSets.map((dataSet, dSetIndex) => {
                                        return <div key={dSetIndex} onClick={() => setSelectedDataSource([dSrcIndex, rIndex, dSetIndex])} 
                                        className={`cursor-pointer flex flex-row items-center justify-start space-x-2 py-0.5 px-3 rounded-full border shadow-sm border-gray-200  ${selectedDataSource.length > 0 && selectedDataSource[0] === dSrcIndex && selectedDataSource[1] === rIndex && selectedDataSource[2] === dSetIndex ? 'text-white bg-blue-500 hover:bg-blue-400 border-blue-500 hover:border-blue-400' : 'text-gray-900 bg-gray-200 hover:bg-gray-100 hover:border-gray-200'}`}>
                                            <TableIcon className="h-6 w-6" />
                                            <div className="text-sm pr-0.5">{`${ressource.name}!${dataSet.dataRange[0]}:${dataSet.dataRange[1]}`}</div>
                                        </div>
                                    })}
                                </div>
                            })}
                        </div>
                    })} */}
                </div>

                {/* {selectedDataSource && 
                    <div className="flex flex-col item-start justify-start space-y-2 bg-gray-100 p-2 rounded-md w-full">

                    </div>
                } */}
            </div>
            <div className="max-w-2xl w-full space-y-3">
                <div className="w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md shadow overflow-hidden">
                    <div className="w-full h-full gradientBackground"></div>
                    {selectedDataSource && selectedDataSource.length > 0 &&
                        <div className="flex w-full h-full items-start justify-center p-4">
                            <div className="table w-full rounded-sm bg-white bg-opacity-90">
                                <div className="table-header-group">
                                    <div className="table-row">
                                        {query.map(column => {
                                            return <div className="table-cell text-xs font-medium">{column.title}</div>
                                        })}
                                    </div>
                                </div>
                                <div className="table-row-group">
                                    {dataSources[selectedDataSource[0]].queryDataSet(selectedDataSource[1]).map(row => {
                                        return <div className="table-row">
                                            {row.map(cell => {
                                                return <div className="table-cell text-xs">{cell}</div>
                                            })}
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default DataSourceTool;