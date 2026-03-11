import Header from './Header'
import {Outlet} from 'react-router-dom'

function RootLayout() {
  return (
    <div>
        <Header />
        <div className="container">
            <Outlet />
        </div>
    </div>
  )
}

export default RootLayout