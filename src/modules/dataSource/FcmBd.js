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
                type: getType(url)
            }

            switch (source.type) {
                case dataSourceType.GOOGLESHEET:
                    let id = url.substring(url.indexOf("/d/") + 3, url.lastIndexOf("/"));
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

                            let dataSet = { ref: sheetTitle, id: sheetId, dataStoreRef: dataStoreRef, columns: {} };

                            source.dataSets.refs.push(sheetTitle);

                            dataStores[dataStoreRef] = [];

                            if (sheetData.values.length > 0) {
                                dataSet.columns = sheetData.values[0].map((column, colIdx) => {
                                    return { id: colIdx + 1, name: column, title: column, index: colIdx };
                                });
                            }
    
                            sheetData.values.splice(0, 1);
    
                            sheetData.values.forEach((row, rowIdx) => {
                                let rowData = {};
                                dataSet.columns.forEach((column, colIdx) => {
                                    rowData[column.name] = row[colIdx] ? row[colIdx] : ''
                                });
    
                                dataStores[dataStoreRef].push(rowData);
                            });
    
                            dataSet.dataLoaded = true;
    
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
     * Retourne les information d'une source de données
     * 
     * @param  {string} name    - Nom unique de la source de données.
     * 
     * @return {object} - Un objet contenant les informations de base de la source de données.
     */
    _DataSources.find = function(name) {
        return dataSources[name];
    }

    _DataSources.query = async function(name, query = {}) {

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

            if (dataSet.dataLoaded) {
                data = dataStores[dataSet.dataStoreRef];
                queryResult.datasetNbRows = data.length;

                if (query.where) {
                    data = filter(data, query.where);
                }

                queryResult.nbRows = data.length;

                if (query.select && queryResult.nbRows > 0) {
                    data = select(data, query.select);
                }

                if (query.orderBy && queryResult.nbRows > 0) {
                    data = sort(data, query.orderBy);
                }

                queryResult.data = data;

                queryResult.duration = (new Date().getTime() - startTime) / 1000;

                if (queryResult.duration === 0) {
                    queryResult.duration = 0.0001
                }

                return queryResult;

            } else {
                // TODO: Load dataSet data to store (need a function for that) then rerun query() with same param.
                return await fetchQuery(dataSources[name].baseUrl + dataSourceTypeDefaultParams[dataSources[name].type]);
            }
        }
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

    const getType = (url) => {
        let type;
        if (url.indexOf("https://docs.google.com/spreadsheets/") > -1) {
            type = dataSourceType.GOOGLESHEET;
        } else {
            type = dataSourceType.API;
        }

        return type;
    }

    const addIndexes = (data = [], keys = []) => {

    }
    
    const searchOne = (data = [], filters = [{key: '', values: []}]) => {
    
    }
    
    const format = (value, dataType, format) => {
    
    }
    
    const match = (objectTocheck, valuesToMatch = []) => {
        let isMacthing = false;
    
        for (let i = 0; i < valuesToMatch.length; i++) {
            switch (valuesToMatch[i].operator) {
                case "=":
                    isMacthing = objectTocheck[valuesToMatch[i].key] === valuesToMatch[i].value;
                break;
                case ">=":
                    isMacthing = objectTocheck[valuesToMatch[i].key] >= valuesToMatch[i].value;
                break;
                case "<=":
                    isMacthing = objectTocheck[valuesToMatch[i].key] <= valuesToMatch[i].value;
                break;
                case "in":
                    isMacthing = valuesToMatch[i].value.includes(objectTocheck[valuesToMatch[i].key]);
                break;
                default:
                    isMacthing = false;
            }
    
            if (!isMacthing) {
                break;
            }
        }
        
        return isMacthing;
    }
    
    const filter = (data = [], filters = []) => {

        //{key: '', operator: '', value: ''}
    
        /* for (let i = 0; i < filters.length; i++) {
            filteredData = filteredData.filter(item => {
                return match(item, filters[i]);
            });
        } */

        let filteredData = data.filter(item => {
            return match(item, filters);
        });
        
        return filteredData;
    }
    
    const sort = (data = [], keys = []) => {
        let sortedData = data.sort((itemA, itemB) => {
            let sorted = 0;

            for (let key of keys) {

                if (!isNaN(parseFloat(itemA[key]))) {
                    let valueA = parseFloat(itemA[key]);
                    let valueB = parseFloat(itemB[key]);

                    if (valueA < valueB) {
                        sorted = -1;
                    }

                    if (valueA > valueB) {
                        sorted = 1;
                    }

                } else {
                    sorted = itemA[key].localeCompare(itemA[key]);
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