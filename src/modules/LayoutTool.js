import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MenuAlt2Icon, PhotographIcon, FilmIcon, DocumentIcon, CursorClickIcon, TrashIcon, SparklesIcon, ArrowSmUpIcon, ArrowSmDownIcon, ArrowSmLeftIcon, ArrowSmRightIcon, PlayIcon, StopIcon } from '@heroicons/react/outline'

import { useMediaQuery } from 'react-responsive';

import FcmBd from './dataSource/FcmBd';

import { gsap } from "gsap";

import { Slide, ListeDeroulante, ZoneEditor } from '../components';

import useMouse from '@react-hook/mouse-position'

import { csv2json } from 'csvjson-csv2json';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const layoutMatrix = [
    [30,30,48,48],[72,30,108,48],[132,30,168,48],[192,30,228,48],[252,30,288,48],[312,30,348,48],[372,30,408,48],[432,30,468,48],[492,30,528,48],[552,30,588,48],[612,30,648,48],[672,30,708,48],[732,30,768,48],[792,30,828,48],[852,30,888,48],[912,30,948,48],[972,30,1008,48],[1032,30,1068,48],[1092,30,1128,48],[1152,30,1188,48],[1212,30,1248,48],[1272,30,1308,48],[1332,30,1368,48],[1392,30,1428,48],[1452,30,1488,48],[1512,30,1548,48],[1572,30,1608,48],[1632,30,1668,48],[1692,30,1728,48],[1752,30,1788,48],[1812,30,1848,48],[1872,30,1890,48],
    [30,72,48,108],[72,72,108,108],[132,72,168,108],[192,72,228,108],[252,72,288,108],[312,72,348,108],[372,72,408,108],[432,72,468,108],[492,72,528,108],[552,72,588,108],[612,72,648,108],[672,72,708,108],[732,72,768,108],[792,72,828,108],[852,72,888,108],[912,72,948,108],[972,72,1008,108],[1032,72,1068,108],[1092,72,1128,108],[1152,72,1188,108],[1212,72,1248,108],[1272,72,1308,108],[1332,72,1368,108],[1392,72,1428,108],[1452,72,1488,108],[1512,72,1548,108],[1572,72,1608,108],[1632,72,1668,108],[1692,72,1728,108],[1752,72,1788,108],[1812,72,1848,108],[1872,72,1890,108],
    [30,132,48,168],[72,132,108,168],[132,132,168,168],[192,132,228,168],[252,132,288,168],[312,132,348,168],[372,132,408,168],[432,132,468,168],[492,132,528,168],[552,132,588,168],[612,132,648,168],[672,132,708,168],[732,132,768,168],[792,132,828,168],[852,132,888,168],[912,132,948,168],[972,132,1008,168],[1032,132,1068,168],[1092,132,1128,168],[1152,132,1188,168],[1212,132,1248,168],[1272,132,1308,168],[1332,132,1368,168],[1392,132,1428,168],[1452,132,1488,168],[1512,132,1548,168],[1572,132,1608,168],[1632,132,1668,168],[1692,132,1728,168],[1752,132,1788,168],[1812,132,1848,168],[1872,132,1890,168],
    [30,192,48,228],[72,192,108,228],[132,192,168,228],[192,192,228,228],[252,192,288,228],[312,192,348,228],[372,192,408,228],[432,192,468,228],[492,192,528,228],[552,192,588,228],[612,192,648,228],[672,192,708,228],[732,192,768,228],[792,192,828,228],[852,192,888,228],[912,192,948,228],[972,192,1008,228],[1032,192,1068,228],[1092,192,1128,228],[1152,192,1188,228],[1212,192,1248,228],[1272,192,1308,228],[1332,192,1368,228],[1392,192,1428,228],[1452,192,1488,228],[1512,192,1548,228],[1572,192,1608,228],[1632,192,1668,228],[1692,192,1728,228],[1752,192,1788,228],[1812,192,1848,228],[1872,192,1890,228],
    [30,252,48,288],[72,252,108,288],[132,252,168,288],[192,252,228,288],[252,252,288,288],[312,252,348,288],[372,252,408,288],[432,252,468,288],[492,252,528,288],[552,252,588,288],[612,252,648,288],[672,252,708,288],[732,252,768,288],[792,252,828,288],[852,252,888,288],[912,252,948,288],[972,252,1008,288],[1032,252,1068,288],[1092,252,1128,288],[1152,252,1188,288],[1212,252,1248,288],[1272,252,1308,288],[1332,252,1368,288],[1392,252,1428,288],[1452,252,1488,288],[1512,252,1548,288],[1572,252,1608,288],[1632,252,1668,288],[1692,252,1728,288],[1752,252,1788,288],[1812,252,1848,288],[1872,252,1890,288],
    [30,312,48,348],[72,312,108,348],[132,312,168,348],[192,312,228,348],[252,312,288,348],[312,312,348,348],[372,312,408,348],[432,312,468,348],[492,312,528,348],[552,312,588,348],[612,312,648,348],[672,312,708,348],[732,312,768,348],[792,312,828,348],[852,312,888,348],[912,312,948,348],[972,312,1008,348],[1032,312,1068,348],[1092,312,1128,348],[1152,312,1188,348],[1212,312,1248,348],[1272,312,1308,348],[1332,312,1368,348],[1392,312,1428,348],[1452,312,1488,348],[1512,312,1548,348],[1572,312,1608,348],[1632,312,1668,348],[1692,312,1728,348],[1752,312,1788,348],[1812,312,1848,348],[1872,312,1890,348],
    [30,372,48,408],[72,372,108,408],[132,372,168,408],[192,372,228,408],[252,372,288,408],[312,372,348,408],[372,372,408,408],[432,372,468,408],[492,372,528,408],[552,372,588,408],[612,372,648,408],[672,372,708,408],[732,372,768,408],[792,372,828,408],[852,372,888,408],[912,372,948,408],[972,372,1008,408],[1032,372,1068,408],[1092,372,1128,408],[1152,372,1188,408],[1212,372,1248,408],[1272,372,1308,408],[1332,372,1368,408],[1392,372,1428,408],[1452,372,1488,408],[1512,372,1548,408],[1572,372,1608,408],[1632,372,1668,408],[1692,372,1728,408],[1752,372,1788,408],[1812,372,1848,408],[1872,372,1890,408],
    [30,432,48,468],[72,432,108,468],[132,432,168,468],[192,432,228,468],[252,432,288,468],[312,432,348,468],[372,432,408,468],[432,432,468,468],[492,432,528,468],[552,432,588,468],[612,432,648,468],[672,432,708,468],[732,432,768,468],[792,432,828,468],[852,432,888,468],[912,432,948,468],[972,432,1008,468],[1032,432,1068,468],[1092,432,1128,468],[1152,432,1188,468],[1212,432,1248,468],[1272,432,1308,468],[1332,432,1368,468],[1392,432,1428,468],[1452,432,1488,468],[1512,432,1548,468],[1572,432,1608,468],[1632,432,1668,468],[1692,432,1728,468],[1752,432,1788,468],[1812,432,1848,468],[1872,432,1890,468],
    [30,492,48,528],[72,492,108,528],[132,492,168,528],[192,492,228,528],[252,492,288,528],[312,492,348,528],[372,492,408,528],[432,492,468,528],[492,492,528,528],[552,492,588,528],[612,492,648,528],[672,492,708,528],[732,492,768,528],[792,492,828,528],[852,492,888,528],[912,492,948,528],[972,492,1008,528],[1032,492,1068,528],[1092,492,1128,528],[1152,492,1188,528],[1212,492,1248,528],[1272,492,1308,528],[1332,492,1368,528],[1392,492,1428,528],[1452,492,1488,528],[1512,492,1548,528],[1572,492,1608,528],[1632,492,1668,528],[1692,492,1728,528],[1752,492,1788,528],[1812,492,1848,528],[1872,492,1890,528],
    [30,552,48,588],[72,552,108,588],[132,552,168,588],[192,552,228,588],[252,552,288,588],[312,552,348,588],[372,552,408,588],[432,552,468,588],[492,552,528,588],[552,552,588,588],[612,552,648,588],[672,552,708,588],[732,552,768,588],[792,552,828,588],[852,552,888,588],[912,552,948,588],[972,552,1008,588],[1032,552,1068,588],[1092,552,1128,588],[1152,552,1188,588],[1212,552,1248,588],[1272,552,1308,588],[1332,552,1368,588],[1392,552,1428,588],[1452,552,1488,588],[1512,552,1548,588],[1572,552,1608,588],[1632,552,1668,588],[1692,552,1728,588],[1752,552,1788,588],[1812,552,1848,588],[1872,552,1890,588],
    [30,612,48,648],[72,612,108,648],[132,612,168,648],[192,612,228,648],[252,612,288,648],[312,612,348,648],[372,612,408,648],[432,612,468,648],[492,612,528,648],[552,612,588,648],[612,612,648,648],[672,612,708,648],[732,612,768,648],[792,612,828,648],[852,612,888,648],[912,612,948,648],[972,612,1008,648],[1032,612,1068,648],[1092,612,1128,648],[1152,612,1188,648],[1212,612,1248,648],[1272,612,1308,648],[1332,612,1368,648],[1392,612,1428,648],[1452,612,1488,648],[1512,612,1548,648],[1572,612,1608,648],[1632,612,1668,648],[1692,612,1728,648],[1752,612,1788,648],[1812,612,1848,648],[1872,612,1890,648],
    [30,672,48,708],[72,672,108,708],[132,672,168,708],[192,672,228,708],[252,672,288,708],[312,672,348,708],[372,672,408,708],[432,672,468,708],[492,672,528,708],[552,672,588,708],[612,672,648,708],[672,672,708,708],[732,672,768,708],[792,672,828,708],[852,672,888,708],[912,672,948,708],[972,672,1008,708],[1032,672,1068,708],[1092,672,1128,708],[1152,672,1188,708],[1212,672,1248,708],[1272,672,1308,708],[1332,672,1368,708],[1392,672,1428,708],[1452,672,1488,708],[1512,672,1548,708],[1572,672,1608,708],[1632,672,1668,708],[1692,672,1728,708],[1752,672,1788,708],[1812,672,1848,708],[1872,672,1890,708],
    [30,732,48,768],[72,732,108,768],[132,732,168,768],[192,732,228,768],[252,732,288,768],[312,732,348,768],[372,732,408,768],[432,732,468,768],[492,732,528,768],[552,732,588,768],[612,732,648,768],[672,732,708,768],[732,732,768,768],[792,732,828,768],[852,732,888,768],[912,732,948,768],[972,732,1008,768],[1032,732,1068,768],[1092,732,1128,768],[1152,732,1188,768],[1212,732,1248,768],[1272,732,1308,768],[1332,732,1368,768],[1392,732,1428,768],[1452,732,1488,768],[1512,732,1548,768],[1572,732,1608,768],[1632,732,1668,768],[1692,732,1728,768],[1752,732,1788,768],[1812,732,1848,768],[1872,732,1890,768],
    [30,792,48,828],[72,792,108,828],[132,792,168,828],[192,792,228,828],[252,792,288,828],[312,792,348,828],[372,792,408,828],[432,792,468,828],[492,792,528,828],[552,792,588,828],[612,792,648,828],[672,792,708,828],[732,792,768,828],[792,792,828,828],[852,792,888,828],[912,792,948,828],[972,792,1008,828],[1032,792,1068,828],[1092,792,1128,828],[1152,792,1188,828],[1212,792,1248,828],[1272,792,1308,828],[1332,792,1368,828],[1392,792,1428,828],[1452,792,1488,828],[1512,792,1548,828],[1572,792,1608,828],[1632,792,1668,828],[1692,792,1728,828],[1752,792,1788,828],[1812,792,1848,828],[1872,792,1890,828],
    [30,852,48,888],[72,852,108,888],[132,852,168,888],[192,852,228,888],[252,852,288,888],[312,852,348,888],[372,852,408,888],[432,852,468,888],[492,852,528,888],[552,852,588,888],[612,852,648,888],[672,852,708,888],[732,852,768,888],[792,852,828,888],[852,852,888,888],[912,852,948,888],[972,852,1008,888],[1032,852,1068,888],[1092,852,1128,888],[1152,852,1188,888],[1212,852,1248,888],[1272,852,1308,888],[1332,852,1368,888],[1392,852,1428,888],[1452,852,1488,888],[1512,852,1548,888],[1572,852,1608,888],[1632,852,1668,888],[1692,852,1728,888],[1752,852,1788,888],[1812,852,1848,888],[1872,852,1890,888],
    [30,912,48,948],[72,912,108,948],[132,912,168,948],[192,912,228,948],[252,912,288,948],[312,912,348,948],[372,912,408,948],[432,912,468,948],[492,912,528,948],[552,912,588,948],[612,912,648,948],[672,912,708,948],[732,912,768,948],[792,912,828,948],[852,912,888,948],[912,912,948,948],[972,912,1008,948],[1032,912,1068,948],[1092,912,1128,948],[1152,912,1188,948],[1212,912,1248,948],[1272,912,1308,948],[1332,912,1368,948],[1392,912,1428,948],[1452,912,1488,948],[1512,912,1548,948],[1572,912,1608,948],[1632,912,1668,948],[1692,912,1728,948],[1752,912,1788,948],[1812,912,1848,948],[1872,912,1890,948],
    [30,972,48,1008],[72,972,108,1008],[132,972,168,1008],[192,972,228,1008],[252,972,288,1008],[312,972,348,1008],[372,972,408,1008],[432,972,468,1008],[492,972,528,1008],[552,972,588,1008],[612,972,648,1008],[672,972,708,1008],[732,972,768,1008],[792,972,828,1008],[852,972,888,1008],[912,972,948,1008],[972,972,1008,1008],[1032,972,1068,1008],[1092,972,1128,1008],[1152,972,1188,1008],[1212,972,1248,1008],[1272,972,1308,1008],[1332,972,1368,1008],[1392,972,1428,1008],[1452,972,1488,1008],[1512,972,1548,1008],[1572,972,1608,1008],[1632,972,1668,1008],[1692,972,1728,1008],[1752,972,1788,1008],[1812,972,1848,1008],[1872,972,1890,1008],
    [30,1032,48,1050],[72,1032,108,1050],[132,1032,168,1050],[192,1032,228,1050],[252,1032,288,1050],[312,1032,348,1050],[372,1032,408,1050],[432,1032,468,1050],[492,1032,528,1050],[552,1032,588,1050],[612,1032,648,1050],[672,1032,708,1050],[732,1032,768,1050],[792,1032,828,1050],[852,1032,888,1050],[912,1032,948,1050],[972,1032,1008,1050],[1032,1032,1068,1050],[1092,1032,1128,1050],[1152,1032,1188,1050],[1212,1032,1248,1050],[1272,1032,1308,1050],[1332,1032,1368,1050],[1392,1032,1428,1050],[1452,1032,1488,1050],[1512,1032,1548,1050],[1572,1032,1608,1050],[1632,1032,1668,1050],[1692,1032,1728,1050],[1752,1032,1788,1050],[1812,1032,1848,1050],[1872,1032,1890,1050]
];

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

