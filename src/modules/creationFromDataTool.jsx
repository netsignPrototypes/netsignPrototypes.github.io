import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import FcmBd from './dataSource/FcmBd';
import * as htmlToImage from 'html-to-image';
import { PlayIcon, ViewGridAddIcon, PencilIcon, XIcon, ChevronRightIcon, ChevronDownIcon, StopIcon, TableIcon} from '@heroicons/react/outline'
import { gsap } from "gsap";
import ContentEditable from "react-contenteditable";
import { useMediaQuery } from 'react-responsive';

import CloudNaturalLanguageAPI from './CloudNaturalLanguageAPI';
import PixaBayAPI from './PixaBayAPI'

import { saveAs } from 'file-saver';

const PL_DATA = [
    { img: "https://images.unsplash.com/photo-1517054612019-1bf855127c43?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1940&q=80", title: "Yosemite", titleColor: "#a54a5e", category: "Parc national", desc: "Le parc national de Yosemite se trouve dans les montagnes de la Sierra Nevada, en Californie.", desc2: "Il est renommé pour ses séquoias géants centenaires et pour Tunnel View, point de vue emblématique sur la chute vertigineuse du Voile de la Mariée, et les falaises granitiques d'El Capitan et du Half Dome." },
    { img: "https://images.unsplash.com/photo-1604542246637-7994c14147bd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1964&q=80", title: "Sequoia", titleColor: "#86836c", category: "Parc national", desc: "Le parc national de Sequoia se trouve dans les montagnes du sud de la Sierra Nevada, en Californie.", desc2: "Il est connu pour ses énormes séquoias, notamment le General Sherman qui domine la Giant Forest." },
    { img: "https://images.unsplash.com/photo-1598382569575-b13e69afc96c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1974&q=80", title: "La vallée de la Mort", titleColor: "#c7a685", category: "Parc national", desc: "Le parc national de la vallée de la Mort chevauche la frontière entre l'est de la Californie et le Nevada.", desc2: "Il est notamment connu pour le Titus Canyon, qui comprend une ville fantôme et des formations rocheuses colorées, ainsi que pour les salines du bassin de Badwater, le point le plus bas de l'Amérique du Nord." },
    { img: "https://images.unsplash.com/photo-1516302350523-4c29d47b89e0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", title: "Grand Canyon", titleColor: "#c27351", category: "Parc national", desc: "Le Grand Canyon, situé en Arizona, est une formation naturelle caractérisée par des couches de roche rouge visibles sur ses versants, révélant des millions d'années d'histoire géologique dans une coupe transversale.", desc2: "Le canyon, extrêmement imposant, s'étend sur environ 16 km de largeur et 446 km de longueur, avec une profondeur moyenne de 1 600 m." },
    { img: "https://images.unsplash.com/photo-1529439322271-42931c09bce1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80", title: "Yellowstone", titleColor: "#ffb106", category: "Parc national", desc: "Le parc national de Yellowstone est une zone de loisirs sauvage d'environ 9000 km² surplombant un site géothermique volcanique.", desc2: "Principalement situé dans le Wyoming, le parc s'étend également sur des parties du Montana et de l'Idaho." }
]

