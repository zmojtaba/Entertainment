import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../App.css";
import imaes from '@assets/images/iceland1.jpg'
import { type Categorys } from "../../store/types";
import LoadingComponets from "../../Components/Loading";
import { categoreys } from "../../constants/utilis";
import { Outlet, useNavigate } from "react-router-dom";
import classes from './style.module.scss'
import logoImage from '@assets/images/download.png'
import ice from '/iceland1.jpg'

export default function Dashboard() {
    const [categories, setCategories] = useState<Categorys[]>([])
    const [loading, setLoading] = useState(true)
    const [pos, setPos] = useState({ x: 50, y: 50 });
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true)
        showLoading()
    }, [])
    const showLoading = async () => {
        await window.wait(5000);
        setLoading(false)
        setCategories(categoreys)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };
    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <div className={classes.logo}>
                    <img src={logoImage} width={100} height={40} />
                </div>
                <div className={classes.nav}>
                    <span>Netflix </span>
                </div>
            </div>
            <div className={classes.main}>
                <div className="bento-grid"
                    onMouseMove={handleMouseMove}
                    style={{ "--mouse-x": `${pos.x}px`, "--mouse-y": `${pos.y}px` } as React.CSSProperties}
                >
                    {categories.map((item, index) => {

                        return (
                            <motion.div
                                onClick={() => navigate(`/${item.type == 'None' ? '' : item.type}`)}
                                style={{ zIndex: 20, overflow: 'hidden' }}
                                key={index}
                                className={`grid-item ${item.name}`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ type: "spring", stiffness: 150, damping: 15, delay: index * 0.1 }}
                            >
                                <img src={item.image == 'iceland1' ? ice : logoImage} alt={item.name} />
                                <div className="overlay">
                                    <motion.h2
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.15 + 0.2, duration: 0.4 }}
                                    >
                                        {item.type != 'None' && item.type.replaceAll('_', ' ')}
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
            <LoadingComponets loading={loading} />
            <Outlet />
        </div>
    );
}
