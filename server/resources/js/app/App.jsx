import './components/css/App.css';
import './components/css/media.css';
import './components/css/mobmenu.css';
import TopMenu from "./template/header/topMenu";
import SearchBar from "./template/header/searchBar";
import {useContext} from "react";
import {Context} from "./store/context/context";
import UseAuth from "./store/hooks/http/useAuth";
import Router from "./route/route";
import MenuBar from "./template/phone/menuBar";
import Messenger from "./content/messenger/messenger";

function App() {
    const {state} = useContext(Context);

    return (<>
      <UseAuth/>

        {/*{ localStorage.getItem('token') ? state.auth ?*/}
          <>
              <TopMenu/>
              <MenuBar/>
              {/*<Slider/>*/}
              <div className="my-container">
                  <div className='container-xl'>
                      <SearchBar/>
                  </div>
              </div>
              <div className='container-xl route-container'>
                  <Router/>
              </div>
              <Messenger/>
          </>
      {/*   :<Login />:<Login />*/}
      {/*}*/}


  </>);
}

export default App;
