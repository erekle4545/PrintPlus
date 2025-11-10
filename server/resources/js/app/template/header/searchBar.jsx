import React, {useContext} from 'react';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {RouteLinks} from '../../store/hooks/useRouteLinks';
import {Context} from "../../store/context/context";
import {AddBox, LocalFlorist, Logout, ShoppingCartRounded} from "@mui/icons-material";
import {useQuery} from "react-query";
import useHttp from "../../store/hooks/http/useHttp";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {animations} from "react-animation";

export default  function SearchBar() {
    const navigate = useNavigate();
    const {dispatch} = useContext(Context)
    const location = useLocation();
    const http = useHttp();
    const search = (e) => {
        dispatch({type:'SEARCH',payload:e.target.value})
    }
    const showCatFilter= location.pathname.split('/')?.[2] ==='filter';

    const { data: data, error, isLoading } = useQuery('top-category',()=>{
        return  http.get('category',{params:{top:true}}).then((res)=>{
            return res.data.data
        })
    });

    const categoryList = () => {
        return data&&data.map((item,index)=>{
            return <li style={{animation: animations.fadeIn}} key={index}><NavLink to={`/category/${item.slug}/${item.id}`}>{item.title}</NavLink></li>
            // return <Nav.Link key={index} href={'/category/filter/'+item.id}>{item.title}>Features</Nav.Link>
        })
    }

    return <div className='row'>
        <div className='col-xl-12 col-md-12 col-sm-12 p-0 '>

            <Navbar expand="xxl" className=''  >
                <Navbar.Brand className='d-xl-none'>
                    <NavLink to='/'>
                        <img className='' height={'50'} src='/img/logo/logo.png' alt=''/>
                    </NavLink>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
               <Navbar.Collapse className='justify-content-between ' id="basic-navbar-nav" >

                    <Nav className="mr-auto top-nav title_font p-2">
                        <li className=' '><NavLink to='/'><i className='fa fa-home icon-font-size'></i> მთავარი
                        </NavLink></li>
                        {categoryList()}
                        {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                        {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Divider />*/}
                        {/*    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                    <Nav className='search-bar-menu-search ' pullRight>
                        {location.pathname === '/' || showCatFilter === true ? <div className="input-group">
                                <input onChange={(e) => search(e)} type="search" className="form-control rounded title_font"
                                       placeholder="ძებნა" aria-label="ძებნა"/>
                            </div>
                            : null

                            // <button type="button" onClick={() => navigate('/')} className="btn btn-light title_font">
                            //     <ShoppingCartRounded/> კალათაშია {JSON.parse(localStorage.getItem('cart'))?.length}  </button>

                        }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        </div>


    </div>
}
