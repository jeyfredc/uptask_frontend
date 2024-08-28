import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import DashboardView from '@/views/DashboardView'

export default function Router() {
    
    
    return(
        <BrowserRouter>
            <Routes>
                <Route >
                    <Route element={<AppLayout />}>
                    {/* Se pone index para indicar que es la pagina principal */}
                    <Route path='/' element={<DashboardView />} index />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}