const grayScale = [
    "bg-gray-100",
    "bg-gray-200",
    "bg-gray-300",
    "bg-gray-400",
    "bg-gray-500",
    "bg-gray-600",
    "bg-gray-700",
    "bg-gray-800",
    "bg-gray-900",
]

const toolTypes = {
    Cursor: 0,
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

const animationProperties = {
    1: { start: { x: 100 }, end: { x: 0 } },
    2: { start: { y: 100 }, end: { y: 0 } },
    3: { start: { y: -100 }, end: { y: 0 } },
    4: { start: { x: -100 }, end: { x: 0 } }
}

const DATASETS = ['Création libre', 'Simple Layout', 'Multi Pictures', 'News'];

const templates = {
    'Création libre': [],
    'Simple Layout': [{"id":"Shape-1","type":3,"position":[[0,0,24,24],[696,1056,720,1080]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":0,"top":0,"width":720,"height":1080}},{"id":"Shape-2","type":3,"position":[[1896,0,1920,24],[720,1056,744,1080]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":720,"top":0,"width":1200,"height":1080}},{"id":"Image-7","type":2,"position":[[744,24,768,48],[1296,504,1320,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1598635416326-ff055cbb02cb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":744,"top":24,"width":576,"height":504}},{"id":"Image-8","type":2,"position":[[1872,24,1896,48],[1344,504,1368,528]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80","finalPosition":{"left":1344,"top":24,"width":552,"height":504}},{"id":"Image-9","type":2,"position":[[744,552,768,576],[1296,1032,1320,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":744,"top":552,"width":576,"height":504}},{"id":"Image-10","type":2,"position":[[1344,552,1368,576],[1872,1032,1896,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644869432047-fa8bdbe849cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80","finalPosition":{"left":1344,"top":552,"width":552,"height":504}},{"id":"Text-11","type":1,"position":[[24,48,48,72],[672,168,696,192]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":48,"width":672,"height":144}},{"id":"Text-12","type":1,"position":[[24,216,48,240],[672,1032,696,1056]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1567637903900-7a2f05e37e1a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":24,"top":216,"width":672,"height":840}}],
    'Multi Pictures': [{"id":"Shape-1","type":3,"position":[[0,0,24,24],[1896,1056,1920,1080]],"sequence":1,"animations":[],"finalPosition":{"left":0,"top":0,"width":1920,"height":1080}},{"id":"Image-2","type":2,"position":[[24,24,48,48],[672,240,696,264]],"sequence":1,"animations":[],"finalPosition":{"left":24,"top":24,"width":672,"height":240}},{"id":"Image-3","type":2,"position":[[720,24,744,48],[1056,504,1080,528]],"sequence":1,"animations":[],"finalPosition":{"left":720,"top":24,"width":360,"height":504}},{"id":"Image-4","type":2,"position":[[24,288,48,312],[336,720,360,744]],"sequence":1,"animations":[],"finalPosition":{"left":24,"top":288,"width":336,"height":456}},{"id":"Image-5","type":2,"position":[[384,288,408,312],[672,504,696,528]],"sequence":1,"animations":[],"finalPosition":{"left":384,"top":288,"width":312,"height":240}},{"id":"Image-6","type":2,"position":[[384,552,408,576],[840,1032,864,1056]],"sequence":1,"animations":[],"finalPosition":{"left":384,"top":552,"width":480,"height":504}},{"id":"Image-7","type":2,"position":[[24,768,48,792],[336,1032,360,1056]],"sequence":1,"animations":[],"finalPosition":{"left":24,"top":768,"width":336,"height":288}},{"id":"Image-8","type":2,"position":[[1536,264,1560,288],[1104,504,1128,528]],"sequence":1,"animations":[],"finalPosition":{"left":1104,"top":264,"width":456,"height":264}},{"id":"Image-9","type":2,"position":[[1872,24,1896,48],[1104,216,1128,240]],"sequence":1,"animations":[],"finalPosition":{"left":1104,"top":24,"width":792,"height":216}},{"id":"Image-10","type":2,"position":[[1584,264,1608,288],[1872,744,1896,768]],"sequence":1,"animations":[],"finalPosition":{"left":1584,"top":264,"width":312,"height":504}},{"id":"Image-11","type":2,"position":[[888,552,912,576],[1296,744,1320,768]],"sequence":1,"animations":[],"finalPosition":{"left":888,"top":552,"width":432,"height":216}},{"id":"Image-12","type":2,"position":[[1536,552,1560,576],[1344,744,1368,768]],"sequence":1,"animations":[],"finalPosition":{"left":1344,"top":552,"width":216,"height":216}},{"id":"Image-13","type":2,"position":[[888,792,912,816],[1128,1032,1152,1056]],"sequence":1,"animations":[],"finalPosition":{"left":888,"top":792,"width":264,"height":264}},{"id":"Image-14","type":2,"position":[[1872,792,1896,816],[1176,1032,1200,1056]],"sequence":1,"animations":[],"finalPosition":{"left":1176,"top":792,"width":720,"height":264}}],
    'News': [
        {"id":"Fond","type":4,"position":[[0,0,24,24],[1896,1056,1920,1080]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":0,"width":1920,"height":1080}},
        {"id":"bandeau","type":3,"position":[[0,888,24,912],[1896,1008,1920,1032]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":0,"top":888,"width":1920,"height":144}},
        {"id":"CoinBandeau","type":3,"position":[[1896,840,1920,864],[1560,1008,1584,1032]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":1560,"top":840,"width":360,"height":192}},
        {"id":"Heure","type":1,"position":[[1584,864,1608,888],[1872,984,1896,1008]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":1584,"top":864,"width":312,"height":144}},
        {"id":"Logo","type":2,"position":[[144,888,168,912],[24,1008,48,1032]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644780295337-452d26bc1f89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80","finalPosition":{"left":24,"top":888,"width":144,"height":144}},
        {"id":"ImagePrincipale","type":2,"position":[[72,240,96,264],[816,648,840,672]],"sequence":1,"animations":[],"src":"https://images.unsplash.com/photo-1644678961183-b57d0b9423d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80","finalPosition":{"left":72,"top":240,"width":768,"height":432}},
        {"id":"Titre","type":1,"position":[[1824,72,1848,96],[72,192,96,216]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":72,"top":72,"width":1776,"height":144}},
        {"id":"Corp","type":1,"position":[[864,240,888,264],[1824,792,1848,816]],"sequence":1,"animations":[],"src":"","finalPosition":{"left":864,"top":240,"width":984,"height":576}}],
}

const LayoutTool = ({ isHidden }) => {

    const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const thumbPreview = useRef(null);

    const hoverZoneRef = useRef(null);

    const mouseHoverZone = useMouse(hoverZoneRef, { fps: 60 });
    const mouse = useMouse(thumbPreview, { fps: 60 });

    const [matrix, setMatrix] = useState([]);

    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

    const screenSize = useWindowSize();

    const [zones, setZones] = useState([]);
    const [zoneIdx, setZoneIdx] = useState(0);
    const [hoverZoneIdx, setHoverZoneIdx] = useState(null);
    const [selectedZoneIdx, setSelectedZoneIdx] = useState(null);
    const [tempZone, setTempZone] = useState([]);
    const [currentTool, setCurrentTool] = useState("Text");

    const [uniqueZoneCount, setUniqueZoneCount] = useState(1);

    const [tl, setTl] = useState(null);
    const [playingPreview, setPlayingPreview] = useState(false);

    const [maxSequence, setMaxSequence] = useState(2);

    const [intensity, setIntensity] = useState(0.8);
    const [selectedDataSet, setSelectedDataSet] = useState(DATASETS[0]);

    const [imgIdx, setImgIdx] = useState(0);

    const [clipboardData, setClipboardData] = useState('');

    useEffect(() => {
        if (!isHidden && matrix.length === 0) {
            let newMatrix = [];

            //for (let i = 0; i < 45;i++) {
            //    for (let y = 0; y < 80;y++) {
            //        newMatrix.push([y * 24 /* + 4 */, i * 24 /* + 4 */, (y + 1) * 24 /* - 4 */, (i + 1) * 24 /* - 4 */])
            //    }
            //}

            setMatrix(newMatrix);
        }
    }, [isHidden]);

    useEffect(() => {
        if (thumbPreview.current) {
           setThumbPreviewWidth(thumbPreview.current.offsetWidth);
        }
    }, [screenSize]);

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = thumbPreviewWidth;

        if (thumbPreviewWidth === 0 || (thumbPreview.current && thumbPreview.current.offsetWidth !== thumbPreviewWidth)) {
            currentThumbPreviewWidth = thumbPreview.current.offsetWidth;
            setThumbPreviewWidth(currentThumbPreviewWidth);
        }

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    const getRealPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = thumbPreviewWidth;

        if (thumbPreviewWidth === 0 || (thumbPreview.current && thumbPreview.current.offsetWidth !== thumbPreviewWidth)) {
            currentThumbPreviewWidth = thumbPreview.current.offsetWidth;
            setThumbPreviewWidth(currentThumbPreviewWidth);
        }

        computedPixelSize = 1920 / currentThumbPreviewWidth * pixel;

        return computedPixelSize;
    }

    const handleChangeDataSet = (dataSet) => {

        if (dataSet !== selectedDataSet) {

            if (selectedDataSet === 'Création libre') {
                templates['Création libre'] = FcmBd.utils.deepCopy(zones);
            }

            setSelectedZoneIdx(null);
            setSelectedDataSet(dataSet);

            if (templates[dataSet]) {
                setZones(templates[dataSet]);
            }
        }
    }

    const handleZoneClick = (square) => {
        let newZones = [...zones];
        let newZone = zones[zoneIdx];

        setSelectedZoneIdx(null);

        if (newZones.length === 0) {
            setZones([{ id: `${currentTool}-${uniqueZoneCount}`, type: toolTypes[currentTool], position: [ square, null ], sequence: 1, animations: [] }]);
            setTempZone([ square, square ]);
        } else if (newZone && newZone.position[1] === null) {
            if (newZone.position[0][0] <= square[2] && newZone.position[0][1] <= square[3]) {

                newZones[zoneIdx].position = [newZone.position[0], square];
            } else {
                newZones[zoneIdx].position = [square, newZone.position[0]];
            }

            let position = newZones[zoneIdx].position;

            newZones[zoneIdx].finalPosition = {
                left: position[0][0] < position[1][0] ? position[0][0] : position[1][0], 
                top: position[0][1] < position[1][1] ? position[0][1] : position[1][1], 
                width: position[1][2] > position[0][0] ? position[1][2] - position[0][0] : position[0][2] - position[1][0], 
                height: position[1][3] > position[0][1] ? position[1][3] - position[0][1] : position[0][3] - position[1][1]
            }

            setZones(newZones);
            setTempZone([]);
            setUniqueZoneCount(uniqueZoneCount + 1);
        } else {
            newZones.push({ id: `${currentTool}-${uniqueZoneCount}`, type: toolTypes[currentTool], position: [ square, null ], sequence: 1, animations: [] });
            setZoneIdx(zoneIdx + 1);
            setZones(newZones);
            setTempZone([ square, square ]);
        }
    }

    const handlePreviewScreenClick = (mouseX, mouseY, mouseDown) => {

        const gridSize = 24;

        let realX = getRealPixelSize(mouseX);
        let realY = getRealPixelSize(mouseY);

        let x = realX - realX % gridSize;
        let y = realY - realY % gridSize;

        let square = [ x, y, x + gridSize, y + gridSize ];

        let newZones = [...zones];
        let newZone = zones[zoneIdx];

        setSelectedZoneIdx(null);

        if (newZones.length === 0 && mouseDown) {
            setZones([{ id: `${currentTool}-${uniqueZoneCount}`, type: toolTypes[currentTool], position: [ square, null ], sequence: 1, animations: [], src: images[imgIdx] }]);
            setTempZone([ square, square ]);

            if (toolTypes[currentTool] === toolTypes.Image) {
                let newImgIdx = imgIdx + 1;

                if (newImgIdx < images.length) {
                    setImgIdx(newImgIdx);
                } else {
                    setImgIdx(0);
                }
            }
        } else if (newZone && newZone.position[1] === null && !mouseDown) {
            if (newZone.position[0][0] <= square[2] && newZone.position[0][1] <= square[3]) {

                newZones[zoneIdx].position = [newZone.position[0], square];
            } else {
                newZones[zoneIdx].position = [square, newZone.position[0]];
            }

            let position = newZones[zoneIdx].position;
            let finalPosition = {
                left: position[0][0] < position[1][0] ? position[0][0] : position[1][0], 
                top: position[0][1] < position[1][1] ? position[0][1] : position[1][1], 
                width: position[1][2] > position[0][0] ? position[1][2] - position[0][0] : position[0][2] - position[1][0], 
                height: position[1][3] > position[0][1] ? position[1][3] - position[0][1] : position[0][3] - position[1][1]
            }

            newZones[zoneIdx].finalPosition = finalPosition;

            newZones[zoneIdx].position = [[finalPosition.left, finalPosition.top, finalPosition.left + gridSize, finalPosition.top + gridSize], 
            [finalPosition.left + finalPosition.width - gridSize, finalPosition.top + finalPosition.height - gridSize, finalPosition.left + finalPosition.width, finalPosition.top + finalPosition.height]];

            setZones(newZones);
            setTempZone([]);
            setUniqueZoneCount(uniqueZoneCount + 1);
        } else if (mouseDown) {
            newZones.push({ id: `${currentTool}-${uniqueZoneCount}`, type: toolTypes[currentTool], position: [ square, null ], sequence: 1, animations: [], src: images[imgIdx] });
            setZoneIdx(zoneIdx + 1);
            setZones(newZones);
            setTempZone([ square, square ]);

            if (toolTypes[currentTool] === toolTypes.Image) {

                let newImgIdx = imgIdx + 1;

                if (newImgIdx < images.length) {
                    setImgIdx(newImgIdx);
                } else {
                    setImgIdx(0);
                }
                
            }
        }
    }

    const handleZoneHover = (square) => {
        let newZone = zones[zoneIdx];

        if (newZone && newZone.position.length > 0 && newZone.position[1] === null) {
            if (newZone.position[0][0] <= square[2] && newZone.position[0][1] <= square[3]) {
                setTempZone([newZone.position[0], square]);
            } else {
                setTempZone([square, newZone.position[0]]);
            }
        }
    }

    const handleHoverZone = (index) => {
        if (hoverZoneIdx !== selectedZoneIdx) {
            setHoverZoneIdx(index);
        } else if (hoverZoneIdx === null && selectedZoneIdx === null) {
            setHoverZoneIdx(index);
        }
    }

    useEffect(() => {
        if (mouseHoverZone.isOver) {
            setHoverZoneIdx(selectedZoneIdx);
        }
    }, [mouseHoverZone.isOver]);

    const handleDeleteZone = (index) => {
        let newZones = [...zones];
        let newZoneIdx = zoneIdx;

        newZones.splice(index, 1);

        if (newZoneIdx > 0) {
            newZoneIdx -= 1;
        }

        if (selectedZoneIdx === index) {
            setSelectedZoneIdx(null);
        }

        if (hoverZoneIdx === index) {
            setHoverZoneIdx(null);
        }

        let minSequence = Math.min.apply(Math, newZones.map(zone => zone.sequence));

        if (minSequence === 2) {
            newZones.forEach(zone => {
                zone.sequence -= 1;
            });
            setMaxSequence(maxSequence - 1);
        }

        setZones(newZones);
        setZoneIdx(newZoneIdx);
    }

    const handleSelectZone = (index) => {
        setCurrentTool('Cursor');

        if (selectedZoneIdx === index) {
            setSelectedZoneIdx(null);
        } else {
            setSelectedZoneIdx(index);
        }
    }

    const handleChangeCurrentTool = (tool) => {
        setCurrentTool(tool);
        setSelectedZoneIdx(null);
    }
    
    const handleZoneAnimation = (zone, animationType) => {
        let newZones = [...zones];

        if (newZones[zone].animations.includes(animationType)) {
            newZones[zone].animations = newZones[zone].animations.filter(animation => animation !== animationType);
        } else if (newZones[zone].animations.includes(uncompatibleAnimation[animationType])) {
            newZones[zone].animations = newZones[zone].animations.filter(animation => animation !== uncompatibleAnimation[animationType]);
            newZones[zone].animations.push(animationType);
        } else {
            newZones[zone].animations.push(animationType);
        }

        setZones(newZones);

        emptyTimeLine();
        createTimeLine([newZones[zone]], false);

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
                finalAnimation = { start: { opacity: 0 }, end: { opacity: 0.75, ease: 'power3.inOut', duration: 1.5 } };
            break;
            case ANIMATION_TYPE.zoom: 
                finalAnimation = { start: { scale: 0, rotation: 0.01 }, end: { scale: 1, rotation: 0, ease: 'power3.inOut', duration: 1.5 } };
            break;
            default:
        }

        return finalAnimation;
    }

    const createTimeLine = (zonesToAnimate, paused) => {
        const newTl = gsap.timeline({ paused: paused, clearProps: true });

        if (zonesToAnimate.length > 1) {
            zonesToAnimate = zonesToAnimate.sort((a,b) => a.sequence - b.sequence);
        }

        let lastZoneType = '';

        zonesToAnimate.forEach((zone, index) => {

            if (zone.animations.length > 0) {

                let start = {};
                let end = {};

                zone.animations.forEach(animation => {
                    let animationSequence = getAnimation(zone.finalPosition, animation)
                    start = { ...start, ...animationSequence.start };
                    end = { ...end, ...animationSequence.end };
                });

                let position = `sequence${zone.sequence}${zone.sequence > 1 && zone.animations.length > 0 ? `-=${index > 0 && zone.level && zonesToAnimate[index - 1].level === zone.level ? lastZoneType === zone.type ? '1.1' : '0.8' : '0.5'}` : ''}`;

                if (Object.keys(end).length > 0) {
                    newTl.fromTo(`#${zone.id}`, start, end, position);
                } else {
                    newTl.from(`#${zone.id}`, start, position);
                }

                lastZoneType = zone.type;
                
            }
        });

        newTl.then(() => handleStop());

        setTl(newTl);

    }

    const handlePlay = (smart = false) => {
        emptyTimeLine();
        setSelectedZoneIdx(null);

        if (!smart) {
            createTimeLine([...zones], false);
        } else {
            //createTimeLine(computeZones(FcmBd.utils.deepCopy(zones)), false);
            createTimeLineV2(smartAnimationV2(computeZonesV2(FcmBd.utils.deepCopy(zones))), false);
        }
        
        setPlayingPreview(true);
        
    }

    const handleStop = () => {
        emptyTimeLine();
        setPlayingPreview(false);
    }

    const handleChangeSequence = (index) => {
        let newZones = [...zones];

        newZones[index].sequence += 1;

        if (newZones[index].sequence >= maxSequence) {
            let max = Math.max.apply(Math, zones.map((zone, idx) => index === idx ? 0 : zone.sequence));
            if (max + 1 < newZones[index].sequence) {
                newZones[index].sequence = 1;
            } else {
                setMaxSequence(max + 1);
            }
        }

        setZones(newZones);
    }

    const computeZones = (zonesToCompute) => {
        zonesToCompute.forEach((zone, index) => {

            zone.parentZones = [];
            zone.childZones = [];
            zone.level = 0;
            zone.index = index;

            for (let i = 0; i < index;i++) {
                if (isParent(zone.finalPosition, zonesToCompute[i].finalPosition) || isOverlapping(zone.finalPosition, zonesToCompute[i].finalPosition)) {
                    zone.parentZones = [zonesToCompute[i]];

                    if (zonesToCompute[i].level >= zone.level) {
                        zone.level = zonesToCompute[i].level + 1;
                    }
                }
            }
        });

        zonesToCompute.forEach((zone, index) => {
            if (zone.parentZones.length > 0 && zone.parentZones[0].level > 0) {
                zone.parentZones[0].childZones.push(zone);
            }
        });

        /* console.log('computedZones', zonesToCompute.map(zone => ({ index: zone.index, level: zone.level, parentZones: zone.parentZones }))) */

        return smartAnimation(zonesToCompute)
    }

    const computeZonesV2 = (zones) => {

        zones.forEach((zone, index) => {

            zone.index = index;

            zone.level = 0;
            zone.parent = null;
            zone.childs = [];
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
                        zoneA.childs.push(zoneB);
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
                            && ((zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y))) {

                                zoneA.surrounding.left.push(zoneB);
                        }

                        // À droite?
                        if (zoneA.corners.tr.x <= zoneB.corners.tr.x && ((parent && zoneB.corners.tr.x !== 1920) || !parent)
                            && ((zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y >= zoneB.corners.tr.y && zoneA.corners.br.y <= zoneB.corners.br.y)
                            || (zoneA.corners.tr.y <= zoneB.corners.tr.y && zoneA.corners.br.y >= zoneB.corners.br.y))) {

                                zoneA.surrounding.right.push(zoneB);
                        }

                        // Au dessus?
                        if (zoneA.corners.tl.y >= zoneB.corners.tl.y && ((parent && zoneB.corners.tl.y !== 0) || !parent)
                            && ((zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x))) {

                                zoneA.surrounding.top.push(zoneB);
                        }

                        // En dessous?
                        if (zoneA.corners.bl.y <= zoneB.corners.bl.y && ((parent && zoneB.corners.bl.y !== 1080) || !parent)
                            && ((zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x >= zoneB.corners.tr.x && zoneA.corners.tl.x <= zoneB.corners.tl.x)
                            || (zoneA.corners.tr.x <= zoneB.corners.tr.x && zoneA.corners.tl.x >= zoneB.corners.tl.x))) {

                                zoneA.surrounding.bottom.push(zoneB);
                        }
                    }
                }

            });

            /* console.log('computedZonesV2 | ' + zoneA.id, { 
                        level: zoneA.level, 
                        parent: zoneA.parent ? zoneA.parent.id : '', 
                        childs: JSON.stringify(zoneA.childs.map(child => child.id)),
                        overlappings: JSON.stringify(zoneA.overlappings.map(child => child.id)),
                        surrounding:  JSON.stringify({ left: zoneA.surrounding.left.map(child => child.id), right: zoneA.surrounding.right.map(child => child.id), top: zoneA.surrounding.top.map(child => child.id), bottom: zoneA.surrounding.bottom.map(child => child.id) }) 
                    }
            ); */
        });

        

        return zones;
    }

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
        
                    /* if (a.level < b.level || (aCenterX < bCenterX && (aCenterY < bCenterY || aCenterY > bCenterY))) {
                        //order = reversed && !(a.level < b.level) ? 1 : -1;
                        order = -1;
                    } else if (a.level > b.level || (aCenterX > bCenterX && (aCenterY > bCenterY || aCenterY < bCenterY))) {
                        //order = reversed && !(a.level > b.level) ? -1 : 1;
                        order = 1;
                    } */
        
                    if (reversed) {
                        return a.level - b.level || distanceA - distanceB;
                    } else {
                        return a.level - b.level || distanceB - distanceA;
                    }
                    
                });
            case 'readingOrder':
                return zones.sort((a,b) => {

                    /* let order = 0;
        
                    if (a.level < b.level || (a.finalPosition.left < b.finalPosition.left && (a.finalPosition.top < b.finalPosition.top || a.finalPosition.top > b.finalPosition.top))) {
                        order = reversed && !(a.level < b.level) ? 1 : -1;
                    } else if (a.level > b.level || (a.finalPosition.left > b.finalPosition.left && (a.finalPosition.top > b.finalPosition.top || a.finalPosition.top < b.finalPosition.top))) {
                        order = reversed && !(a.level > b.level) ? -1 : 1;
                    } */

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
                childs: JSON.stringify(zone.childs.map(child => child.id)),
                overlappings: JSON.stringify(zone.overlappings.map(child => child.id)),
                surrounding:  JSON.stringify({ left: zone.surrounding.left.map(child => child.id), right: zone.surrounding.right.map(child => child.id), top: zone.surrounding.top.map(child => child.id), bottom: zone.surrounding.bottom.map(child => child.id) }) 
            },
            JSON.stringify(possibleAnimations)
        ); */

        return possibleAnimations;
    }

    const createTimeLineV2 = (zonesToAnimate, paused) => {
        const newTl = gsap.timeline({ paused: paused, clearProps: true });

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
                    newTl.fromTo(`#${zone.id}`, start, end, position);
                } else {
                    newTl.from(`#${zone.id}`, start, position);
                }
                
            }
        });

        newTl.then(() => handleStop());

        setTl(newTl);

    }



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

    const smartAnimation = (zonesToAnimate) => {

        //let nbLevels = Math.max.apply(Math, zonesToAnimate.map((zone, idx) => zone.level + 1));
        let sortedZones;
        let sortedIndex = Math.floor(Math.random() * 2);

        console.log('sortedIndex', sortedIndex)

        if (sortedIndex === 0) {
            sortedZones = zonesToAnimate.sort((a,b) => {

                let order = 0;
    
                if (a.level < b.level || (a.finalPosition.left < b.finalPosition.left && (a.finalPosition.top < b.finalPosition.top || a.finalPosition.top > b.finalPosition.top))) {
                    order = -1;
                } else if (a.level > b.level || (a.finalPosition.left > b.finalPosition.left && (a.finalPosition.top > b.finalPosition.top || a.finalPosition.top < b.finalPosition.top))) {
                    order = 1;
                }
    
                return order;
            })
        } else {

            let sortedReverse = Math.floor(Math.random() * 2) === 0 ? false : true;

            sortedZones = zonesToAnimate.sort((a,b) => {

                let order = 0;

                let aCenterX = a.finalPosition.left + a.finalPosition.width / 2 - 960;
                let aCenterY = a.finalPosition.top + a.finalPosition.height / 2 - 540;
                let bCenterX = b.finalPosition.left + b.finalPosition.width / 2 - 960;
                let bCenterY = b.finalPosition.top + b.finalPosition.height / 2 - 540;

                if (aCenterX < 0) aCenterX *= -1;
                if (aCenterY < 0) aCenterY *= -1;
                if (bCenterX < 0) bCenterX *= -1;
                if (bCenterY < 0) bCenterY *= -1;
    
                if (a.level < b.level || (aCenterX < bCenterX && (aCenterY < bCenterY || aCenterY > bCenterY))) {
                    order = sortedReverse ? 1 : -1;
                } else if (a.level > b.level || (aCenterX > bCenterX && (aCenterY > bCenterY || aCenterY < bCenterY))) {
                    order = sortedReverse ? -1 : 1;
                }
    
                return order;
            })
        }
        

        let sequenceNo = 1;

        let lastZoneType = null;
        let lastZoneAnimation = null;

        sortedZones.forEach((zone, index) => {
            let possibleAnimations = getPossibleAnimations(sortedZones.slice(0, index), zone.finalPosition);

            if (zone.level === 0) {
                zone.sequence = 1;

                /* if (index > 0) {
                    possibleAnimations = possibleAnimations.filter(animation => animation !== sortedZones[index - 1].animations[0]);
                } */
            } else {
                /* if (zone.childZones.length > 0) {

                    if (sequenceNo === 1) {
                        sequenceNo += 1;
                        zone.sequence = sequenceNo;
                    }
                    
                    zone.childZones.forEach(childZone => {
                        childZone.sequence = zone.sequence;
                    });
                } else  */if (zone.parentZones.length > 0 && zone.parentZones[0].level > 0) {
                    zone.sequence = zone.parentZones[0].sequence;
                } else {
                    sequenceNo += 1;
                    zone.sequence = sequenceNo;
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

        console.log('smartAnimation', sortedZones);

        return sortedZones;
    }

    const getCorners = (zoneFinalPosition) => {
        let zonePosition = {
            tl: { x: zoneFinalPosition.left, y: zoneFinalPosition.top },
            tr: { x: zoneFinalPosition.left + zoneFinalPosition.width, y: zoneFinalPosition.top },
            bl: { x: zoneFinalPosition.left, y: zoneFinalPosition.top + zoneFinalPosition.height },
            br: { x: zoneFinalPosition.left + zoneFinalPosition.width, y: zoneFinalPosition.top + zoneFinalPosition.height },
        }

        return zonePosition;
    }

    const getPossibleAnimations = (zonesToCheck, zoneToAnimatePosition) => {
        let possibleAnimations = [1, 2, 3, 4];

        let zonePosition = getCorners(zoneToAnimatePosition);

        // Basic rules not dependent of other zones

        // Slide from left
        if (zonePosition.tr.x === 1920 && zoneToAnimatePosition.width < 960) {
            possibleAnimations = possibleAnimations.filter(animation => animation !== 4);
        }

        // Slide form right
        if (zonePosition.tl.x === 0 && zoneToAnimatePosition.width < 960) {
            possibleAnimations = possibleAnimations.filter(animation => animation !== 1);
        }

        // Slide from top
        if (zonePosition.bl.y === 1080 && zoneToAnimatePosition.height < 540) {
            possibleAnimations = possibleAnimations.filter(animation => animation !== 3);
        }

        // Slide from bottom
        if (zonePosition.tl.y === 0 && zoneToAnimatePosition.height < 540) {
            possibleAnimations = possibleAnimations.filter(animation => animation !== 2);
        }

        zonesToCheck.forEach((zone, index) => {
            let zoneToCheckPosition = getCorners(zone.finalPosition);

            let isParentOfZone = isParent(zoneToAnimatePosition, zone.finalPosition);

            if (possibleAnimations.length > 0) {

                if (!isParentOfZone) {
                    // Slide from left
                    if (possibleAnimations.includes(4) && zonePosition.tl.x > zoneToCheckPosition.tl.x) {
                        if ((zonePosition.tl.y >= zoneToCheckPosition.tl.y && zonePosition.tl.y <= zoneToCheckPosition.bl.y) || 
                        (zonePosition.bl.y >= zoneToCheckPosition.tl.y && zonePosition.bl.y <= zoneToCheckPosition.bl.y) || 
                        (zonePosition.tl.y <= zoneToCheckPosition.tl.y && zonePosition.bl.y >= zoneToCheckPosition.tl.y)) {
                            possibleAnimations = possibleAnimations.filter(animation => animation !== 4);
                        }
                    }

                    // Slide from right
                    if (possibleAnimations.includes(1) && zonePosition.tl.x < zoneToCheckPosition.tl.x) {
                        if ((zonePosition.tl.y >= zoneToCheckPosition.tl.y && zonePosition.tl.y <= zoneToCheckPosition.bl.y) || 
                        (zonePosition.bl.y >= zoneToCheckPosition.tl.y && zonePosition.bl.y <= zoneToCheckPosition.bl.y) || 
                        (zonePosition.tl.y <= zoneToCheckPosition.tl.y && zonePosition.bl.y >= zoneToCheckPosition.tl.y)) {
                            possibleAnimations = possibleAnimations.filter(animation => animation !== 1);
                        }
                    }

                    // Slide from top
                    if (possibleAnimations.includes(3) && ((zonePosition.tl.x >= zoneToCheckPosition.tl.x && zonePosition.tl.x <= zoneToCheckPosition.tr.x) || 
                    (zonePosition.tr.x >= zoneToCheckPosition.tl.x && zonePosition.tr.x <= zoneToCheckPosition.tr.x) || 
                    (zonePosition.tl.x <= zoneToCheckPosition.tl.x && zonePosition.tr.x >= zoneToCheckPosition.tl.x))) {
                        if (zonePosition.tl.y > zoneToCheckPosition.tl.y) {
                            possibleAnimations = possibleAnimations.filter(animation => animation !== 3);
                        }
                    }

                    // Slide from bottom
                    if (possibleAnimations.includes(2) && ((zonePosition.tl.x >= zoneToCheckPosition.tl.x && zonePosition.tl.x <= zoneToCheckPosition.tr.x) || 
                    (zonePosition.tr.x >= zoneToCheckPosition.tl.x && zonePosition.tr.x <= zoneToCheckPosition.tr.x) || 
                    (zonePosition.tl.x <= zoneToCheckPosition.tl.x && zonePosition.tr.x >= zoneToCheckPosition.tl.x))) {
                        if (zonePosition.tl.y < zoneToCheckPosition.tl.y) {
                            possibleAnimations = possibleAnimations.filter(animation => animation !== 2);
                        }
                    }
                } else {
                    // Slide from left
                    if (possibleAnimations.includes(4) && zoneToCheckPosition.tl.x !== 0) {
                        possibleAnimations = possibleAnimations.filter(animation => animation !== 4);
                    }

                    // Slide from right
                    if (possibleAnimations.includes(1) && zoneToCheckPosition.tr.x !== 1920) {
                        possibleAnimations = possibleAnimations.filter(animation => animation !== 1);
                    }

                    // Slide from top
                    if (possibleAnimations.includes(3) && zoneToCheckPosition.tl.y !== 0) {
                        possibleAnimations = possibleAnimations.filter(animation => animation !== 3);
                    }

                    // Slide from bottom
                    if (possibleAnimations.includes(2) && zoneToCheckPosition.bl.y !== 1080) {
                        possibleAnimations = possibleAnimations.filter(animation => animation !== 2);
                    }
                }
            }

        });

        return possibleAnimations;
    }

    const isParent = (childPosition, parentPosition) => {

        let isParent = false;

        let parent = getCorners(parentPosition);

        let child = getCorners(childPosition);

        // Check X axis
        /* if (child.tl.x >= parent.tl.x && child.tr.x <= parent.tr.x) {
            // Check Y axis
            if (child.tl.y >= parent.tl.y && child.bl.y <= parent.bl.y) {
                isParent = true;
            }
        } */

        if (isCornerIn(parent, child.tl) && isCornerIn(parent, child.tr)) {
            if (isCornerIn(parent, child.bl) && isCornerIn(parent, child.br)) {
                isParent = true;
            }
        }

        return isParent;
    }

    const isCornerIn = (corners, corner) => {
        let isIn = false;

        if (corners.tl.x <= corner.x && corners.tr.x >= corner.x) {
            if (corners.tl.y <= corner.y && corners.bl.y >= corner.y) {
                isIn = true;
            }
        }

        return isIn;
    }

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

    const handleZoneChange = (zoneIdx, key, value = null) => {
        switch (key) {
            case 'animations':
                handleZoneAnimation(zoneIdx, value);
            break;
            case 'sequence':
                handleChangeSequence(zoneIdx);
            break;
            case 'finalPosition':
                let newZones = [...zones];

                if (value.position[0][0] <= value.position[1][2] && value.position[0][1] <= value.position[1][3]) {
                    newZones[zoneIdx].position = [value.position[0], value.position[1]];
                } else {
                    newZones[zoneIdx].position = [value.position[1], value.position[0]];
                }

                delete value.position;

                newZones[zoneIdx].finalPosition = value;

                setZones(newZones);
            break;
            default:
        }
    }

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

    const handleDragEnd = (result) => {
        const {destination, source, draggableId} = result;
        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const newZones = [...zones]
        const newZone = zones[source.index];
        newZones.splice(source.index, 1);
        newZones.splice(destination.index, 0, newZone);

        if (source.index === selectedZoneIdx) {
            setSelectedZoneIdx(destination.index);
        }

        setZones(newZones.map((zone, index) => {
            zone.index = index;
            return zone;
        }));
    }

    return (
        <>
        

        <div className={`min-h-screen flex-col items-start justify-start bg-gray-900 py-20 lg:py-12 px-4 sm:px-6 lg:px-52 space-y-4 lg:space-y-8 ${isHidden ? 'hidden' : 'flex'}`}>
        <div className="w-full flex flex-col-reverse space-x-0 lg:flex-row lg:space-x-6 lg:space-y-0 md:flex-row md:space-x-6 md:space-y-0 items-center justify-end">
                {/* <h2 className="ml-2 text-left text-3xl md:text-xl font-extrabold text-white select-none">Création à partir de données</h2> */}
                {/* {!playingPreview && <div className="flex flex-row mr-6 items-center">
                    
                </div>} */}
                {/* <input
                        id="pasteData"
                        onPaste={handleOnPasteClipboardData}
                        value={''}
                        name="pasteData"
                        type="text"
                        className="resize-none appearance-none relative block h-9 md:w-96 w-full px-3 py-2 border border-gray-300 placeholder-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Collez des données"
                    /> */}
                <div className="flex flex-row space-x-4 h-full w-full items-center justify-end mt-4 md:mt-0 lg:mt-0">                    
                    {playingPreview ? <StopIcon onClick={() => handleStop()} className="text-white hover:text-blue-400 cursor-pointer h-7 w-7" /> : <PlayIcon onClick={() => handlePlay()} className="text-white hover:text-blue-400 cursor-pointer h-7 w-7" />}
                    <SparklesIcon onClick={() => handlePlay(true)} className={`text-white hover:text-blue-400 cursor-pointer h-7 w-7`} />
                </div>
                
                <div className="flex flex-row items-center mt-3 lg:mt-0">
                    <div className={"select-none rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle text-white bg-transparent border-transparent"}>
                    Animation
                    </div>
                    <div className={"select-none rounded-md m-1 px-2 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle text-gray-600 bg-transparent border-transparent"}>
                    <input type="range" id="durationAdjustment" step={0.05} className="rangeNoFill" name="durationAdjustment" min="0" max="1" onChange={e => setIntensity(Number(e.target.value))} defaultValue={intensity} />
                    </div>
                </div>
                <ListeDeroulante disabled={playingPreview} preSelect={selectedDataSet} list={DATASETS} onChange={handleChangeDataSet} />
            </div>
            {!isHidden && <div className="flex flex-col lg:flex-row w-full">

                <div className="flex flex-col">
                    <div className="mt-2 lg:mx-2 lg:mt-0 flex flex-col space-y-4 px-2 py-3 bg-white rounded-sm">
                        <CursorClickIcon onClick={() => handleChangeCurrentTool('Cursor')} className={`h-6 w-6 text-${currentTool === "Cursor" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
                        <MenuAlt2Icon onClick={() => handleChangeCurrentTool('Text')} className={`h-6 w-6 text-${currentTool === "Text" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
                        <PhotographIcon onClick={() => handleChangeCurrentTool('Image')} className={`h-6 w-6 text-${currentTool === "Image" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
                        <DocumentIcon onClick={() => handleChangeCurrentTool('Shape')} className={`h-6 w-6 text-${currentTool === "Shape" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
                        <FilmIcon onClick={() => handleChangeCurrentTool('Video')} className={`h-6 w-6 text-${currentTool === "Video" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
                    </div>
                </div>
                
                <div className="w-full overflow-hidden shadow">
                    <div id="thumbPreview" className="w-full aspect-w-16 aspect-h-9 bg-white overflow-hidden rounded" ref={thumbPreview}>

                        {thumbPreview.current && thumbPreviewWidth > 0 && 

                            <>
                                <div className={`absolute z-10 top-0 left-0 h-full w-full ${currentTool !== 'Cursor' ? 'pointer-events-none' : ''}`}>
                                    {zones.map((/* { id, position, type, finalPosition, sequence, animations, src } */zone, index) => {
                                        if (zone.finalPosition) {
                                            return <ZoneEditor zone={zone} key={zone.id} index={index} onClick={handleSelectZone} onMouseEnter={handleHoverZone} onMouseLeave={setHoverZoneIdx} isDisabled={playingPreview || currentTool !== 'Cursor' || (selectedZoneIdx !== null && selectedZoneIdx !== index && hoverZoneIdx === selectedZoneIdx)} isPlaying={playingPreview} isSelected={selectedZoneIdx === index} isHovered={hoverZoneIdx === index} onChange={handleZoneChange} adjusmentWidth={thumbPreviewWidth} mouseX={mouse.x} mouseY={mouse.y} mouseDown={mouse.isDown} mouseHover={mouse.isOver} />
                                            /* return <button key={`zones-${index}`}  onClick={() => { if (currentTool === 'Cursor') handleSelectZone(index) }}  onMouseEnter={() => { if (currentTool === 'Cursor') setHoverZoneIdx(index)}} onMouseLeave={() => { if (currentTool === 'Cursor') setHoverZoneIdx(null)}} style={{ position: "absolute", left: getComputedPixelSize(finalPosition.left), top: getComputedPixelSize(finalPosition.top), width: getComputedPixelSize(finalPosition.width), height: getComputedPixelSize(finalPosition.height) }} className={`${currentTool === 'Cursor' ? 'pointer-events-auto' : 'pointer-events-none'} ${[toolTypes.Image].includes(type) && playingPreview ? '' : 'rounded'} flex flex-row items-center justify-center ${playingPreview ? '' : selectedZoneIdx === index ? 'border border-blue-600' : hoverZoneIdx === index ? 'border border-blue-400' : 'border border-gray-200'}`}>
                                                        <div id={id} className={`${selectedZoneIdx === index ? 'bg-blue-400' : hoverZoneIdx === index && !playingPreview ? 'bg-blue-200' : playingPreview && type === toolTypes.Shape ? 'bg-gray-100' : 'bg-gray-400'} overflow-hidden ${[toolTypes.Image].includes(type) && playingPreview ? '' : 'rounded-sm'} opacity-75 w-full h-full pointer-events-none flex flex-row items-center justify-center`}>
                                                            {type === toolTypes.Text && <MenuAlt2Icon key={`zones-${index}-icon`} className={`h-12 w-12 text-white`} />}
                                                            {type === toolTypes.Image && <PhotographIcon key={`zones-${index}-icon`} className={`h-12 w-12 text-white`} />}
                                                            {type === toolTypes.Image && <img id={`image-${id}`} src={src ? src : images[index]} alt={`${id}`} crossOrigin='anonymous' className={`select-none w-full h-full object-center object-cover bg-white`} />}
                                                            {type === toolTypes.Shape && <DocumentIcon key={`zones-${index}-icon`} className={`h-12 w-12 text-white`} />}
                                                            {type === toolTypes.Video && <FilmIcon key={`zones-${index}-icon`} className={`h-12 w-12 text-white`} />}
                                                        </div>
                                                        <div className={`bg-gray-200 pointer-events-none absolute top-0 left-0 flex flex-row items-center justify-center rounded-br rounded-tl-sm space-x-1 p-1 ${playingPreview || currentTool !== 'Cursor' ? 'hidden' : ''}`}>
                                                            <div className='h-5 w-5 shrink-0 flex rounded text-xs bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-400 items-center justify-center cursor-pointer pointer-events-auto' onClick={(e) => { e.stopPropagation(); handleChangeSequence(index)}}>
                                                                {sequence}
                                                            </div>
                                                            {animationTypes.map((animation, animIdx) => {
                                                                return <div key={`animationSamll-${index}-${animIdx}`} onClick={() => handleZoneAnimation(index, animation.type)} className={`pointer-events-auto cursor-pointer rounded ${animations.includes(animation.type) ? 'bg-blue-200 text-blue-600' : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-400'}`}>
                                                                    <animation.icon className='h-5 w-5' />
                                                                </div>
                                                            })}
                                                        </div>
                                                    </button> */
                                        }

                                        return <></>
                                    })}
                                    
                                    
                                    {/* {currentTool !== 'Cursor' && <Grid matrix={matrix} adjusmentWidth={thumbPreviewWidth} onClick={handleZoneClick} onHover={handleZoneHover} />} */}
                                </div>
                                <div className={`absolute z-20 top-0 left-0 h-full w-full pointer-events-none ${currentTool === 'Cursor' && hoverZoneIdx !== selectedZoneIdx && selectedZoneIdx !== null ? '' : 'hidden'}`}>
                                    <button ref={hoverZoneRef} onMouseEnter={() => setHoverZoneIdx(selectedZoneIdx)} className={'pointer-events-auto'} style={{ position: "absolute", left: getComputedPixelSize(selectedZoneIdx !== null ? zones[selectedZoneIdx].finalPosition.left : 0), top: getComputedPixelSize(selectedZoneIdx !== null ?zones[selectedZoneIdx].finalPosition.top : 0), width: getComputedPixelSize(selectedZoneIdx !== null ?zones[selectedZoneIdx].finalPosition.width : 0), height: getComputedPixelSize(selectedZoneIdx !== null ?zones[selectedZoneIdx].finalPosition.height : 0) }}></button>
                                </div>
                                <div className={`absolute z-20 top-0 left-0 h-full w-full ${currentTool !== 'Cursor' ? '' : 'hidden'}`}>
                                    {tempZone.length > 0 && <div key={'tempZone-key'} style={{ position: "absolute", left: getComputedPixelSize(tempZone[0][0] < tempZone[1][0] ? tempZone[0][0] : tempZone[1][0]), top: getComputedPixelSize(tempZone[0][1] < tempZone[1][1] ? tempZone[0][1] : tempZone[1][1]), width: getComputedPixelSize(tempZone[1][2] > tempZone[0][0] ? tempZone[1][2] - tempZone[0][0] : tempZone[0][2] - tempZone[1][0]), height: getComputedPixelSize(tempZone[1][3] > tempZone[0][1] ? tempZone[1][3] - tempZone[0][1] : tempZone[0][3] - tempZone[1][1]) }} className='bg-blue-600 opacity-40 z-0 pointer-event-none rounded-sm'></div>}
                                    {currentTool !== 'Cursor' && selectedDataSet === 'Création libre' && <VirtualGrid hidden={playingPreview ? true : !mouse.isOver} x={mouse.x} y={mouse.y} adjusmentWidth={thumbPreviewWidth} onClick={handlePreviewScreenClick} isDown={mouse.isDown} onHover={handleZoneHover} />}
                                </div>
                            </>

                        }

                    </div>
                </div>

                {/* <div className="mt-4 lg:ml-4 lg:mt-0 space-x-4 lg:space-y-4 lg:space-x-0 flex flex-row lg:flex-col" style={{ width: `${isMobile ? 100 : 18.25}%`}}> */}
                            <div className="mt-2 lg:ml-4 lg:mt-0 container flex flex-col space-y-3" style={{ width: `${isMobile ? 100 : 18.25}%`}}>
                                {/* <div className='w-full text-xs flex flex-row space-x-3 items-center mb-1 py-2 px-3 bg-white rounded-sm'>
                                    <PlayIcon onClick={() => handlePlay()} className={`h-6 w-6 text-${currentTool === "Cursor" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
                                    <SparklesIcon onClick={() => handlePlay(true)} className={`h-6 w-6 text-${currentTool === "Cursor" ? "blue-600" : "gray-400"} hover:text-blue-500 cursor-pointer`} />
                                </div> */}
                                
                                {zones.map(({ position, type, animations, finalPosition, sequence, id }, index) => {
                                    if (finalPosition) {
                                        return <div key={`zonesList-${id}`} className={`bg-white pointer-events-auto rounded-sm py-2 px-2 w-full text-sm flex flex-col space-y-2 items-center ${selectedZoneIdx === index ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-gray-900' : hoverZoneIdx === index ? 'ring-2 ring-blue-300 ring-offset-2 ring-offset-gray-900' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 hover:ring-offset-gray-900'}`}>
                                                    <button onClick={() => handleSelectZone(index)} onMouseEnter={() => setHoverZoneIdx(index)} onMouseLeave={() => setHoverZoneIdx(null)} className='w-full text-sm flex flex-row items-center'>
                                                        <div className='mr-3' >
                                                            {type === toolTypes.Text && <MenuAlt2Icon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                            {type === toolTypes.Image && <PhotographIcon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                            {type === toolTypes.Shape && <DocumentIcon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                            {type === toolTypes.Video && <FilmIcon key={`zonesList-${index}-icon`} className={`h-5 w-5 text-gray-400 pointer-events-none`} />}
                                                        </div>
                                                        <div className='w-full text-left pointer-events-none'>{zoneTypes[type]}</div>
                                                        <div className='h-5 w-5 shrink-0 flex ml-3 rounded text-xs bg-gray-200 items-center justify-center cursor-pointer pointer-events-auto' onClick={(e) => { e.stopPropagation(); handleChangeSequence(index)}}>
                                                            {sequence}
                                                        </div>
                                                        <div className='ml-3'>
                                                            <TrashIcon key={`zonesList-${id}-trash`} onClick={(e) => { e.stopPropagation(); handleDeleteZone(index)}} className={`h-4 w-4 text-gray-400 hover:text-red-600 cursor-pointer`} />
                                                        </div>
                                                    </button>
                                                    {selectedZoneIdx === index && <div className='bg-gray-100 rounded-sm w-full text-xs flex flex-col pb-1'>
                                                        <div className='w-full text-xs flex flex-row items-center mx-2 mt-2 mb-1'>
                                                            <div className='mr-2'>
                                                                <SparklesIcon className={`h-4 w-4 text-gray-400 pointer-events-none`} />
                                                            </div>
                                                            <div className='w-full text-left pointer-events-none'>Animations</div>
                                                        </div>
                                                        <div className='w-full text-xs flex flex-row items-center mx-1 mt-1'>
                                                            {animationTypes.map((animation, animIdx) => {
                                                                return <div key={`zonesList-animation-${index}-${animIdx}`} onClick={() => handleZoneAnimation(index, animation.type)} className={`pointer-events-auto cursor-pointer p-1 m-1 rounded ${animations.includes(animation.type) ? 'bg-blue-200 text-blue-600' : 'bg-white text-gray-500 hover:bg-blue-100 hover:text-blue-400'}`}>
                                                                    <animation.icon className='h-5 w-5' />
                                                                </div>
                                                            })}
                                                        </div>
                                                    </div>}
                                                </div>

                                    }

                                    return <></>
                                })}
                            </div>

            </div>}

            <section className={`container grid md:grid-cols-4 grid-cols-3 gap-1 lg:grid-cols-12 lg:gap-2 w-full`}></section>
        </div>
        
        </>
    );
}

/* const Zone = props => {
    if (props.zone[0] && props.zone[1] !== null) {
        return <div style={props.style} className={props.className}></div>
       }

    return <></>
}

const Zones = props => {

    const adjusmentWidth = props.adjusmentWidth;

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    return props.zones.map((zone, index) => {
        if (zone[0] && zone[1] !== null) {
            return <Zone zone={zone} key={`refZone-${index}`} style={{ position: "absolute", left: getComputedPixelSize(zone[0][0] < zone[1][0] ? zone[0][0] : zone[1][0]), top: getComputedPixelSize(zone[0][1] < zone[1][1] ? zone[0][1] : zone[1][1]), width: getComputedPixelSize(zone[1][2] > zone[0][0] ? zone[1][2] - zone[0][0] : zone[0][2] - zone[1][0]), height: getComputedPixelSize(zone[1][3] > zone[0][1] ? zone[1][3] - zone[0][1] : zone[0][3] - zone[1][1]) }} className={`bg-gray-${index + 1}00 pointer-event-none rounded-sm`} />
        }

        return <></>
    })
} */

const GridSquare = props => {
    return <button onMouseEnter={() => props.onHover(props.square)} onClick={() => props.onClick(props.square)} style={props.style} className='hover:bg-blue-600 hover:rounded-sm'></button>
}

const Grid = props => {

    const matrix = props.matrix;
    const adjusmentWidth = props.adjusmentWidth;

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

    return matrix.map((square, index) => {
        return <GridSquare square={square} onClick={props.onClick} onHover={props.onHover} key={`refSquare-${index}`} style={{ position: "absolute", left: getComputedPixelSize(square[0]), top: getComputedPixelSize(square[1]), width: getComputedPixelSize(square[2] - square[0]), height: getComputedPixelSize(square[3] - square[1]) }} />
    })
}

const VirtualGrid = props => {

    const gridSize = 24;

    const [mouseDown, setMouseDown] = useState(false);

    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThumbPreviewWidth = props.adjusmentWidth;

        computedPixelSize = currentThumbPreviewWidth / 1920 * pixel;

        return computedPixelSize;
    }

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
                let realX = getRealPixelSize(props.x);
                let realY = getRealPixelSize(props.y);
    
                let x = realX - realX % gridSize;
                let y = realY - realY % gridSize;
        
                let square = [ x, y, x + gridSize, y + gridSize ];
    
                props.onHover(square);
            } else if (mouseDown && !props.isDown) {
                setMouseDown(false);
                props.onClick(props.x, props.y, false);
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

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      // Call handler right away so state gets updated with initial window size
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export default LayoutTool;