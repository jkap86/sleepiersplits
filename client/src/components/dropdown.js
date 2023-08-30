import { useState, useCallback, useEffect, useRef } from "react"
import headshot from '../images/headshot.png';


const Dropdown = ({
    placeholder,
    list,
    searched,
    setSearched,
    sendDropdownVisible,
    disabled
}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const tooltipRef = useRef();

    useEffect(() => {
        const handleExitTooltip = (event) => {

            if (!tooltipRef.current || !tooltipRef.current.contains(event.target)) {

                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleExitTooltip);

        return () => {
            document.removeEventListener('mousedown', handleExitTooltip);
        }

    }, [])

    useEffect(() => {
        sendDropdownVisible && sendDropdownVisible(dropdownVisible)
    }, [dropdownVisible])

    useEffect(() => {
        if (searched?.display_name || searched === '') {
            setDropdownVisible(false)
        } else {
            setDropdownVisible(true)
        }
    }, [searched])

    const format = (string) => {
        return string
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
    }

    const getOptions = useCallback((s) => {
        const all_options = list
        const options = s.trim() === '' ? all_options : all_options
            .sort((a, b) =>
                (format(b.display_name).split(' ').indexOf(format(s.trim())) || 999)
                - (format(a.display_name).split(' ').indexOf(format(s.trim())) || 999)
                || (format(b.display_name).trim().indexOf(format(s.trim())) || 999)
                - (format(a.display_name).trim().indexOf(format(s.trim())) || 999)

            )


        return options;
    }, [list])

    const handleSearch = (input) => {
        let s = input
        let options;
        let visible;

        if (s === '') {
            options = list;
            visible = true
            setSearched(s)
        } else if (list.map(x => x.display_name?.trim().toLowerCase()).includes(s.trim().toLowerCase())) {

            const option = list.find(x => x.display_name?.trim().toLowerCase() === s.trim().toLowerCase())
            options = []
            visible = false
            setSearched(option)
        } else {

            options = getOptions(s)
            visible = true
            setSearched(s)
        }


        setDropdownVisible(visible)
        setDropdownOptions(options)
    }

    return <div className="dropdown_container">
        {
            searched?.display_name ?
                <img
                    alt="headshot"
                    src={searched.headshot || headshot}
                />
                :
                null
        }
        <input
            onChange={(e) => handleSearch(e.target.value)}
            onBeforeInput={(e) => e.target.value?.trim() === "" ? handleSearch(" ") : null}
            onFocus={(e) => e.target.value?.trim() === "" ? handleSearch(" ") : null}
            className={'search'}
            placeholder={placeholder}
            type="text"
            value={searched?.display_name || searched}
            autoComplete={'off'}
            disabled={disabled}
        />
        {
            dropdownVisible ?
                <ol className="dropdown" ref={tooltipRef}>
                    {
                        dropdownOptions
                            .slice(0, 100)
                            .map((dropdown_option, index) => {
                                return <li key={dropdown_option.gsis_id}>
                                    <button onMouseDown={() => setSearched(dropdown_option)} type="button">
                                        <p>
                                            <img
                                                alt="headshot"
                                                src={dropdown_option.headshot || headshot}
                                            />
                                            {dropdown_option.display_name}
                                        </p>
                                    </button>
                                </li>
                            })
                    }
                </ol>
                : null
        }
    </div>
}

export default Dropdown;