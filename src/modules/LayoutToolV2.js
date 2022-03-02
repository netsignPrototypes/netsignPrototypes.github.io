import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MenuAlt2Icon, PhotographIcon, FilmIcon, DocumentIcon, CursorClickIcon, TrashIcon, SparklesIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmLeftIcon, ArrowSmRightIcon, PlayIcon, StopIcon, HandIcon, SaveIcon, ArrowCircleLeftIcon, ArrowCircleRightIcon, PlusIcon } from '@heroicons/react/outline'

import { useMediaQuery } from 'react-responsive';

import FcmBd from './dataSource/FcmBd';

import { gsap } from "gsap";

import { Zone, ZoneContent } from '../components';

import useMouse from '@react-hook/mouse-position';

import { csv2json } from 'csvjson-csv2json';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import usePanZoom from "use-pan-and-zoom";

import { useWindowSize } from '../hooks';
import useKeyboardShortcut from 'use-keyboard-shortcut'

const images = [
    'https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
    'https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644869432047-fa8bdbe849cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644574739831-d19ded59cae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644748865694-2db1be00e13a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1637336659506-93ee3acccd85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644840379571-2a973eee0726?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    'https://images.unsplash.com/photo-1644805424176-e426671f33ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1644773741827-d635af7357b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',
    'https://images.unsplash.com/photo-1644707386365-117da5d3fdc4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1644667621462-4938986c3a41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2077&q=80',
    'https://images.unsplash.com/photo-1644604992281-5c07ca56fa5b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',
    'https://images.unsplash.com/photo-1644657167747-49910669ac24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644530633761-094c893a6558?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
    'https://images.unsplash.com/photo-1644601397307-ae67d3024d46?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80'
]

const toolTypes = {
    Cursor: 0,
    PanZoom: 5,
    Text: 1,
    Image: 2,
    Shape: 3,
    Video: 4,
}

const zoneTypes = {
    1: 'Text',
    2: 'Image',
    3: 'Shape',
    4: 'Video',
}

const ANIMATION_TYPE = {
    slideFromLeft: 4,
    slideFromRight: 1,
    slideFromBottom: 2,
    slideFromTop: 3,
    fade: 5,
    zoom: 6,
}

const animationTypes = [
    { type: 4, icon: ArrowSmRightIcon, oppositeType: 1 },
    { type: 2, icon: ArrowSmUpIcon, oppositeType: 3 },
    { type: 3, icon: ArrowSmDownIcon, oppositeType: 2 },
    { type: 1, icon: ArrowSmLeftIcon, oppositeType: 4 },
]

const uncompatibleAnimation = {
    1: 4,
    2: 3,
    3: 2,
    4: 1,
}

