import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { PlusIcon, MinusIcon } from '@heroicons/react/outline'
import ToggleButton from './ToggleButton';

const TagSearchBar = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [tags, setTags] = useState(props.tags);
    const [selectedTags, setSelectedTags] = useState(props.selectedTags ? props.selectedTags : []);
  
    useEffect(() => {
        setTags(props.tags);
    }, [props.tags])

    useEffect(() => {
        setSelectedTags(props.selectedTags);
    }, [props.selectedTags])

    // UI LOGIC STATES
    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });
    const [showAll, setShowAll] = useState(false);


    const handleOnClickTag = ({ value, selected }) => {
        let newSelectedTags = [...selectedTags];

        if (selected) {
            newSelectedTags.push(value);
        } else {
            let index = newSelectedTags.indexOf(value);

            if (index > -1) {
                newSelectedTags.splice(index, 1);
            }
        }

        setSelectedTags(newSelectedTags);

        props.onChange(newSelectedTags);
    }

    return <div className={`flex flex-col flex-wrap items-start justify-start align-middle py-1 rounded-md w-full ${props.className ? props.className : ""}`}>
        <div className="flex flex-row flex-wrap items-center justify-start align-middle">
            {(isMobile || true) && (showAll ? <MinusIcon onClick={() => setShowAll(false)} className="m-0.5 text-gray-700 hover:text-gray-600 cursor-pointer h-5 w-5 lg:h-6 lg:w-6" /> : <PlusIcon onClick={() => setShowAll(true)} className="m-0.5 text-gray-700 hover:text-gray-600 cursor-pointer h-5 w-5 lg:h-6 lg:w-6" /> )}
            {((isMobile || true) && !showAll) ? 
            selectedTags.map((tag, index) => {
                return <ToggleButton key={`selected-${tag}`} label={tag} value={tag} selected={true} />
            })
            :
            tags.map((tag, index) => {
                return <ToggleButton key={`${tag}`} label={tag} value={tag} selected={selectedTags.includes(tag)} onClick={handleOnClickTag} />
            })}
        </div>
    </div>
}

export default TagSearchBar;