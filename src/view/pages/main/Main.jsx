import React from 'react'
import css from "./main.module.css"
import Timer from "react-compound-timer"
import Loader from '../../components/Loader';

export const Main = ({text, onSubmit}) => {
    const [printWord, SetPrintWord] = React.useState("")
    const [sentences, setSentences] = React.useState([])
    const [activeWord, setActiveWord] = React.useState(0)
    const [error, setError] = React.useState()
    const [complete, setComplete] = React.useState([])
    const [countError, setCountError] = React.useState(0)
    const [stopTime, setStopTime] = React.useState(false)

    React.useEffect(() => {
        setSentences(text?.split(" "))
    }, [text])
    // При нажатии на Backspace удалеем последний элемент стоки в input
    const deleteLastSymbol = () => {
        SetPrintWord(printWord.slice(0, -1))
    }
    // При нажатии на Пробел сравниваем текущий активное слово(Тексте) со словом, который напечатали
    const checkWord = () => {
        if (printWord === sentences[activeWord]) {
            setComplete((old) => {
                return [...old, activeWord]
            });
            setActiveWord(activeWord + 1);
        }
    }
    //  Проверям на наличие опечаток
    React.useEffect(() => {
        checkSymbol()
    }, [printWord])
    const checkSymbol = () => {
        const end = printWord.length
        if (sentences[activeWord]?.substr(0, end) === printWord || !printWord) {
            setError()
            return
        }
        setCountError(countError + 1)
        setError(activeWord)
    }
    const onPrint = (e) => {
        if (e.keyCode === 8) {
            deleteLastSymbol()
        } else if (e.keyCode === 32) {
            checkWord();
            SetPrintWord("")
        } else if (((e.keyCode >= 7) && (e.keyCode <= 48)) || (e.keyCode === 144)) return null
        else {
            SetPrintWord((prev) => prev + e.key)
        }
    }
    // Вызывает функцию isTimeout когда время закончилось
    React.useEffect(() => {
        if (stopTime === true) {
            isTimeout()
        }
    }, [stopTime])
    // После окончания времени передает данные о опечатках и скорости печати,
    function isTimeout() {
        const result = complete.map((item) => {
            return (sentences[item].length + 1)
        })
        onSubmit({
            typing_speed: result !== [] ? result.reduce((a, b) => a + b, 0) / 5 : 0,
            errors_count: countError,
        })
    }
    if (!text) return <div className={css.loader}><Loader/></div>

    return <div className="container">
        <Timer
            initialTime={60 * 1000}
            direction="backward"
            startImmediately={false}
            checkpoints={[{
                time: 60,
                callback: () => setStopTime(true),
            }]}
        >
            {({start}) => (
                <>
                    <div>
                        <Timer.Minutes/> minute {}
                        <Timer.Seconds/> seconds
                    </div>
                    <div className={css.texts}>
                        <p>{sentences.map((word, index) => {
                            if (complete.includes(index)) return <span key={index}
                                                                       className={css.complete}>{word} </span>
                            if (index === activeWord) return <span key={index}
                                                                   style={{color: index === error ? "red" : ""}}
                                                                   className={css.color}>{word} </span>
                            return <span key={index}>{word} </span>
                        })
                        }</p>
                    </div>
                    <div className={css.print__block}>
                        <input className={css.input} type="text" disabled={stopTime} value={printWord}
                               onKeyDown={onPrint} onChange={start}/>
                    </div>
                    <p className={css.misprint}> Опечатки :{countError}</p>
                </>
            )}
        </Timer>
    </div>
}