const CreationFromDataTool = ({ isHidden }) => {

    const [playingPreview, setPlayingPreview] = useState(false);

    const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const [smallThumbPreviewWidth, setSmallThumbPreviewWidth] = useState(0);
    const thumbPreview = useRef(null);
    const smallThumbPreview = useRef(null);

    const [currentSlide, setCurrentSlide] = useState(PL_DATA.length - 1);

    const [plData, setPlData] = useState(PL_DATA);

    const [textZoneWidth, setTextZoneWidth] = useState(40);
    const defaultEditingInput = { input: "", idx: -1 };
    const [editingInput, setEditingInput] = useState(defaultEditingInput);

    const [showDataTable, setShowDataTable] = useState(false);

    const titleRef = useRef();
    const imgRef = useRef();

    const [tl, setTl] = useState(null);
    const [tlSwitch, setTlSwitch] = useState(() => {
        gsap.config({ force3D: true });
        return gsap.timeline();
    });

    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

    const screenSize = useWindowSize();

    const handlePlayingPreview = (e, play) => {
        e.preventDefault();
        
        setPlayingPreview(play);
    }

    useLayoutEffect(() => {
        if (!isHidden) {
            
        }
    }, [isHidden]);

    const getTimeLine = () => {
        const tlNew = gsap.timeline({ paused: true });

                const defaultLayer1In = { 
                    from: { opacity: 1, yPercent: 100, xPercent: 0, rotation:0.01 }, 
                    to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                };

                const defaultLayer2In = { 
                    from: { opacity: 1, yPercent: -100, xPercent: 0, rotation:0.01 }, 
                    to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                };

                const defaultLayer1Out = { yPercent: -100, duration: 2, ease: "power3.inOut", rotation: 0.01 };
                const defaultLayer2Out = { opacity: 1, yPercent: 100, duration: 2, ease: "power3.inOut", rotation: 0.01 };

                const defaultAnim = {
                    layer1In : defaultLayer1In,
                    layer2In : defaultLayer2In,
                    layer1Out : defaultLayer1Out,
                    layer2Out : defaultLayer2Out,
                }

                const anim1 = {
                    layer1In : defaultLayer1In,
                    layer2In : defaultLayer2In,
                    layer1Out : { width: "200%", xPercent: 50, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                    layer2Out : { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                }

                const anim2 = {
                    layer1In : { 
                        from: { opacity: 1, xPercent: -100 + textZoneWidth, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2In : { 
                        from: { opacity: 1, xPercent: -100, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: -100 + textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer1Out : defaultLayer2Out,
                    layer2Out : defaultLayer1Out,
                }

                const anim3 = {
                    layer1In : defaultLayer1In,
                    layer2In : defaultLayer2In,
                    layer1Out : { width: "95%", xPercent: -10, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                    layer2Out : { opacity: 1, xPercent: -textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                }

                const anim4 = {
                    layer1In : { 
                        from: { opacity: 1, xPercent: 100, yPercent: 0, width: `100%`, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: 0, width: `100%`, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2In : { 
                        from: { opacity: 1, xPercent: 100, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer1Out : { width: "110%", xPercent: 25, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                    layer2Out : { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                }

                const anim5 = {
                    layer1In : { 
                        from: { opacity: 1, xPercent: -100 + textZoneWidth, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2In : { 
                        from: { opacity: 1, xPercent: -100, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: -100 + textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer1Out : defaultLayer2Out,
                    layer2Out : defaultLayer1Out,
                }

                const animations = [
                    anim1,
                    anim2,
                    anim3,
                    anim4,
                    anim5
                    
                    
                ]

                plData.forEach((slide, slideIdx) => {
                    tlNew.fromTo(`#thumbPreview #slide-${slideIdx+1} #layer-1`, animations[slideIdx].layer1In.from, animations[slideIdx].layer1In.to, `slide-${slideIdx+1}-in`/* , slideIdx * 5 */)
                    tlNew.fromTo(`#thumbPreview #slide-${slideIdx+1} #layer-2`, animations[slideIdx].layer2In.from, animations[slideIdx].layer2In.to, `slide-${slideIdx+1}-in`/* , slideIdx * 5 */)
                    tlNew.fromTo(`#thumbPreview #slide-${slideIdx+1} #layer-2 #progress`, { width: "0%" }, { width: "85%", ease: "linear", duration: 7 }, `slide-${slideIdx+1}-in`/* , slideIdx * 5 + 1 */)

                    if (slideIdx + 1 < plData.length) {
                        tlNew.to(`#thumbPreview #slide-${slideIdx+1} #layer-1`, animations[slideIdx].layer1Out, `slide-${slideIdx+2}-in`/* , (slideIdx + 1) * 5 */)
                        tlNew.to(`#thumbPreview #slide-${slideIdx+1} #layer-2`, animations[slideIdx].layer2Out, `slide-${slideIdx+2}-in`/* , (slideIdx + 1) * 5 */)
                    }
                    
                });

                tlNew.then(previewDone)

                return tlNew;
    }

    useEffect(() => {

        if (playingPreview === true) {

            /* if (tl === null) {
                const tlNew = getTimeLine();

                setTl(tlNew);
            } else {
                tl.restart();
            } */

            const tlNew = getTimeLine();

            tlNew.restart();
            setTl(tlNew);
        } else {
            if (tl) {
                tl.progress(1);
            }
            
        }
        
    }, [playingPreview]);

    useEffect(() => {
        if (thumbPreview.current) {
           setThumbPreviewWidth(thumbPreview.current.offsetWidth);
        }
        if (smallThumbPreview.current) {
            setSmallThumbPreviewWidth(smallThumbPreview.current.offsetWidth);
        }
    }, [screenSize]);

    const previewDone = (timeline) => {

        transitionSlide(-1, plData.length - 1);
    }

    const resetAllSlides = () => {
        plData.forEach((slide, slideIdx) => {
            gsap.set(`#thumbPreview #slide-${slideIdx+1} #layer-1`, { width: "100%", opacity: 1, xPercent: 0, yPercent: -100, rotation: 0 })
            gsap.set(`#thumbPreview #slide-${slideIdx+1} #layer-2`, { width: "100%", opacity: 1, xPercent: 0, yPercent: 100, rotation: 0 })
            gsap.set(`#thumbPreview #slide-${slideIdx+1} #layer-2 #progress`, { width: "85%" })            
        });
    }

    const transitionSlide = (slideIn = -1, slideOut = -1) => {

        if (slideIn !== currentSlide) {

            if (slideIn === -1) {
                slideIn = currentSlide;
            }
    
            if (slideOut === -1) {
                slideOut = currentSlide;
            }

        /* const transitions = [
            {
                slideOut: {
                    layer1: {
                        to: { width: "200%", xPercent: 50, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: {
                        to: { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1: { 
                        from: { opacity: 1, xPercent: -100 + textZoneWidth, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2: { 
                        from: { opacity: 1, xPercent: -100, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: -100 + textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            },
            {
                slideOut: {
                    layer1: {
                        to: { yPercent: -100, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: { 
                        to: { opacity: 1, yPercent: 100, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1: {
                        from: { opacity: 1, yPercent: 100, rotation:0.01 }, 
                        to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 }
                    },
                    layer2: { 
                        from: { opacity: 1, yPercent: -100, rotation:0.01 }, 
                        to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            },
            {
                slideOut: {
                    layer1: {
                        to: { width: "95%", xPercent: -10, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: { 
                        to: { opacity: 1, xPercent: -textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1 : { 
                        from: { opacity: 1, xPercent: 100 - textZoneWidth, width: `${(100 - textZoneWidth) * 4}%`, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: 0, width: `100%`, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2 : { 
                        from: { opacity: 1, xPercent: 100, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            },
            {
                slideOut: {
                    layer1: {
                        to: { width: "110%", xPercent: 25, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: { 
                        to: { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1 : { 
                        from: { opacity: 1, xPercent: -100 + textZoneWidth, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2 : { 
                        from: { opacity: 1, xPercent: -100, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: -100 + textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            }
        ] */

        const transitions = [
            {
                slideOut: {
                    layer1: {
                        to: { width: "200%", xPercent: 50, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: {
                        to: { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1: { 
                        from: { width: "100%", opacity: 1, xPercent: -100 + textZoneWidth, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2: { 
                        from: { width: "100%", opacity: 1, xPercent: -100, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: -100 + textZoneWidth, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            },
            {
                slideOut: {
                    layer1: {
                        to: { yPercent: -100, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: { 
                        to: { opacity: 1, yPercent: 100, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1: {
                        from: { width: "100%", opacity: 1, yPercent: 100, xPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 }
                    },
                    layer2: { 
                        from: { width: "100%", opacity: 1, yPercent: -100, xPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            },
            {
                slideOut: {
                    layer1: {
                        to: { width: "95%", xPercent: -100, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: { 
                        to: { opacity: 1, xPercent: -100, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1 : { 
                        from: { opacity: 1, xPercent: 100 - textZoneWidth, yPercent: 0, width: `${(100 - textZoneWidth) * 4}%`, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: 0, width: `100%`, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2 : { 
                        from: { width: "100%", opacity: 1, xPercent: 100, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            },
            {
                slideOut: {
                    layer1: {
                        to: { width: "110%", xPercent: 25, duration: 2, ease: "power3.inOut", rotation: 0.01 }
                    },
                    layer2: { 
                        to: { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 } 
                    },
                },
                slideIn: {
                    layer1 : { 
                        from: { width: "100%", opacity: 1, xPercent: -100 + textZoneWidth, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                    layer2 : { 
                        from: { width: "100%", opacity: 1, xPercent: -100, yPercent: 0, rotation:0.01 }, 
                        to: { opacity: 1, xPercent: -100 + textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                    },
                }
            }
        ]

        /* tlSwitch.progress(1); */

        if (!tlSwitch.isActive()) {
            tlSwitch.progress(1);
            tlSwitch.clear();
        }

        if (tl && tl.isActive()) {
            tl.progress(1);
        }

        resetAllSlides();

        setPlayingPreview(false);
        

        /* if (tl === null) {
            const tlNew = getTimeLine();

            setTl(tlNew);

            tlNew.seek(`slide-${slideIn+2}-in`)

        } else {
            tl.seek(`slide-${slideIn+2}-in`)
        } */

        

        /* let transitionIdx = Math.floor(Math.random() * (transitions.length - 1)); */

        let transitionIdx = 1;

        tlSwitch.fromTo(`#thumbPreview #slide-${slideIn+1} #layer-1`, { ...transitions[transitionIdx].slideIn.layer1.from}, { clearProps: 'transform', ...transitions[transitionIdx].slideIn.layer1.to}, `transition`)
        tlSwitch.fromTo(`#thumbPreview #slide-${slideIn+1} #layer-2`, { ...transitions[transitionIdx].slideIn.layer2.from}, { clearProps: 'transform', ...transitions[transitionIdx].slideIn.layer2.to}, `transition`)

        if (slideIn !== slideOut) {
            tlSwitch.fromTo(`#thumbPreview #slide-${slideOut+1} #layer-1`, {  }, { ...transitions[transitionIdx].slideOut.layer1.to}, `transition`)
            tlSwitch.set(`#thumbPreview #slide-${slideOut+1} #layer-1`, {  })
            tlSwitch.fromTo(`#thumbPreview #slide-${slideOut+1} #layer-2`, {  }, { ...transitions[transitionIdx].slideOut.layer2.to}, `transition`)
            tlSwitch.set(`#thumbPreview #slide-${slideOut+1} #layer-2`, {  })
        }
        

        //setTlSwitch(tlSwitch);
        tlSwitch.progress(1);
        

        /* if (tlSwitch === null) {
            const tlNew = gsap.timeline()

            const defaultLayer1In = { 
                from: { opacity: 1, yPercent: 100, rotation:0.01 }, 
                to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
            };

            const defaultLayer2In = { 
                from: { opacity: 1, yPercent: -100, rotation:0.01 }, 
                to: { opacity: 1, yPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
            };

            const defaultLayer1Out = { yPercent: -100, duration: 2, ease: "power3.inOut", rotation: 0.01 };
            const defaultLayer2Out = { opacity: 1, yPercent: 100, duration: 2, ease: "power3.inOut", rotation: 0.01 };

            const defaultAnim = {
                layer1In : defaultLayer1In,
                layer2In : defaultLayer2In,
                layer1Out : defaultLayer1Out,
                layer2Out : defaultLayer2Out,
            }

            const anim1 = {
                layer1In : defaultLayer1In,
                layer2In : defaultLayer2In,
                layer1Out : { width: "200%", xPercent: 50, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                layer2Out : { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 },
            }

            const anim2 = {
                layer1In : { 
                    from: { opacity: 1, xPercent: -100 + textZoneWidth, rotation:0.01 }, 
                    to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                },
                layer2In : { 
                    from: { opacity: 1, xPercent: -100, rotation:0.01 }, 
                    to: { opacity: 1, xPercent: -100 + textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                },
                layer1Out : defaultLayer2Out,
                layer2Out : defaultLayer1Out,
            }

            const anim3 = {
                layer1In : defaultLayer1In,
                layer2In : defaultLayer2In,
                layer1Out : { width: "95%", xPercent: -10, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                layer2Out : { opacity: 1, xPercent: -textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 },
            }

            const anim4 = {
                layer1In : { 
                    from: { opacity: 1, xPercent: 100 - textZoneWidth, width: `${(100 - textZoneWidth) * 4}%`, rotation:0.01 }, 
                    to: { opacity: 1, xPercent: 0, width: `100%`, duration: 2, ease: "power3.inOut", rotation: 0 } 
                },
                layer2In : { 
                    from: { opacity: 1, xPercent: 100, rotation:0.01 }, 
                    to: { opacity: 1, xPercent: 0, duration: 2, ease: "power3.inOut", rotation: 0 } 
                },
                layer1Out : { width: "110%", xPercent: 25, duration: 2, ease: "power3.inOut", rotation: 0.01 },
                layer2Out : { opacity: 1, xPercent: 100 - textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0.01 },
            }

            const anim5 = {
                layer1In : { 
                    from: { opacity: 1, xPercent: -100 + textZoneWidth, rotation:0.01 }, 
                    to: { opacity: 1, xPercent: textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                },
                layer2In : { 
                    from: { opacity: 1, xPercent: -100, rotation:0.01 }, 
                    to: { opacity: 1, xPercent: -100 + textZoneWidth, duration: 2, ease: "power3.inOut", rotation: 0 } 
                },
                layer1Out : defaultLayer2Out,
                layer2Out : defaultLayer1Out,
            }

            const animations = [
                anim1,
                anim2,
                anim3,
                anim4,
                anim5
                
                
            ]

            plData.forEach((slide, slideIdx) => {
                tlNew.fromTo(`#thumbPreview #slide-${slideIdx+1} #layer-1`, animations[slideIdx].layer1In.from, animations[slideIdx].layer1In.to, `slide-${slideIdx+1}-in`)
                tlNew.fromTo(`#thumbPreview #slide-${slideIdx+1} #layer-2`, animations[slideIdx].layer2In.from, animations[slideIdx].layer2In.to, `slide-${slideIdx+1}-in`)

                if (slideIdx + 1 < plData.length) {
                    tlNew.to(`#thumbPreview #slide-${slideIdx+1} #layer-1`, animations[slideIdx].layer1Out, `slide-${slideIdx+2}-in`)
                    tlNew.to(`#thumbPreview #slide-${slideIdx+1} #layer-2`, animations[slideIdx].layer2Out, `slide-${slideIdx+2}-in`)
                }
            });

            setTlSwitch(tlNew);
            tlNew.timeScale(6).tweenTo(`slide-${slide+2}-in`);
        } else {
            tlSwitch.timeScale(6).tweenTo(`slide-${slide+2}-in`);
        } */

            setCurrentSlide(slideIn)
        }
    }

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

    const handleSaveAsImage = async () => {

        let container = document.createElement("div");
        container.classList.add("overflow-hidden");
        container.classList.add("fixed");

        let preview = document.createElement("div");

        let html = renderScreenShot()

        preview.innerHTML = ReactDOMServer.renderToStaticMarkup(html);

        document.body.appendChild(container);

        container.appendChild(preview);

        let blob = await htmlToImage.toBlob(preview);

        saveAs(blob, "thumb.png");
        document.body.removeChild(container);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    const renderScreenShot = () => {
        /* return <div className="aspect-w-16 aspect-h-9 bg-gray-50 overflow-hidden" style={{ width: "1920px", height: "1080px" }} ref={thumbPreview}>

        </div> */
    }

    const handleChangeText = (input, value, index) => {
        let newPlData = [...plData];
        
        newPlData[index][input] = value;

        setPlData(newPlData);
    }


    return (
        <>

        {showDataTable && <div className={`fixed z-50 p-2 lg:p-16 w-full h-full flex flex-col space-y-2 items-center justify-start bg-gray-800 bg-opacity-30`} style={{ background: 'rgba(16,18,27,0.3)', backdropFilter: 'blur(5px)' }}>

            <div className="relative max-w-5xl flex flex-col w-full h-full items-start justify-start bg-white rounded ">
                <XIcon onClick={() => setShowDataTable(false)} className="absolute top-2 right-2 text-gray-700 hover:text-gray-600 cursor-pointer h-4 w-4 lg:h-6 lg:w-6" />
                <div className="w-full h-full overflow-auto mt-10 pb-3 pl-3">
                <div className="w-full h-full overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="sticky top-0 bg-white z-50">
                        <tr>
                        <th
                            scope="col"
                            className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            #
                        </th>
                        <th
                            scope="col"
                            className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Catégorie
                        </th>
                        <th
                            scope="col"
                            className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Titre
                        </th>
                        <th
                            scope="col"
                            className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Texte
                        </th>
                        <th
                            scope="col"
                            className="px-6 pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            Image
                        </th>
                        {/* <th scope="col" className="relative px-6 pb-3">
                            <span className="sr-only">Edit</span>
                        </th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 overflow-auto">
                        {plData.map((data, index) => (
                        <tr key={`slide_${index}_table`}>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ContentEditable
                                    tagName="p"
                                    html={data.category}
                                    className="focus:placeholder-transparent rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-4 break-normal whitespace-normal"
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData("text");
                                        Document.execCommand("insertText", false, text);
                                    }}
                                    onChange={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        } else {
                                            const html = e.target.value;
                                            handleChangeText('category', html.replace(/(<([^>]+)>)/gi, ""), index);
                                        }
                                    }}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ContentEditable
                                    tagName="p"
                                    html={data.title}
                                    className="focus:placeholder-transparent rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-4 break-normal whitespace-normal"
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData("text");
                                        Document.execCommand("insertText", false, text);
                                    }}
                                    onChange={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        } else {
                                            const html = e.target.value;
                                            handleChangeText('title', html.replace(/(<([^>]+)>)/gi, ""), index);
                                        }
                                    }}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">
                                <ContentEditable
                                    tagName="p"
                                    html={data.desc}
                                    className="focus:placeholder-transparent rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-4 break-normal whitespace-normal"
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const text = e.clipboardData.getData("text");
                                        Document.execCommand("insertText", false, text);
                                    }}
                                    onChange={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        } else {
                                            const html = e.target.value;
                                            handleChangeText('desc', html.replace(/(<([^>]+)>)/gi, ""), index);
                                        }
                                    }}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap w-1/4">
                                    <Img src={data.img} 
                                        onChange={media => {
                                            handleChangeText('img', media, index);
                                        }}
                                        imgClassName="object-contain"
                                        alt={data.title} 
                                        disabled={playingPreview}
                                        id={`img-1`}
                                        modalLibrary={true}
                                        preSearchText={`${data.title}. ${data.desc}`} />
                                    {/* <img className="object-contain" src={data.img} alt="" /> */}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <PencilIcon onClick={() => setShowDataTable(false)} className="text-gray-700 hover:text-gray-600 cursor-pointer h-4 w-4 lg:h-5 lg:w-5" />
                            </td> */}
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>

        </div>}

        <div className={`min-h-screen flex-col items-start justify-start bg-gray-900 py-20 lg:py-12 px-4 sm:px-6 lg:px-52 space-y-4 lg:space-y-8 ${isHidden ? 'hidden' : 'flex'}`}>
            <div className="w-full flex space-y-0 flex-row items-center justify-end">
                {/* <h2 className="ml-2 text-left text-3xl md:text-xl font-extrabold text-white select-none">Création à partir de données</h2> */}
                {!playingPreview && <div className="flex flex-row mr-6">
                    <div className={"select-none rounded-md m-1 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle text-white bg-transparent border-transparent"}>
                    Format :
                    </div>
                    <div className={"select-none rounded-md m-1 px-2 py-0.5 text-center text-xs flex items-center font-medium justify-center align-middle text-gray-600 bg-transparent border-transparent"}>
                    <input type="range" id="textZoneWidth" step={5} name="fontSize" min="35" max="65" onChange={e => setTextZoneWidth(Number(e.target.value))} defaultValue={40} />
                    </div>
                    <TableIcon onClick={() => setShowDataTable(!showDataTable)} className="text-white hover:text-blue-400 cursor-pointer h-7 w-7 ml-6" />
                </div>}
                <div className="flex flex-row space-x-4 h-full items-center">
                    {playingPreview ? <StopIcon onClick={event => handlePlayingPreview(event, false)} className="text-white hover:text-blue-400 cursor-pointer h-7 w-7" /> : <PlayIcon onClick={event => handlePlayingPreview(event, true)} className="text-white hover:text-blue-400 cursor-pointer h-7 w-7" />}
                </div>
            </div>
            {!isHidden && <div className="flex flex-col lg:flex-row w-full pointer-events-none">
                
                <div className="w-full overflow-hidden shadow">
                    <div id="thumbPreview" className="w-full aspect-w-16 aspect-h-9 bg-white overflow-hidden rounded-md" ref={thumbPreview}>

                        {thumbPreview.current && thumbPreviewWidth > 0 && 

                        plData.map((slide, slideIdx) => {
                            return <Slide id={`slide-${slideIdx + 1}`}>
                                
                                <Layer id={`layer-1`}>
                                    <Img src={slide.img} 
                                        onChange={media => {
                                            handleChangeText('img', media, slideIdx);
                                        }} 
                                        alt={slide.title} 
                                        disabled={playingPreview}
                                        id={`img-1`} 
                                        style={{ width: `${100 - textZoneWidth}%` }} 
                                        preSearchText={`${slide.title}. ${slide.desc}`} />
                                </Layer>

                                <Layer id={`layer-2`} className="justify-end">
                                    <div className="flex pointer-events-auto bg-white h-full items-center" style={{ width: `${textZoneWidth}%`, padding: `${getComputedPixelSize(36)}px`}}>
                                        <div className="pointer-events-auto" style={{ padding: `${getComputedPixelSize(36)}px`}} >
                                            <Text id={`text-1`} style={{ marginBottom: `${getComputedPixelSize(12)}px` }} editingInput={editingInput.input === 'category' && editingInput.idx === slideIdx}>
                                                <ContentEditable
                                                    tagName="h2"
                                                    html={slide.category}
                                                    className="focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:ring-offset-4 font-bold uppercase tracking-widest max-w-full break-normal whitespace-normal"
                                                    style={{ fontSize: `${getComputedPixelSize(32)}px` }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const text = e.clipboardData.getData("text");
                                                        Document.execCommand("insertText", false, text);
                                                    }}
                                                    disabled={playingPreview}
                                                    onFocus={() => { setEditingInput({ input: 'category', idx: slideIdx }) }}
                                                    onBlur={() => { setEditingInput(defaultEditingInput) }}
                                                    onChange={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        } else {
                                                            const html = e.target.value;
                                                            handleChangeText('category', html.replace(/(<([^>]+)>)/gi, ""), slideIdx);
                                                        }
                                                    }}
                                                />
                                            </Text>
                                            <Text id={`text-2`} style={{ marginTop: `${getComputedPixelSize(12)}px`, marginBottom: `${getComputedPixelSize(12)}px` }} editingInput={editingInput.input === 'title' && editingInput.idx === slideIdx}>
                                                <ContentEditable
                                                    tagName="h1"
                                                    html={slide.title}
                                                    className="focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-bold max-w-full break-normal whitespace-normal" 
                                                    style={{ fontSize: `${getComputedPixelSize(84)}px`, lineHeight: `${getComputedPixelSize(97)}px`, color: slide.titleColor }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const text = e.clipboardData.getData("text");
                                                        Document.execCommand("insertText", false, text);
                                                    }}
                                                    disabled={playingPreview}
                                                    onFocus={() => { setEditingInput({ input: 'title', idx: slideIdx }) }}
                                                    onBlur={() => { setEditingInput(defaultEditingInput) }}
                                                    onChange={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        } else {
                                                            const html = e.target.value;
                                                            handleChangeText('title', html.replace(/(<([^>]+)>)/gi, ""), slideIdx);
                                                        }
                                                    }}
                                                />
                                            </Text>
                                            <Text id={`text-3`} style={{ marginTop: `${getComputedPixelSize(12)}px`, marginBottom: `${getComputedPixelSize(8)}px` }} editingInput={editingInput.input === 'desc' && editingInput.idx === slideIdx}>
                                                <ContentEditable
                                                    tagName="p"
                                                    html={slide.desc}
                                                    className="focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 max-w-full break-normal whitespace-normal" 
                                                    style={{ fontSize: `${getComputedPixelSize(35)}px` }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const text = e.clipboardData.getData("text");
                                                        Document.execCommand("insertText", false, text);
                                                    }}
                                                    disabled={playingPreview}
                                                    onFocus={() => { setEditingInput({ input: 'desc', idx: slideIdx }) }}
                                                    onBlur={() => { setEditingInput(defaultEditingInput) }}
                                                    onChange={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        } else {
                                                            const html = e.target.value;
                                                            handleChangeText('desc', html.replace(/(<([^>]+)>)/gi, ""), slideIdx);
                                                        }
                                                    }}
                                                />
                                            </Text>
                                            <div id="progress" className="" style={{ width: "75%", height: `${getComputedPixelSize(6)}px`, marginTop: `${getComputedPixelSize(24)}px`, backgroundColor: slide.titleColor }}></div>
                                        </div>
                                    </div>
                                </Layer>

                            </Slide>
                        })

                        
                        
                        }

                        {playingPreview && <div className="pointer-events-auto flex w-full h-full items-center justify-center"></div>}

                    </div>
                </div>

                {/* <div className="mt-4 lg:ml-4 lg:mt-0 space-x-4 lg:space-y-4 lg:space-x-0 flex flex-row lg:flex-col" style={{ width: `${isMobile ? 100 : 18.25}%`}}> */}
                <div className="mt-2 lg:ml-4 lg:mt-0 container grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-2" style={{ width: `${isMobile ? 100 : 18.25}%`}}>

                {
                    plData.map((slide, slideIdx) => {
                        return <div className={`w-full aspect-w-16 aspect-h-9 bg-white overflow-hidden rounded ${slideIdx === currentSlide ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 hover:ring-offset-gray-900'}`} ref={smallThumbPreview}>

                        

                        {smallThumbPreview.current && smallThumbPreviewWidth > 0 && 

                         <Slide id={`slide-${slideIdx + 1}`}>
                                
                                <Layer id={`layer-1`}>
                                    <Img src={slide.img} 
                                        onChange={media => {
                                            handleChangeText('img', media, slideIdx);
                                        }} 
                                        disabled={true}
                                        alt={slide.title} 
                                        id={`img-1`} 
                                        style={{ width: `${100 - textZoneWidth}%` }} 
                                        preSearchText={`${slide.title}. ${slide.desc}`} />
                                </Layer>

                                <Layer id={`layer-2`} className="justify-end">
                                    <div className="flex pointer-events-none bg-white h-full items-center" style={{ width: `${textZoneWidth}%`, padding: `${getSmallComputedPixelSize(36)}px`}}>
                                        <div className="pointer-events-none" style={{ padding: `${getSmallComputedPixelSize(36)}px`}} >
                                            <Text id={`text-1`} style={{ marginBottom: `${getSmallComputedPixelSize(12)}px` }} disabled={true} editingInput={editingInput.input === 'category' && editingInput.idx === slideIdx}>
                                                <ContentEditable
                                                    tagName="h2"
                                                    html={slide.category}
                                                    className="focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:ring-offset-4 font-bold uppercase tracking-widest max-w-full break-normal whitespace-normal select-none"
                                                    style={{ fontSize: `${getSmallComputedPixelSize(32)}px` }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const text = e.clipboardData.getData("text");
                                                        Document.execCommand("insertText", false, text);
                                                    }}
                                                    disabled={true}
                                                    onFocus={() => { setEditingInput({ input: 'category', idx: slideIdx }) }}
                                                    onBlur={() => { setEditingInput(defaultEditingInput) }}
                                                    onChange={(e) => {
                                                        const html = e.target.value;
                                                        handleChangeText('category', html, slideIdx);
                                                    }}
                                                />
                                            </Text>
                                            <Text id={`text-2`}  style={{ marginTop: `${getSmallComputedPixelSize(12)}px`, marginBottom: `${getSmallComputedPixelSize(12)}px` }} disabled={true} editingInput={editingInput.input === 'title' && editingInput.idx === slideIdx}>
                                                <ContentEditable
                                                    tagName="h1"
                                                    html={slide.title}
                                                    className="focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-bold max-w-full break-normal whitespace-normal select-none" 
                                                    style={{ fontSize: `${getSmallComputedPixelSize(84)}px`, lineHeight: `${getSmallComputedPixelSize(97)}px`, color: slide.titleColor }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const text = e.clipboardData.getData("text");
                                                        Document.execCommand("insertText", false, text);
                                                    }}
                                                    disabled={true}
                                                    onFocus={() => { setEditingInput({ input: 'title', idx: slideIdx }) }}
                                                    onBlur={() => { setEditingInput(defaultEditingInput) }}
                                                    onChange={(e) => {
                                                        const html = e.target.value;
                                                        handleChangeText('title', html, slideIdx);
                                                    }}
                                                />
                                            </Text>
                                            <Text id={`text-3`} style={{ marginTop: `${getSmallComputedPixelSize(12)}px`, marginBottom: `${getSmallComputedPixelSize(8)}px` }} disabled={true} editingInput={editingInput.input === 'desc' && editingInput.idx === slideIdx}>
                                                <ContentEditable
                                                    tagName="p"
                                                    html={slide.desc}
                                                    className="focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 max-w-full break-normal whitespace-normal select-none" 
                                                    style={{ fontSize: `${getSmallComputedPixelSize(35)}px` }}
                                                    onPaste={(e) => {
                                                        e.preventDefault();
                                                        const text = e.clipboardData.getData("text");
                                                        Document.execCommand("insertText", false, text);
                                                    }}
                                                    disabled={true}
                                                    onFocus={() => { setEditingInput({ input: 'desc', idx: slideIdx }) }}
                                                    onBlur={() => { setEditingInput(defaultEditingInput) }}
                                                    onChange={(e) => {
                                                        const html = e.target.value;
                                                        handleChangeText('desc', html, slideIdx);
                                                    }}
                                                />
                                            </Text>
                                            <div id="progress" className="" style={{ width: "75%", height: `${getSmallComputedPixelSize(6)}px`, marginTop: `${getSmallComputedPixelSize(24)}px`, backgroundColor: slide.titleColor }}></div>
                                        </div>
                                    </div>
                                </Layer>

                            </Slide>
                        }
                        
                            <div className="pointer-events-auto flex w-full h-full items-center justify-center cursor-pointer" onClick={() => transitionSlide(slideIdx)}></div>

                        </div>
                        })
                    }
                    
                </div>

            </div>}
        </div></>
    );
}

const Library = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [searchedText, setSearchedText] = useState("");
    const [medias, setMedias] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [language, setLanguage] = useState("fr");
  
    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMedias, setIsLoadingMedias] = useState(false);

    const isMobile = useMediaQuery({ query: `(max-width: 1024px)` });

    useEffect(() => {

        if (!props.isHidden && props.preSearchText !== searchedText) {
            setSearchedText(props.preSearchText);
            initTagSearchBar(props.preSearchText);
        }
        
    }, [props.isHidden])

    const initTagSearchBar = (text) => {
        CloudNaturalLanguageAPI.analyzeEntities(text).then((Result)=>{
          console.log('analyzeEntities', Result);
    
          setIsLoading(false);
    
          if (Result.entities.length > 0) {
    
            let wordsArray = [];
            let searchWords = [];
    
            setLanguage(Result.language);
    
            Result.entities.forEach((words, index) => {
    
              let word = {};
    
              word.considered = false;
              word.text = words.name.toLowerCase();
              word.salience = words.salience;
              word.searched = false;
              word.addedSearch = false;
    
              if (words.salience >= 0.07 && wordsArray.findIndex(word => word.text.toUpperCase() === words.name.toUpperCase()) == -1) {
                word.considered = true;
    
                if (((index > 0 && words.salience >= 0.50) || index < 1)) {
                  searchWords.push(words.name.toLowerCase());
                  word.searched = true;
                }
              }
    
              wordsArray.push(word);
            });
    
            let filteredWordsArray = wordsArray.filter(word => word.considered);
    
            /* setSearchQueryWords(filteredWordsArray); */

            let newTags = filteredWordsArray.map(word => word.text);

            setTags(newTags)
            setSelectedTags(searchWords);
    
            getCorrespondingImages(searchWords, Result.language);
    
            console.log('wordsArray', wordsArray);
    
          } else {
            getCorrespondingImages([], Result.language);
          }
    
          setIsLoading(false);
    
        }).catch((Err)=>{
          console.log('Saving API errors', Err);
          setIsLoading(false);
        });
    }

    const getCorrespondingImages = (words, lang = language) => {

        setIsLoadingMedias(true);

        PixaBayAPI.getCorrespondingImages(words, lang).then((Result)=>{
            console.log('getCorrespondingImages', Result);

            setMedias(Result.hits);

            setIsLoading(false);
            setIsLoadingMedias(false);

            /* let customTags = getCustomTags(Result.hits, words);
            setCustomSearchTags(customTags); */

        }).catch((Err)=>{
            console.log('Saving API errors', Err);
            setIsLoading(false);
        });

        /* PixaBayAPI.getCorrespondingImagesUnsplash(words, lang).then((Result)=>{
            console.log('getCorrespondingImagesUnsplash', Result);

            setImages(Result.hits);

            setIsLoading(false);

        }).catch((Err)=>{
            console.log('getCorrespondingImagesUnsplash', Err);
            setIsLoading(false);
        }); */
    }

    return <div className={`${isMobile || props.modal ? "fixed z-50 top-0 left-0" : "absolute top-0 left-0"} pointer-events-auto p-4 lg:p-12 w-full h-full flex flex-col space-y-2 items-center justify-start bg-gray-800 bg-opacity-30 ${props.isHidden ? 'hidden' : ''}`} style={{ background: 'rgba(16,18,27,0.4)', backdropFilter: 'blur(6px)' }}>

        <div className={`pointer-events-auto relative flex flex-col lg:max-w-2xl w-full h-full items-start justify-start bg-gray-100 rounded`}>
            {isLoading && <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
            <XIcon onClick={() => props.setShowLibrary(false)} className="absolute top-2 right-2 text-gray-700 hover:text-gray-600 cursor-pointer h-4 w-4 lg:h-6 lg:w-6" />
            <TagSearchBar className="mb-2 pt-3 pl-3 pr-8" onChange={getCorrespondingImages} tags={tags} selectedTags={selectedTags} />
            <MediaGrid className="rounded-sm mb-3 pl-3 mr-3" isLoading={isLoadingMedias} setSrc={props.setSrc} medias={medias} />
        </div>

    </div>
}

const MediaContainer = ({ src, alt, onClick, hoverOptions, selected, metadata }) => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [mediaData, setMediaData] = useState(metadata || {});
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState(src);
  
    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(true);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isSelected, setIsSelected] = useState(selected ? true : false);
  
    const isMobile = useMediaQuery({ query: `(max-width: 768px)` });

    const handleOnClick = (e) => {
        setIsSelected(!isSelected);

        if (onClick) {
            onClick({ value: mediaData, selected: !isSelected });
        }
    }
  
    return (<>
      {isMobile ? 
        <div onClick={handleOnClick} className="aspect-w-16 aspect-h-9 cursor-pointer">
          {isLoading && <div className="flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
          <img onLoad={() => setIsLoading(false)} src={mediaPreviewUrl} alt={mediaData.tags} className="select-none rounded-sm shadow w-full h-full object-center object-cover" />
          {((isMouseOver || isMobile || true) && hoverOptions && hoverOptions.length > 0) && <div className="flex flex-row items-end justify-end"><div className="p-1 bg-gray-800 bg-opacity-50 rounded-tl-lg rounded-br-sm">{hoverOptions.map(option => option)}</div></div>}
        </div>
      :
        <div onClick={handleOnClick} onMouseOver={() => setIsMouseOver(true)} onMouseLeave={() => setIsMouseOver(false)} className="aspect-w-16 aspect-h-9 cursor-pointer">
          {isLoading && <div className="flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
          <img onLoad={() => setIsLoading(false)} src={mediaPreviewUrl} alt={mediaData.tags} className="select-none rounded-sm shadow w-full h-full object-center object-cover" />
          {((isMouseOver || isMobile || true) && hoverOptions && hoverOptions.length > 0) && <div className="flex flex-row items-end justify-end"><div className="p-1 bg-gray-800 bg-opacity-50 rounded-tl-lg rounded-tl-lg rounded-br-sm">{hoverOptions.map(option => option)}</div></div>}
        </div>
      }
    </>);
}

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
            {(isMobile || true) && (showAll ? <ChevronDownIcon onClick={() => setShowAll(false)} className="m-0.5 text-gray-700 hover:text-gray-600 cursor-pointer h-5 w-5 lg:h-6 lg:w-6" /> : <ChevronRightIcon onClick={() => setShowAll(true)} className="m-0.5 text-gray-700 hover:text-gray-600 cursor-pointer h-5 w-5 lg:h-6 lg:w-6" /> )}
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

const MediaGrid = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [medias, setMedias] = useState(props.medias || []);
    const [selectedMedias, setSelectedMedias] = useState(props.selectedMedias || []);

    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMedias(props.medias);
    }, [props.medias])

    useEffect(() => {
        setIsLoading(props.isLoading);
    }, [props.isLoading])
  
    // UI LOGIC STATES
    const [mediasToDisplay, setMediasToDisplay] = useState([]);

    const handleOnClickMedia = ({ value, isSelected }) => {
        let newSelectedTags = [...selectedMedias];

        if (isSelected) {
            newSelectedTags.push(value);
        } else {
            let index = newSelectedTags.indexOf(value);

            if (index > -1) {
                newSelectedTags.splice(index, 1);
            }
        }

        setSelectedMedias(newSelectedTags);

        props.setSrc(value.largeImageURL);
    }

    const checkAsSimilarMedias = (index) => {

        let currentSelectedSearchTag = props.selectedSearchTags.length > 0 ? props.selectedSearchTags[props.selectedSearchTags.length - 1] : "";
    
        let asSimilarImages = false;
    
        medias[index].tags.split(", ").forEach(tag => {
          let tagFound = props.costumSearchTags.find(costumTag => costumTag.word === tag);
    
          if (tagFound && currentSelectedSearchTag !== tag && !props.selectedSearchTags.includes(tag)) {
            asSimilarImages = true;
          }
        })
    
        return asSimilarImages;
    }

    const handleShowSimilarMedias = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const NB_IMAGE_TO_DISPLAY = 20
    
        let tagToSelect = "";
        let nbImagesForTag = 0;
        let currentSelectedSearchTag = props.selectedSearchTags.length > 0 ? props.selectedSearchTags[props.selectedSearchTags.length - 1] : "";
    
        medias[index].tags.split(", ").forEach(tag => {
          let tagFound = props.costumSearchTags.find(costumTag => costumTag.word === tag);
    
          if (tagFound && tagFound.nbImages > nbImagesForTag && currentSelectedSearchTag !== tag && !props.selectedSearchTags.includes(tag)) {
            tagToSelect = tagFound.word;
            nbImagesForTag = tagFound.nbImages;
          }
        })
    
        if (tagToSelect !== "") {
          let newSelectedSearchTags = [...props.selectedSearchTags]; //.splice(0, selectedSearchTags.length - 1);
    
          /* let tagExistIdx = newSelectedSearchTags.findIndex(tag => tag === tagToSelect);
    
          if (tagExistIdx > -1) {
            newSelectedSearchTags.splice(tagExistIdx, 1);
          } */
    
          newSelectedSearchTags.push(tagToSelect);
          props.setSelectedSearchTags(newSelectedSearchTags);
    
          let newImagesToDisplay = [...medias];
    
          let indexSelectedSearchTag = newSelectedSearchTags.length - 1;
    
          if (newSelectedSearchTags.length > 0) {
            newImagesToDisplay = newImagesToDisplay.filter(image => {
              let match = false;
              if (!match) {
                match = image.tags.includes(newSelectedSearchTags[indexSelectedSearchTag]);
              }
    
              return match;
            });
    
            if (newImagesToDisplay.length > 0) {
              if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
                newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
              }
              setMediasToDisplay(newImagesToDisplay);
            }
          } else {
            if (newImagesToDisplay.length > NB_IMAGE_TO_DISPLAY) {
              newImagesToDisplay = newImagesToDisplay.splice(0,NB_IMAGE_TO_DISPLAY);
            }
            setMediasToDisplay(newImagesToDisplay);
          }
        }
    }

    return (
        <div className={`container grid md:grid-cols-4 grid-cols-3 gap-1 lg:grid-cols-4 lg:gap-2 mx-auto max-h-full overflow-auto ${props.className}`}>
            {medias.map((media, index) => {
                return <MediaContainer key={media.id} alt={media.tags} metadata={media} onClick={handleOnClickMedia} src={media.previewURL} /* hoverOptions={checkAsSimilarMedias(index) ? [<ViewGridAddIcon onClick={event => handleShowSimilarMedias(event, index)} className="h-4 w-4 lg:h-5 lg:w-5 text-white hover:text-opacity-75" />] : []} */ />
            })}
            {isLoading && <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center bg-white bg-opacity-30"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
        </div>
    )
}




const Slide = ({ children, id }) => {
    return <div id={id} className="pointer-events-none h-full w-full">
        {children}
    </div>
}

const Layer = ({ children, id, className }) => {
    return <div id={id} className={"pointer-events-none flex h-full w-full absolute " + className}>
        {children}
    </div>
}

const Zone = ({ children, id }) => {
    return <div id={id} className="pointer-events-none flex h-full w-full items-center justify-start">
        {children}
    </div>
}

const Img = props => {

    // STATES MANAGEMENT ------------------------------------------------------------------------------
  
    // DATA STATES
    const [src, setSrc] = useState(props.src)

    // UI LOGIC STATES
    const [isLoading, setIsLoading] = useState(true);
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);

    const { id } = props;

    const handleSwitchImg = (e) => {
        e.preventDefault();
        const { target } = e;
    
        setShowLibrary(!showLibrary);
    };

    useEffect(() => {
        setSrc(props.src);
    }, [props.src]);

    const handleOnChange = (media) => {
        setShowLibrary(false);
        props.onChange(media);
    }

    return <div id={id} onMouseOver={() => setIsMouseOver(!props.disabled && true)} onMouseLeave={() => setIsMouseOver(!props.disabled && false)} className={`relative pointer-events-auto bg-white h-full overflow-hidden ${props.className ? props.className : ''}`} style={props.style}>
        {isLoading && <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center"><LoadingSpinner className="h-6 w-6 text-blue-600" /></div>}
        <img onLoad={() => setIsLoading(false)} src={src} alt={props.alt} className={`select-none w-full h-full object-center object-cover bg-white ${props.imgClassName && props.imgClassName}`} />
        {isMouseOver && !showLibrary && <div className="absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center bg-gray-800 bg-opacity-30"><ViewGridAddIcon onClick={event => handleSwitchImg(event)} className="text-white hover:text-white cursor-pointer h-12 w-12" /></div>}
        {<Library modal={props.modalLibrary} isHidden={showLibrary ? (props.disabled ? true : false) : true} preSearchText={props.preSearchText} setSrc={handleOnChange} setShowLibrary={setShowLibrary} />}
    </div>
}

const Text = props => {

    // UI LOGIC STATES
    const [isMouseOver, setIsMouseOver] = useState(false);

    const { id } = props;

    const handleChangeText = (e) => {
        e.preventDefault();
        const { target } = e;
    };

    return <div id={id} style={props.style} onMouseOver={() => setIsMouseOver(!props.disabled && true)} onMouseLeave={() => setIsMouseOver(!props.disabled && false)} className={`relative pointer-events-auto ${props.className ? props.className : ''}`}>
        {!props.disabled && (isMouseOver || props.editingInput) && <div className="pointer-events-none absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center rounded-sm ring-1 ring-blue-500 ring-offset-2"></div>}
        {props.children}
        {isMouseOver && !props.editingInput && <div className="pointer-events-none absolute -top-0.5 -right-0.5 flex flex-row items-center justify-center rounded-sm ">
            <div className="pointer-events-none p-1 bg-blue-500 rounded-tr-sm rounded-bl">
                <PencilIcon /* onClick={event => handleChangeText(event)} */ className="pointer-events-none text-white hover:text-white cursor-pointer h-4 w-4" />
            </div>
        </div>}
    </div>
}

const LoadingSpinner = ({ className }) => {
    return (
      <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    );
  }

function InlineEdit(props) {
const [isInputActive, setIsInputActive] = useState(false);
const [inputValue, setInputValue] = useState(props.text);
const wrapperRef = useRef(null);
const textRef = useRef(null);
const inputRef = useRef(null);
const enter = useKeyPress("Enter");
const esc = useKeyPress("Escape");
// check to see if the user clicked outside of this component
useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
    props.onSetText(inputValue);
    setIsInputActive(false);
    }
});
// focus the cursor in the input field on edit start
useEffect(() => {
    if (isInputActive) {
    inputRef.current.focus();
    }
}, [isInputActive]);
useEffect(() => {
    if (isInputActive) {
    // if Enter is pressed, save the text and case the editor
    if (enter) {
        props.onSetText(inputValue);
        setIsInputActive(false);
    }
    // if Escape is pressed, revert the text and close the editor
    if (esc) {
        setInputValue(props.text);
        setIsInputActive(false);
    }
    }
}, [enter, esc]); // watch the Enter and Escape key presses
return (
    <span className="inline-text" ref={wrapperRef}>
    <span
        ref={textRef}
        onClick={() => setIsInputActive(true)}
        className={`inline-text_copy inline-text_copy--${
        !isInputActive ? "active" : "hidden"
        }`}
    >
        {props.text}
    </span>
    <input
        ref={inputRef}
        // set the width to the input length multiplied by the x height
        // it's not quite right but gets it close
        /* style={{ width: Math.ceil(inputValue.length * 0.9) + "ex" }} */
        value={inputValue}
        onChange={e => {
        setInputValue(e.target.value);
        }}
        className={`inline-text_input inline-text_input--${
        isInputActive ? "active" : "hidden"
        }`}
    />
    </span>
);
}

function useKeyPress(targetKey) {
// State for keeping track of whether key is pressed
const [keyPressed, setKeyPressed] = useState(false);
// If pressed key is our target key then set to true
function downHandler({ key }) {
    if (key === targetKey) {
    setKeyPressed(true);
    }
}
// If released key is our target key then set to false
const upHandler = ({ key }) => {
    if (key === targetKey) {
    setKeyPressed(false);
    }
};
// Add event listeners
useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
    window.removeEventListener("keydown", downHandler);
    window.removeEventListener("keyup", upHandler);
    };
}, []); // Empty array ensures that effect is only run on mount and unmount
return keyPressed;
}

function useOnClickOutside(ref, handler) {
useEffect(
    () => {
    const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
        return;
        }
        handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
    };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
);
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



export default CreationFromDataTool;