
const dataSourceType = {
    GOOGLESHEET: "GOOGLESHEET",
    API: "API"
};

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const API_KEY_GOOGLE_SHEET = process.env.REACT_APP_GOOGLE_SHEET_API_KEY;

function DataSource() {
    // CONFIG
    this.id = 0;
    this.name = "";
    this.properties = {};
    this.fetchQuery = "";
    this.type = "";
    this.dataRefreshRate = 60000;

    // STATUS
    this.valid = false;
    this.dataLoaded = false;

    // MODEL
    this.fieldNames = [];
    this.idFieldName = "";
    this.ressources = [];
    this.dataSets = [];

    // CONTROLLER
    this.intervalPopulateDynamicFields = undefined;
    this.intervalUpdateData = undefined;

    // DATA STORING AND MANAGEMENT
    this.data = null;
    this.formatedData = null;
    this.dataRefIndex = {};
    this.dynamicFields = [];
}

DataSource.prototype.load = async function(url) {

    // https://docs.google.com/spreadsheets/d/1gwYEvp4q0Zp2-b1DJcO1k3NoBO-BS5pZa6FwmyiXH1w/edit?usp=sharing

    let promises = [];
    let promises2 = [];

    // Étape 1 : On détermine le type
    if (url.indexOf("https://docs.google.com/spreadsheets/") > -1) {
        this.type = dataSourceType.GOOGLESHEET;
    } else {
        this.type = dataSourceType.API;
    }

    // Étape 2 : On va chercher les informations qu'on peut selon le type
    switch (this.type) {
        case dataSourceType.GOOGLESHEET:
            let id = url.substring(url.indexOf("/d/") + 3, url.lastIndexOf("/"));

            this.properties.spreadsheetId = id;

            this.fetchQuery = `https://sheets.googleapis.com/v4/spreadsheets/${id}`;

            promises.push(fetch(this.fetchQuery + '?alt=json&key=' + API_KEY_GOOGLE_SHEET)
            .then(handleResponse)
            .then(data => {
                this.name = data.properties.title;
                data.sheets.forEach((sheet, index) => {
                    /* this.ressources.push({ name: sheet.properties.title, id: sheet.properties.sheetId, dataSets: []}); */

                    this.dataSets.push({ name: sheet.properties.title, id: sheet.properties.sheetId, data: [], columns: []});

                    promises2.push(fetch(this.fetchQuery + '/values/' + sheet.properties.title + '?alt=json&key=' + API_KEY_GOOGLE_SHEET)
                    .then(handleResponse)
                    .then(data => {

                        // On ajoute un dataSet
                        /* this.ressources[index].dataSets.push({ data: [], columns: [], headerRowNo: 1 }); */

                        if (data.values.length > 0) {
                            this.dataSets[index].columns = data.values[0].map((column, index) => {
                                return { id: index + 1, name: column, title: column, index: index };
                            });
                        }

                        data.values.splice(0, 1);

                        data.values.forEach((row, rowIdx) => {
                            
                            /* for (let i = 0; i < this.dataSets[index].columns.length; i++) {

                                if (!this.dataSets[index].data[rowIdx]) {
                                    this.dataSets[index].data.push([]);
                                }

                                this.dataSets[index].data[rowIdx].push((row[i] ? row[i] : ''));
                            } */
                            let rowData = {};
                            this.dataSets[index].columns.forEach((column, colIdx) => {
                                rowData[column.name] = row[colIdx] ? row[colIdx] : ''
                            });

                            this.dataSets[index].data.push(rowData);
                        });
                        

                        // On essaye de trouver les tableaux (range) disponnible dans la feuille
                        /* let dataSetIdx = 0;
                        let dataSetRowIdx = 0;
                        let dataSetCellIdx = 0;

                        let maxDataSetCellIdx = 0; */

                        /* data.values.forEach((row, rowIdx) => {

                            if (row.length > 0) {
                               this.ressources[index].dataSets[dataSetIdx].data.push([]);
                            } else if ((this.ressources[index].dataSets[dataSetIdx].dataRange) && this.ressources[index].dataSets[dataSetIdx].dataRange.length === 2) {
                                dataSetIdx += 1;
                                dataSetRowIdx = 0;
                                dataSetCellIdx = 0;

                                if (!this.ressources[index].dataSets[dataSetIdx]) {
                                    this.ressources[index].dataSets.push({ data: [], columns: [], headerRowNo: 1 });
                                }
                            } 
                            
                            row.forEach((cell, cellIdx) => {
                                if (cell !== '') {

                                    if (!this.ressources[index].dataSets[dataSetIdx].dataRange) {
                                        this.ressources[index].dataSets[dataSetIdx].dataRange = [`${alphabet[cellIdx]}${rowIdx + 1}`];
                                    }

                                    if (this.ressources[index].dataSets[dataSetIdx].dataRange.length === 1) {
                                        this.ressources[index].dataSets[dataSetIdx].columns.push({ name: cell });
                                    } else if (!this.ressources[index].dataSets[dataSetIdx].columns[dataSetCellIdx].exempleValue) {
                                        this.ressources[index].dataSets[dataSetIdx].columns[dataSetCellIdx].exempleValue = cell;
                                    }

                                    if (row.length === cellIdx + 1 && this.ressources[index].dataSets[dataSetIdx].dataRange.length === 1) {
                                        this.ressources[index].dataSets[dataSetIdx].dataRange.push(`${alphabet[cellIdx]}`);
                                    }

                                    this.ressources[index].dataSets[dataSetIdx].data[dataSetRowIdx].push(cell);
                                    dataSetCellIdx += 1;

                                    if (maxDataSetCellIdx < cellIdx) {
                                        maxDataSetCellIdx = cellIdx;
                                    }

                                } else if ((this.ressources[index].dataSets[dataSetIdx].dataRange) && this.ressources[index].dataSets[dataSetIdx].dataRange.length === 1) {
                                    this.ressources[index].dataSets[dataSetIdx].dataRange.push(`${alphabet[cellIdx]}`);
                                    
                                    dataSetIdx += 1;

                                    if (!this.ressources[index].dataSets[dataSetIdx]) {
                                        this.ressources[index].dataSets.push({ data: [], columns: [], headerRowNo: 1 });
                                    }
                                }
                            });
                            
                            if (row.length > 0) {
                               dataSetCellIdx = 0;
                               dataSetRowIdx += 1;
                            }
                            
                        }); */
        
                        return true;
                    })
                    .catch(error => {
                        return true;
                    }));

                });
                this.valid = true;

                return true;
            })
            .catch(error => {
                return false;
            }));

            break;
        case dataSourceType.API:
            this.fetchQuery = url;
            break;
        default:
            this.fetchQuery = url;
            break;
    }

    return await Promise.all(promises).then(initializations => {
        let valid = true;

        initializations.forEach(initialization => {
            if (!initialization) {
                valid = false;
            }
        })
        
        /* return valid; */

        return Promise.all(promises2).then(initializations => {
            let valid = true;
    
            initializations.forEach(initialization => {
                if (!initialization) {
                    valid = false;
                }
            })
    
            return valid;
        });
    });
}

