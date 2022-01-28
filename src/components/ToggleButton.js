import React, { useEffect, useState } from 'react';

const ToggleButton = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [label, setLabel] = useState(props.label || props.value);
    const [value, setValue] = useState(props.value || props.label);
  
    // UI LOGIC STATES
    const [isSelected, setIsSelected] = useState(props.selected ? true : false);

    useEffect(() => {
        setIsSelected(props.selected);
    }, [props.selected])

    const handleOnClick = (e) => {

        let newIsSelected = !isSelected;
        setIsSelected(newIsSelected);

        if (props.onClick) {
            props.onClick({ value: value, selected: newIsSelected });
        }
    }

    return <div onClick={handleOnClick} className={`rounded-full m-0.5 lg:m-1 py-0.5 px-2 text-center text-xs lg:text-xs flex items-center justify-center align-middle cursor-pointer border-1 lg:border-2 select-none ${isSelected ? "text-white bg-blue-600 hover:bg-blue-500 border-blue-600 hover:border-blue-500" : "text-gray-900 bg-gray-300 hover:bg-gray-200 border-gray-300 hover:border-gray-200"}`}>
        {label}
    </div>
}

export default ToggleButton;