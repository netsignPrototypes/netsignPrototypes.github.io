import React, { useState, useRef, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon, TableIcon, DatabaseIcon } from '@heroicons/react/outline'
import DataSource from './DataSource';
import DataSourceManager from './DataSourceManager';
import FcmBd from './FcmBd';

const LoadingSpinner = ({ className }) => {
    return (
      <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
}

const dataSourceManager = new DataSourceManager();

const DataSourceTool = ({ isHidden }) => {

    const [url, setUrl] = useState("https://docs.google.com/spreadsheets/d/1gwYEvp4q0Zp2-b1DJcO1k3NoBO-BS5pZa6FwmyiXH1w/edit?usp=sharing");
    const [dataSources, setDataSources] = useState([]);
    const [selectedDataSource, setSelectedDataSource] = useState([]);

    const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const thumbPreview = useRef();

    const [thumbFontSize, setThumbFontSize] = useState(10);
    const [thumbTablePadding, setThumbTablePadding] = useState(1);
    const [thumbTableWidth, setThumbTableWidth] = useState(100);
    const [totalColumnWidth, setTotalColumnWidth] = useState(0);
    const [maxNbRows, setMaxNbRows] = useState(0);

    const [htmlTable, setHtmlTable] = useState(<></>);

    const [query, setQuery] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isValidSource, setIsValidSource] = useState(true);

    const handleChange = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();        
    
        setUrl(value);
    };

    useEffect(() => {
        FcmBd.DataSources.add('TestData', "https://docs.google.com/spreadsheets/d/1gwYEvp4q0Zp2-b1DJcO1k3NoBO-BS5pZa6FwmyiXH1w/edit?usp=sharing", async (req, res) => {});
    }, [])

    const handleAddDataSource = (e) => {
        e.preventDefault();

        if (url) {
            setIsLoading(true);
            createDataSource();
        } else {
            setIsLoading(true);
            let query = { 
                select: {
                    nom: 1,
                    prenom: 1,
                    equipe: 1,
                    pause: 1,
                    debut: 1,
                    fin: 1
                }, 
                from: 'Simons',
                where: { $and: [{ pause: 'A'}, {equipe: 121}] },
                orderBy: [{ nom: 1 }, { prenom: 1 }],
                limit: 200,
                skip: 0
            };

            FcmBd.DataSources.query('TestData', false, query).then(queryResult => {
                console.log('FcmBd.DataSources.query("TestData")', queryResult);
                setIsLoading(false);
            });
        }
        
    }

    const createDataSource = () => {

        FcmBd.DataSources.add('TestData2', url, async (req, res) => {

            let find = FcmBd.DataSources.find('TestData2');

            /* let query = { 
                select: ['nom', 'prenom', 'equipe', 'pause', 'debut', 'fin'], 
                from: 'Simons', 
                orderBy: ['equipe', 'nom', 'prenom'] 
            }; */

            let query = { 
                select: {
                    nom: 1,
                    prenom: 1,
                    equipe: 1,
                    pause: 1,
                    debut: 1,
                    fin: 1
                }, 
                from: 'Simons',
                where: { equipe: 9 },
                orderBy: [{ nom: 1 }, { prenom: 1 }],
                limit: 200,
                skip: 0
            };

            let queryResult = await FcmBd.DataSources.query('TestData2', true, query);

            console.log('FcmBd.DataSources.find("TestData")', find);
            console.log('FcmBd.DataSources.query("TestData")', queryResult);
        });        

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

        let newQuery = dataSources[dataSourceIdx].getElementByProperty('dataSets', 'id', dataSetId).columns.map(column => {
            return {...column, filters: {}, format: '', width: 0, textAlign: 'left', textDescriptions: {}, display: true };
        });

        setQuery(newQuery);
    }

    const handleChangeQueryColumn = (e, colIndex) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        e.persist();

        let newQuery = [...query];

        newQuery[colIndex][name] = value;

        setQuery(newQuery);
    }

    const handleChangeQueryColumnSpecific = (e, name, value, colIndex) => {
        e.persist();

        let newQuery = [...query];

        newQuery[colIndex][name] = value;

        setQuery(newQuery);
    }

    const sum = (items, prop) => {
        return items.reduce( function(a, b){
            return a + parseInt(b[prop]);
        }, 0);
    }

    const getMaxNbRows = (previewWidth, fontSize, tablePadding, windowPadding) => {

        let screenHeight = previewWidth / 16 * 9;
        let minHeaderFontSize = getComputedPixelSize(fontSize * 1.25);
        let minBannerSpace = 0;
        let minTablePadding = getComputedPixelSize(tablePadding < 2 ? 2 : 0);
        let minWindowPadding = getComputedPixelSize(windowPadding);
        let minCellPadding = getComputedPixelSize(tablePadding / 3);
        let minCellFontSize = getComputedPixelSize(fontSize);


        let newMaxNbRows = Math.floor((screenHeight - minHeaderFontSize - minBannerSpace - (minTablePadding * 2) - (minWindowPadding * 2)) / ((minCellPadding * 2) + minCellFontSize + 1));

        return newMaxNbRows;
    }

    useEffect(() => {

        let tables = [];

        if (selectedDataSource && selectedDataSource.length > 0) {

            let screenHeight = thumbPreviewWidth / 16 * 9;
            let minHeaderFontSize = getComputedPixelSize(thumbFontSize * 1.25);
            let minHeaderPadding = getComputedPixelSize(thumbTablePadding * 1.5);
            let minBannerSpace = 0;
            let minTablePadding = 0;
            let minWindowPadding = getComputedPixelSize(25);
            let minCellPadding = getComputedPixelSize(thumbTablePadding);
            let minCellFontSize = getComputedPixelSize(thumbFontSize);

            let newMaxNbRows = Math.floor((screenHeight - minHeaderFontSize - minBannerSpace - (minTablePadding * 2) - (minWindowPadding * 2) - (minHeaderPadding * 2)) / ((minCellPadding * 2) + minCellFontSize + 1));

            for (let i = 0;i < 1; i++) {

                let columns = query.filter(column => column.display === true);
                let data = dataSources[selectedDataSource[0]].queryDataSet(selectedDataSource[1], query.filter(column => column.display === true)).slice(newMaxNbRows * i, (newMaxNbRows * i) + newMaxNbRows);

                if (data.length > 0) {
                    let table = <div className="table rounded-sm overflow-hidden"
                                style={{ 
                                    /* padding: `${getComputedPixelSize(thumbTablePadding < 2 ? 2 : 0)}px ${getComputedPixelSize(thumbTablePadding < 2 ? 2 : thumbTablePadding / 3)}px ${getComputedPixelSize(thumbTablePadding < 2 ? 2 : thumbTablePadding)}px ${getComputedPixelSize(thumbTablePadding < 2 ? 2 : thumbTablePadding / 3)}px`, */
                                    width: `${thumbTableWidth}%`,
                                    marginLeft: `${i === 0 ? 0 : getComputedPixelSize(10)}px`
                                }}
                            >
                                <div className="table-header-group bg-gray-200 bg-opacity-90">
                                    <div className="table-row">
                                        {columns.map(column => {
                                            return <div className="table-cell align-middle font-medium select-none leading-none truncate" 
                                            style={{ 
                                                padding: `${getComputedPixelSize(thumbTablePadding * 1.5)}px ${getComputedPixelSize(thumbTablePadding * 3)}px ${getComputedPixelSize(thumbTablePadding * 1.5)}px ${getComputedPixelSize(thumbTablePadding * 3)}px`,
                                                fontSize: `${getComputedPixelSize(thumbFontSize * 1.25)}px`,
                                                lineHeight: `${getComputedPixelSize(thumbFontSize * 1.25)}px`,
                                                width: (column.width > 0 ? `${column.width}%` : 'auto'),
                                                textAlign: column.textAlign
                                            }}
                                            >{column.title}</div>
                                        })}
                                    </div>
                                </div>
                                <div className="table-row-group bg-white bg-opacity-90"
                                    style={{ 
                                        padding: `${getComputedPixelSize(thumbTablePadding)}px 0`,
                                    }}
                                >
                                    {data.map(row => {
                                        return <div className="table-row">
                                            {row.map((cell, index) => {
                                                return <div className="table-cell align-middle select-none leading-none truncate border-t border-gray-300" 
                                                    style={{ 
                                                        padding: `${getComputedPixelSize(thumbTablePadding)}px ${getComputedPixelSize(thumbTablePadding * 3)}px ${getComputedPixelSize(thumbTablePadding)}px ${getComputedPixelSize(thumbTablePadding * 3)}px`,
                                                        fontSize: `${getComputedPixelSize(thumbFontSize)}px`,
                                                        lineHeight: `${getComputedPixelSize(thumbFontSize)}px`,
                                                        textAlign: columns[index].textAlign
                                                    }}
                                                >{cell}</div>
                                            })}
                                        </div>
                                    })}
                                </div>
                            </div>

                    tables.push(table);
                }
                
            }

            setMaxNbRows(newMaxNbRows);
        }

        setHtmlTable(tables);

    }, [thumbPreviewWidth, thumbFontSize, thumbTablePadding, dataSources, selectedDataSource, query, thumbTableWidth]);

    /* useEffect(() => {
        let totalWidth = sum(query, 'width');

        console.log(totalWidth);

        totalWidth = 100 - totalWidth;

        setTotalColumnWidth(totalWidth);
    }, [query]); */

    useEffect(() => {
        setThumbPreviewWidth(thumbPreview.current.offsetWidth);
    }, [thumbPreview]);
    
    const getComputedPixelSize = (pixel) => {
    let computedPixelSize = 0;
    let currentThuumbPreviewWidth = thumbPreviewWidth;

    if (thumbPreviewWidth === 0) {
        currentThuumbPreviewWidth = thumbPreview.current.offsetWidth;
        setThumbPreviewWidth(currentThuumbPreviewWidth);
    }

    computedPixelSize = currentThuumbPreviewWidth / 672 * pixel;

    return computedPixelSize;
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

                {query.length > 0 && 
                    <div className="flex flex-col item-start justify-start space-y-2 bg-gray-100 p-2 rounded-md w-full">
                        <div className="table w-full rounded-sm">
                            <div className="table-header-group">
                                <div className="table-row">
                                    <div className="table-cell text-xs font-medium py-1 px-2"></div>
                                    <div className="table-cell text-xs font-medium py-1 px-2">Titre</div>
                                    <div className="table-cell text-xs font-medium py-1 px-2 text-center">Afficher</div>
                                    <div className="table-cell text-xs font-medium py-1 px-2">Alignement</div>
                                    <div className="table-cell text-xs font-medium py-1 px-2">Largeur</div>
                                    {/* <div className="table-cell text-xs font-medium">Style</div> */}
                                </div>
                            </div>
                            <div className="table-row-group">
                                {query.map((column, index) => {
                                    return <div className="table-row" key={column.name}>
                                        <div className="table-cell text-xs py-1 px-1 text-center align-middle">{index + 1}</div>
                                        <div className="table-cell py-1 px-2 align-middle">
                                            <input
                                                id={`title-${index}`}
                                                onChange={event => handleChangeQueryColumn(event, index)}
                                                value={column.title}
                                                name='title'
                                                type="text"
                                                autoComplete="off"
                                                className="resize-none appearance-none rounded-none relative block h-6 w-full px-2 py-1 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                                placeholder="Titre"
                                            />
                                        </div>
                                        <div className="table-cell py-1 px-2 text-center align-middle">
                                            <input type="checkbox" id={`display-${index}`} name="display" checked={column.display} onChange={event => handleChangeQueryColumn(event, index)} className="appearance-none cursor-pointer checked:bg-blue-500 checked:border-transparent" />
                                        </div>
                                        <div className="table-cell py-1 px-2 align-middle">
                                            <div className="flex flex-row space-x-1">
                                                <div onClick={event => handleChangeQueryColumnSpecific(event, 'textAlign', 'left', index)} className="cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${column.textAlign === 'left' && 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M 4 6 h 16 M 4 12 h 8 m -8 6 h 12" />
                                                    </svg>
                                                </div>
                                                <div onClick={event => handleChangeQueryColumnSpecific(event, 'textAlign', 'center', index)} className="cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${column.textAlign === 'center' && 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M 4 6 h 16 M 8 12 h 8 m -10 6 h 12" />
                                                    </svg>
                                                </div>
                                                <div onClick={event => handleChangeQueryColumnSpecific(event, 'textAlign', 'right', index)} className="cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${column.textAlign === 'right' && 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M 4 6 h 16 M 12 12 h 8 m -12 6 h 12" />
                                                    </svg>
                                                </div>

                                            </div>
                                            
                                        </div>
                                        <div className="table-cell py-1 px-2 align-middle">
                                            <div className="flex flex-row">
                                                <input type="range" className="cursor-pointer" id={`width-${index}`} step={1} name="width" min="0" max={100} onChange={event => handleChangeQueryColumn(event, index)} defaultValue={0} />
                                                <div className="text-xs px-2">{column.width}</div>
                                            </div>
                                        </div>
                                        {/* <div className="table-cell"></div> */}
                                    </div>
                                })}
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="max-w-2xl w-full space-y-3" ref={thumbPreview}>
                {selectedDataSource && selectedDataSource.length > 0 && <>
                <div className="w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md shadow overflow-hidden">
                    <div className="w-full h-full gradientBackground"></div>
                    
                        <div className="flex flex-row w-full h-full items-start justify-start"
                            style={{
                                padding: `${getComputedPixelSize(25)}px ${getComputedPixelSize(25)}px ${getComputedPixelSize(25)}px ${getComputedPixelSize(25)}px`
                            }}
                        >
                            {/* <div className="flex flex-col items-start justify-start">
                                <h2 className="text-left font-extrabold text-white select-none"
                                style={{
                                    fontSize: `${getComputedPixelSize(18)}px`,
                                    paddingBottom: `${getComputedPixelSize(thumbTablePadding * 2)}px`
                                }}
                                >{dataSources[selectedDataSource[0]].dataSets.find(dataSet => dataSet.id === selectedDataSource[1]).name}</h2>
                            </div> */}
                            {/* <div className="table rounded-sm bg-white bg-opacity-90"
                                style={{ 
                                    padding: `${getComputedPixelSize(thumbTablePadding < 2 ? 2 : 0)}px ${getComputedPixelSize(thumbTablePadding < 2 ? 2 : thumbTablePadding / 3)}px ${getComputedPixelSize(thumbTablePadding < 2 ? 2 : thumbTablePadding)}px ${getComputedPixelSize(thumbTablePadding < 2 ? 2 : thumbTablePadding / 3)}px`,
                                    width: `${thumbTableWidth}%`
                                }}
                            >
                                <div className="table-header-group">
                                    <div className="table-row">
                                        {query.filter(column => column.display === true).map(column => {
                                            return <div className="table-cell font-medium select-none leading-none" 
                                            style={{ 
                                                padding: `${getComputedPixelSize(thumbTablePadding * 2)}px ${getComputedPixelSize(thumbTablePadding * 3)}px ${getComputedPixelSize(thumbTablePadding * 2)}px ${getComputedPixelSize(thumbTablePadding * 3)}px`,
                                                fontSize: `${getComputedPixelSize(thumbFontSize * 1.25)}px`,
                                                width: (column.width > 0 ? `${column.width}%` : 'auto')
                                            }}
                                            >{column.title}</div>
                                        })}
                                    </div>
                                </div>
                                <div className="table-row-group">
                                    {dataSources[selectedDataSource[0]].queryDataSet(selectedDataSource[1], query.filter(column => column.display === true)).slice(0, maxNbRows).map(row => {
                                        return <div className="table-row">
                                            {row.map(cell => {
                                                return <div className="table-cell select-none leading-none" 
                                                    style={{ 
                                                        padding: `${getComputedPixelSize(thumbTablePadding)}px ${getComputedPixelSize(thumbTablePadding * 3)}px ${getComputedPixelSize(thumbTablePadding)}px ${getComputedPixelSize(thumbTablePadding * 3)}px`,
                                                        fontSize: `${getComputedPixelSize(thumbFontSize)}px`,
                                                    }}
                                                >{cell}</div>
                                            })}
                                        </div>
                                    })}
                                </div>
                            </div> */}

                            {htmlTable}

                        </div>
                </div>

                <div className="flex flex-row flex-wrap item-center justify-start align-middle w-full mt-2">
                    <div>{`${maxNbRows}/${dataSources[selectedDataSource[0]].queryDataSet(selectedDataSource[1], query.filter(column => column.display === true)).length}`}</div>
                </div>

                <div className="flex flex-row flex-wrap item-center justify-start align-middle w-full mt-2">

                    <div className="flex flex-col lg:flex-row flex-wrap item-center justify-start align-middle w-full mt-4">
                        <div className="flex flex-row">
                            <div className={"select-none rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                            Taille du texte :
                            </div>
                            <div className={"select-none rounded-md m-1 pl-2 pr-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                                <input type="range" id="fontSize" step={0.1} name="fontSize" min="4" max="25" onChange={e => setThumbFontSize(parseFloat(e.target.value))} defaultValue={10} />
                            </div>
                            <div className={"select-none w-4 rounded-md m-1 pr-2 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                                {thumbFontSize}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className={"select-none rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                            Largeur du tableau :
                            </div>
                            <div className={"select-none rounded-md m-1 pl-2 pr-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                                <input type="range" id="padding" step={1} name="padding" min="0" max="100" onChange={e => setThumbTableWidth(parseInt(e.target.value))} defaultValue={100} />
                            </div>
                            <div className={"select-none w-4 rounded-md m-1 pr-2 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                                {thumbTableWidth}
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <div className={"select-none rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                            Espacement :
                            </div>
                            <div className={"select-none rounded-md m-1 pl-2 pr-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                                <input type="range" id="padding" step={0.1} name="padding" min="1" max="10" onChange={e => setThumbTablePadding(parseFloat(e.target.value))} defaultValue={1} />
                            </div>
                            <div className={"select-none w-4 rounded-md m-1 pr-2 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle border-2 text-gray-600 bg-gray-50 border-gray-50"}>
                                {thumbTablePadding}
                            </div>
                        </div>
                    </div>
                    
                </div>
                </>
                }

            </div>
        </div>
    );
}

export default DataSourceTool;