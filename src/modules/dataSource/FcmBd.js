/**
 * FcmBD - Fonctions communes pour la gestion des sources de données.
 * @namespace FcmBd
 */
const FcmBd = (() => {

    /* ===================
     CONSTANT DECLARATION
    =================== */

    const _DataSources = {};
    const dataSources = { refs: [] };
    const dataStores = {};

    const API_KEY_GOOGLE_SHEET = process.env.REACT_APP_GOOGLE_SHEET_API_KEY;

    const dataSourceType = {
        GOOGLESHEET: "GOOGLESHEET",
        API: "API"
    };

    const dataSourceTypeDefaultParams = {
        GOOGLESHEET: '?alt=json&key=' + API_KEY_GOOGLE_SHEET,
        API: '',
    };

    const defaultDataSourceModel = {
        id: 0,
        ref: '',
        type: '',
        name: '',
        title: '',
        baseUrl: '',
        properties: {},
        dataSets: {
            refs: [],
        }
    }

    const defaultDataSetModel = {
        id: 0,
        ref: '',
        type: '',
        name: '',
        title: '',
        baseUrl: '',
        dataLoaded: true,
        storeRefreshRate: 3600000,
        dataStoreRef: '',
        columns: {
            refs: [],
        },
    }

    const defaultColumnModel = {
        id: 0,
        ref: '',
        dataType: '',
        name: '',
        title: '',
        index: 0,
    }

    /* ====================
     DATASOURCES FUNCTIONS
    ==================== */

    _DataSources.add = (dataSourceName, dataSourceModel = {}) => {

        try {
            const dataSource = dataSources[dataSourceName];

            if (!dataSource) {
                dataSourceModel = {...JSON.parse(JSON.stringify(defaultDataSourceModel)), ...dataSourceModel};
                addItemAndRef(dataSources, dataSources.refs, dataSourceName, dataSourceModel);
            } else {
                // TODO: Si une dataSource avec le même nom existe déjà.
                throw new Error(`Une source de données nommée '${dataSourceName}' existe déjà.`);
            }
        } catch (err) {
            console.error('FcmBd.DataSources.add() : ' + err.message);
        }
        
    }

    _DataSources.addDataSet = (dataSourceName, dataSetName, dataSetModel = {}) => {

        try {

            validateRequest(dataSourceName);

            const dataSource = dataSources[dataSourceName];

            const dataSets = dataSource.dataSets;

            if (!dataSets[dataSetName]) {
                dataSetModel = {...JSON.parse(JSON.stringify(defaultDataSetModel)), ...dataSetModel};
                addItemAndRef(dataSets, dataSets.refs, dataSetName, dataSetModel);

                if (!dataStores[dataSetModel.dataStoreRef]) {
                    dataStores[dataSetModel.dataStoreRef] = [];
                } else {
                    // TODO: Si un dataStore avec le même nom existe déjà.
                    throw new Error(`Un stockage de données nommé '${dataSetModel.dataStoreRef}' existe déjà.`);
                }
                
            } else {
                // TODO: Si un dataSet avec le même nom existe déjà.
                throw new Error(`Un ensemble de données nommé '${dataSetName}' existe déjà dans '${dataSourceName}'.`);
            }

        } catch (err) {
            console.error('FcmBd.DataSources.addDataSet() : ' + err.message);
        }
    }

    _DataSources.addDataSetColumn = (dataSourceName, dataSetName, columnName, columnModel = {}) => {

        try {

            validateRequest(dataSourceName, dataSetName);

            const dataSource = dataSources[dataSourceName];

            const dataSet = dataSource.dataSets[dataSetName];

            const columns = dataSet.columns;

            if (!columns[columnName]) {
                columnModel = {...JSON.parse(JSON.stringify(defaultColumnModel)), ...columnModel}
                addItemAndRef(columns, columns.refs, columnName, columnModel);
            } else {
                // TODO: Si une colonne avec le même nom existe déjà.
                throw new Error(`Une colonne nommée '${columnName}' existe déjà dans '${dataSetName}'.`);
            }

        } catch (err) {
            console.error('FcmBd.DataSources.addDataSetColumn() : ' + err.message);
        }
    }

    _DataSources.remove = (dataSourceName) => {
        try {
            validateRequest(dataSourceName);

            removeItemAndRef(dataSources, dataSources.refs, dataSourceName);

        } catch (err) {
            console.error('FcmBd.DataSources.remove() : ' + err.message);
        }
    }

    _DataSources.removeDataSet = (dataSourceName, dataSetName) => {

        try {
            validateRequest(dataSourceName, dataSetName);

            const dataSource = dataSources[dataSourceName];

            const dataSet = dataSource.dataSets[dataSetName];

            delete dataStores[dataSet.dataStoreRef];

            removeItemAndRef(dataSource.dataSets, dataSource.dataSets.refs, dataSetName);

        } catch (err) {
            console.error('FcmBd.DataSources.removeDataSet() : ' + err.message);
        }
    }

    _DataSources.removeDataSetColumn = (dataSourceName, dataSetName, columnName) => {

        try {
            validateRequest(dataSourceName, dataSetName, columnName);

            const dataSource = dataSources[dataSourceName];

            const dataSet = dataSource.dataSets[dataSetName];

            removeItemAndRef(dataSet.columns, dataSet.columns.refs, columnName);

        } catch (err) {
            console.error('FcmBd.DataSources.removeDataSetColumn() : ' + err.message);
        }
    }

    /**
     * Ajouter une source de données
     * 
     * @param  {string}     dataSourceName    - Nom unique de la source de données.
     * @param  {string}     url     - L'url pour accéder à la source de données.
     * @param  {string}     [type]  - Type de source de données.
     */
    _DataSources.create = async function(dataSourceName, url, callback) {

        try {

            if (dataSources[dataSourceName]) {
                throw new Error(`Une source de données nommée '${dataSourceName}' existe déjà.`);
            }

            let dataSourceModel = {
                id: dataSources.refs.length + 1,
                type: getDataSourceType(url),
                name: dataSourceName,
            }

            _DataSources.add(dataSourceName, dataSourceModel);

            let source = dataSources[dataSourceName];

            switch (source.type) {
                case dataSourceType.GOOGLESHEET:
                    let id = url.substring(url.indexOf("/d/") + 3, url.lastIndexOf("/"));
                    source.properties.spreadsheetId = id;
                    source.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${id}`;

                    const spreadsheet = await fetchQuery(source.baseUrl + dataSourceTypeDefaultParams[source.type]);

                    source.title = spreadsheet.properties.title;

                    let dataSets = [];

                    for (const sheet of spreadsheet.sheets) {
                        dataSets.push(fetchQuery(source.baseUrl + '/values/' + sheet.properties.title + dataSourceTypeDefaultParams[source.type]).then(sheetData => {
                            let sheetId = sheet.properties.sheetId;
                            let dataStoreRef = `${dataSourceName}_${sheetId}`;
                            let dataSetName = sheet.properties.title;

                            let dataSetModel = { 
                                id: sheetId,
                                type: 'JSON',
                                name: dataSetName,
                                title: dataSetName,
                                baseUrl: '/values/' + dataSetName,
                                dataStoreRef: dataStoreRef
                            };

                            _DataSources.addDataSet(dataSourceName, dataSetName, dataSetModel);
                            
                            let dataSet = source.dataSets[dataSetName];

                            if (sheetData.values.length > 0) {
                                sheetData.values[0].forEach((columnName, colIdx) => {

                                    let columnModel = { 
                                        id: colIdx + 1,
                                        dataType: getDataType(sheetData.values[1][colIdx]),
                                        name: columnName,
                                        title: columnName,
                                        index: colIdx
                                    };

                                    _DataSources.addDataSetColumn(dataSourceName, dataSetName, columnName, columnModel);
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
        } catch (err) {
            console.error('FcmBd.DataSources.create() : ' + err.message);
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

    _DataSources.list = function(dataSourceName = undefined, dataSetName = undefined) {
        let list;

        if (!dataSourceName) {
            list = dataSources.refs;
        } else if (dataSourceName && !dataSetName) {
            list = dataSources[dataSourceName].dataSets.refs;
        } else if (dataSourceName && dataSetName) {
            list = dataSources[dataSourceName].dataSets[dataSetName].columns.refs;
        }

        return  list;
    }

    _DataSources.query = async function(dataSourceName, liveData = false, query = {}) {

        try {
            validateRequest(dataSourceName, query.from);

            const startTime = new Date().getTime();

            let queryResult = {
                datasetNbRows: 0,
                returnedNbRows: 0,
                duration: 0,
                data: []
            };

            let data = [];

            let dataSource = dataSources[dataSourceName];

            if (dataSource) {

                let dataSet = dataSource.dataSets[query.from];

                if (dataSet.dataLoaded && !liveData) {
                    data = dataStores[dataSet.dataStoreRef];
                    queryResult.datasetNbRows = data.length;

                    if (query.where) {
                        data = filter(data, query.where, dataSet.columns);
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
                        data = orderBy(data, query.orderBy, dataSet.columns);
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

                    return await _DataSources.updateStore(dataSource.name, dataSet.name).then(() => _DataSources.query(dataSourceName, false, query));
                }
            }
        } catch (err) {
            console.error('FcmBd.DataSources.query() : ' + err.message);
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

    /* ==============================
     QUERY & DATA FETCHING FUNCTIONS
    ============================== */

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

    /* ====================================
     VALIDATION & ERROR HANDLING FUNCTIONS
    ==================================== */

    const validateRequest = (dataSourceName, dataSetName = null, columnName = null) => {

        const dataSource = dataSources[dataSourceName];

        if (!dataSource) {
            throw new Error(`La source de données '${dataSourceName}' n'existe pas.`);
        } else if (dataSetName && !dataSource.dataSets[dataSetName]) {
            throw new Error(`L'ensemble de données '${dataSetName}' n'existe pas dans '${dataSourceName}'.`);
        } else if (columnName && !dataSource.dataSets[dataSetName].columns[columnName]) {
            throw new Error(`La colonne '${columnName}' n'existe pas dans '${dataSetName}'.`);
        }
    }

    /* ==============
     UTILS FUNCTIONS
    ============== */

    const addItemAndRef = (object, refArr, ref, item) => {
        item.ref = ref;
        object[ref] = item;
        refArr.push(ref);
    }

    const removeItemAndRef = (object, refArr, ref) => {
        delete object[ref];
        const index = refArr.indexOf(ref);
        if (index > -1) {
            refArr.splice(index, 1);
        }
    }

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
        let type = 'string';
        
        if (value === '') {
            type = 'string';
        } else if (value === 'true' || value === 'false') {
            type = 'boolean';
        } else if (Date.parse(value) && (value.includes('-') || value.includes(':'))) {
            type = 'date';
        } else if (!isNaN(parseFloat(value))) {
            type = 'number';
        }

        return type;
    }

    const readFilter = (objectTocheck, filters, dataSetColumns, operator = '', keyToCheck = undefined, isMacthing = true) => {

        let filterArr;

        if (filters !== null && typeof filters == "object") {

            if (Array.isArray(filters)) {
                for (let filter of filters) {
                    isMacthing = readFilter(objectTocheck, filter, dataSetColumns, operator, keyToCheck, isMacthing);

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
                            isMacthing = readFilter(objectTocheck, filters, dataSetColumns, operator, keyToCheck, isMacthing);
                        } else {
                            operator = key;
                            isMacthing = compare(convertToDataType(objectTocheck[keyToCheck], dataSetColumns[keyToCheck].dataType), convertToDataType(value, dataSetColumns[keyToCheck].dataType), operator);
                        }
                        
                    } else if (value !== null && typeof value == "object") {
                        operator = '';
                        filters = value;
                        keyToCheck = key;
                        isMacthing = readFilter(objectTocheck, filters, dataSetColumns, operator, keyToCheck, isMacthing);
                    } else {
                        if (!keyToCheck) {
                            keyToCheck = key;
                        };

                        isMacthing = compare(convertToDataType(objectTocheck[keyToCheck], dataSetColumns[keyToCheck].dataType), convertToDataType(value, dataSetColumns[keyToCheck].dataType), operator);

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

    /* const resolveExpression = () => {

    }

    const compute = () => {

    } */

    const compare = (valueToCheck, valueToMatch, operator = "") => {
        let isMacthing = false;
    
        switch (operator) {
            case "$gt":
                isMacthing = valueToCheck > valueToMatch;
            break;
            case "$lt":
                isMacthing = valueToCheck < valueToMatch;
            break;
            case "$gte":
                isMacthing = valueToCheck >= valueToMatch;
            break;
            case "$lte":
                isMacthing = valueToCheck <= valueToMatch;
            break;
            case "$ne":
                isMacthing = valueToCheck !== valueToMatch;
            break;
            case "$in":
                isMacthing = valueToMatch.includes(valueToCheck);
            break;
            case "$sameMonthAndDay":
                isMacthing = (valueToCheck.getUTCMonth() + 1 === valueToMatch.getUTCMonth() + 1) && (valueToCheck.getUTCDate() === valueToMatch.getUTCDate());
            break;
            default:
                isMacthing = valueToCheck === valueToMatch;
        }
        
        return isMacthing;
    }

    const convertToDataType = (valueToConvert, dataType) => {

        let convertedValue;

        switch (dataType) {
            case "string":
                convertedValue = String(valueToConvert);
            break;
            case "number":
                convertedValue = Number(valueToConvert);
            break;
            case "boolean":
                convertedValue = Boolean(valueToConvert);
            break;
            case "date":
                let newDate = new Date(valueToConvert);

                convertedValue = newDate;

                /* convertedValue = newDate.getTime(); */
            break;
            default:
                
        }

        return convertedValue;
    }
    
    const filter = (data = [], filters = {}, dataSetColumns = {}) => {

        let filteredData = data.filter(item => {
            return readFilter(item, filters, dataSetColumns);
        });
        
        return filteredData;
    }
    
    const orderBy = (data = [], keys = [], dataSetColumns = {}) => {

        let columns = keys.map(key => {
            return Object.entries(key)[0];
        });

        let sortedData = data.sort((itemA, itemB) => {
            let sorted = 0;

            for (let [key, direction] of columns) {
                let valueA = direction ? itemA[key] : itemB[key];
                let valueB = direction ? itemB[key] : itemA[key];

                if (dataSetColumns[key].dataType === "number" || dataSetColumns[key].dataType === "date") {
                    valueA = convertToDataType(valueA, dataSetColumns[key].dataType);
                    valueB = convertToDataType(valueB, dataSetColumns[key].dataType);

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