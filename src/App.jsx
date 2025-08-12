import AppRoutes from "./routes/AppRoutes.jsx"
import { BrowserRouter } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

function App(){
    return <BrowserRouter>
        <AppRoutes/>
    </BrowserRouter>
}

export default App;