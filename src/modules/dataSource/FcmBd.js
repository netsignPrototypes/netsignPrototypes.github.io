/**
 * FcmBD - Fonctions communes pour la gestion des sources de données.
 * @namespace FcmBd
 */
const FcmBd = (() => {

    const API_KEY_GOOGLE_SHEET = process.env.REACT_APP_GOOGLE_SHEET_API_KEY;

    const dataSourceType = {
        GOOGLESHEET: "GOOGLESHEET",
        API: "API"
    };

    const dataSourceTypeDefaultParams = {
        GOOGLESHEET: '?alt=json&key=' + API_KEY_GOOGLE_SHEET,
        API: '',
    };

    // =========================================================
    // DATASOURCES OBJECT AND FUNCTIONS
    // =========================================================

    const _DataSources = {};

    const dataSources = {
        refs: []
    };

    const dataStores = {};

    /**
     * Ajouter une source de données
     * 
     * @param  {string}     dataSourceName    - Nom unique de la source de données.
     * @param  {string}     url     - L'url pour accéder à la source de données.
     * @param  {string}     [type]  - Type de source de données.
     */
    _DataSources.add = async function(dataSourceName, url, callback) {

        try {

            let source = {
                properties: {},
                type: getDataSourceType(url)
            }

            switch (source.type) {
                case dataSourceType.GOOGLESHEET:
                    let id = url.substring(url.indexOf("/d/") + 3, url.lastIndexOf("/"));
                    source.name = dataSourceName;
                    source.properties.spreadsheetId = id;
                    source.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${id}`;

                    const spreadsheet = await fetchQuery(source.baseUrl + dataSourceTypeDefaultParams[source.type]);

                    source.properties.title = spreadsheet.properties.title;
                    source.dataSets = {
                        refs: []
                    };

                    let dataSets = [];

                    for (const sheet of spreadsheet.sheets) {
                        dataSets.push(fetchQuery(source.baseUrl + '/values/' + sheet.properties.title + dataSourceTypeDefaultParams[source.type]).then(sheetData => {
                            let sheetId = sheet.properties.sheetId;
                            let dataStoreRef = `${dataSourceName}_${sheetId}`;
                            let sheetTitle = sheet.properties.title;

                            let dataSet = { name: sheetTitle, ref: sheetTitle, baseUrl: '/values/' + sheet.properties.title, id: sheetId, dataStoreRef: dataStoreRef, columns: { refs: [] } };

                            source.dataSets.refs.push(sheetTitle);

                            dataStores[dataStoreRef] = [];

                            if (sheetData.values.length > 0) {
                                sheetData.values[0].forEach((column, colIdx) => {
                                    dataSet.columns.refs.push(column);

                                    dataSet.columns[column] = { id: colIdx + 1, name: column, title: column, index: colIdx };
                                });
                            }
    
                            sheetData.values.splice(0, 1);
    
                            sheetData.values.forEach((row, rowIdx) => {
                                let rowData = {};
                                dataSet.columns.refs.forEach((column, colIdx) => {
                                    rowData[column] = row[colIdx] ? row[colIdx] : ''
                                });
    
                                dataStores[dataStoreRef].push(rowData);
                            });
    
                            dataSet.dataLoaded = true;
                            dataSet.storeRefreshRate = 30000;

                            /* dataSet.intervalUpdateStore = setInterval(function() { _DataSources.updateStore(source.name, dataSet.name); }, dataSet.storeRefreshRate); */
    
                            source.dataSets[sheetTitle] = dataSet;
                        }));
                    };

                    await Promise.all(dataSets);

                    break;
                case dataSourceType.API:
                    source.baseUrl = url;

                    break;
                default:
                    source.baseUrl = url;

                    break;
            }

            dataSources[dataSourceName] = source;
            dataSources.refs.push(dataSourceName);

            return callback(null, dataSources[dataSourceName]);
        } catch (e) {
            return false;
        }
    }

    /**
     * Retourne les informations d'une source de données
     * 
     * @param  {string} name    - Nom unique de la source de données.
     * 
     * @return {object} - Un objet contenant les informations de base de la source de données.
     */
    _DataSources.find = function(name) {
        return dataSources[name];
    }

    _DataSources.query = async function(name, liveData = false, query = {}) {

        const startTime = new Date().getTime();

        let queryResult = {
            datasetNbRows: 0,
            returnedNbRows: 0,
            duration: 0,
            data: []
        };

        let data = [];

        let dataSource = dataSources[name];

        if (dataSource) {

            let dataSet = dataSource.dataSets[query.from];

            if (dataSet.dataLoaded && !liveData) {
                data = dataStores[dataSet.dataStoreRef];
                queryResult.datasetNbRows = data.length;

                if (query.where) {
                    data = filter(data, query.where);
                }

                if (query.select && data.length > 0) {

                    let dataSetColumns = [];

                    let included = Object.values(query.select);

                    let removing = included.includes(0);
                    let adding = included.includes(1);
                    
                    dataSet.columns.refs.forEach(column => {

                        if (removing && adding) {
                            if (query.select[column] === 1 && query.select[column] === undefined) {
                                dataSetColumns.push(column);
                            }
                        } else if (adding) {
                            if (query.select[column]) {
                                dataSetColumns.push(column);
                            }
                        } else if (removing) {
                            if (query.select[column] !== 0 || query.select[column] === undefined) {
                                dataSetColumns.push(column);
                            }
                        }
                        
                        
                    });

                    data = select(data, dataSetColumns);
                }

                if (query.orderBy && data.length > 0) {
                    data = sort(data, query.orderBy);
                }

                if (query.skip && query.limit) {
                    data = data.slice(query.skip, query.skip + query.limit);
                } else if (query.limit) {
                    data = data.slice(0, query.limit);
                } else if (query.skip) {
                    data = data.slice(query.skip);
                }

                queryResult.returnedNbRows = data.length;
                queryResult.data = data;

                queryResult.duration = (new Date().getTime() - startTime) / 1000;

                if (queryResult.duration === 0) {
                    queryResult.duration = 0.0001
                }

                return queryResult;

            } else {
                // TODO: Load dataSet data to store (need a function for that) then rerun query() with same param.
                dataSet.dataLoaded = false;

                return await _DataSources.updateStore(dataSource.name, dataSet.name).then(() => _DataSources.query(name, false, query));
            }
        }
    }

    _DataSources.updateStore = async (dataSourceName, dataSetName) => {

        let dataSource = dataSources[dataSourceName];
        let dataSet = dataSource.dataSets[dataSetName];

        console.log('updateStore', dataSourceName, dataSetName);

        return await fetchQuery(dataSource.baseUrl + dataSet.baseUrl + dataSourceTypeDefaultParams[dataSource.type]).then(data => {
            let updatedData = undefined;

            switch (dataSource.type) {
                case "GOOGLESHEET":

                    updatedData = [];

                    data.values.splice(0, 1);
    
                    data.values.forEach((row, rowIdx) => {
                        let rowData = {};
                        dataSet.columns.refs.forEach((column, colIdx) => {
                            rowData[column] = row[colIdx] ? row[colIdx] : ''
                        });

                        updatedData.push(rowData);
                    });
                    break;
                default:
                    updatedData = data;
                break;
            }

            if (updatedData) {
                dataStores[dataSet.dataStoreRef] = updatedData;
                dataSet.dataLoaded = true;
            }
        });
    }

    // =========================================================
    // QUERY & DATA FETCHING FUNCTIONS
    // =========================================================

    const fetchQuery = async (url) => {
        try {
            const response = await fetch(url);
            const result = await handleResponse(response);

            return result;
        } catch (err) {

        }
    }

    const handleResponse = (response) => {
        let contentType = response.headers.get('content-type')
        if (contentType.includes('application/json')) {
          return handleJSONResponse(response)
        } else if (contentType.includes('text/html')) {
          return handleTextResponse(response)
        } else {
          // Other response types as necessary. I haven't found a need for them yet though.
          throw new Error(`Sorry, content-type ${contentType} not supported`)
        }
    }
      
    const handleJSONResponse = (response) => {
        return response.json()
          .then(json => {
            if (response.ok) {
              return json
            } else {
              return Promise.reject(Object.assign({}, json, {
                status: response.status,
                statusText: response.statusText
              }))
            }
          })
    }
    
    const handleTextResponse = (response) => {
        return response.text()
          .then(text => {
            if (response.ok) {
              return text
            } else {
              return Promise.reject({
                status: response.status,
                statusText: response.statusText,
                err: text
              })
            }
          })
    }

    // =========================================================
    // UTILS FUNCTIONS
    // =========================================================

    const getDataSourceType = (url) => {
        let type;
        if (url.indexOf("https://docs.google.com/spreadsheets/") > -1) {
            type = dataSourceType.GOOGLESHEET;
        } else {
            type = dataSourceType.API;
        }

        return type;
    }

    const getDataType = (value) => {
        let type;
        
        if (value === '') {
            type = 'string';
        } else if (value === 'true' || value === 'false') {
            type = 'boolean';
        } 

        return type;
    }

    const addIndexes = (data = [], keys = []) => {

    }
    
    const searchOne = (data = [], filters = [{key: '', values: []}]) => {
    
    }
    
    const format = (value, dataType, format) => {
    
    }

    const readFilter = (objectTocheck, filters, operator = '', keyToCheck = undefined, isMacthing = true) => {

        let filterArr;

        if (filters !== null && typeof filters == "object") {

            if (Array.isArray(filters)) {
                for (let filter of filters) {
                    isMacthing = readFilter(objectTocheck, filter, keyToCheck, isMacthing);

                    if (operator === '$and' && !isMacthing) {
                        break;
                    } else if (operator === '$or' && isMacthing) {
                        break;
                    }
                }
            } else {
                filterArr = Object.entries(filters);

                for (let [key, value] of filterArr) {

                    if (key.includes('$')) {
                        
                        if (value !== null && typeof value == "object") {
                            operator = key;
                            filters = value;
                            isMacthing = readFilter(objectTocheck, filters, keyToCheck, isMacthing);
                        } else {
                            operator = key;
                            isMacthing = compare(objectTocheck[keyToCheck], value, operator);
                        }
                        
                    } else if (value !== null && typeof value == "object") {
                        operator = '';
                        filters = value;
                        keyToCheck = key;
                        isMacthing = readFilter(objectTocheck, filters, keyToCheck, isMacthing);
                    } else {
                        if (!keyToCheck) {
                            keyToCheck = key;
                        };

                        isMacthing = compare(objectTocheck[keyToCheck], value, operator);

                        operator = '';
                    }

                    if (!isMacthing) {
                        break;
                    }
                }
            }

        }

        return isMacthing;

    }

    const compare = (valueToCheck, valueToMatch, operator = "") => {
        let isMacthing = false;
    
        switch (operator) {
            case "$gt":
                isMacthing = Number(valueToCheck) > valueToMatch;
            break;
            case "$lt":
                isMacthing = Number(valueToCheck) < valueToMatch;
            break;
            case "$gte":
                isMacthing = Number(valueToCheck) >= valueToMatch;
            break;
            case "$lte":
                isMacthing = Number(valueToCheck) <= valueToMatch;
            break;
            case "$in":
                isMacthing = valueToMatch.includes(valueToCheck);
            break;
            default:
                isMacthing = valueToCheck == valueToMatch;
        }
        
        return isMacthing;
    }
    
    const filter = (data = [], filters = {}) => {

        let filteredData = data.filter(item => {
            return readFilter(item, filters);
        });
        
        return filteredData;
    }
    
    const sort = (data = [], keys = []) => {

        let columns = keys.map(key => {
            return Object.entries(key)[0];
        });

        let sortedData = data.sort((itemA, itemB) => {
            let sorted = 0;

            for (let [key, direction] of columns) {
                let valueA = direction ? itemA[key] : itemB[key];
                let valueB = direction ? itemB[key] : itemA[key];

                if (!isNaN(parseFloat(valueA)) && !isNaN(parseFloat(valueB))) {
                    valueA = parseFloat(valueA);
                    valueB = parseFloat(valueB);

                    if (valueA < valueB) {
                        sorted = -1;
                    }

                    if (valueA > valueB) {
                        sorted = 1;
                    }

                } else {
                    sorted = valueA.localeCompare(valueB) * direction;
                }

                if (sorted !== 0) {
                    break;
                }
            }

            return sorted;

        });

        return sortedData;
    }

    const select = (data = [], keys = []) => {

        let selectedData = data.map(item => {
            let dataRow = {};
            
            keys.forEach(key => {
                dataRow[key] = item[key];
            });

            return dataRow;
        })

        return selectedData;
    }

    return {
        DataSources: _DataSources
    }
})();

export default FcmBd;