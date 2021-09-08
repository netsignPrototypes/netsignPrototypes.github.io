const addIndexes = (data = [], fields = []) => {

}

const searchOne = (data = [], filters = [{field: '', values: []}]) => {

}

const format = (value, dataType, format) => {

}

const match = (valueTocheck, operator, valueToMatch) => {
    let isMacthing = false;

    switch (operator) {
        case "=":
            isMacthing = valueTocheck === valueToMatch;
        break;
        case ">=":
            isMacthing = valueTocheck >= valueToMatch;
        break;
        case "<=":
            isMacthing = valueTocheck <= valueToMatch;
        break;
        case "in":
            isMacthing = valueToMatch.includes(valueTocheck);
        break;
        default:
            isMacthing = false;
    }

    return isMacthing;
}

const filter = (data = [], filters = [{field: '', operator: '', value: ''}]) => {
    let filteredData = [];

    filteredData = data.filter(item => {
        return match(item, filters);
    });

    return filteredData;
}

const order = (data = [], fields = []) => {

}

export {
    addIndexes,
    searchOne,
    format,
    filter,
    order
};