const DEFAULT_SLIDES = [
    {
        "id":1,
        "duration":5,
        "zones": [
            {"id":1,"type":3,"position":[[0,0,24,24],[696,1056,720,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":0,"width":720,"height":1080}},
            {"id":2,"type":3,"position":[[720,0,744,24],[1896,1056,1920,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":720,"top":0,"width":1200,"height":1080}},
            {"id":3,"type":2,"position":[[744,24,768,48],[1296,504,1320,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":744,"top":24,"width":576,"height":504}},
            {"id":4,"type":2,"position":[[1344,24,1368,48],[1872,504,1896,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80","finalPosition":{"left":1344,"top":24,"width":552,"height":504}},
            {"id":5,"type":2,"position":[[744,552,768,576],[1296,1032,1320,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":744,"top":552,"width":576,"height":504}},
            {"id":6,"type":2,"position":[[1344,552,1368,576],[1872,1032,1896,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644869432047-fa8bdbe849cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":1344,"top":552,"width":552,"height":504}},
            {"id":7,"type":1,"position":[[24,24,48,48],[672,168,696,192]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":24,"width":672,"height":168}},
            {"id":8,"type":1,"position":[[24,216,48,240],[672,1032,696,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":216,"width":672,"height":840}}
        ]
    },
    {
        "id":2,
        "duration":5,
        "zones": [
            {"id":9,"type":3,"position":[[0,0,24,24],[1896,1056,1920,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":0,"width":1920,"height":1080}},
            {"id":10,"type":2,"position":[[24,24,48,48],[672,240,696,264]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":24,"top":24,"width":672,"height":240}},
            {"id":11,"type":2,"position":[[720,24,744,48],[1056,504,1080,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80","finalPosition":{"left":720,"top":24,"width":360,"height":504}},
            {"id":12,"type":2,"position":[[24,288,48,312],[336,720,360,744]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":288,"width":336,"height":456}},
            {"id":13,"type":2,"position":[[384,288,408,312],[672,504,696,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644869432047-fa8bdbe849cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":384,"top":288,"width":312,"height":240}},
            {"id":14,"type":2,"position":[[384,552,408,576],[840,1032,864,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":384,"top":552,"width":480,"height":504}},
            {"id":15,"type":2,"position":[[24,768,48,792],[336,1032,360,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644574739831-d19ded59cae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":768,"width":336,"height":288}},
            {"id":16,"type":2,"position":[[1104,264,1128,288],[1536,504,1560,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644748865694-2db1be00e13a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":1104,"top":264,"width":456,"height":264}},
            {"id":17,"type":2,"position":[[1104,24,1128,48],[1872,216,1896,240]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1637336659506-93ee3acccd85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":1104,"top":24,"width":792,"height":216}},
            {"id":18,"type":2,"position":[[1584,264,1608,288],[1872,744,1896,768]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644840379571-2a973eee0726?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80","finalPosition":{"left":1584,"top":264,"width":312,"height":504}},
            {"id":19,"type":2,"position":[[888,552,912,576],[1296,744,1320,768]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644805424176-e426671f33ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":888,"top":552,"width":432,"height":216}},
            {"id":20,"type":2,"position":[[1344,552,1368,576],[1536,744,1560,768]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644773741827-d635af7357b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":1344,"top":552,"width":216,"height":216}},
            {"id":21,"type":2,"position":[[888,792,912,816],[1128,1032,1152,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644707386365-117da5d3fdc4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80","finalPosition":{"left":888,"top":792,"width":264,"height":264}},
            {"id":22,"type":2,"position":[[1176,792,1200,816],[1872,1032,1896,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644667621462-4938986c3a41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2077&q=80","finalPosition":{"left":1176,"top":792,"width":720,"height":264}}
        ]
    },
    {
        "id":3,
        "duration":5,
        "zones": [
            {"id":23,"type":4,"position":[[0,0,24,24],[1896,1056,1920,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":0,"width":1920,"height":1080}},
            {"id":24,"type":3,"position":[[0,888,24,912],[1896,1008,1920,1032]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":888,"width":1920,"height":144}},
            {"id":25,"type":3,"position":[[1560,840,1584,864],[1896,1008,1920,1032]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":1560,"top":840,"width":360,"height":192}},
            {"id":26,"type":1,"position":[[1584,864,1608,888],[1872,984,1896,1008]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":1584,"top":864,"width":312,"height":144}},
            {"id":27,"type":2,"position":[[24,888,48,912],[144,1008,168,1032]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80","finalPosition":{"left":24,"top":888,"width":144,"height":144}},
            {"id":28,"type":2,"position":[[72,240,96,264],[816,648,840,672]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":72,"top":240,"width":768,"height":432}},
            {"id":29,"type":1,"position":[[72,72,96,96],[1824,192,1848,216]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":72,"top":72,"width":1776,"height":144}},
            {"id":30,"type":1,"position":[[864,240,888,264],[1824,792,1848,816]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":864,"top":240,"width":984,"height":576}}
        ]
    }
]

const DEFAULT_SLIDES_OLD = [
    {
        id: 1,
        duration: 5,
        zones: [/* ZONES */]
    },
    {
        id: 2,
        duration: 5,
        zones: [
            {"id":"Shape-1001","type":3,"position":[[0,0,24,24],[696,1056,720,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":0,"width":720,"height":1080}},
            {"id":"Shape-1002","type":3,"position":[[1896,0,1920,24],[720,1056,744,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":720,"top":0,"width":1200,"height":1080}},
            {"id":"Image-1007","type":2,"position":[[744,24,768,48],[1296,504,1320,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":744,"top":24,"width":576,"height":504}},
            {"id":"Image-1008","type":2,"position":[[1872,24,1896,48],[1344,504,1368,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80","finalPosition":{"left":1344,"top":24,"width":552,"height":504}},
            {"id":"Image-1009","type":2,"position":[[744,552,768,576],[1296,1032,1320,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":744,"top":552,"width":576,"height":504}},
            {"id":"Image-10010","type":2,"position":[[1344,552,1368,576],[1872,1032,1896,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644869432047-fa8bdbe849cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":1344,"top":552,"width":552,"height":504}},
            {"id":"Text-10011","type":1,"position":[[24,24,48,72],[672,168,696,192]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":24,"width":672,"height":168}},
            {"id":"Text-10012","type":1,"position":[[24,216,48,240],[672,1032,696,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":216,"width":672,"height":840}}
        ]
    },
    {
        id: 3,
        duration: 5,
        zones: [
            {"id":"Shape-2001","type":3,"position":[[0,0,24,24],[1896,1056,1920,1080]],"sequence":1,"animations":[],"src":'',"finalPosition":{"left":0,"top":0,"width":1920,"height":1080}},
            {"id":"Image-2002","type":2,"position":[[24,24,48,48],[672,240,696,264]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',"finalPosition":{"left":24,"top":24,"width":672,"height":240}},
            {"id":"Image-2003","type":2,"position":[[720,24,744,48],[1056,504,1080,528]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',"finalPosition":{"left":720,"top":24,"width":360,"height":504}},
            {"id":"Image-2004","type":2,"position":[[24,288,48,312],[336,720,360,744]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',"finalPosition":{"left":24,"top":288,"width":336,"height":456}},
            {"id":"Image-2005","type":2,"position":[[384,288,408,312],[672,504,696,528]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644869432047-fa8bdbe849cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',"finalPosition":{"left":384,"top":288,"width":312,"height":240}},
            {"id":"Image-2006","type":2,"position":[[384,552,408,576],[840,1032,864,1056]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',"finalPosition":{"left":384,"top":552,"width":480,"height":504}},
            {"id":"Image-2007","type":2,"position":[[24,768,48,792],[336,1032,360,1056]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644574739831-d19ded59cae8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',"finalPosition":{"left":24,"top":768,"width":336,"height":288}},
            {"id":"Image-2008","type":2,"position":[[1536,264,1560,288],[1104,504,1128,528]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644748865694-2db1be00e13a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',"finalPosition":{"left":1104,"top":264,"width":456,"height":264}},
            {"id":"Image-2009","type":2,"position":[[1872,24,1896,48],[1104,216,1128,240]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1637336659506-93ee3acccd85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',"finalPosition":{"left":1104,"top":24,"width":792,"height":216}},
            {"id":"Image-20010","type":2,"position":[[1584,264,1608,288],[1872,744,1896,768]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644840379571-2a973eee0726?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',"finalPosition":{"left":1584,"top":264,"width":312,"height":504}},
            {"id":"Image-20011","type":2,"position":[[888,552,912,576],[1296,744,1320,768]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644805424176-e426671f33ec?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',"finalPosition":{"left":888,"top":552,"width":432,"height":216}},
            {"id":"Image-20012","type":2,"position":[[1536,552,1560,576],[1344,744,1368,768]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644773741827-d635af7357b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80',"finalPosition":{"left":1344,"top":552,"width":216,"height":216}},
            {"id":"Image-20013","type":2,"position":[[888,792,912,816],[1128,1032,1152,1056]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644707386365-117da5d3fdc4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80',"finalPosition":{"left":888,"top":792,"width":264,"height":264}},
            {"id":"Image-20014","type":2,"position":[[1872,792,1896,816],[1176,1032,1200,1056]],"sequence":1,"animations":[],"src":'https://images.unsplash.com/photo-1644667621462-4938986c3a41?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2077&q=80',"finalPosition":{"left":1176,"top":792,"width":720,"height":264}}
        ]
    },
    {
        id: 4,
        duration: 5,
        zones: [
            {"id":"Fond-300","type":4,"position":[[0,0,24,24],[1896,1056,1920,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":0,"width":1920,"height":1080}},
            {"id":"bandeau-300","type":3,"position":[[0,888,24,912],[1896,1008,1920,1032]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":888,"width":1920,"height":144}},
            {"id":"CoinBandeau-300","type":3,"position":[[1896,840,1920,864],[1560,1008,1584,1032]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":1560,"top":840,"width":360,"height":192}},
            {"id":"Heure-300","type":1,"position":[[1584,864,1608,888],[1872,984,1896,1008]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":1584,"top":864,"width":312,"height":144}},
            {"id":"Logo-300","type":2,"position":[[144,888,168,912],[24,1008,48,1032]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80","finalPosition":{"left":24,"top":888,"width":144,"height":144}},
            {"id":"ImagePrincipale-300","type":2,"position":[[72,240,96,264],[816,648,840,672]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":72,"top":240,"width":768,"height":432}},
            {"id":"Titre-300","type":1,"position":[[1824,72,1848,96],[72,192,96,216]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":72,"top":72,"width":1776,"height":144}},
            {"id":"Corp-300","type":1,"position":[[864,240,888,264],[1824,792,1848,816]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":864,"top":240,"width":984,"height":576}}
        ]
    }
]

const DEFAULT_SLIDE = {
    id: 0,
    duration: 5,
    zones: [/* ZONES */]
}

const DEFAULT_ZONE = {
    // IDENTIFICATION
    id: 0,
    // PROPERTIES
    type: 0,
    src: "",
    // ANIMATION
    index: 0,
    level: 0,
    sequence: 1,
    animations: [],
    sequenceOffset: "",
    // POSITION IN SPACE
    parent: null,
    childrens: [/* ZONES */],
    overlappings: [/* ZONES */],
    surrounding: {/* left: [ ZONES ], right: [ ZONES ], top: [ ZONES ], bottom: [ ZONES ] */},
    corners: {/* tl: { x: 0, y: 0 }, tr: { x: 1920, y: 0 }, bl: { x: 0, y: 1080 }, br: { x: 1920, y: 1080 } */},
    finalPosition: {/* left: 0, top: 0, width: 1920, height: 1080 */},
    position: [/* [0, 0, 24, 24], [1896, 1056, 1920, 1080] */]
}

const LayoutToolV2 = ({ isHidden }) => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES -------------------------------

    /* Unique ids */
    const [uniqueZoneCount, setUniqueZoneCount] = useState(31);
    const [uniqueSlideCount, setUniqueSlideCount] = useState(4);
    const [imgIdx, setImgIdx] = useState(0);

    /* Thumb previews */
    const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const [thumbPreviewContainerWidth, setThumbPreviewContainerWidth] = useState(0);
    const [smallThumbPreviewWidth, setSmallThumbPreviewWidth] = useState(0);

    /* Zones */
    const [zones, setZones] = useState([]);
    const [currentZone, setCurrentZone] = useState(null);
    const [hoveredZoneId, setHoveredZoneId] = useState(null);
    const [selectedZoneId, setSelectedZoneId] = useState(null);

    const [tempZone, setTempZone] = useState([]);
    const [zoneIdx, setZoneIdx] = useState(0);
    const [hoverZoneIdx, setHoverZoneIdx] = useState(null);
    const [selectedZoneIdx, setSelectedZoneIdx] = useState(null);

    const [changeHistory, setChangeHistory] = useState([DEFAULT_SLIDES[0]]);
    const [changeHistoryIdx, setChangeHistoryIdx] = useState(0);
    
    /* Slides */
    const [slides, setSlides] = useState(DEFAULT_SLIDES);
    const [currentSlide, setCurrentSlide] = useState(DEFAULT_SLIDES[0]);
    const [slideIdx, setSlideIdx] = useState(0);

    /* Animations */
    const [maxSequence, setMaxSequence] = useState(2);
    const [tl, setTl] = useState(null);
    const [intensity, setIntensity] = useState(0.8);

    /* Data for smart creation */
    const [clipboardData, setClipboardData] = useState('');
  

    // UI LOGIC STATES ---------------------------
    
    /* Outil de création */
    const [currentTool, setCurrentTool] = useState("Text");

    /* Statut de lecture de la séquence */
    const [playingPreview, setPlayingPreview] = useState(false);

    /* Suivis des modifications */
    const [isSaved, setIsSaved] = useState(true);

    /* En cour de drag & drop */
    const [isDragging, setIsDragging] = useState(false);

    /* Précision de l'éditeur */
    const [gridSize, setGridSize] = useState(24);

    /* Panning & zooming */
    /* const [canPan, setCanPan] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [currentPan, setCurrentPan] = useState({x: 0, y: 0}); */

    // REFS --------------------------------------

    /* Thumb previews */
    const thumbPreviewContainer = useRef(null);
    const thumbPreview = useRef(null);
    const smallThumbPreview = useRef(null);

    /* Zone on top of selected zone so our mouse goes trough layers on top of the selected zone */
    const hoverZoneRef = useRef(null);
    

    // CUSTOM HOOKS ------------------------------

    const mouseHoverZone = useMouse(hoverZoneRef, { fps: 30 });
    /* const mouse = useMouse(thumbPreview, { fps: 30 }); */
    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });
    const screenSize = useWindowSize();
    /* const { transform, setContainer, panZoomHandlers, setPan, zoom, container } = usePanZoom({ 
        minZoom: 1, 
        maxZoom: 6, 
        enablePan: (currentTool === 'PanZoom' && canPan), 
        enableZoom: (currentTool === 'PanZoom'),
        zoomSensitivity: 0.001
    }); */

    const ctrlShiftZ = useKeyboardShortcut(["Control", "Shift", "Z"], () => { handleChangeHistoryIdx(1) }, { overrideSystem: true, ignoreInputFields: false, repeatOnHold: false });
    const ctrlZ = useKeyboardShortcut(["Control", "Z"], keys => { handleChangeHistoryIdx(-1) }, { overrideSystem: true, ignoreInputFields: false, repeatOnHold: false });
    const ctrlS = useKeyboardShortcut(["Control", "s"], () => { handleSaveSlide(currentSlide.id, currentSlide) }, { overrideSystem: true, ignoreInputFields: false, repeatOnHold: false });

    // EFFECTS ----------------------------------------------------------------------------------------

    useEffect(() => {
        if (!isHidden) {

        }

        return () => {
            ctrlZ.flushHeldKeys();
            ctrlShiftZ.flushHeldKeys();
            ctrlS.flushHeldKeys();
        }
    }, [isHidden]);

    useEffect(() => {
        if (thumbPreviewContainer.current) {

            let containerWidth = thumbPreviewContainer.current.offsetWidth;
            let containerHeight = thumbPreviewContainer.current.offsetHeight;

            let previewWidth = containerWidth * 0.75;
            let previewHeight = previewWidth / 16 * 9;

            if (previewHeight >= containerHeight * 0.95) {
                previewHeight = containerHeight * 0.95;
                previewWidth = previewHeight / 9 * 16;
            }

            setThumbPreviewWidth(previewWidth);
            setThumbPreviewContainerWidth(containerWidth);
        }
        
        /* if (thumbPreview.current) {
           setThumbPreviewWidth(thumbPreview.current.offsetWidth);
        } */

        if (smallThumbPreview.current) {
            setSmallThumbPreviewWidth(smallThumbPreview.current.offsetWidth);
        }
    }, [screenSize]);

    useEffect(() => {
        if (mouseHoverZone.isOver && selectedZoneIdx !== null) {
            setHoverZoneIdx(selectedZoneIdx);
        }
    }, [mouseHoverZone.isOver]);

    useEffect(() => {
        if (zones !== null) {
            zones.forEach(zone => {
                gsap.set(`#${zoneTypes[zone.type]}-${zone.id}`, { opacity: 1 })
            });
            createTimeLineV2([...zones], false);
        }
     }, [zones]);

    /* useEffect(() => {
        if (zoom === 1 && canPan) {
            setPan({ x: 0, y: 0});
            setCanPan(false);
        } else if (!canPan && zoom > 1) {
            setCanPan(true);
        }
    }, [zoom]);  */


    // DATA STATE MANAGEMENT FUNCTIONS ----------------------------------------------------------------

    /* Slides */
    const handleAddSlide = (index = -1) => {

        let newSlide = { ...DEFAULT_SLIDE, id: uniqueSlideCount };

        if (index < 0) {
            setSlides(currentSlides => [...currentSlides, newSlide]);
        } else {
            let newSlides = [...slides];

            newSlides.splice(index, 0, newSlide);

            setSlides(newSlides);
        }

        handleEditSlide(newSlide);
        
        setUniqueSlideCount(current => current + 1);
    }

    const handleDeleteSlide = (id) => {
        const updatedObject = slides.filter((slide, index) => {
            if (slide.id === id) {
                if (slides[index + 1]) {
                    handleEditSlide(slides[index + 1]);
                } else if (slides[index - 1]) {
                    handleEditSlide(slides[index - 1]);
                }
            }

            return slide.id !== id;
        
        });

        setSlides(updatedObject);

        if (updatedObject.length === 0) {
            handleAddSlide();
        }
    }

    const handleEditSlide = (slide) => {
        setCurrentSlide({ ...slide });
        setChangeHistory([slide]);
        setChangeHistoryIdx(0);
        setIsSaved(true);
        setSelectedZoneId(null);
        setCurrentZone(null);
    }

    const handleSaveSlide = (id, updatedSlide) => {
        const updatedObject = slides.map((slide) =>
            slide.id === id ? updatedSlide : slide
        );

        setSlides(updatedObject);
        setIsSaved(true);
    }

    const handleUpdateSlide = (updatedSlide) => {
        setCurrentSlide({ ...currentSlide, ...updatedSlide });
        handleChangeHistory({ ...currentSlide, ...updatedSlide });
        setIsSaved(checkIfSaved(slides.find(slide => slide.id === currentSlide.id), { ...currentSlide, ...updatedSlide }));
    }

    /* À revoir pour slides */
    const handleSelectSlide = (index) => {

        if (index !== slideIdx && !playingPreview) {
            const newSlides = [...slides];
            const newZones = [...zones];
            newSlides[slideIdx] = newZones;

            setHoverZoneIdx(null);
            setSelectedZoneIdx(null);
            setSlideIdx(index);
            setSlides(newSlides);
            setZones(FcmBd.utils.deepCopy(newSlides[index]));
            setZoneIdx(newSlides[index].length > 0 ? newSlides[index].length - 1 : 0);
        } 
        

    }

    /* Zones */
    const handleAddZone = (zone) => {
        handleUpdateSlide({ zones: [...currentSlide.zones, { ...DEFAULT_ZONE, ...zone, id: uniqueZoneCount, type: toolTypes[currentTool] }]});
        setUniqueZoneCount(current => current + 1);
    }

    const handleDeleteZone = (id) => {
        const updatedObject = currentSlide.zones.filter((zone) => zone.id !== id);

        if (selectedZoneId === id) {
            setSelectedZoneId(null);
            setCurrentZone(null);
        }

        handleUpdateSlide({ zones: updatedObject });
        setIsSaved(false);
    }

    const handleEditZone = (zone) => {
        setCurrentZone({ ...zone });
    }

    const handleSaveZone = (id) => {}

    const handleUpdateZone = (id, updatedZone) => {
        const updatedObject = currentSlide.zones.map((zone) =>
            zone.id === id ? updatedZone : zone
        );

        if (id === selectedZoneId) {
            setCurrentZone(updatedZone);
        }

        handleUpdateSlide({ zones: updatedObject });
    }

    const handleHoveredZone = (id) => {
        if (hoveredZoneId !== selectedZoneId || (hoverZoneIdx === null && selectedZoneIdx === null)) {
            setHoveredZoneId(id);
        }
    }

    const handleSelectedZone = (zone = {}) => {
        if (currentTool !== 'Cursor') {
            setCurrentTool('Cursor');
        }
        
        if (zone.id && selectedZoneId === zone.id) {
            setSelectedZoneId(null);
            setCurrentZone(null);
        } else if (zone.id) {
            setSelectedZoneId(zone.id);
            setCurrentZone({ ...zone });
        } else if (hoveredZoneId !== null) {
            selectedZoneId(hoveredZoneId);
            setCurrentZone({ ...currentSlide.zones.find(zone => zone.id === hoveredZoneId) });
        }
        
    }


    /* Current zone */
    const handleCreateNewZone = (mouseX, mouseY, mouseDown) => {

        /* const gridSize = 24; */

        let realX = getRealPixelSize(mouseX);
        let realY = getRealPixelSize(mouseY);

        let x = realX - realX % gridSize;
        let y = realY - realY % gridSize;

        let square = [ x, y, x + gridSize, y + gridSize ];

        if (currentZone && !mouseDown) {
            handleAddZone({...currentZone, ...getPositions([tempZone, square]) });
            setTempZone(null);
            setCurrentZone(null);
        } else if (mouseDown) {

            if (currentZone === null) {
                // Temporaire pour les images
                if (toolTypes[currentTool] === toolTypes.Image) {

                    let newImgIdx = imgIdx + 1;

                    if (newImgIdx < images.length) {
                        setImgIdx(newImgIdx);
                    } else {
                        setImgIdx(0);
                    }
                    
                    setCurrentZone({ ...DEFAULT_ZONE, src: images[imgIdx], ...getPositions([ square, square ]) });
                } else {
                    setCurrentZone({ ...DEFAULT_ZONE, ...getPositions([ square, square ]) });
                }

                setTempZone(square);
            } else {
                setCurrentZone({...currentZone, ...getPositions([tempZone, square]) });
            }
        } 
    }

    const handleChangeZone = (zone, key, value = null) => {
        switch (key) {
            case 'animations':
                handleZoneAnimation(zone, value);
            break;
            case 'sequence':
                handleChangeSequence(zone);
            break;
            case 'finalPosition':
                handleUpdateZone(zone.id, {...zone, ...getPositions([value.position[0], value.position[1]]) });
            break;
            case 'delete':
                handleDeleteZone(zone.id);
            break;
            default:
        }
    }

    const handleZoneAnimation = (zone, animationType) => {

        let animations = [];

        if (zone.animations.includes(animationType)) {
            animations = zone.animations.filter(animation => animation !== animationType);
        } else if (zone.animations.includes(uncompatibleAnimation[animationType])) {
            animations = zone.animations.filter(animation => animation !== uncompatibleAnimation[animationType]);
            animations.push(animationType);
        } else {
            animations.push(animationType);
        }

        handleUpdateZone(zone.id, {...zone, animations: animations });

        emptyTimeLine();
        createTimeLineV2([{...zone, animations: animations }], false, 0);

    }

    const handleChangeSequence = (zone) => {

        let sequence = zone.sequence + 1;

        if (sequence >= maxSequence) {
            let max = Math.max.apply(Math, currentSlide.zones.map(({ id, sequence }) => id === zone.id ? 0 : sequence));
            if (max + 1 < sequence) {
                sequence = 1;
            } else {
                setMaxSequence(max + 1);
            }
        }

        handleUpdateZone(zone.id, {...zone, sequence: sequence });
    }


    /* Drag & Drop */
    const handleDragEnd = (result, dataType) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }
    
        const items = reorder(
            dataType === 'slides' ? slides : currentSlide.zones,
            result.source.index,
            result.destination.index
        );

        if (dataType === 'slides') {
            setSlides([...items]);
        } else {
            handleUpdateSlide({ zones: items.map((item, index) => { item.index =index; return item;}) });
        }

        setIsDragging(false);
    
    }

    const handleDragStart = () => {
        setIsDragging(true);
    }


    /* Versionning */
    const handleChangeHistory = (lastChangedObject) => {

        if (!checkIfSaved(changeHistory[changeHistory.length - 1], lastChangedObject)) {
            let newChangeHistory = [...changeHistory];

            if (changeHistoryIdx < changeHistory.length - 1) {
                newChangeHistory = newChangeHistory.filter((change, index) => index <= changeHistoryIdx);
            }

            setChangeHistory([ ...newChangeHistory, lastChangedObject]);
            setChangeHistoryIdx(newChangeHistory.length);
        }
    }

    const handleChangeHistoryIdx = (move) => {
        let newChangeHistoryIdx = changeHistoryIdx;

        if (newChangeHistoryIdx > 0 && move < 0) {
            setChangeHistoryIdx(newChangeHistoryIdx - 1);
            setCurrentSlide(changeHistory[newChangeHistoryIdx - 1]);
            setIsSaved(checkIfSaved(slides.find(slide => slide.id === currentSlide.id), changeHistory[newChangeHistoryIdx - 1]));
        } else if (newChangeHistoryIdx + 1 < changeHistory.length && move > 0) {
            setChangeHistoryIdx(newChangeHistoryIdx + 1);
            setCurrentSlide(changeHistory[newChangeHistoryIdx + 1]);
            setIsSaved(checkIfSaved(slides.find(slide => slide.id === currentSlide.id), changeHistory[newChangeHistoryIdx + 1]));
        }
    }


    /* Data for smart creation */
    const handleOnPasteClipboardData = (e) => {
        const { clipboardData } = e;
        e.persist();
        setClipboardData(clipboardData);

        /* console.log(clipboardData.getData('Text'));
        console.log(clipboardData.getData('text/plain'));
        console.log(clipboardData.getData('text/html'));
        console.log(clipboardData.getData('text/rtf'));

        console.log(clipboardData.getData('Url'));
        console.log(clipboardData.getData('text/uri-list'));
        console.log(clipboardData.getData('text/x-moz-url')); */

        const json = csv2json(clipboardData.getData('Text'));
        console.log(json);

        
    }


    // UI LOGIC STATE MANAGEMENT FUNCTIONS ------------------------------------------------------------

    /* Outil de création */
    const handleChangeCurrentTool = (tool) => {
        setCurrentTool(tool);
        setSelectedZoneIdx(null);
    }

    /* Animations */
    const handlePlay = (smart = false) => {
        emptyTimeLine();
        setSelectedZoneIdx(null);

        if (!smart) {            

            let computedZones = [];

            slides.forEach((slide, index) => {
                let computedZone = smartAnimationV2(computeZonesV2(FcmBd.utils.deepCopy(slide.zones))).map(zone => {
                    zone.sequence += index * 100;

                    return zone;
                });

                computedZones = [...computedZones, ...computedZone];
            })

            //createTimeLine([...zones], false);

            setZones([...computedZones]);

            //createTimeLineV2([...computedZones], false);
        } else {
            //createTimeLine(computeZones(FcmBd.utils.deepCopy(zones)), false);

            let computedZones = smartAnimationV2(computeZonesV2(FcmBd.utils.deepCopy(currentSlide.zones)));

            /* createTimeLineV2(computedZones, false); */

            setZones([...computedZones]);
        }
        
        setPlayingPreview(true);
        
    }

    const handleStop = () => {
        emptyTimeLine();
        setPlayingPreview(false);

        zones.forEach(zone => {
            gsap.set(`#${zoneTypes[zone.type]}-${zone.id}`, { opacity: 0.75 })
        });

        setZones(null);

    }

    const stopTimeLine = () => {
        if (tl !== null) {
            tl.progress(1);
        }
    }

    const emptyTimeLine = () => {
        if (tl !== null) {
            tl.progress(1);
            tl.clear();
            setTl(null);
        }
    }

    
    // COMPUTATIONAL FUNCTIONS ------------------------------------------------------------------------

    /* Zones */
    /* Permet de trouver toutes les informations possibles en comparant chaque vignette par rapport aux autres 
    à partir d'une liste de zones dans une même vignette. Retourne la liste mise à jour. */
    const computeZonesV2 = (zones) => {

        zones.forEach((zone, index) => {

            zone.index = index;

            zone.level = 0;
            zone.parent = null;
            zone.childrens = [];
            zone.overlappings = [];

            zone.corners = getCorners(zone.finalPosition);

            zone.surrounding = {
                left: [],
                right: [],
                top: [],
                bottom: []
            }

        });

        zones.forEach((zoneA, indexA) => {

            zones.forEach((zoneB, indexB) => {

                if (indexA !== indexB) {

                    let parent = false;
                    let child = false;
                    let overlapping = false;

                    // Déterminer le parent direct de chaque zone
                    // Pour être le parent d'une zone, la zone enfant doit être complètement à l'intérieur de celle-ci. Une zone ne peut pas avoir plusieurs parents et peut ne pas avoir de parent du tout.
                    if (isParent(zoneA.finalPosition, zoneB.finalPosition) && indexA > indexB) {
                        zoneA.parent = zoneB;
                        parent = true;
                    }

                    // Déterminer les enfants direct de chaque zone
                    // Pour être l'enfant d'une zone, la zone parent doit contenir celle-ci complètement. Une zone peut avoir plusieurs enfants et peut ne pas avoir d'enfants du tout.
                    else if (isParent(zoneB.finalPosition, zoneA.finalPosition) && indexA < indexB) {
                        zoneA.childrens.push(zoneB);
                        child = true;
                    }

                    // Déterminer les zones qui se chevauchent
                    // Une zone qui embarque par dessus une autre zone sans pouvoir être qualifié de parent ou d'enfant direct.
                    else if (isOverlapping(zoneA.finalPosition, zoneB.finalPosition) && indexA > indexB) {
                        zoneA.overlappings.push(zoneB);
                        overlapping = true;
                    }

                    // Déterminer le niveau de chaque zone
                    // Une zone qui embarque par dessus une autre zone est un niveau supérieur, mais deux zones qui ne se croisent pas avec des indexes Z différent sont sur le même niveau
                    if ((parent || overlapping)) {
                        zoneA.level = zoneB.level + 1;
                    }

                    // Déterminer les zones qui se trouves à gauche, droite, au dessus et en dessous de chaque zones  
                    // Tous niveaux et chevauchement confondus

                    if (!child) {
                        // À gauche?
                        if (zoneA.corners.tl.x >= zoneB.corners.tl.x && ((parent && zoneB.corners.tl.x !== 0) || !parent)
                            && isOverlappingOnAxis(zoneA.corners, zoneB.corners, 'y') /* ((zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y)) */) {

                                zoneA.surrounding.left.push(zoneB);
                        }

                        // À droite?
                        if (zoneA.corners.tr.x <= zoneB.corners.tr.x && ((parent && zoneB.corners.tr.x !== 1920) || !parent)
                            && isOverlappingOnAxis(zoneA.corners, zoneB.corners, 'y') /* ((zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y)) */) {

                                zoneA.surrounding.right.push(zoneB);
                        }

                        // Au dessus?
                        if (zoneA.corners.tl.y >= zoneB.corners.tl.y && ((parent && zoneB.corners.tl.y !== 0) || !parent)
                            && isOverlappingOnAxis(zoneA.corners, zoneB.corners, 'x') /* ((zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x)) */) {

                                zoneA.surrounding.top.push(zoneB);
                        }

                        // En dessous?
                        if (zoneA.corners.bl.y <= zoneB.corners.bl.y && ((parent && zoneB.corners.bl.y !== 1080) || !parent)
                            && isOverlappingOnAxis(zoneA.corners, zoneB.corners, 'x') /* ((zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x)) */) {

                                zoneA.surrounding.bottom.push(zoneB);
                        }
                    }
                }

            });

            /* console.log('computedZonesV2 | ' + zoneA.id, { 
                        level: zoneA.level, 
                        parent: zoneA.parent ? zoneA.parent.id : '', 
                        childrens: JSON.stringify(zoneA.childrens.map(child => child.id)),
                        overlappings: JSON.stringify(zoneA.overlappings.map(child => child.id)),
                        surrounding:  JSON.stringify({ left: zoneA.surrounding.left.map(child => child.id), right: zoneA.surrounding.right.map(child => child.id), top: zoneA.surrounding.top.map(child => child.id), bottom: zoneA.surrounding.bottom.map(child => child.id) }) 
                    }
            ); */
        });

        

        return zones;
    }

    /* Permet de trier les zones selon un ordre logique basé sur leur position, 
    ordre de lecture, à partir du centre, à partir de l'extérieur */
    const sortZones = (zones, method, reversed) => {

        console.log('sortZones', method, reversed);

        switch (method) {
            case 'fromCenter':
                return zones.sort((a,b) => {

                    /* let order = 0; */
    
                    let aCenterX = a.finalPosition.left + a.finalPosition.width / 2 - 960;
                    let aCenterY = a.finalPosition.top + a.finalPosition.height / 2 - 540;
                    let bCenterX = b.finalPosition.left + b.finalPosition.width / 2 - 960;
                    let bCenterY = b.finalPosition.top + b.finalPosition.height / 2 - 540;
    
                    if (aCenterX < 0) aCenterX *= -1;
                    if (aCenterY < 0) aCenterY *= -1;
                    if (bCenterX < 0) bCenterX *= -1;
                    if (bCenterY < 0) bCenterY *= -1;

                    let distanceA = Math.sqrt( aCenterX + aCenterY );
                    let distanceB = Math.sqrt( bCenterX + bCenterY );
        
                    if (reversed) {
                        return a.level - b.level || distanceA - distanceB;
                    } else {
                        return a.level - b.level || distanceB - distanceA;
                    }
                    
                });
            case 'readingOrder':
                return zones.sort((a,b) => {

                    let distanceA = Math.sqrt( a.finalPosition.left + a.finalPosition.top );
                    let distanceB = Math.sqrt( b.finalPosition.left + b.finalPosition.top );
        
                    return a.level - b.level || distanceA - distanceB;
                    /* if (reversed) {
                        return a.level - b.level || distanceB - distanceA;
                    } else {
                        return a.level - b.level || distanceA - distanceB;
                    } */
                });
            default:
                return zones;
        }
    }

    /* Animations */
    /* Permet de générer les propriétés de séquence d'animation d'une liste de vignette 
    qui a préalablement été traité par la fonction computeZonesV2. Retourne la liste mise à jour. */
    const smartAnimationV2 = (zonesToAnimate) => {
        
        // Déterminer l'ordre d'arrivé des zones par niveau et position 
        let method = ['readingOrder', 'fromCenter'][Math.floor(Math.random() * 2)];
        let reversed = Math.floor(Math.random() * 2) === 0 ? false : true;

        let sortedZones = sortZones(zonesToAnimate, method, reversed);

        let sequenceNo = 1;

        let lastZoneType = null;
        let lastZoneAnimation = null;

        sortedZones.forEach((zone, index) => {
            let possibleAnimations = getPossibleAnimationsV2(sortedZones.slice(0, index), zone);

            if (zone.level === 0) {
                zone.sequence = 1;
                zone.sequenceOffset = '';
            } else {
                
                if (zone.parent && zone.parent.level > 0) {
                    zone.sequence = zone.parent.sequence + 1;
                    zone.sequenceOffset = '1.2';
                } else if (zone.overlappings[0] && zone.overlappings[0].sequence > 1 && zone.overlappings.length === 1) {
                    zone.sequence = zone.overlappings[0].sequence/*  < zone.overlappings[0].sequence ? zone.overlappings[0].sequence : zone.overlappings[zone.overlappings.length - 1].sequence */;
                    zone.sequenceOffset = '0.2';
                } else {
                    sequenceNo += 1;
                    zone.sequence = sequenceNo;

                    if (index > 0 && sortedZones[index - 1].type === zone.type) {
                        zone.sequenceOffset = '1.1';
                    } else if (index > 0 && sortedZones[index - 1].level === zone.level) {
                        zone.sequenceOffset = '0.8';
                    } else {
                        zone.sequenceOffset = '0.5';
                    }
                }
            }

            if (possibleAnimations.length === 0) {
                possibleAnimations = [5, 6]
            } else if (zone.level > 0) {
                possibleAnimations.push(5);
                possibleAnimations.push(6);
            }

            possibleAnimations = possibleAnimations.filter(animation => computeAnimationIntensity(animation, zone.finalPosition) / (zone.level === 0 ? 2 : 1) <= intensity);

            if (possibleAnimations.length === 0) {
                possibleAnimations = [5]
            }

            if (zone.level !== 0 && lastZoneType === zone.type && possibleAnimations.includes(lastZoneAnimation)) {
                zone.animations = [lastZoneAnimation];
            } else {
                let animIndex = Math.floor(Math.random() * possibleAnimations.length);

                zone.animations = [possibleAnimations[animIndex]];
                lastZoneAnimation = possibleAnimations[animIndex];
            }

            lastZoneType = zone.type;

        });

        console.log('smartAnimationV2', sortedZones);

        return sortedZones;
    }

    /* Permet de déterminer les animations qu'une zone peut utiliser selon des règles 
    logiques en se basant sur les zones qui sont déjà aparrues dans la vignette, 
    utilisé dans le traitement de la fonction smartAnimationV2 */
    const getPossibleAnimationsV2 = (zonesToCheck, zone) => {
        let possibleAnimations = [1, 2, 3, 4];

        // Basic rules not dependent of other zones for level 0 (Background) zones.

        if (zone.level === 0) {
            // Slide from left
            if (zone.corners.tr.x === 1920 && zone.position.width < 960) {
                possibleAnimations = possibleAnimations.filter(animation => animation !== 4);
            }

            // Slide form right
            if (zone.corners.tl.x === 0 && zone.position.width < 960) {
                possibleAnimations = possibleAnimations.filter(animation => animation !== 1);
            }

            // Slide from top
            if (zone.corners.bl.y === 1080 && zone.position.height < 540) {
                possibleAnimations = possibleAnimations.filter(animation => animation !== 3);
            }

            // Slide from bottom
            if (zone.corners.tl.y === 0 && zone.position.height < 540) {
                possibleAnimations = possibleAnimations.filter(animation => animation !== 2);
            }
        }
        

        // Basic rules dependent of other zones that are already displayed
        for (let zoneToCheck of zonesToCheck) {
            if (possibleAnimations.length > 0) {
                // Slide from left
                if (possibleAnimations.includes(4) && (zone.surrounding.left.some(surroudingZone => surroudingZone.id === zoneToCheck.id) || (zone.parent && zone.parent.level > 0 && zone.parent.corners.tl.x !== 0))) {
                    possibleAnimations = possibleAnimations.filter(animation => animation !== 4);
                }

                // Slide form right
                if (possibleAnimations.includes(1) && (zone.surrounding.right.some(surroudingZone => surroudingZone.id === zoneToCheck.id) || (zone.parent && zone.parent.level > 0 && zone.parent.corners.tr.x !== 1920))) {
                    possibleAnimations = possibleAnimations.filter(animation => animation !== 1);
                }

                // Slide from top
                if (possibleAnimations.includes(3) && (zone.surrounding.top.some(surroudingZone => surroudingZone.id === zoneToCheck.id) || (zone.parent && zone.parent.level > 0 && zone.parent.corners.tl.y !== 0))) {
                    possibleAnimations = possibleAnimations.filter(animation => animation !== 3);
                }

                // Slide from bottom
                if (possibleAnimations.includes(2) && (zone.surrounding.bottom.some(surroudingZone => surroudingZone.id === zoneToCheck.id) || (zone.parent && zone.parent.level > 0 && zone.parent.corners.bl.y !== 1080))) {
                    possibleAnimations = possibleAnimations.filter(animation => animation !== 2);
                }
            } else {
                break;
            }
        }

        /* console.log('getPossibleAnimationsV2 | ' + zone.id, { 
                level: zone.level, 
                parent: zone.parent ? zone.parent.id : '', 
                childrens: JSON.stringify(zone.childrens.map(child => child.id)),
                overlappings: JSON.stringify(zone.overlappings.map(child => child.id)),
                surrounding:  JSON.stringify({ left: zone.surrounding.left.map(child => child.id), right: zone.surrounding.right.map(child => child.id), top: zone.surrounding.top.map(child => child.id), bottom: zone.surrounding.bottom.map(child => child.id) }) 
            },
            JSON.stringify(possibleAnimations)
        ); */

        return possibleAnimations;
    }
    
    /* Permet de calculer l'intensité du movement d'une zone selon une animation donnée, 
    utilisé dans le traitement de la fonction smartAnimationV2 pour choisir une animation 
    qui correspond à l'intensité désiré par l'usager */
    const computeAnimationIntensity = (animationType, zoneToAnimatePosition) => {
        let zonePosition = getCorners(zoneToAnimatePosition);

        let intensity = 0;

        switch (animationType) {
            case ANIMATION_TYPE.slideFromRight:
                intensity = (1920 - zonePosition.tl.x) / 1920;
            break;
            case ANIMATION_TYPE.slideFromBottom:
                intensity = (1080 - zonePosition.tl.y) / 1080;
            break;
            case ANIMATION_TYPE.slideFromTop:
                intensity = (zonePosition.bl.y) / 1080;
            break;
            case ANIMATION_TYPE.slideFromLeft:
                intensity = (zonePosition.tr.x) / 1920;
            break;
            case ANIMATION_TYPE.fade: 
                intensity = 0;
            break;
            case ANIMATION_TYPE.zoom: 
                intensity = (zoneToAnimatePosition.width * zoneToAnimatePosition.height) / (1920 * 1080);
            break;
            default:
        }

        return intensity
    }

    /* Permet de créer la timeline dans l'engin d'animation pour une liste de vignette 
    qui a préalablement été traité par la fonction smartAnimationV2 */
    const createTimeLineV2 = (zonesToAnimate, paused, delay = 1) => {
        const newTl = gsap.timeline({ paused: paused/* , clearProps: true */, delay: delay });

        if (zonesToAnimate.length > 1) {
            zonesToAnimate = zonesToAnimate.sort((a,b) => a.sequence - b.sequence);
        }

        zonesToAnimate.forEach((zone, index) => {

            if (zone.animations.length > 0) {

                let start = {};
                let end = {};

                zone.animations.forEach(animation => {
                    let animationSequence = getAnimation(zone.finalPosition, animation)
                    start = { ...start, ...animationSequence.start };
                    end = { ...end, ...animationSequence.end };
                });

                let position = `sequence${zone.sequence}${zone.sequenceOffset !== '' ? `-=${zone.sequenceOffset}` : ''}`;

                if (Object.keys(end).length > 0) {
                    newTl.fromTo(`#${zoneTypes[zone.type]}-${zone.id}`, start, end, position);
                } else {
                    newTl.from(`#${zoneTypes[zone.type]}-${zone.id}`, start, position);
                }
                
            }
        });

        newTl.then(() => handleStop());

        setTl(newTl);

    }

    /* Permet de vérifier si la vignette présentement en cour d'édition est identique 
    à celle dans la liste des vignettes de la séquence */
    const checkIfSaved = (currentObject, newObject) => {
        let isIdentical = true;

        if (JSON.stringify(currentObject) !== JSON.stringify(newObject)) {
            isIdentical = false;
        }

        return isIdentical;
    }

    
    // UTILITY FUNCTIONS ------------------------------------------------------------------------------

    /* Obtenir la grosseur d'une pixel dans la zone d'édition de la vignette, 
    les mesures enregistrées sont basées sur un écran 1920x1080, mais la zone d'édition n'a pas cette dimension */
    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = thumbPreviewWidth;

        if (thumbPreviewContainerWidth === 0 || (thumbPreviewContainer.current && thumbPreviewContainer.current.offsetWidth !== thumbPreviewContainerWidth)) {
            /* currentThumbPreviewWidth = thumbPreview.current.offsetWidth; */
            let containerWidth = thumbPreviewContainer.current.offsetWidth;
            let containerHeight = thumbPreviewContainer.current.offsetHeight;

            let previewWidth = containerWidth * 0.75;
            let previewHeight = previewWidth / 16 * 9;

            if (previewHeight >= containerHeight * 0.95) {
                previewHeight = containerHeight * 0.95;
                previewWidth = previewHeight / 9 * 16;
            }

            currentThumbPreviewWidth = previewWidth;
            setThumbPreviewContainerWidth(containerWidth);
            setThumbPreviewWidth(currentThumbPreviewWidth);
        }

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    /* Obtenir la grosseur d'une pixel dans un l'aperçue d'une vignette de la liste des vignettes, 
    les mesures enregistrées sont basées sur un écran 1920x1080, mais l'aperçue n'a pas cette dimension */
    const getSmallComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = smallThumbPreviewWidth;

        if (smallThumbPreviewWidth === 0 || (smallThumbPreview.current && smallThumbPreview.current.offsetWidth !== smallThumbPreviewWidth)) {
            currentThumbPreviewWidth = smallThumbPreview.current.offsetWidth;
            setSmallThumbPreviewWidth(currentThumbPreviewWidth);
        }

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    /* Obtenir la grosseur d'une pixel réel en 1920x1080 en partant d'une autre dimension, 
    les mesures enregistrées sont basées sur un écran 1920x1080, mais la zone d'édition n'a pas cette dimension */
    const getRealPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = thumbPreviewWidth;

        if (thumbPreviewContainerWidth === 0 || (thumbPreviewContainer.current && thumbPreviewContainer.current.offsetWidth !== thumbPreviewContainerWidth)) {
            /* currentThumbPreviewWidth = thumbPreview.current.offsetWidth; */
            let containerWidth = thumbPreviewContainer.current.offsetWidth;
            let containerHeight = thumbPreviewContainer.current.offsetHeight;

            let previewWidth = containerWidth * 0.75;
            let previewHeight = previewWidth / 16 * 9;

            if (previewHeight >= containerHeight * 0.95) {
                previewHeight = containerHeight * 0.95;
                previewWidth = previewHeight / 9 * 16;
            }

            currentThumbPreviewWidth = previewWidth;
            setThumbPreviewContainerWidth(containerWidth);
            setThumbPreviewWidth(currentThumbPreviewWidth);
        }

        computedPixelSize = 1920 / currentThumbPreviewWidth * pixel;

        return computedPixelSize;
    }

    /* Obtenir le point d'entré et d'arrivé d'une animation avec la position de la zone et le type d'animation */
    const getAnimation = (position, animation) => {

        let finalAnimation = {};

        switch (animation) {
            case ANIMATION_TYPE.slideFromRight:
                finalAnimation = { start: { x: getComputedPixelSize(1920 - position.left), rotation: 0.01 }, end: { x: 0, rotation: 0, ease: 'power3.inOut', duration: 1.5 } };
            break;
            case ANIMATION_TYPE.slideFromBottom:
                finalAnimation = { start: { y: getComputedPixelSize(1080 - position.top), rotation: 0.01 }, end: { y: 0, rotation: 0, ease: 'power3.inOut', duration: 1.5 } };
            break;
            case ANIMATION_TYPE.slideFromTop:
                finalAnimation = { start: { y: getComputedPixelSize((position.top + position.height) * -1), rotation: 0.01 }, end: { y: 0, rotation: 0, ease: 'power3.inOut', duration: 1.5 } };
            break;
            case ANIMATION_TYPE.slideFromLeft:
                finalAnimation = { start: { x: getComputedPixelSize((position.left + position.width) * -1), rotation: 0.01 }, end: { x: 0, rotation: 0, ease: 'power3.inOut', duration: 1.5 } };
            break;
            case ANIMATION_TYPE.fade: 
                finalAnimation = { start: { opacity: 0 }, end: { opacity: 1, ease: 'power3.inOut', duration: 1.5 } };
            break;
            case ANIMATION_TYPE.zoom: 
                finalAnimation = { start: { scale: 0, rotation: 0.01 }, end: { scale: 1, rotation: 0, ease: 'power3.inOut', duration: 1.5 } };
            break;
            default:
        }

        return finalAnimation;
    }

    /* Obtenir un objet contenant les coordonées de chaque coin d'une zone sous la forme { tl: { x: 0, y: 0 }, tr: { x: 0, y: 0 }, bl: { x: 0, y: 0 }, br: { x: 0, y: 0 } }
    à partir d'un objet contenant les propriétés css sous la forme { left: 0, top: 0, width: 1920, height: 1080 } */
    const getCorners = (zoneFinalPosition) => {
        let zonePosition = {
            tl: { x: zoneFinalPosition.left, y: zoneFinalPosition.top },
            tr: { x: zoneFinalPosition.left + zoneFinalPosition.width, y: zoneFinalPosition.top },
            bl: { x: zoneFinalPosition.left, y: zoneFinalPosition.top + zoneFinalPosition.height },
            br: { x: zoneFinalPosition.left + zoneFinalPosition.width, y: zoneFinalPosition.top + zoneFinalPosition.height },
        }

        return zonePosition;
    }

    /* Obtenir un objet contenant les positions et les positions finales recalculées d'une zone sous la forme { finalPosition: { left: 0, top: 0, width: 1920, height: 1080 }, position: [[0,0,0,0],[0,0,0,0]] }
    à partir d'un objet contenant les positions sous la forme [[0,0,0,0],[0,0,0,0]] */
    const getPositions = (position) => {

        /* const gridSize = 24; */

        if (position[0][0] <= position[1][2] && position[0][1] <= position[1][3]) {
            position = [position[0], position[1]];
        } else {
            position = [position[1], position[0]];
        }

        let finalPosition = {
            left: position[0][0] < position[1][0] ? position[0][0] : position[1][0], 
            top: position[0][1] < position[1][1] ? position[0][1] : position[1][1], 
            width: position[1][2] > position[0][0] ? position[1][2] - position[0][0] : position[0][2] - position[1][0], 
            height: position[1][3] > position[0][1] ? position[1][3] - position[0][1] : position[0][3] - position[1][1]
        }

        position = [
            [
                finalPosition.left, 
                finalPosition.top, 
                finalPosition.left + gridSize, 
                finalPosition.top + gridSize
            ], 
            [
                finalPosition.left + finalPosition.width - gridSize, 
                finalPosition.top + finalPosition.height - gridSize, 
                finalPosition.left + finalPosition.width, 
                finalPosition.top + finalPosition.height
            ]
        ];

        return { finalPosition: finalPosition, position: position };
    }

    /* Détermine si une zone est le parent direct d'une autre zone, à partir des positions de chacune d'elle représenté 
    dans un objet contenant les propriétés css sous la forme { left: 0, top: 0, width: 1920, height: 1080 } */
    const isParent = (childPosition, parentPosition) => {

        let isParent = false;

        let parentCorners = getCorners(parentPosition);

        let childCorners = getCorners(childPosition);

        if (isCornerIn(parentCorners, childCorners.tl) && isCornerIn(parentCorners, childCorners.tr)) {
            if (isCornerIn(parentCorners, childCorners.bl) && isCornerIn(parentCorners, childCorners.br)) {
                isParent = true;
            }
        }

        return isParent;
    }

    /* Détermine si le coin d'une zone est à l'intéreur d'une autre zone, à partir des coordonées de chaque coin représenté 
    dans un objet contenant les coordonées sous la forme { tl: { x: 0, y: 0 }, tr: { x: 0, y: 0 }, bl: { x: 0, y: 0 }, br: { x: 0, y: 0 } } */
    const isCornerIn = (corners, corner) => {
        let isIn = false;

        if (corners.tl.x <= corner.x && corners.tr.x >= corner.x) {
            if (corners.tl.y <= corner.y && corners.bl.y >= corner.y) {
                isIn = true;
            }
        }

        return isIn;
    }

    /* Détermine si une zone est par dessus une autre zone sans que celle-ci en soit le parent direct, à partir des positions de chacune d'elle représenté 
    dans un objet contenant les propriétés css sous la forme { left: 0, top: 0, width: 1920, height: 1080 } */
    const isOverlapping = (childPosition, parentPosition) => {

        let overlapping = false;

        let parent = getCorners(parentPosition);

        let child = getCorners(childPosition);

        // Check X axis
        if ((child.tl.x > parent.tl.x && child.tl.x < parent.tr.x) || (child.tr.x > parent.tl.x && child.tr.x < parent.tr.x) || (child.tl.x < parent.tl.x && child.tr.x > parent.tl.x)) {
            // Check Y axis
            if ((child.tl.y > parent.tl.y && child.tl.y < parent.bl.y) || (child.bl.y > parent.tl.y && child.bl.y < parent.bl.y) || (child.tl.y < parent.tl.y && child.bl.y > parent.tl.y)) {
                overlapping = true;
            }
        }

        return overlapping;
    }

    const isOverlappingOnAxis = (cornersA, cornersB, axis) => {
        let overlappingOnAxis = false;

        let corner = axis === 'x' ? 'tr' : 'bl';

        if ((cornersA.tl[axis] >= cornersB.tl[axis] && cornersA.tl[axis] < cornersB[corner][axis]) 
        || (cornersA[corner][axis] > cornersB.tl[axis] && cornersA[corner][axis] <= cornersB[corner][axis]) 
        || (cornersA.tl[axis] <= cornersB.tl[axis] && cornersA[corner][axis] >= cornersB.tl[axis])) {
            overlappingOnAxis = true;
        }

        return overlappingOnAxis;
    }

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
      };

    /* const getDefaultSlides = () => {
        let newSlides = [...DEFAULT_SLIDES];

        newSlides.forEach(slide => {
            slide.zones.forEach(zone => {
                let position = getPositions(zone.position);

                zone.position = position.position;
            });
        });

        return newSlides;
    } */


    return (
        <>
        {console.log('render')}
        <main role="main" className="w-10/12 4k:w-11/12 flex grow-0 shrink-0">
            
          <div className='w-full h-full shrink grow-0 flex flex-col bg-gray-900'>

            <div className='w-full flex shrink-0 grow-0 min-h-fit bg-gray-600 pl-6'>
                <div className="w-full items-center justify-start flex flex-row bg-gray-600">
                    <h2 className="mr-10 text-left text-3xl md:text-xl font-extrabold text-white select-none">Création</h2>
                    <div onClick={() => handleChangeCurrentTool('Cursor')} className={`h-full py-2 px-3 text-white ${currentTool === "Cursor" && !playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <CursorClickIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                    </div>
                    {/* <div onClick={() => handleChangeCurrentTool('PanZoom')} className={`h-full py-2 px-3 text-white ${currentTool === "PanZoom" && !playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <HandIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                    </div> */}
                    <div onClick={() => handleChangeCurrentTool('Text')} className={`h-full py-2 px-3 text-white ${currentTool === "Text" && !playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <MenuAlt2Icon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                    </div>
                    <div onClick={() => handleChangeCurrentTool('Image')} className={`h-full py-2 px-3 text-white ${currentTool === "Image" && !playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <PhotographIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                    </div>
                    <div onClick={() => handleChangeCurrentTool('Shape')} className={`h-full py-2 px-3 text-white ${currentTool === "Shape" && !playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <DocumentIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                    </div>
                    <div onClick={() => handleChangeCurrentTool('Video')} className={`h-full py-2 px-3 text-white ${currentTool === "Video" && !playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <FilmIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                    </div>
                </div>
                <div className="w-full items-center justify-end flex flex-row px-3 bg-gray-600">
                    {playingPreview ? 
                        <div onClick={() => handleStop()} className={`h-full py-2 px-3 text-white ${playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                            <StopIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                        </div>
                    :
                        <div onClick={() => handlePlay()} className={`h-full py-2 px-3 text-white ${playingPreview ? "bg-blue-500" : "hover:bg-gray-500 cursor-pointer"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                            <PlayIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                        </div>
                    }
                    <div onClick={() => handlePlay(true)} className={`h-full py-2 px-3 text-white hover:bg-gray-500 cursor-pointer flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <SparklesIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                    </div>
                    {/* {playingPreview ? <StopIcon onClick={() => handleStop()} className="text-white hover:text-blue-400 cursor-pointer h-7 w-7" /> : <PlayIcon onClick={() => handlePlay()} className="text-white hover:text-blue-400 cursor-pointer h-7 w-7" />}
                    <SparklesIcon onClick={() => handlePlay(true)} className={`text-white hover:text-blue-400 cursor-pointer h-7 w-7`} /> */}
                    <div className="flex flex-row items-center mt-3 lg:mt-0 ml-4">
                        <div className={"select-none rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle text-white bg-transparent border-transparent"}>
                        Animation
                        </div>
                        <div className={"select-none rounded-md m-1 px-2 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle text-gray-600 bg-transparent border-transparent"}>
                        <input type="range" id="durationAdjustment" step={0.05} className="rangeNoFill" name="durationAdjustment" min="0" max="1" onChange={e => setIntensity(Number(e.target.value))} defaultValue={intensity} />
                        </div>
                    </div>
                </div>
                <div onClick={() => handleChangeHistoryIdx(-1)} className={`h-full py-2 px-3 text-white ${changeHistoryIdx > 0 && changeHistory.length > 0 ? "text-white cursor-pointer hover:bg-gray-500" : "text-gray-400 pointer-events-none"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <ArrowCircleLeftIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                </div>
                <div onClick={() => handleChangeHistoryIdx(1)} className={`h-full py-2 px-3 text-white ${changeHistoryIdx < changeHistory.length - 1 && changeHistory.length > 0 ? "text-white cursor-pointer hover:bg-gray-500" : "text-gray-400 pointer-events-none"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <ArrowCircleRightIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                </div>
                <div onClick={() => handleSaveSlide(currentSlide.id, currentSlide)} className={`h-full py-2 px-3 ${!isSaved ? "bg-red-600 cursor-pointer text-white" : "text-gray-400 pointer-events-none"} flex items-center transition duration-150 ease-in-out delay-0 group`}>
                        <SaveIcon className={`h-6 w-6 pointer-events-none transition duration-150 ease-in-out delay-0 group-hover:scale-110`} />
                </div>
            </div>
                
            <div className={`w-full h-full flex flex-row items-center justify-center bg-gray-900 overflow-hidden ${currentTool === 'PanZoom' ? 'cursor-grab' : ''}`} /* ref={(el) => {if (container === null) setContainer(el)}} {...panZoomHandlers} */ ref={thumbPreviewContainer} >

            {thumbPreviewContainer.current && thumbPreviewContainerWidth > 0 && thumbPreviewWidth > 0 &&
                <div className={`${currentTool === 'PanZoom' ? 'pointer-events-none' : ''}`} style={{ width: thumbPreviewWidth, height: thumbPreviewWidth / 16 * 9 }} /* style={{ transform }} */>
                    <div id="thumbPreview" className={`w-full h-full relative bg-white overflow-hidden rounded ${currentTool === 'PanZoom' ? 'pointer-events-none' : ''}`} ref={thumbPreview} >
                        {/* {thumbPreview.current && thumbPreviewWidth > 0 && 

                            <> */}
                                <div className={`absolute z-10 top-0 left-0 h-full w-full ${currentTool !== 'Cursor' ? 'pointer-events-none' : ''}`}>
                                    {zones === null ? currentSlide.zones.map((zone, index) => {
                                        if (zone.finalPosition) {
                                            return <Zone mouseRef={thumbPreview} zone={zone} key={zone.id} index={index} gridSize={gridSize} onClick={handleSelectedZone} onMouseEnter={handleHoveredZone} onMouseLeave={setHoveredZoneId} isDisabled={playingPreview || currentTool !== 'Cursor' || (selectedZoneId !== null && selectedZoneId !== zone.id && hoveredZoneId === selectedZoneId) || isDragging} isPlaying={playingPreview} isSelected={selectedZoneId === zone.id} isHovered={hoveredZoneId === zone.id} onChange={handleChangeZone} adjusmentWidth={thumbPreviewWidth} /* mouseX={mouse.x} mouseY={mouse.y} mouseDown={mouse.isDown} mouseHover={mouse.isOver} */ />
                                            /* <Zone mouseRef={thumbPreview} zone={zone} key={zone.id} index={index} onClick={handleSelectedZone} onMouseEnter={handleHoveredZone} onMouseLeave={setHoveredZoneId} isDisabled={playingPreview || currentTool !== 'Cursor' || (selectedZoneId !== null && selectedZoneId !== zone.id && hoveredZoneId === selectedZoneId)} isPlaying={playingPreview} isSelected={selectedZoneId === zone.id} isHovered={hoveredZoneId === zone.id} onChange={handleChangeZone} adjusmentWidth={thumbPreviewWidth} mouseX={mouse.x} mouseY={mouse.y} mouseDown={mouse.isDown} mouseHover={mouse.isOver} /> */
                                        }

                                        return <></>
                                    })
                                    :
                                    zones.map((zone, index) => {
                                        if (zone.finalPosition) {
                                            return <ZoneContent zone={zone} key={`preview-${zone.id}`} isPreview={true} adjusmentWidth={thumbPreviewWidth} />
                                            {/* <Zone zone={zone} key={zone.id} index={index} gridSize={gridSize} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} isDisabled={true} isPlaying={true} isSelected={false} isHovered={false} onChange={() => {}} adjusmentWidth={thumbPreviewWidth} mouseX={0} mouseY={0} mouseDown={false} mouseHover={false} /> */}
                                        }

                                        return <></>
                                    })}
                                </div>
                                {/* <div className={`absolute z-20 top-0 left-0 h-full w-full pointer-events-none ${currentTool === 'Cursor' && hoveredZoneId !== selectedZoneId && selectedZoneId !== null ? '' : 'hidden'}`}>
                                    <button ref={hoverZoneRef} onMouseEnter={() => setHoveredZoneId(selectedZoneId)} className={`${currentTool !== 'Cursor' ? 'pointer-events-none' : 'pointer-events-auto'}`} style={{ position: "absolute", left: getComputedPixelSize(selectedZoneId !== null ? currentZone.finalPosition.left : 0), top: getComputedPixelSize(selectedZoneIdx !== null ? currentZone.finalPosition.top : 0), width: getComputedPixelSize(selectedZoneIdx !== null ? currentZone.finalPosition.width : 0), height: getComputedPixelSize(selectedZoneIdx !== null ? currentZone.finalPosition.height : 0) }}></button>
                                </div> */}
                                <div className={`absolute z-20 top-0 left-0 h-full w-full ${currentTool !== 'Cursor' && currentTool !== 'PanZoom' ? '' : 'hidden'}`}>
                                    {/* {currentZone !== null && currentZone.id === 0 && <div key={'tempZone-key'} style={{ position: "absolute", left: getComputedPixelSize(currentZone.finalPosition.left), top: getComputedPixelSize(currentZone.finalPosition.top), width: getComputedPixelSize(currentZone.finalPosition.width), height: getComputedPixelSize(currentZone.finalPosition.height) }} className='bg-blue-500 opacity-40 z-0 pointer-event-none rounded-sm'></div>} */}
                                    {currentTool !== 'Cursor' && currentTool !== 'PanZoom' && !isDragging && <VirtualGrid gridSize={gridSize} mouseRef={thumbPreview} hidden={playingPreview} adjusmentWidth={thumbPreviewWidth} onClick={handleCreateNewZone} onHover={handleCreateNewZone} />}
                                    {/* {currentTool !== 'Cursor' && currentTool !== 'PanZoom' && <VirtualGrid mouseRef={thumbPreview} hidden={playingPreview ? true : !mouse.isOver} x={mouse.x / (zoom ? zoom : 1)} y={mouse.y / (zoom ? zoom : 1)} adjusmentWidth={thumbPreviewWidth} onClick={handleCreateNewZone} isDown={mouse.isDown} onHover={handleCreateNewZone} />} */}
                                    {/* {currentTool === 'PanZoom' && <div className={`absolute top-0 left-0 w-full h-full ${currentTool === 'PanZoom' ? 'pointer-events-auto' : 'hidden'}`} ref={(el) => setContainer(el)} {...panZoomHandlers}></div>} */}
                                </div>
                            {/* </>

                        } */}
                    </div>
                </div>}

                {/* {currentTool === 'PanZoom' && <div className={`absolute top-0 left-0 w-full h-full ${currentTool === 'PanZoom' ? 'pointer-events-auto' : 'hidden'}`} ref={(el) => setContainer(el)} {...panZoomHandlers}></div>} */}

            </div>
            <div className='w-full flex flex-row shrink-0 min-h-fit bg-gray-600 overflow-x-scroll flex-nowrap'>

                <DragDropContext onDragEnd={result => handleDragEnd(result, 'slides')} onDragStart={handleDragStart}>
                    <Droppable droppableId="slides" direction="horizontal">
                        {(provided) => (
                        <div className='grid grid-flow-col auto-cols-max px-4 pt-4 pb-2' ref={provided.innerRef} {...provided.droppableProps}> {/* grid grid-flow-col auto-cols-max */}
                                    {slides.map((slide, index) => {
                                            return <Draggable draggableId={`slide-${slide.id}`} key={`slide-${slide.id}`} index={index}>
                                                {(provided) => (
                                                    <div className='relative flex flex-row'  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style, height: smallThumbPreviewWidth / 16 * 9 }}>
                                                        <div className='w-6 hover:w-16 h-full flex flex-col group items-center justify-center transition delay-150 duration-300 ease-in-out transition-all opacity-0 hover:opacity-100'>
                                                            <div onClick={() => handleAddSlide(index)} className='pointer-events-none group-hover:pointer-events-auto flex w-0 group-hover:w-12 h-full rounded cursor-pointer flex-col group items-center justify-center border-2 border-lime-500 transition delay-150 duration-300 ease-in-out transition-all'>
                                                                <PlusIcon className={`h-6 w-0 group-hover:w-6 pointer-events-none text-lime-500 transition delay-150 duration-300 ease-in-out transition-all`} />
                                                            </div>
                                                        </div>
                                                        <div /* key={`slide-${slide.id}`} */ onClick={() => handleEditSlide(slide)} className={`transition duration-300 ease-in-out delay-0 hover:scale-105 relative bg-white w-48 rounded cursor-pointer ${false ? 'ring-2 ring-red-700 ring-offset-2 ring-offset-gray-600' : ''} ${currentSlide.id === slide.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-600' : ''/* 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 hover:ring-offset-gray-900' */}`}>
                                                            {/* <div className='absolute top-0 z-30 -left-6 w-6 h-full cursor-pointer pointer-events-auto flex flex-col items-center justify-center'>
                                                                <div className='w-1 rounded-full bg-lime-500 h-full cursor-pointer '></div>
                                                                <div className='absolute mx-auto -left-1 w-8 h-8 rounded-full bg-lime-500 cursor-pointer flex flex-col items-center justify-center'>
                                                                    <PlusCircleIcon className={`h-8 w-8 pointer-events-none text-gray-600`} />
                                                                </div>
                                                            </div> */}
                                                            <div className={`z-50 group absolute bottom-0 right-0 p-1 m-1 bg-gray-100 opacity-50 hover:opacity-100 ${currentSlide.id === slide.id ? '' : 'hidden'}`}>
                                                                <TrashIcon key={`slide-${slide.id}-trash`} onClick={(e) => { e.stopPropagation(); handleDeleteSlide(slide.id)}} className={`h-5 w-5 text-gray-600 group-hover:text-red-600 cursor-pointer`} />
                                                            </div>
                                                            {smallThumbPreview.current && smallThumbPreviewWidth > 0 && 
                                                                <div className={`absolute z-10 top-0 left-0 overflow-hidden h-full bg-white rounded w-full pointer-events-none`}>
                                                                    {slide.zones.map((zone, index) => {
                                                                        if (zone.finalPosition) {
                                                                            return <ZoneContent zone={zone} key={`slide-${slide.id}-smallpreview-${zone.id}`} isPreview={true} adjusmentWidth={smallThumbPreviewWidth} />;
                                                                            {/* <Zone zone={zone} key={`slide-${slide.id}-${zone.id}`} index={index} gridSize={gridSize} onClick={() => {}} onMouseEnter={() => {}} onMouseLeave={() => {}} isDisabled={true} isPlaying={true} isSelected={false} isHovered={false} onChange={() => {}} adjusmentWidth={smallThumbPreviewWidth} mouseX={0} mouseY={0} mouseDown={false} mouseHover={false} /> */}
                                                                        }

                                                                        return <></>
                                                                    })}
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                    })}
                            {provided.placeholder}
                            <div className='w-48 h-full flex flex-col group items-start justify-center transition delay-150 duration-300 ease-in-out transition-all opacity-0 hover:opacity-100' ref={smallThumbPreview} >
                                <div onClick={() => handleAddSlide()} className='pointer-events-none group-hover:pointer-events-auto flex w-full mx-2 h-full rounded cursor-pointer flex-col items-center justify-center border-2 border-lime-500'>
                                    <PlusIcon className={`h-6 w-6 pointer-events-none text-lime-500`} />
                                </div>
                            </div>
                        </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
          </div>
        </main>
        <div className="z-50 w-full 4k:w-1/12 flex grow-0 bg-gray-700 shadow-md shadow-gray-900/50 overflow-y-scroll">
            <div className='w-full shrink-0 h-full pl-4 pr-3 pt-2 pb-4'>
                    
            
            <div className="flex sm:flex-col">
                <DragDropContext onDragEnd={result => handleDragEnd(result, 'zones')} onDragStart={handleDragStart}>
                    <Droppable droppableId="zones">
                        {(provided) => (
                        <div className="flex flex-col space-y-3" ref={provided.innerRef} {...provided.droppableProps}>
                            {currentSlide.zones.length > 1 ? <h2 className="text-left text-3xl md:text-xl font-extrabold text-white select-none">Éléments&nbsp;<span className='font-normal'>{` (${currentSlide.zones.length})`}</span></h2> : <h2 className="text-left text-3xl md:text-xl font-extrabold text-white select-none">{`Élément`}</h2>}
                            {currentSlide.zones.map((zone, index) => {
                                const { position, type, animations, finalPosition, sequence, id } = zone;
                                if (finalPosition) {
                                    return <Draggable draggableId={`zone-${id}`} key={`slide-${currentSlide.id}-zonesList-${id}`} index={index}>
                                            {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`transition duration-200 ease-in-out delay-0 hover:scale-105 bg-white pointer-events-auto rounded-sm w-full text-sm flex flex-col items-center ${selectedZoneId === id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-700' : hoveredZoneId === id ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-gray-700' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 hover:ring-offset-gray-700'}`}>
                                                <div disabled={isDragging} className={`py-2 px-2 w-full text-sm flex flex-col space-y-2 items-center`} onClick={() => handleSelectedZone(zone)} /* onMouseEnter={() => setHoveredZoneId(id)} onMouseLeave={() => setHoveredZoneId(null)} */>
                                                    <div className='w-full text-sm flex flex-row items-center'>
                                                        <div className='mr-3' >
                                                            {type === toolTypes.Text && <MenuAlt2Icon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                            {type === toolTypes.Image && <PhotographIcon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                            {type === toolTypes.Shape && <DocumentIcon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                            {type === toolTypes.Video && <FilmIcon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                        </div>
                                                        <div className='w-full text-left pointer-events-none'>{zoneTypes[type]}</div>
                                                        <div className='ml-3'>
                                                            <TrashIcon key={`slide-${currentSlide.id}-zonesList-${id}-trash`} onClick={(e) => { e.stopPropagation(); handleDeleteZone(id)}} className={`h-4 w-4 text-gray-400 hover:text-red-600 cursor-pointer`} />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                            )}
                                        </Draggable>

                                }

                                return <></>
                            })}
                            {provided.placeholder}
                            <div className='w-full h-3'>
                            </div>
                        </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>
            </div>
        </div>
        </>
    );
}

const VirtualGrid = props => {

    /* const gridSize = 24; */

    const [mouseDown, setMouseDown] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState(null);
    const [tempPositions, setTempPositions] = useState(null);
    const [computedGridSize, setComputedGridSize] = useState(props.gridSize);

    useEffect(() => {
        setComputedGridSize(getComputedPixelSize(props.gridSize))
    }, [props.adjusmentWidth])

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = props.adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    const mouse = useMouse(props.mouseRef, { fps: 120 });

    const getRealPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = props.adjusmentWidth;

        computedPixelSize = 1920 / currentThumbPreviewWidth * pixel;

        return computedPixelSize;
    }

    const handleClick = (event) => {
        if (event.button === 0) {
            props.onClick(mouse.x, mouse.y, true);
            handleTempFinalPosition(mouse.x, mouse.y);
            setIsDrawing(true);
        }
    }

    const getPositions = (position) => {

        /* const gridSize = 24; */

        if (position[0][0] <= position[1][2] && position[0][1] <= position[1][3]) {
            position = [position[0], position[1]];
        } else {
            position = [position[1], position[0]];
        }

        let finalPosition = {
            left: position[0][0] < position[1][0] ? position[0][0] : position[1][0], 
            top: position[0][1] < position[1][1] ? position[0][1] : position[1][1], 
            width: position[1][2] > position[0][0] ? position[1][2] - position[0][0] : position[0][2] - position[1][0], 
            height: position[1][3] > position[0][1] ? position[1][3] - position[0][1] : position[0][3] - position[1][1]
        }

        position = [
            [
                finalPosition.left, 
                finalPosition.top, 
                finalPosition.left + props.gridSize, 
                finalPosition.top + props.gridSize
            ], 
            [
                finalPosition.left + finalPosition.width - props.gridSize, 
                finalPosition.top + finalPosition.height - props.gridSize, 
                finalPosition.left + finalPosition.width, 
                finalPosition.top + finalPosition.height
            ]
        ];

        return { finalPosition: finalPosition, position: position };
    }

    const handleTempFinalPosition = (mouseX, mouseY) => {

        /* const gridSize = 24; */

        let realX = getRealPixelSize(mouseX);
        let realY = getRealPixelSize(mouseY);

        let x = realX - realX % props.gridSize;
        let y = realY - realY % props.gridSize;

        let square = [ x, y, x + props.gridSize, y + props.gridSize ];

        let newTempFinalPosition = null;

        if (tempPositions === null) {
            newTempFinalPosition = getPositions([square, square]);
            setTempPositions(newTempFinalPosition);
        } else {
            newTempFinalPosition = getPositions([tempPositions.position[0], square]);
            setTempPositions({ ...tempPositions, finalPosition: newTempFinalPosition.finalPosition});
        }
    }

    useEffect(() => {
        if (!props.hidden && mouse.isOver && isDrawing) {
            if (mouse.isDown) {
                setMouseDown(true);    
                /* props.onHover(mouse.x, mouse.y, true); */
                handleTempFinalPosition(mouse.x, mouse.y);
                setLastMousePosition({ x: mouse.x, y: mouse.y});
            } else if (mouseDown && !mouse.isDown) {
                setMouseDown(false);
                props.onClick(mouse.x, mouse.y, false);
                setTempPositions(null);
                setIsDrawing(false);
                setLastMousePosition(null)
            } else if (!mouse.isDown) {
                setMouseDown(false);
                /* props.onClick(lastMousePosition.x, lastMousePosition.y, false); */
                if (lastMousePosition !== null) {
                    handleTempFinalPosition(lastMousePosition.x, lastMousePosition.y);
                } else {
                    setMouseDown(false);
                    props.onClick(mouse.x, mouse.y, false);
                    setTempPositions(null);
                    setLastMousePosition(null)
                }
                setIsDrawing(false);
            }
        } else {
            if (mouseDown) {
                setMouseDown(false);
            }
        }
    }, [mouse.isDown, mouse.isOver, props.hidden, mouse.x, mouse.y]);



    return <>
    <button className={`w-full h-full pointer-events-auto z-10 ${props.hidden || !mouse.isOver ? 'hidden' : ''}`} onMouseDown={(event) => handleClick(event)}>
        <div className='bg-blue-500 rounded-sm cursor-pointer pointer-events-none'  /* onMouseUp={() => props.onClick(props.x, props.y)} */ style={{ position: "absolute", 
            left: mouse.x - mouse.x % computedGridSize, 
            top: mouse.y - mouse.y % computedGridSize, 
            width: computedGridSize, 
            height: computedGridSize }} ></div>
    </button>
    {tempPositions !== null && <div key={'tempZone-key'} style={{ position: "absolute", left: getComputedPixelSize(tempPositions.finalPosition.left), top: getComputedPixelSize(tempPositions.finalPosition.top), width: getComputedPixelSize(tempPositions.finalPosition.width), height: getComputedPixelSize(tempPositions.finalPosition.height) }} className='bg-blue-500 opacity-40 z-0 pointer-event-none rounded-sm'></div>}
    </>

}

const VirtualGridOLD = props => {

    const gridSize = 24;

    const [mouseDown, setMouseDown] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0});

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = props.adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    const mouse = useMouse(props.mouseRef, { fps: 30 });

    const getRealPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = props.adjusmentWidth;

        computedPixelSize = 1920 / currentThumbPreviewWidth * pixel;

        return computedPixelSize;
    }

    useEffect(() => {
        if (!props.hidden) {
            if (props.isDown) {
                setMouseDown(true);
                /* let realX = getRealPixelSize(props.x);
                let realY = getRealPixelSize(props.y);
    
                let x = realX - realX % gridSize;
                let y = realY - realY % gridSize;
        
                let square = [ x, y, x + gridSize, y + gridSize ]; */
    
                props.onHover(props.x, props.y, true);
                setIsDrawing(true);
                setLastMousePosition({ x: props.x, y: props.y});
            } else if (mouseDown && !props.isDown) {
                setMouseDown(false);
                props.onClick(props.x, props.y, false);
                setIsDrawing(false);
            } else if (!props.isDown) {
                setMouseDown(false);
                props.onClick(lastMousePosition.x, lastMousePosition.y, false);
                setIsDrawing(false);
            }
        } else {
            setMouseDown(false);
        }
    }, [props.isDown, props.hidden, props.x, props.y]);



    return <button className={`w-full h-full pointer-events-auto z-10 ${props.hidden ? 'hidden' : ''}`} onMouseDown={(event) => {if (event.button === 0) props.onClick(props.x, props.y, true)}}><div className='bg-blue-600 rounded-sm cursor-pointer pointer-events-none'  /* onMouseUp={() => props.onClick(props.x, props.y)} */ style={{ position: "absolute", 
    left: props.x - props.x % getComputedPixelSize(gridSize), 
    top: props.y - props.y % getComputedPixelSize(gridSize), 
    width: getComputedPixelSize(gridSize), 
    height: getComputedPixelSize(gridSize) }} ></div></button>
}

export default LayoutToolV2;