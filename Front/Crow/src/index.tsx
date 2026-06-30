import "./i18n"
import "./styles/main.scss"
import ReactDOM from "react-dom/client"
import App from "app/App"
import reportWebVitals from "./reportWebVitals"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(<App />)

reportWebVitals()
