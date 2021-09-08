const FcmBd = (() => {

    const dataSourceType = {
        GOOGLESHEET: "GOOGLESHEET",
        API: "API"
    };

    let dataSources = {};

    const DataSources = function() {
        this.dataSources = {};
        this.dynamicFieldsToUpdate = [];
    }

    DataSources.add = function(name, url, type = undefined) {
        let source = {
            url: url,
            type: type || getType(url)
        }

        dataSources[name] = source;
    }

    DataSources.find = function(name) {
        return dataSources[name];
    }

    const getDataSources = () => {
        return DataSources;
    }

    /* const DataSource = function() {
        this.dataSources = {};
        this.dynamicFieldsToUpdate = [];
    }

    DataSource.add = function(name, url, type = undefined) {
        let source = {
            url: url,
            type: type || getType(url)
        }

        dataSources[name] = source;
    }

    DataSource.find = function(name) {
        return dataSources[name];
    }

    const getDataSources = () => {
        return DataSource;
    } */

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
    
    const filter = (data = [], filters = [{key: '', operator: '', value: ''}]) => {
        let filteredData = data;
    
        /* for (let i = 0; i < filters.length; i++) {
            filteredData = filteredData.filter(item => {
                return match(item, filters[i]);
            });
        } */
    
        filteredData = filteredData.filter(item => {
            return match(item, filters);
        });
        
        return filteredData;
    }
    
    const sort = (data = [], keys = []) => {
    
    }

    return {
        DataSources,
        getDataSources
    }
})();

export default FcmBd;