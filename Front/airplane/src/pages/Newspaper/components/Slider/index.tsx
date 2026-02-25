import { useEffect, useRef, useState, type SetStateAction } from "react";
import classes from "./style.module.scss";
// import images from '@assest/images/home.png'
import { IoReturnUpBackOutline } from "react-icons/io5";
import logoImage from '@assets/images/download.png'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingComponets from "../../../../Components/Loading";
import { API_CONFIG } from "../../../../constants/ApiConfig";
import clsx from "clsx";
import type { INewspaper } from "../../types";
import type { Genre } from "@/store/types";
import { filterByGenres, getGeners, getMovies } from "../../constant/api";


export default function Slider() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [genres, setGerners] = useState<Genre>();
    const [menuOpen, setMenuOpen] = useState(false);
    const [language, setLanguage] = useState('');
    const [movies, setMovies] = useState<INewspaper[]>([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { category } = useParams();

    console.log(category);

    useEffect(() => {
        let tempLanguage = '';
        if (category == 'Iranian_Newspaper') {
            tempLanguage = 'Persian';
        } else
            tempLanguage = '';

        setLanguage(tempLanguage)

        setLoading(true)
        getMovies(tempLanguage, '')
            // getMovies('', '')
            .then((res) => {
                setMovies(res.data)
                // setLoading(false)
                // console.log("dddddd", res.data)

            })
            .catch((_err: any) => {
                setLoading(false)
            }).finally(() => {
                getGeners()
                    .then((res) => {
                        setGerners(res.data)
                        setLoading(false)
                    })
                    .catch((_err: any) => {
                        setLoading(false)
                    })
            })
    }, [])

    let scrollAmount = 0;

      const goNext = () => {
        scrollAmount = window.innerWidth <= 481 ? (sliderRef.current?.scrollWidth! / movies.length) : (sliderRef.current?.scrollWidth! / movies.length) * 3
        sliderRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    const goPrev = () => {
        scrollAmount = window.innerWidth <= 481 ? (sliderRef.current?.scrollWidth! / movies.length) : (sliderRef.current?.scrollWidth! / movies.length) * 3
        sliderRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }



      useEffect(() => {
            const handleOrientationChange = () => {
                if (sliderRef.current) {
                    // console.log('orientation changed → scrolling to top');
                    sliderRef.current.scrollLeft = 0
                }
            };
    
            // اضافه کردن listener
            window.addEventListener('orientationchange', handleOrientationChange);
            window.addEventListener('resize', handleOrientationChange);
    
            // اجرا کردن یک بار موقع mount (اختیاری)
            handleOrientationChange();
    
            // cleanup
            return () => {
                window.removeEventListener('orientationchange', handleOrientationChange);
                window.removeEventListener('resize', handleOrientationChange);
            };
        }, []); 
    // Scroll با موس
    // useEffect(() => {
    //     const slider = sliderRef.current;
    //     if (!slider) return;

    //     const handleWheel = (e: WheelEvent) => {
    //         e.preventDefault();
    //         // console.log("e.deltaY",e.deltaX);

    //         slider.scrollBy({ left: e.deltaY, behavior: "smooth" });
    //     };

    //     slider.addEventListener("wheel", handleWheel, { passive: false });
    //     return () => slider.removeEventListener("wheel", handleWheel);
    // }, []);

    const handleFilterByGeners = async (title: string) => {
        setSelectedGenre(title)
        setLoading(true)
        filterByGenres(language, title)
            .then(async res => {
                // await window.wait(3000)
                setMovies(res.data)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
    }

    return (
        <div className={classes.container} >
            <div className={classes.header}>
                <div className={classes.backIcon} onClick={() => navigate('/Magazine')}>
                    <IoReturnUpBackOutline size={25} title='Back' />
                </div>
                <div className={classes.logo}>
                    <img src={logoImage} width={100} height={40} />
                    <button
                        className={classes.hamburger}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? 'x' : '☰'}
                    </button>
                </div>
            </div>
            {/* Hamburger */}

            <div className={classes.main}>
                <div className={`${classes.menu} ${menuOpen && classes.open}`}>
                    <div className={classes.menuTitle}>
                        <div className={classes.title}>Filter by Genre</div>

                        <button
                            title="Close"
                            className={classes.closeIcon}
                            onClick={() => setMenuOpen(false)}
                        >
                            {menuOpen ? 'x' : '☰'}
                        </button>
                    </div>
                    <div className={classes.menuContent}>
                        {
                            genres?.genres?.length &&
                            genres?.genres?.map((genre, index) => (
                                <div key={index} className={clsx(classes.menuItem, selectedGenre == genre.title && classes.isSelect)}
                                    onClick={() => handleFilterByGeners(genre.title)}
                                >{genre.title}</div>
                            ))
                        }
                    </div>


                </div>

                {/* Slider */}
                <div className={classes.netflixSlider}>
                    <div className={classes.sliderTrack} ref={sliderRef}>
                        {movies.map((m, idx) => (
                            <div
                                className={classes.movieCard}
                                ref={cardRef}
                                key={idx}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => navigate(`/newspaper/${category}/${m.id}`)}
                            >
                                <img src={`${API_CONFIG.movie}/media/${m.posterImageUrl.replaceAll('\\', '/')}`} alt={m.title} />


                                <div className={classes.movieHover}>
                                    <h3>{m.title}</h3>
                                    {/* <div className={classes.genre}>{m.genres.map((g,index) => (<span key={index}>{g}</span>))}</div> */}
                                    <div className={classes.desc}>{`Publisher : ${m?.publisher.name}`}</div>
                                    {/* <button className={classes.playBtn}>Show</button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                    {
                        movies?.length ?
                        <>
                            <button className={`${classes.nav} ${classes.prev}`} onClick={goPrev}>
                                ❮
                            </button>
                            <button className={`${classes.nav} ${classes.next}`} onClick={goNext}>
                                ❯
                            </button>
                        </>:<></>
                    }
                </div>
            </div>
            <LoadingComponets
                loading={loading}

            // key={200}
            // message="
            />
        </div >
    );
}
