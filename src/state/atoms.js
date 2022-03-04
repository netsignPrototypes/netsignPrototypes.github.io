import { atom } from 'recoil';

const slidesState = atom({
    key: 'slidesState',
    default: [],
});

const currentSlideState = atom({
    key: 'currentSlideState',
    default: {},
});

const selectedZoneIdState = atom({
    key: 'selectedZoneIdState',
    default: null,
});

const hoveredZoneIdState = atom({
    key: 'hoveredZoneIdState',
    default: null,
});

const thumbPreviewMouseState = atom({
    key: 'thumbPreviewMouseState',
    default: {},
});

export {
    slidesState,
    currentSlideState,
    hoveredZoneIdState,
    selectedZoneIdState,
    thumbPreviewMouseState
}