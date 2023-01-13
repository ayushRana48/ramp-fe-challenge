import ReactDOM from "react-dom/client"
import "./index.css"
import { App } from "./App"
import { AppContextProvider } from "./components/AppContextProvider"
import React from "react"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <AppContextProvider>
    <App />
  </AppContextProvider>
  

)
