
const dataSourceType = {
    GOOGLESHEET: "GOOGLESHEET",
    API: "API"
};

const API_KEY_GOOGLE_SHEET = process.env.REACT_APP_GOOGLE_SHEET_API_KEY;

function DataSource() {
    // CONFIG
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

    let promises = [];

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
                data.sheets.forEach(sheet => {
                    this.ressources.push(sheet.properties.title);
                });
                this.valid = true;

                return true
            })
            .catch(error => {
                return false
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

        return valid;
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

    if (this.dynamicFields.findIndex(dynamicField => dynamicField.elementId == elementId) == -1) {
        this.dynamicFields.push({ column: column, id: id, elementId: elementId });   
    }
    
}

DataSource.prototype.postProcessData = function() {

    if (this.fieldNames.length == 0) {
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

export default DataSource;