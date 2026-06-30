import React, { useEffect, useState } from 'react'
import classes from './style.module.scss'
import { motion } from "framer-motion";
import {  useNavigate } from 'react-router-dom';
import logoImage from '@assets/images/download.png'
import { IoReturnUpBackOutline } from "react-icons/io5";
import { categoreyMusic } from '../constant/utils';
import type { CategoryStory } from '../types';

function CategoryAudioStoryPage() {
    const [pos, setPos] = useState({ x: 50, y: 50 });
    const [categories, setCategories] = useState<CategoryStory[]>(categoreyMusic)
    const navigate = useNavigate()


    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };
    const handelClickItem = (itemType: CategoryStory) => {
        const route = itemType.type.includes('Book') ? `/Book/${itemType.type}`
            : itemType.type.includes('Podcast') ? `/Podcast/${itemType.type}`
                : itemType.type.includes('Audio') ? `/Audio_story/${itemType.type}` : '/'
        navigate(route)
    }
    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.backIcon} onClick={() => navigate('/')}>
                    <IoReturnUpBackOutline size={25} title='Back' />
                </div>
                <div className={classes.nav}>
                    <img src={logoImage} width={100} height={40} />
                </div>
            </div>
            <div className={classes.main}>
                <div className={classes.bentoGrid}
                    onMouseMove={handleMouseMove}
                    style={{ "--mouse-x": `${pos.x}px`, "--mouse-y": `${pos.y}px` } as React.CSSProperties}
                >
                    {categories.map((item, index) => {
                        return (
                            <motion.div
                                onClick={() => handelClickItem(item)}
                                // style={{ zIndex: 20, overflow: 'hidden' }}
                                key={index}
                                style={{ "--delay": `${index * 0.12}s` } as React.CSSProperties}
                                className={`grid-item ${item.name}`}

                            >
                                <img className='image' src={item.image} alt={item.name} />
                                <div className="overlay">
                                    <motion.h2
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.15 + 0.2, duration: 0.4 }}
                                    >
                                        {item.type.replaceAll('_', ' ')}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.15 + 0.3, duration: 0.4 }}
                                    >
                                        {item.subtitle}
                                    </motion.p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div >
    )
}

export default CategoryAudioStoryPage