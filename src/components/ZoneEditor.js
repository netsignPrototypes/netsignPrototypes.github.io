import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { MenuAlt2Icon, PhotographIcon, FilmIcon, DocumentIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmLeftIcon, ArrowSmRightIcon, TrashIcon } from '@heroicons/react/outline'

import { useOnClickOutside, useWindowSize } from '../hooks';

import useMouse from '@react-hook/mouse-position';

import ZoneContent from './ZoneContent';

const ZoneEditor = ({ zone }) => {
    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
  
    // UI LOGIC STATES

    // UTILITY FUNCTIONS

    return <img id={`image-${zone.id}`} src={zone.src} alt={`${zone.id}`} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white`} />
}

export default ZoneEditor;