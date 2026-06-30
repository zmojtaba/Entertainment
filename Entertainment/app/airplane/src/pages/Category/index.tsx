import React from 'react'
import classes from './style.module.scss'
import { motion } from "framer-motion";
import { tilesSample } from '../../constants/utilis'
import Loading from '../../Components/Loading';

const items = [
    { title: "Beach", subtitle: "Serene beauty", img: "https://source.unsplash.com/600x600/?beach", size: "large" },
    { title: "Mountain", subtitle: "Adventure awaits", img: "https://source.unsplash.com/400x400/?mountain", size: "small" },
    { title: "City", subtitle: "Urban vibes", img: "https://source.unsplash.com/400x400/?city", size: "small" },
    { title: "Forest", subtitle: "Reconnect with nature", img: "https://source.unsplash.com/600x600/?forest", size: "large" },
    { title: "Desert", subtitle: "Feel the sand", img: "https://source.unsplash.com/400x400/?desert", size: "small" },
    { title: "Snow", subtitle: "Winter adventure", img: "https://source.unsplash.com/400x400/?snow", size: "small" },
];

function Category() {
    return (
        <div className={classes.page}>
            <div className={classes.gridContainer}>
                <div className="bento-grid">
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            className={`grid-item ${item.size}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <img src={item.img} alt={item.title} />
                            <div className="overlay">
                                <h2>{item.title}</h2>
                                <p>{item.subtitle}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Loading message='' loading={true} />
        </div>
    )
}

export default Category