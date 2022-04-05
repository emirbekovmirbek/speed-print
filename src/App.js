import {Main} from "./view/pages/main/Main"
import React from "react"

function App() {
    const [text, setText] = React.useState("");
    const [result, setResult] = React.useState({
        typing_speed: "",
        errors_count: "",
    })

    React.useEffect(() => {
        fetch("https://60f15c0c38ecdf0017b0fbdb.mockapi.io/text")
            .then((res) => res.json())
            .then((data) => {
                setText(data[Math.floor(Math.random() * (data.length - 1))].text)
            })
    }, [])
    const start = () => {
        setResult({
            typing_speed: "",
            errors_count: "",
        })
    }
    return (
        <div className="App">
            {result.typing_speed === "" ? <Main
                text={text}
                onSubmit={(obj) => setResult(obj)}
            /> : ""}
            {result.typing_speed !== "" ? <div className="your__result container">
                <h1 className="title">Ваш результат</h1>
                <p className="errors_count">{`Количество опечаток: ${result.errors_count}`}</p>
                <p className="typing_speed">{` Слов в миниту: ${result.typing_speed}`}</p>
                <button className="start__btn" onClick={start}>Старт</button>
            </div> : ""}
        </div>
    )
}

export default App
