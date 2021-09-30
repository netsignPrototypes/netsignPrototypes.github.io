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
    const queries = { refs: [] };
    const tableModels = { refs: [] };

    const config = {
        GOOGLESHEET_API_KEY: '',
        DATASOURCE_CONFIG_FETCH_URL: '',
        DATASOURCE_CONFIG_REFRESH_RATE: 3600000,
        DATASOURCE_CONFIG_INTERVAL: undefined,
    };

    const dataSourceType = {
        GOOGLESHEET: "GOOGLESHEET",
        API: "API"
    };

    const dataSourceTypeDefaultParams = {
        GOOGLESHEET: '',
        API: '',
    };

    const defaultDataSourceModel = {
        id: 0,
        ref: '',
        type: '',
        name: '',
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
        baseUrl: '',
        dataLoaded: false,
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
        index: 0,
    }

    /* =========
     FCMBD INIT
    ========= */

    const init = async (configModifier) => {

        Object.assign(config, {...configModifier});

        if (configModifier.GOOGLESHEET_API_KEY) {
           dataSourceTypeDefaultParams.GOOGLESHEET = '?alt=json&key=' + config.GOOGLESHEET_API_KEY;
        }

        if (configModifier.DATASOURCE_CONFIG_FETCH_URL) {

            await _DataSources.init(config.DATASOURCE_CONFIG_FETCH_URL);

            /* config.DATASOURCE_CONFIG_INTERVAL = setInterval(function() { _DataSources.init(config.DATASOURCE_CONFIG_FETCH_URL); }, config.DATASOURCE_CONFIG_REFRESH_RATE < 360000 ? 360000 : config.DATASOURCE_CONFIG_REFRESH_RATE); */         
        }

        return true;
        
    }

    /* ===============
     DATASOURCES INIT
    =============== */

    _DataSources.init = async (url) => {
        return await fetchQuery(url).then(data => {
            let initData = deepParse(data);

            if (initData) {
                if (initData.dataSources) {
                    initData.dataSources.forEach(source => {
                        _DataSources.createFromJson(source);
                    });
                }

                if (initData.queries) {
                    initData.queries.forEach(query => {
                        addItemAndRef(queries, queries.refs, query.ref, query);
                    });
                }

                if (initData.tableModels) {
                    initData.tableModels.forEach(tableModel => {
                        addItemAndRef(tableModels, tableModels.refs, tableModel.ref, tableModel);
                    });
                }
            }
        });
    }

    /* ====================
     DATASOURCES FUNCTIONS
    ==================== */

    _DataSources.add = (dataSourceRef, dataSourceModel = {}) => {

        try {
            const dataSource = dataSources[dataSourceRef];

            if (!dataSource) {
                dataSourceModel = {...JSON.parse(JSON.stringify(defaultDataSourceModel)), ...dataSourceModel};
                addItemAndRef(dataSources, dataSources.refs, dataSourceRef, dataSourceModel);
            } else {
                // TODO: Si une dataSource avec le même nom existe déjà.
                throw new Error(`Une source de données nommée '${dataSourceRef}' existe déjà.`);
            }
        } catch (err) {
            console.error('FcmBd.DataSources.add() : ' + err.message);
        }
        
    }

    _DataSources.addDataSet = (dataSourceRef, dataSetRef, dataSetModel = {}) => {

        try {

            validateRequest(dataSourceRef);

            const dataSource = dataSources[dataSourceRef];

            const dataSets = dataSource.dataSets;

            if (!dataSets[dataSetRef]) {
                dataSetModel = {...JSON.parse(JSON.stringify(defaultDataSetModel)), ...dataSetModel};
                addItemAndRef(dataSets, dataSets.refs, dataSetRef, dataSetModel);

                if (!dataStores[dataSetModel.dataStoreRef]) {
                    dataStores[dataSetModel.dataStoreRef] = [];
                } else {
                    // TODO: Si un dataStore avec le même nom existe déjà.
                    throw new Error(`Un stockage de données nommé '${dataSetModel.dataStoreRef}' existe déjà.`);
                }

                setUpdateStoreInterval(dataSourceRef, dataSetRef);
                
            } else {
                // TODO: Si un dataSet avec le même nom existe déjà.
                throw new Error(`Un ensemble de données nommé '${dataSetRef}' existe déjà dans '${dataSourceRef}'.`);
            }

        } catch (err) {
            console.error('FcmBd.DataSources.addDataSet() : ' + err.message);
        }
    }

    _DataSources.addDataSetColumn = (dataSourceRef, dataSetRef, columnRef, columnModel = {}) => {

        try {

            validateRequest(dataSourceRef, dataSetRef);

            const dataSource = dataSources[dataSourceRef];

            const dataSet = dataSource.dataSets[dataSetRef];

            const columns = dataSet.columns;

            if (!columns[columnRef]) {
                columnModel = {...JSON.parse(JSON.stringify(defaultColumnModel)), ...columnModel}
                addItemAndRef(columns, columns.refs, columnRef, columnModel);
            } else {
                // TODO: Si une colonne avec le même nom existe déjà.
                throw new Error(`Une colonne nommée '${columnRef}' existe déjà dans '${dataSetRef}'.`);
            }

        } catch (err) {
            console.error('FcmBd.DataSources.addDataSetColumn() : ' + err.message);
        }
    }

    _DataSources.remove = (dataSourceRef) => {
        try {
            validateRequest(dataSourceRef);

            removeItemAndRef(dataSources, dataSources.refs, dataSourceRef);

        } catch (err) {
            console.error('FcmBd.DataSources.remove() : ' + err.message);
        }
    }

    _DataSources.removeDataSet = (dataSourceRef, dataSetRef) => {

        try {
            validateRequest(dataSourceRef, dataSetRef);

            const dataSource = dataSources[dataSourceRef];

            const dataSet = dataSource.dataSets[dataSetRef];

            clearUpdateStoreInterval(dataSourceRef, dataSetRef);

            delete dataStores[dataSet.dataStoreRef];

            removeItemAndRef(dataSource.dataSets, dataSource.dataSets.refs, dataSetRef);

        } catch (err) {
            console.error('FcmBd.DataSources.removeDataSet() : ' + err.message);
        }
    }

    _DataSources.removeDataSetColumn = (dataSourceRef, dataSetRef, columnRef) => {

        try {
            validateRequest(dataSourceRef, dataSetRef, columnRef);

            const dataSource = dataSources[dataSourceRef];

            const dataSet = dataSource.dataSets[dataSetRef];

            removeItemAndRef(dataSet.columns, dataSet.columns.refs, columnRef);

        } catch (err) {
            console.error('FcmBd.DataSources.removeDataSetColumn() : ' + err.message);
        }
    }

    /**
     * Ajouter une source de données
     * 
     * @param  {string}     dataSourceRef    - Nom unique de la source de données.
     * @param  {string}     url     - L'url pour accéder à la source de données.
     * @param  {string}     [type]  - Type de source de données.
     */
    _DataSources.create = async (dataSourceRef, url, callback) => {

        try {

            if (dataSources[dataSourceRef]) {
                throw new Error(`Une source de données nommée '${dataSourceRef}' existe déjà.`);
            }

            let dataSourceModel = {
                id: dataSources.refs.length + 1,
                type: getDataSourceType(url),
                ref: dataSourceRef,
            }

            _DataSources.add(dataSourceRef, dataSourceModel);

            let source = dataSources[dataSourceRef];

            switch (source.type) {
                case dataSourceType.GOOGLESHEET:
                    let id = url.substring(url.indexOf("/d/") + 3, url.lastIndexOf("/"));
                    source.properties.spreadsheetId = id;
                    source.baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${id}`;

                    const spreadsheet = await fetchQuery(source.baseUrl + dataSourceTypeDefaultParams[source.type]);

                    source.name = spreadsheet.properties.title;

                    let dataSets = [];

                    for (const sheet of spreadsheet.sheets) {
                        dataSets.push(fetchQuery(source.baseUrl + '/values/' + sheet.properties.title + dataSourceTypeDefaultParams[source.type]).then(sheetData => {
                            let sheetId = sheet.properties.sheetId;
                            let dataStoreRef = `${dataSourceRef}_${sheetId}`;
                            let dataSetRef = sheet.properties.title;

                            let dataSetModel = { 
                                id: sheetId,
                                type: 'JSON',
                                name: dataSetRef,
                                baseUrl: '/values/' + dataSetRef,
                                dataStoreRef: dataStoreRef
                            };

                            _DataSources.addDataSet(dataSourceRef, dataSetRef, dataSetModel);
                            
                            let dataSet = source.dataSets[dataSetRef];

                            if (sheetData.values.length > 0) {
                                sheetData.values[0].forEach((columnRef, colIdx) => {

                                    let columnModel = { 
                                        id: colIdx + 1,
                                        ref: columnRef,
                                        dataType: getDataType(sheetData.values[1][colIdx]),
                                        name: columnRef,
                                        index: colIdx
                                    };

                                    _DataSources.addDataSetColumn(dataSourceRef, dataSetRef, columnRef, columnModel);
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

            /* dataSources[dataSourceRef] = source;
            dataSources.refs.push(dataSourceRef); */

            return callback(null, dataSources[dataSourceRef]);
        } catch (err) {
            console.error('FcmBd.DataSources.create() : ' + err.message);
        }
    }

    _DataSources.createFromJson = (dataSourceModel) => {
        let dataSets = dataSourceModel.dataSets;

        delete dataSourceModel.dataSets;

        let dataSource = dataSourceModel;

        let dataSourceRef = dataSource.ref

        _DataSources.add(dataSourceRef, dataSource);

        dataSets.refs.forEach(dataSetRef => {
            let columns = dataSets[dataSetRef].columns;

            delete dataSets[dataSetRef].columns

            _DataSources.addDataSet(dataSourceRef, dataSetRef, dataSets[dataSetRef]);

            columns.refs.forEach(columnRef => {    
                _DataSources.addDataSetColumn(dataSourceRef, dataSetRef, columnRef, columns[columnRef]);
            });
        });
    }

    /**
     * Retourne les informations d'une source de données
     * 
     * @param  {string} name    - Nom unique de la source de données.
     * 
     * @return {object} - Un objet contenant les informations de base de la source de données.
     */
    _DataSources.find = (name) => {
        return dataSources[name];
    }

    _DataSources.list = (dataSourceRef = undefined, dataSetRef = undefined) => {
        let list;

        if (!dataSourceRef) {
            list = dataSources.refs;
        } else if (dataSourceRef && !dataSetRef) {
            list = dataSources[dataSourceRef].dataSets.refs;
        } else if (dataSourceRef && dataSetRef) {
            list = dataSources[dataSourceRef].dataSets[dataSetRef].columns.refs;
        }

        return  list;
    }

    _DataSources.executeStoredQuery = async (queryRef, queryModifier = undefined) => {

        try {
            let query = queries[queryRef];

            if (query) {
                if (queryModifier) {
                    query = {...query, ...queryModifier};
                }

                return _DataSources.query(query.dataSourceRef, query.liveData, query);
            } else {
                throw new Error(`La requête '${queryRef}' n'existe pas.`);
            }
        } catch (err) {
            console.error('FcmBd.DataSources.executeStoredQuery() : ' + err.message);
        }
        
    }

    _DataSources.getStoredQueryTableModel = (queryRef) => {
        try {
            const query = queries[queryRef];
            if (query) {
                if (query.tableModel) {
                    const tableModel = tableModels[query.tableModel];
        
                    if (tableModel) {
                        return tableModel;
                    } else {
                        throw new Error(`Le modèle de tableau '${query.tableModel}' n'existe pas.`);
                    }
                } else {
                    throw new Error(`Aucun modèle de tableau n'existe pour la requête '${queryRef}'.`);
                }
            } else {
                throw new Error(`La requête '${queryRef}' n'existe pas.`);
            }
        } catch (err) {
            console.error('FcmBd.DataSources.executeStoredQuery() : ' + err.message);
        }
    }

    _DataSources.query = async (dataSourceRef, liveData = false, query = {}) => {

        try {
            validateRequest(dataSourceRef, query.from);

            const startTime = getNowTimeStamp();

            let queryResult = {
                datasetNbRows: 0,
                returnedNbRows: 0,
                duration: 0,
                data: []
            };

            let data = [];

            const dataSource = dataSources[dataSourceRef];

            if (dataSource) {

                const dataSet = dataSource.dataSets[query.from];

                if (dataSet.dataLoaded && !liveData) {
                    data = dataStores[dataSet.dataStoreRef];
                    queryResult.datasetNbRows = data.length;

                    if (query.where) {
                        data = where(data, query.where, dataSet.columns);
                    }

                    if (query.select && data.length > 0) {
                        data = select(data, query.select);
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

                    if (query.tableModel) {
                        let tableModel = tableModels[query.tableModel];

                        if (tableModel) {
                            queryResult.tableModel = tableModel;
                        }
                    }

                    queryResult.returnedNbRows = data.length;
                    queryResult.data = data;

                    queryResult.duration = (getNowTimeStamp() - startTime) / 1000;

                    if (queryResult.duration === 0) {
                        queryResult.duration = 0.0001
                    }

                    return queryResult;

                } else {
                    // TODO: Load dataSet data to store (need a function for that) then rerun query() with same param.
                    dataSet.dataLoaded = false;

                    return await updateStore(dataSource.ref, dataSet.ref).then(() => _DataSources.query(dataSourceRef, false, query));
                }
            }
        } catch (err) {
            console.error('FcmBd.DataSources.query() : ' + err.message);
        }

    }

    _DataSources.checkStoredQueryResultUpdated = (queryRef, lastUpdateTime) => {
        try {
            const query = queries[queryRef];
            if (query) {

                const dataSource = dataSources[query.dataSourceRef];
                const dataSet = dataSource.dataSets[query.from];
        
                return dataSet.lastUpdateTime > lastUpdateTime;

            } else {
                throw new Error(`La requête '${queryRef}' n'existe pas.`);
            }
        } catch (err) {
            console.error('FcmBd.DataSources.executeStoredQuery() : ' + err.message);
        }
    }

    /* ==============================
     DATA STORE MANAGEMENT FUNCTIONS
    ============================== */

    const updateStore = async (dataSourceRef, dataSetRef) => {

        const dataSource = dataSources[dataSourceRef];
        const dataSet = dataSource.dataSets[dataSetRef];

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
                    switch (dataSet.type) {
                        case "CSV":
                            updatedData = [];

                            data.forEach((row, rowIdx) => {
                                let rowData = {};
                                dataSet.columns.refs.forEach((column, colIdx) => {
                                    rowData[column] = row[colIdx] ? row[colIdx] : ''
                                });
        
                                updatedData.push(rowData);
                            });

                        break;
                        default:
                            updatedData = data;
                    }
                break;
            }

            if (updatedData) {

                if (dataStores[dataSet.dataStoreRef] && JSON.stringify(dataStores[dataSet.dataStoreRef]) !== JSON.stringify(updatedData)) {
                    dataStores[dataSet.dataStoreRef] = updatedData;
                    dataSet.lastUpdateTime = getNowTimeStamp();
                }
                
                dataSet.dataLoaded = true;

            }
        });
    }

    const setUpdateStoreInterval = (dataSourceRef, dataSetRef) => {

        const dataSource = dataSources[dataSourceRef];
        const dataSet = dataSource.dataSets[dataSetRef];

        if (!dataSet.updateStoreInterval && dataSet.storeRefreshRate) {
            dataSet.updateStoreInterval = setInterval(function() { updateStore(dataSourceRef, dataSetRef); }, dataSet.storeRefreshRate < 1000 ? 1000 : dataSet.storeRefreshRate);
        }
    }

    const clearUpdateStoreInterval = (dataSourceRef, dataSetRef) => {
        
        const dataSource = dataSources[dataSourceRef];
        const dataSet = dataSource.dataSets[dataSetRef];

        if (dataSet.updateStoreInterval) {
            clearInterval(dataSet.updateStoreInterval);

            dataSet.updateStoreInterval = undefined;
        }
    }

    /* const resetNbUseSinceStoreUpdate = (dataSourceRef, dataSetRef) => {
        
        let dataSource = dataSources[dataSourceRef];
        let dataSet = dataSource.dataSets[dataSetRef];

        dataSet.nbUseSinceStoreUpdate = 0;
    }

    const incrementNbUseSinceStoreUpdate = (dataSourceRef, dataSetRef) => {
        
        let dataSource = dataSources[dataSourceRef];
        let dataSet = dataSource.dataSets[dataSetRef];

        if (!dataSet.nbUseSinceStoreUpdate && dataSet.nbUseSinceStoreUpdate !== 0) {
            dataSet.nbUseSinceStoreUpdate = 1;
        } else {
            dataSet.nbUseSinceStoreUpdate += 1;
        }
    } */

    /* ======================
     DATA FETCHING FUNCTIONS
    ====================== */

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
        } else if (contentType.includes('text/csv')) {
            return handleCSVResponse(response)
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

    const handleCSVResponse = (response) => {
        return response.text()
          .then(text => {
            if (response.ok) {
              return parseCSV(text)
            } else {
              return Promise.reject({
                status: response.status,
                statusText: response.statusText,
                err: text
              })
            }
          })
    }

    /* ==============
     QUERY FUNCTIONS
    ============== */

    const filter = (objectTocheck, filters, dataSetColumns, operator = '', keyToCheck = undefined, isMacthing = true) => {

        let filterArr;

        if (filters !== null && typeof filters == "object") {

            if (Array.isArray(filters)) {
                for (let filter of filters) {
                    isMacthing = filter(objectTocheck, filter, dataSetColumns, operator, keyToCheck, isMacthing);

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
                            isMacthing = filter(objectTocheck, filters, dataSetColumns, operator, keyToCheck, isMacthing);
                        } else {
                            operator = key;
                            isMacthing = compare(convertToDataType(objectTocheck[keyToCheck], dataSetColumns[keyToCheck].dataType), convertToDataType(value, dataSetColumns[keyToCheck].dataType), operator);
                        }
                        
                    } else if (value !== null && typeof value == "object") {
                        operator = '';
                        filters = value;
                        keyToCheck = key;
                        isMacthing = filter(objectTocheck, filters, dataSetColumns, operator, keyToCheck, isMacthing);
                    } else {
                        if (!keyToCheck || operator === '') {
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

    const expression = (expr, object) => {

        let result;

        if (expr !== null && typeof expr == "object") {
            if (Array.isArray(expr)) {
                result = [];

                expr.forEach((computation, index) => {
                    result.push(expression(computation, object));
                });

            } else {
                for (let [key, value] of Object.entries(expr)) {
                    if (key.includes('$')) {
                        if (["$first", "$last"].includes(key)) {
                            result = aggregate(expr, object);
                        } else {
                            result = compute(expression(value, object), key);
                        }
                    }
                }
            }
        } else {
            if (typeof expr == "string" && expr.startsWith('$')) {
                result = object[expr.substring(1)];

                if (result === undefined) {
                    result = expr;
                }
            } else {
                result = expr;
            }
        }

        return result;
    }

    const aggregate = (expr, array) => {
        let aggrationResult;

        for (let [operator, value] of Object.entries(expr)) {
            switch (operator) {
                case "$first":
                    aggrationResult = expression(value, array[0]);
                break;
                case "$last":
                    aggrationResult = expression(value, array[array.length - 1]);
                break;
                default:
                    aggrationResult = expression(expr, array);
            }
        }
        
        return aggrationResult;
    }

   /*  if (expr !== null && typeof expr == "object") {
        if (Array.isArray(expr)) {
        } else {

        }
    } else {

    } */

    const compute = (value, operator = "") => {

        let computedValue;

        switch (operator) {
            case "$concat":
                computedValue = "";

                value.forEach(string => {
                    computedValue += string;
                })
            break;
            case "$lower":
                if (typeof value == "string") {
                    computedValue = value.toLowerCase();
                } else {
                    computedValue = value;
                }
            break;
            case "$upper":
                if (typeof value == "string") {
                    computedValue = value.toUpperCase();
                } else {
                    computedValue = value;
                }
            break;
            case "$substr":
                if (typeof value[0] == "string") {
                    computedValue = value[0].substring(value[1], value[2]);
                } else {
                    computedValue = value;
                }
            break;
            default:
                computedValue = value;
        }
        
        return computedValue;
    }

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
    
    const where = (data = [], filters = {}, dataSetColumns = {}) => {

        let filteredData = data.filter(item => {
            return filter(item, filters, dataSetColumns);
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

    const select = (data = [], select = {}) => {

        let selects = Object.entries(select);

        let selectedData = data.map(item => {
            let dataRow = {};

            for (let [key, value] of selects) {
                if (value !== null && typeof value == "object") {
                    dataRow[key] = expression(value, item);
                } else {
                    dataRow[key] = item[key];
                }
            }

            return dataRow;
        })

        return selectedData;
    }

    /* ====================================
     VALIDATION & ERROR HANDLING FUNCTIONS
    ==================================== */

    const validateRequest = (dataSourceRef, dataSetRef = null, columnRef = null) => {

        const dataSource = dataSources[dataSourceRef];

        if (!dataSource) {
            throw new Error(`La source de données '${dataSourceRef}' n'existe pas.`);
        } else if (dataSetRef && !dataSource.dataSets[dataSetRef]) {
            throw new Error(`L'ensemble de données '${dataSetRef}' n'existe pas dans '${dataSourceRef}'.`);
        } else if (columnRef && !dataSource.dataSets[dataSetRef].columns[columnRef]) {
            throw new Error(`La colonne '${columnRef}' n'existe pas dans '${dataSetRef}'.`);
        }
    }

    /* ==============
     UTILS FUNCTIONS
    ============== */

    const getNowTimeStamp = () => {
        let nowTimeStamp = new Date();
        return nowTimeStamp.getTime();
    }

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

    const deepCopy = (inObject) => {
        let outObject, value, key;

        if (typeof inObject !== "object" || inObject == null) {
            return inObject;
        }

        outObject = Array.isArray(inObject) ? [] : {};

        for (key in inObject) {
            value = inObject[key];

            outObject[key] = deepCopy(value);
        }

        return outObject;
    }

    const deepParse = (stringToParse) => {
        let outObject;

        if (typeof stringToParse == "string" && isValidJSON(stringToParse)) {
            outObject = JSON.parse(stringToParse);

            if (outObject !== null && typeof outObject == "object") {
               if (Array.isArray(outObject)) {
                    outObject.forEach((item, index) => {
                        outObject[index] = deepParse(item);
                    });
                } else {
                    for (let [key, value] of Object.entries(outObject)) {
                        outObject[key] = deepParse(value);
                    }
                } 
            }
        } else {
            outObject = stringToParse;
        }

        return outObject;
    }

    const isValidJSON = str => {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Parse takes a string of CSV data and converts it to a 2 dimensional array
     *
     * options
     * - typed - infer types [false]
     *
     * @static
     * @param {string} csv the CSV string to parse
     * @param {Object} [options] an object containing the options
     * @param {Function} [reviver] a custom function to modify the values
     * @returns {Array} a 2 dimensional array of `[entries][values]`
     */
     const parseCSV = (csv, options, reviver = v => v) => {
        const ctx = Object.create(null);
        ctx.options = options || {};
        ctx.reviver = reviver;
        ctx.value = '';
        ctx.entry = [];
        ctx.output = [];
        ctx.col = 1;
        ctx.row = 1;
    
        const lexer = /"|,|\r\n|\n|\r|[^",\r\n]+/y;
        const isNewline = /^(\r\n|\n|\r)$/;
    
        let matches = [];
        let match = '';
        let state = 0;
    
        while ((matches = lexer.exec(csv)) !== null) {
            match = matches[0];
        
            switch (state) {
                case 0: // start of entry
                switch (true) {
                    case match === '"':
                    state = 3;
                    break;
                    case match === ',':
                    state = 0;
                    valueEnd(ctx);
                    break;
                    case isNewline.test(match):
                    state = 0;
                    valueEnd(ctx);
                    entryEnd(ctx);
                    break;
                    default:
                    ctx.value += match;
                    state = 2;
                    break;
                }
                break;
                case 2: // un-delimited input
                switch (true) {
                    case match === ',':
                    state = 0;
                    valueEnd(ctx);
                    break;
                    case isNewline.test(match):
                    state = 0;
                    valueEnd(ctx);
                    entryEnd(ctx);
                    break;
                    default:
                    state = 4;
                    throw Error(`CSVError: Illegal state [row:${ctx.row}, col:${ctx.col}]`);
                }
                break;
                case 3: // delimited input
                switch (true) {
                    case match === '"':
                    state = 4;
                    break;
                    default:
                    state = 3;
                    ctx.value += match;
                    break;
                }
                break;
                case 4: // escaped or closing delimiter
                switch (true) {
                    case match === '"':
                    state = 3;
                    ctx.value += match;
                    break;
                    case match === ',':
                    state = 0;
                    valueEnd(ctx);
                    break;
                    case isNewline.test(match):
                    state = 0;
                    valueEnd(ctx);
                    entryEnd(ctx);
                    break;
                    default:
                    throw Error(`CSVError: Illegal state [row:${ctx.row}, col:${ctx.col}]`);
                }
                break;
                default:
                    throw Error(`CSVError: Illegal state [row:${ctx.row}, col:${ctx.col}]`);
            }
        }
    
        // flush the last value
        if (ctx.entry.length !== 0) {
            valueEnd(ctx);
            entryEnd(ctx);
        }
    
        return ctx.output;
    }

    const valueEnd = (ctx) => {
        const value = ctx.options.typed ? inferType(ctx.value) : ctx.value;
        ctx.entry.push(ctx.reviver(value, ctx.row, ctx.col));
        ctx.value = '';
        ctx.col++;
    }
    
    const entryEnd = (ctx) => {
        ctx.output.push(ctx.entry);
        ctx.entry = [];
        ctx.row++;
        ctx.col = 1;
    }

    const inferType = (value) => {
        const isNumber = /.\./;
    
        switch (true) {
        case value === 'true':
        case value === 'false':
            return value === 'true';
        case isNumber.test(value):
            return parseFloat(value);
        case isFinite(value):
            return parseInt(value);
        default:
            return value;
        }
    }

    return {
        DataSources: _DataSources,
        init: init,
        expression: expression,
    }
})();

export default FcmBd;