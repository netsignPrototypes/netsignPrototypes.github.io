import React, { Fragment, useState, useRef, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon, TableIcon, DatabaseIcon } from '@heroicons/react/outline'
import FcmBd from './FcmBd';


import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'

const LoadingSpinner = ({ className }) => {
    return (
      <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
}

const ListeDeroulante = ({ list, onChange }) => {
    const [selected, setSelected] = useState('');

    const handleChange = (value) => {        
        onChange(value);
        setSelected(value);
    };

    return (
        <div className="w-72">
        <Listbox value={selected} onChange={handleChange}>
            <div className="relative">
            <Listbox.Button className="relative border border-gray-200 w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                <span className="block truncate">{selected || 'Choisir'}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                />
                </span>
            </Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 sm:text-sm">
                {list.map((item, itemIdx) => (
                    <Listbox.Option
                    key={itemIdx}
                    className={({ active }) =>
                        `${active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'}
                            cursor-default select-none relative py-2 pl-10 pr-4`
                    }
                    value={item}
                    >
                    {({ selected, active }) => (
                        <>
                        <span
                            className={`${
                            selected ? 'font-medium' : 'font-normal'
                            } block truncate`}
                        >
                            {item}
                        </span>
                        {selected ? (
                            <span
                            className={`${
                                active ? 'text-blue-600' : 'text-blue-600'
                            }
                                    absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                            </span>
                        ) : null}
                        </>
                    )}
                    </Listbox.Option>
                ))}
                </Listbox.Options>
            </Transition>
            </div>
        </Listbox>
        </div>
    )
}

const VisualQueryBuilderTool = ({ isHidden }) => {

    const [dataSource, setDataSource] = useState();
    const [dataSet, setDataSet] = useState();

    const [columns, setColumns] = useState();
    const [where, setWhere] = useState();
    const [orderBy, setOrderBy] = useState();
    const [limit, setLimit] = useState();
    const [skip, setSkip] = useState();

    const [query, setQuery] = useState();
    const [queryResult, setQueryResult] = useState();

    const [isLoading, setIsLoading] = useState(false);

    const handleChangeColumns = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();
        setColumns(value);    
    };

    const handleChangeWhere = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();
        setWhere(value);    
    };

    const handleChangeOrderBy = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();
        setOrderBy(value);    
    };

    const handleChangeLimit = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();
        setLimit(value);    
    };

    const handleChangeSkip = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();
        setSkip(value);    
    };

    /* const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            let newQuery = buildQuery(dataSet, columns, where, orderBy, limit, skip);
            setQuery(newQuery);
            FcmBd.DataSources.query(dataSource, false, newQuery).then(result => setQueryResult(result));
        }
      } */

    const handleExecuteQuery = (e) => {
        let newQuery = buildQuery(dataSet, columns, where, orderBy, limit, skip);
        setQuery(newQuery);
        FcmBd.DataSources.query(dataSource, false, newQuery).then(result => setQueryResult(result));
    }

    useEffect(() => {
        if (dataSet) {
            let select = {};
            
            FcmBd.DataSources.list(dataSource, dataSet).forEach(column => {
                select[column] = 1;
            })

            let newColums = JSON.stringify(select).replaceAll(",",", ").replaceAll(":",": ").replaceAll("{","{ ").replaceAll("}"," }");

            setColumns(newColums);

            let newQuery = buildQuery(dataSet, newColums);
            
            setQuery(newQuery);

            FcmBd.DataSources.query(dataSource, false, newQuery).then(result => setQueryResult(result));
        }
    }, [dataSource, dataSet]);

    const buildQuery = (from, select, filtre = undefined, ordre = undefined, limite = undefined, depart = undefined) => {
        let query = {};

        if (from) {
            query.from = from;
        }

        if (isJsonString(select)) {
            query.select = JSON.parse(select);
        }

        if (isJsonString(filtre)) {
            query.where = JSON.parse(filtre);
        }

        if (isJsonString(ordre)) {
            query.orderBy = JSON.parse(ordre);
        }

        if (limite !== "" && limite !== undefined) {
            query.limit = parseFloat(limite);
        }

        if (depart !== "" && depart !== undefined) {
            query.skip = parseFloat(depart);
        }

        return query;
    }

    const isJsonString = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    return (
        <div className={`min-h-screen flex-col lg:flex-row items-start justify-center bg-gray-100 py-20 lg:py-12 px-4 sm:px-6 lg:px-8 space-y-20 lg:space-y-0 lg:space-x-20 ${isHidden ? 'hidden' : 'flex'}`}>
            <div className="max-w-xl w-full space-y-7">
                <div className="flex flex-col items-start justify-start">
                    <h2 className="ml-2 text-left text-3xl font-extrabold text-gray-900 select-none">Concepteur de tableau</h2>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 w-full">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg w-full">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="select-none text-lg leading-6 font-medium text-gray-900">Nouveau tableau</h3>
                            <p className="select-none mt-1 max-w-2xl text-sm text-gray-500">Définissez les données à afficher.</p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Source</dt>
                                    <dd className="select-none mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <div className="flex flex-col space-y-1 w-full">
                                            <ListeDeroulante list={FcmBd.DataSources.list()} onChange={setDataSource} />
                                            {dataSource && <ListeDeroulante list={FcmBd.DataSources.list(dataSource)} onChange={setDataSet} />}
                                        </div>
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Colonnes</dt>
                                    <dd className="select-none mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2">{/* <pre>{columns && JSON.stringify(columns, null, 4)}</pre> */}
                                        <textarea
                                            id="columns"
                                            onChange={handleChangeColumns}
                                            value={columns}
                                            name="columns"
                                            type="textarea"
                                            required
                                            className="resize-none select-all appearance-none rounded-none relative block w-full h-16 max-h-16 px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-xs"
                                            placeholder="Colonnes à afficher"
                                        />
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Filtres</dt>
                                    <dd className="select-none mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <textarea
                                            id="where"
                                            onChange={handleChangeWhere}
                                            value={where}
                                            name="where"
                                            type="textarea"
                                            required
                                            className="resize-none select-all appearance-none rounded-none relative block w-full h-16 max-h-16 px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-xs"
                                            placeholder="Condition d'affichage"
                                        />
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Tri</dt>
                                    <dd className="select-none mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <textarea
                                            id="orderBy"
                                            onChange={handleChangeOrderBy}
                                            value={orderBy}
                                            name="orderBy"
                                            type="textarea"
                                            required
                                            className="resize-none select-all appearance-none rounded-none relative block w-full h-16 max-h-16 px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-xs"
                                            placeholder="Tri"
                                        />
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Limite</dt>
                                    <dd className="select-none mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <input
                                            id="limit"
                                            onChange={handleChangeLimit}
                                            value={limit}
                                            name="limit"
                                            type="number"
                                            required
                                            className="resize-none appearance-none rounded-none relative block h-9 w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                            placeholder="Nombre maximum de lignes retournées"
                                        />
                                    </dd>
                                </div>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Saut</dt>
                                    <dd className="select-none mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        <input
                                            id="skip"
                                            onChange={handleChangeSkip}
                                            value={skip}
                                            name="skip"
                                            type="number"
                                            required
                                            className="resize-none appearance-none rounded-none relative block h-9 w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                            placeholder="Ligne de départ"
                                        />
                                    </dd>
                                </div>
                                <div className="px-4 py-5 sm:px-6 justify-end flex border-t border-gray-200">
                                    <div onClick={handleExecuteQuery} className="w-1/5 rounded-md select-none font-medium py-1 px-2 text-center text-sm text-white shadow align-middle bg-blue-600 hover:bg-blue-500 cursor-pointer border-2 border-blue-600 hover:border-blue-500 flex items-center justify-center">
                                        {isLoading ? <LoadingSpinner className="h-5 w-5 text-white" /> : 'Exécuter'}
                                    </div>
                                </div>
                            </dl>
                        </div>
                    </div>              
                </div>
            </div>
            <div className="max-w-5xl overscroll-auto w-full space-y-3">

                {query && queryResult && <>

                <div className="">
                    <div className="flex flex-row items-start justify-start space-x-2">
                        <div className="px-5 py-2 bg-white shadow sm:rounded-lg">
                            <h3 className="select-none text-xs text-gray-500">Nb. rangées</h3>
                            <p className="select-none text-sm font-medium text-gray-900">{`${queryResult.returnedNbRows}/${queryResult.datasetNbRows}`}</p>
                        </div>
                        <div className="px-5 py-2 bg-white shadow sm:rounded-lg">
                            <h3 className="select-none text-xs text-gray-500">Durée</h3>
                            <p className="select-none text-sm font-medium text-gray-900">{`${queryResult.duration}s`}</p>
                        </div>
                    </div>
                </div>
                
                <div className="table rounded-lg overflow-hidden w-full shadow">
                    <div className="table-header-group bg-gray-900 bg-opacity-90">
                        <div className="table-row">
                            {Object.keys(query.select).map(column => {
                                return <div key={`${column}_header`} className="py-2 px-2 table-cell text-sm align-middle text-white font-medium select-none leading-none truncate">{column}</div>
                            })}
                        </div>
                    </div>
                    {queryResult && queryResult.data && queryResult.data.length > 0 && <div className="table-row-group bg-white bg-opacity-90">
                        {queryResult.data.map((row, rowIdx) => {
                            return <div key={`row_${rowIdx}`} className="table-row">
                                {Object.keys(query.select).map((cell, colIdx) => {
                                    return <div key={`${cell}_${colIdx + 1}`} className="py-1 px-2 table-cell text-xs align-middle select-none leading-none truncate border-t border-gray-300">{row[cell]}</div>
                                })}
                            </div>
                        })}
                    </div>}
                </div>
                
                </>}

            </div>
        </div>
    );
}

export default VisualQueryBuilderTool;