DataSource.prototype.init = function(name, fetchQuery, type, dataRefreshRate) {
    this.name = name;
    this.fetchQuery = fetchQuery;
    this.type = type;
    this.dataRefreshRate = dataRefreshRate;

    this.loadData();
}

DataSource.prototype.getType = function() {
    if (this.url.indexOf("https://docs.google.com/spreadsheets/") > -1) {
        this.type = dataSourceType.GOOGLESHEET;
    } else {
        this.type = dataSourceType.API;
    }
}

DataSource.prototype.getFetchQuery = function() {
    switch (this.type) {
        case dataSourceType.GOOGLESHEET:
            let id = this.url.substring(this.url.indexOf("/d/") + 3, this.url.lastIndexOf("/"));
            this.fetchQuery = `https://spreadsheets.google.com/feeds/list/${id}/3/public/values?alt=json`;
            break;
        case dataSourceType.API:
            this.fetchQuery = this.url;
            break;
        default:
            this.fetchQuery = this.url;
            break;
    }
}

DataSource.prototype.setData = function(data) {
    this.dataLoaded = data ? true : false;

    switch (this.type) {
        case "GOOGLESHEET":
            this.data = data.values;
            break;
        default:
            this.data = data;
        break;
    }

    this.postProcessData();
}

DataSource.prototype.getData = function() {
    return this.data;
}

