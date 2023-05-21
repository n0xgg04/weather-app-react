import React, {useCallback} from 'react';
import './scss/style.scss';
import { FiSearch } from 'react-icons/fi';
import { GoSettings } from 'react-icons/go';
import iconCloudy from './assets/images/cloudy.png';
import axios from 'axios';

const Weather = React.memo(() => {
    const [weather, setWeather] = React.useState({});
    const [checkedStatus, setCheckedStatus] = React.useState(false);
    const [location, setLocation] = React.useState("Hanoi");
    const [user, setUser] = React.useState({
        searchType: "Hanoi"
    });
    const hideBarRef = React.useRef();
    const [isFirst, setIsFirst] = React.useState(true);

    function formatDecimal(number) {
        if (number*10 % 10 === 0) {
            return number.toFixed(0);
        } else {
            return number.toFixed(1);
        }
    }


    const getWeather = useCallback((location) => {
        axios.get("https://api.openweathermap.org/data/2.5/weather?q="+location+"&appid=b3961819fc3dff09774d1c9ea5011a8d&units=metric")
            .then((res) => {
                setWeather(res.data);
                console.log("fetch data at " + new Date().toLocaleTimeString());
            })
            .catch((err) => {
                console.log(err);
            });
    },[])

    React.useEffect(() => {
        console.log("componentDidMount or componentDidUpdate");

        const autoRefresh = setInterval(() => {
            getWeather(location);
        }, 10000);

        if(isFirst){
            getWeather(location);
            setIsFirst(false);
        }

        return () =>{
            clearInterval(autoRefresh);
            console.log("componentWillUnmount");
        }
    },[location,weather,getWeather,isFirst]);


    console.log("render")
    return (
            <>
                <div className="weatherBox">
                    {!weather && (
                        <div className="loading">
                            <div className="loading__icon"></div>
                        </div>
                    )}
                    <div className="weatherBox__header">
                        <div ref={hideBarRef} className="weatherBox__header-searchBox hideBar">
                            <input
                                onChange={(e) => {
                                    setUser({
                                        ...user,
                                        searchType: e.target.value
                                    })
                                }}
                                type="text"
                                className="searchBox"
                                value={user.searchType}
                                placeholder="Nhập tỉnh, thành phố"
                            />
                        </div>
                        <div className="weatherBox__header-searchButton">
                            <input
                                onChange={() => {}}
                                type="checkbox"
                                className="showSearchBar"
                                checked={checkedStatus}
                                id="btnShow"
                            />
                            <label
                                onClick={() => {
                                    if(user.searchType !== ""){
                                        setLocation(user.searchType)
                                        setIsFirst(true);
                                    }
                                    setCheckedStatus(!checkedStatus);
                                    hideBarRef.current.classList.toggle("hideBar");
                                }}
                                htmlFor="btnShow"
                                className="btnShow"
                            >
                <span>
                  <FiSearch></FiSearch>
                </span>
                            </label>
                            <button className="searchButton">
                                <GoSettings></GoSettings>
                            </button>
                        </div>
                    </div>
                    <div className="weatherContent">
                        <div className="weatherContent_info">
                            <div className="weatherContent_info-location">
                                <img style={{
                                    marginRight: "5px",
                                }} src={iconCloudy} alt="iconCloudy" className="iconCloudy" />
                                <span className="location">{location}</span>
                            </div>
                            <div className="weatherContent_info-temperature">
                                <span className="temperature">{formatDecimal(parseFloat(weather?.main?.temp))}&deg;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
}, (prevProps, nextProps) => {
    if (prevProps.weather === nextProps.weather) {
        return true;
    }
})

export default Weather;


