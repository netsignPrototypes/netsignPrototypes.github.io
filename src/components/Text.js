import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/outline';

const Text = props => {

    // UI LOGIC STATES
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [showColors, setShowColors] = useState(false);

    const { id } = props;

    const handleChangeText = (e) => {
        e.preventDefault();
        const { target } = e;
    };

    const handleChangeColor = (color) => {
        setShowColors(false);
        props.onChange("color", color);
    }

    return <div id={id} style={props.style} onMouseOver={() => setIsMouseOver(!props.disabled && true)} onMouseLeave={() => {setIsMouseOver(!props.disabled && false); setShowColors(false)}} className={`relative pointer-events-auto ${props.className ? props.className : ''}`}>
        {!props.disabled && (isMouseOver || props.editingInput) && <div className="pointer-events-none absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center rounded-sm ring-1 ring-blue-500 ring-offset-2"></div>}
        {props.children}
        {isMouseOver && !props.editingInput && <div className="bg-blue-500 pointer-events-none absolute -top-0.5 -right-0.5 flex flex-row items-center justify-center rounded-bl rounded-tr-sm">
            {showColors && props.colors.filter(color => color !== props.color).map((color, index) => <div key={`${id}_color_${index}`} className="pointer-events-auto p-1" onClick={() => handleChangeColor(color)}><div className="h-2 w-2 lg:h-4 lg:w-4 rounded-sm ring-1 ring-white cursor-pointer" style={{ backgroundColor: color }}></div></div>)}
            {props.colors && <div className="pointer-events-auto p-1" onClick={() => setShowColors(!showColors)}>
                <div className="h-2 w-2 lg:h-4 lg:w-4 rounded-sm ring-1 ring-white cursor-pointer" style={{ backgroundColor: props.color }}></div>
            </div>}
            <div className="pointer-events-none p-1  ">
                <PencilIcon /* onClick={event => handleChangeText(event)} */ className="pointer-events-none text-white hover:text-white cursor-pointer h-2 w-2 lg:h-4 lg:w-4" />
            </div>
        </div>}
        {/* {props.editingInput && <div className="bg-blue-500 pointer-events-auto absolute -top-0.5 -right-0.5 flex flex-row items-center justify-center rounded-bl rounded-tr-sm">
            {props.colors && props.colors.filter(color => color !== props.color).map((color, index) => <div key={`${id}_color_${index}`} className={`pointer-events-auto p-1 ${showColors ? '' : 'hidden'}`} onClick={() => handleChangeColor(color)}><div className="h-2 w-2 lg:h-4 lg:w-4 rounded-sm ring-1 ring-white cursor-pointer" style={{ backgroundColor: color }}></div></div>)}
            {props.colors && <div className="pointer-events-auto p-1" onClick={() => setShowColors(!showColors)}>
                <div className="h-2 w-2 lg:h-4 lg:w-4 rounded-sm ring-1 ring-white cursor-pointer" style={{ backgroundColor: props.color }}></div>
            </div>}
        </div>} */}
        {/* {props.editingInput && <div className="pointer-events-auto bg-gray-800 shadow-md pointer-events-none absolute -top-9 -left-0.5 flex flex-row items-center justify-center rounded">
            {showColors && props.colors.filter(color => color !== props.color).map((color, index) => <div key={`${id}_color_${index}`} className="pointer-events-auto p-1" onClick={() => handleChangeColor(color)}><div className="h-3 w-3 lg:h-4 lg:w-4 rounded-sm ring-1 ring-white cursor-pointer" style={{ backgroundColor: color }}></div></div>)}
            {props.colors && <div className="pointer-events-auto p-2" onClick={() => setShowColors(!showColors)}>
                <div className="h-3 w-3 lg:h-4 lg:w-4 rounded-sm ring-1 ring-white cursor-pointer" style={{ backgroundColor: props.color }}></div>
            </div>}
        </div>} */}
    </div>
}

export default Text;