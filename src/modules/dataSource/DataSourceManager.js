import DataSource from './DataSource';

function DataSourceManager() {
    this.dataSources = [];
    this.dynamicFieldsToUpdate = [];
}

DataSourceManager.prototype.init = function() {

}

DataSourceManager.prototype.find = function(id) {
    let myDataSource = null;

    for (var key in this.dataSources) {
        if (this.dataSources[key] && this.dataSources[key].getId() === id) {
            myDataSource = this.dataSources[key];
        }
    }
    return myDataSource;
}

DataSourceManager.prototype.getDataSources = function() {
    return this.dataSources;
}

DataSourceManager.prototype.add = function(dataSource) {

    dataSource.setId(this.dataSources.length + 1);

    this.dataSources.push(dataSource);
}

DataSourceManager.prototype.remove = function(id) {
    var dataSourceIndex = 0;
    for (var key in this.dataSources) {
        if (this.dataSources[key] && this.dataSources[key].getId() === id) {
            break;
        }
        dataSourceIndex = dataSourceIndex + 1;
    }

    if (dataSourceIndex > 0) {
        this.dataSources.splice(dataSourceIndex, 1);
    }
}

DataSourceManager.prototype.addDynamicFieldToUpdate = function(dynamicField) {
    this.dynamicFieldsToUpdate.push(dynamicField);
}

DataSourceManager.prototype.updateDynamicFields = function() {
    if (this.dynamicFieldsToUpdate.length > 0) {
		for (let i = 0; i > this.dynamicFieldsToUpdate.length; i++) {
			this.dynamicFieldsToUpdate[i].dataSource.populateDynamicField(this.dynamicFieldsToUpdate[i].column, this.dynamicFieldsToUpdate[i].id, this.dynamicFieldsToUpdate[i].elementId);
		}
	}
}

export default DataSourceManager;
