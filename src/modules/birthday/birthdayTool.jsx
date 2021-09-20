import React, { useState, useRef, useEffect } from 'react';
import FcmBd from '../dataSource/FcmBd';

const BIRTHDAY_IMG_BACKGROUNDS = [
    { img: "https://images.unsplash.com/photo-1523755130311-9eadea3a0861?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3800&q=80", textColor: "gray-900", textShadow: "0 0px 2px rgba(255,255,255,0.40), 0 0px 15px rgba(255,255,255,0.15)", maxNameCol: 6 },
    { img: "https://images.unsplash.com/photo-1523757956233-94a86ff74ea5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3800&q=80", textColor: "gray-900", textShadow: "0 0px 2px rgba(255,255,255,0.40), 0 0px 15px rgba(255,255,255,0.15)", maxNameCol: 3 },
    { img: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3800&q=80", textColor: "white", textShadow: "0 0px 2px rgba(0,0,0,0.40), 0 0px 15px rgba(0,0,0,0.15)", maxNameCol: 3},
    { img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3500&q=80", textColor: "white", textShadow: "0 0px 2px rgba(0,0,0,0.40), 0 0px 15px rgba(0,0,0,0.15)", maxNameCol: 6 },
    { img: "https://images.unsplash.com/photo-1559456751-057ed03f3143?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=5000&q=80", textColor: "white", textShadow: "0 0px 2px rgba(0,0,0,0.40), 0 0px 15px rgba(0,0,0,0.15)", maxNameCol: 6 },
    { img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=6400&q=80", textColor: "white", textShadow: "0 0px 2px rgba(0,0,0,0.40), 0 0px 15px rgba(0,0,0,0.15)", maxNameCol: 6 },
    { img: "https://images.unsplash.com/photo-1519306980079-d14db7cebf33?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3800&q=80", textColor: "white", textShadow: "0 0px 2px rgba(0,0,0,0.40), 0 0px 15px rgba(0,0,0,0.15)", maxNameCol: 6 },
    { img: "https://images.unsplash.com/photo-1498673394965-85cb14905c89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3800&q=80", textColor: "white", textShadow: "0 0px 2px rgba(0,0,0,0.40), 0 0px 15px rgba(0,0,0,0.15)", maxNameCol: 6 }
];

const BIRTHDAY_TITLES = [
    "Joyeux anniversaire!",
    "Bonne fête!",
    "Bon anniversaire!",
    "Nos fêtés!"
];

const BirthdayTool = ({ isHidden }) => {

    const [date, setDate] = useState("2021-09-20");
    const [birthdays, setBirthdays] = useState([]);
    const [bgImgIdx, setBgImgIdx] = useState(0);
    const [titleIdx, setTitleIdx] = useState(0);

    const [playingPreview, setPlayingPreview] = useState(true);

    /* const [thumbPreviewWidth, setThumbPreviewWidth] = useState(0);
    const thumbPreview = useRef(); */

    const handleLoadBirthdays = () => {
        let query = { 
            select: {
                nom: 1,
                prenom: 1,
                date: 1,
            }, 
            from: 'Fetes',
            where: { "date": { "$sameMonthAndDay": date }},
            orderBy: [{ nom: 1 }, { prenom: 1 }]
        };

        FcmBd.DataSources.query('TestData', false, query).then(results => {
            incrBgImgIdx();
            setPlayingPreview(false);
            setBirthdays(results.data);
        });
    }

    const incrBgImgIdx = () => {
        let newBgImgIdx = bgImgIdx + 1;
        let newTitleIdx = titleIdx + 1;

        if (BIRTHDAY_IMG_BACKGROUNDS.length > newBgImgIdx) {
            setBgImgIdx(newBgImgIdx);
        } else {
            setBgImgIdx(0);
        }

        if (BIRTHDAY_TITLES.length > newTitleIdx) {
            setTitleIdx(newTitleIdx);
        } else {
            setTitleIdx(0);
        }
    }

    const handlePlayingPreview = (e, play) => {
        e.preventDefault();

        if (!play) {
            incrBgImgIdx();
        }
        
        setPlayingPreview(play);
    }

    useEffect(() => {
        if (!isHidden) {
            let query = { 
                select: {
                    nom: 1,
                    prenom: 1,
                    date: 1,
                }, 
                from: 'Fetes',
                where: { "date": { "$sameMonthAndDay": date }},
                orderBy: [{ nom: 1 }, { prenom: 1 }]
            };
    
            FcmBd.DataSources.query('TestData', false, query).then(results => {
                setBirthdays(results.data);
            });
        }
    }, [isHidden]);

    /* useEffect(() => {
        if (thumbPreview.current) {
            setThumbPreviewWidth(thumbPreview.current.offsetWidth);
        }
        
    }, [thumbPreview]);
    
    const getComputedPixelSize = (pixel) => {
        let computedPixelSize = 0;
        let currentThuumbPreviewWidth = thumbPreviewWidth;

        if (thumbPreviewWidth === 0 && thumbPreview.current) {
            currentThuumbPreviewWidth = thumbPreview.current.offsetWidth;
            setThumbPreviewWidth(currentThuumbPreviewWidth);
        }

        computedPixelSize = currentThuumbPreviewWidth / 672 * pixel;

        return computedPixelSize;
    } */


    return (
        <div className={`min-h-screen flex-col items-start justify-start bg-gray-100 py-20 lg:py-12 px-4 sm:px-6 lg:px-52 space-y-10 lg:space-y-8 ${isHidden ? 'hidden' : 'flex'}`}>
            <div className="w-full flex space-y-4 lg:space-y-0 flex-col lg:flex-row items-start lg:justify-between">
                <h2 className="ml-2 text-left text-3xl font-extrabold text-gray-900 select-none">Fêtes automatisées</h2>
                <input id="date" type="date" value={date} onChange={event => setDate(event.target.value)} onBlur={handleLoadBirthdays}  className="form-input appearance-none rounded-none relative block max-h-20 px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:placeholder-transparent focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" />
            </div>
            <div className="lg:px-28 w-full"/*  ref={thumbPreview} */>
                <div className="w-full aspect-w-16 aspect-h-9 bg-gray-100 rounded-md shadow overflow-hidden">
                    <div className="overflow-hidden"><img src={BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].img} alt="ThumbBg" onLoad={event => {handlePlayingPreview(event, true) }} onAnimationStart={event => handlePlayingPreview(event, true)} onAnimationEnd={event => handlePlayingPreview(event, false)} className={`${playingPreview ? 'zoom-in-zoom-out' : 'zoom-ended'} select-none rounded-md w-full h-full object-center object-cover`} /></div>
                    {/* <div className="overflow-hidden"><video crossorigin="anonymous"  muted="true" autoplay="true" loop="true" src={"http://dev.medias.netsign.tv/videos/154753_1.mp4#t=0,20"} alt="ThumbBg" className={`select-none rounded-md w-full h-full object-center object-cover`} /></div> */}
                    {/* <div className="pointer-events-none flex w-full h-full items-start justify-center">
                        <h2 className="mt-20 text-left text-5xl font-indieflower font-extrabold text-white select-none">Joyeux anniversaire!</h2>
                    </div>
                    <div className="pointer-events-none flex w-full h-full items-center justify-center">
                        <div className={`grid grid-rows-${birthdays.length > 5 ? Math.ceil(birthdays.length / 2) : birthdays.length} grid-flow-col gap-y-10 gap-x-20`}>
                            {birthdays.map((birthday, index) => {
                                return <div className="text-center text-3xl text-white select-none font-bold">{`${birthday.prenom} ${birthday.nom}`}</div>
                            })}
                        </div>
                    </div> */}

                    {/* <div className="pointer-events-none flex w-full h-full items-start justify-start p-8">
                            <div className="flex-col items-center justify-center pt-10 pb-12 px-10 space-y-10 rounded-lg">
                                <h2 className="text-center rounded-lg w-full white-glassmorphism text-5xl font-permanentmarker text-white select-none" style={{"textShadow": "0 0px 2px rgba(0,0,0,0.20), 0 0px 15px rgba(0,0,0,0.15)"}}>Joyeux anniversaire!</h2>
                                <div className={`grid rounded-lg white-glassmorphism max-w-max grid-rows-${birthdays.length > 3 ? Math.ceil(birthdays.length / 2) : birthdays.length} grid-flow-col gap-y-4 gap-x-20`}>
                                    {birthdays.map((birthday, index) => {
                                        return <div><p className="text-left text-3xl font-indieflower text-white select-none font-extrabold" style={{"textShadow": "0 0px 2px rgba(0,0,0,0.20), 0 0px 15px rgba(0,0,0,0.15)"}}>{`${birthday.prenom} ${birthday.nom}`}</p></div>
                                    })}
                                </div>
                            </div>
                    </div> */}

                    <div className="pointer-events-none flex w-full h-full items-start justify-start p-8">
                        <div className="flex-col white-glassmorphism items-center justify-center pt-8 pb-8 px-10 space-y-10 rounded-lg">
                            <h2 className={`text-left w-full text-7xl font-permanentmarker text-${BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textColor} select-none`} style={{"textShadow": BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textShadow }}>{BIRTHDAY_TITLES[titleIdx]}</h2>
                            <div className={`grid grid-rows-${birthdays.length > BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].maxNameCol ? Math.ceil(birthdays.length / 2) : birthdays.length} grid-flow-col gap-y-6 gap-x-20`}>
                                {birthdays.map((birthday, index) => {
                                    return <div className={`text-left font-indieflower text-5xl tracking-widest text-${BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textColor} select-none`} style={{"textShadow": BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textShadow }}><span className="font-bold">{`${birthday.prenom}`}</span> <span className="font-bold">{`${birthday.nom}`}</span></div>
                                })}
                            </div>
                        </div>
                    </div>


                    {/* <div className="pointer-events-none flex w-full h-full items-start justify-start p-8">  
                        <div className="flex-col items-center justify-center space-y-2">
                            <h2 className={`text-left white-glassmorphism max-w-max text-6xl py-8 px-10 rounded-lg font-permanentmarker text-${BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textColor} select-none`} style={{"textShadow": BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textShadow }}>Joyeux anniversaire!</h2>
                            <div className={`grid py-8 px-10 max-w-max white-glassmorphism rounded-lg grid-rows-${birthdays.length > BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].maxNameCol ? BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].maxNameCol : birthdays.length} grid-flow-col gap-y-4 gap-x-20`}>
                                {birthdays.map((birthday, index) => {
                                    return <div className={`text-left font-indieflower tracking-widest text-${BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textColor} select-none`} style={{"textShadow": BIRTHDAY_IMG_BACKGROUNDS[bgImgIdx].textShadow }}><span className="font-bold text-4xl">{`${birthday.prenom}`}</span> <span className="font-bold text-4xl">{`${birthday.nom}`}</span></div>
                                })}
                            </div>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
}

export default BirthdayTool;