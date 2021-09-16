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

    const handleChange = (e) => {
        const { target } = e;
        const { value } = target;
        e.persist();        
    };

    const handleExecuteQuery = (e) => {
        FcmBd.DataSources.query(dataSource, false, query).then(result => setQueryResult(result));
    }

    useEffect(() => {
        if (dataSet && columns) {
            setQuery(buildQuery(dataSet, columns, where, orderBy, limit, skip));
        }
    }, [dataSet, columns, where, orderBy, limit, skip]);

    useEffect(() => {
        if (dataSet) {
            let select = {};
            
            FcmBd.DataSources.list(dataSource, dataSet).forEach(column => {
                select[column] = 1;
            })

            setColumns(select);   
        }
    }, [dataSource, dataSet]);

    useEffect(() => {
        if (query && !queryResult) {
            FcmBd.DataSources.query(dataSource, false, query).then(result => setQueryResult(result));
        }
    }, [dataSource, query]);

    const buildQuery = (from, select, filtre, ordre, limite, depart) => {
        let query = {};

        if (from) {
            query.from = from;
        }

        if (select) {
            query.select = select;
        }

        if (filtre) {
            query.where = JSON.parse(filtre);
        }

        if (ordre) {
            query.orderBy = JSON.parse(ordre);
        }

        if (limite) {
            query.limit = limite;
        }

        if (depart) {
            query.skip = depart;
        }

        return query;
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
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Colonnes</dt>
                                    <dd className="select-none mt-1 text-xs text-gray-900 sm:mt-0 sm:col-span-2"><pre>{columns && JSON.stringify(columns, null, 4)}</pre></dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Filtres</dt>
                                    <dd className="select-none mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"></dd>
                                </div>
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="select-none text-sm font-medium text-gray-500">Ordre</dt>
                                    <dd className="select-none mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"></dd>
                                </div>
                                <div className="px-4 py-5 sm:px-6 justify-end">
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
                            {Object.keys(columns).map(column => {
                                return <div className="py-2 px-2 table-cell text-sm align-middle text-white font-medium select-none leading-none truncate">{column}</div>
                            })}
                        </div>
                    </div>
                    {queryResult && queryResult.data && queryResult.data.length > 0 && <div className="table-row-group bg-white bg-opacity-90">
                        {queryResult.data.map((row, rowIdx) => {
                            return <div key={`row_${rowIdx}`} className="table-row">
                                {Object.keys(columns).map((cell, colIdx) => {
                                    return <div key={`${cell}_${colIdx}`} className="py-1 px-2 table-cell text-xs align-middle select-none leading-none truncate border-t border-gray-300">{row[cell]}</div>
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