DataSource.prototype.getName = function() {
    return this.name;
}

DataSource.prototype.setId = function(id) {
    this.id = id;
}

DataSource.prototype.getId = function() {
    return this.id;
}

DataSource.prototype.asyncLoadData = async function() {
    const response = await fetch(this.fetchQuery);
    const data = handleResponse(await response).then(data => this.setData(data))
    .catch(error => {
        /* console.log(error); */
    });
}

DataSource.prototype.loadData = function() {
    fetch(this.fetchQuery)
    .then(handleResponse)
    .then(data => {
        this.setData(data);
        this.valid = true;
    })
    .catch(error => {
        console.log(error);
        let datasource = this
        setTimeout(function() { datasource.loadData(); }, 1000);
    });
}

function handleResponse(response) {
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
  
function handleJSONResponse(response) {
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

function handleTextResponse(response) {
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

DataSource.prototype.addDynamicField = function(column, id, elementId) {

    if (this.dynamicFields.findIndex(dynamicField => dynamicField.elementId === elementId) === -1) {
        this.dynamicFields.push({ column: column, id: id, elementId: elementId });   
    }
    
}

DataSource.prototype.postProcessData = function() {

    if (this.fieldNames.length === 0) {
        this.retreiveFieldNames(this.data[0]);
    }
    
    this.formatDataToModel(this.data, this.fieldNames);

    if (!this.intervalUpdateData) {
        let datasource = this
        this.intervalUpdateData = setInterval(function() { datasource.asyncLoadData(); }, this.dataRefreshRate);
    }
    
}

DataSource.prototype.retreiveFieldNames = function(object) {

    switch (this.type) {
        case "GOOGLESHEET":
            this.fieldNames = object;
            this.idFieldName = object[0];
            this.data = this.data.splice(1, this.data.length - 1);
            break;
        default:
            
        break;
    }
}


DataSource.prototype.formatDataToModel = function(data, model) {

    let formatedData = [];

    switch (this.type) {
        case "GOOGLESHEET":
            data.forEach((item, index) => {
                let formatedItem = {};

                model.forEach((field, index) => {
                    formatedItem[field] = item[index];
                });

                this.dataRefIndex[item[0]] = index;

                formatedData.push(formatedItem);
            });
            break;
        default:
            
        break;
    }

    this.formatedData = formatedData;
}

DataSource.prototype.getElementByProperty = function(element, property, value) {
    return this[element].find(result => result[property] === value);
}

DataSource.prototype.queryDataSet = function(dataSetId, query = []) {

    let dataSet = this.getElementByProperty('dataSets', 'id', dataSetId);

    if (query.length === 0) {
        query = dataSet.columns;
    }

    return this.queryObjectsArray(dataSet.data, query);

}

DataSource.prototype.queryObjectsArray = function(data, query) {

    /* query = [
        {
            name: 1,
            filters: {},
            format: '',
            textDescriptions: {}
        }
    ]; */

    let queryResult = [];

    let formatedQueryRow = [];
    let formatedQueryColumn = '';

    data.forEach(row => {

        formatedQueryRow = [];
        formatedQueryColumn = '';

        query.forEach(column => {

            formatedQueryColumn = row[column.name];

            formatedQueryRow.push(formatedQueryColumn);
        });

        queryResult.push(formatedQueryRow);

    });

    return queryResult;
}

export default DataSource;