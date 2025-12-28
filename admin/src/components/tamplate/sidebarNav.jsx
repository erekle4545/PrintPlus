import React, {useContext, useEffect} from "react";
import {Link,NavLink} from "react-router-dom";
import {Context} from "../../store/context/context";
import LangData from "../../language/langs/nuvLang.json";
import useHttp from "../../store/hooks/http/useHttp";
import {RouteLinks} from "../../store/hooks/useRouteLinks";
import Draggable from 'react-draggable';
import Logo from '@/assets/img/logo.png';
const SidebarNav = () => {
    let http = useHttp();
    // Language Translate
    const {state,dispatch} = useContext(Context);
    const translate = (translateName) => {
        if (!LangData[translateName]) {
            return translateName;
        }

        const currentLang = state.lang.code;
        const storedLang = localStorage.getItem('lang');

        return (
            LangData[translateName][currentLang] ||
            LangData[translateName][storedLang] ||
            translateName
        );
    };

    // End translate Lang

    // User Request
        const getUser = ()=>{
            http.get('user').then((response)=>{
                if(response.status === 200){
                    dispatch({type:'USER',payload:response.data})
                    // console.log(response.data)
                }
            }).catch(err=>{
                console.log(err.response)
            });
        }
    //END user Request

    // delete record cart
    const recordCardDelete = (text) => {
            dispatch({type:'NOTIFY',payload:state.notify.filter((e)=>e.text !==text)})
    }

    //Get
    useEffect(()=>{
       getUser();
        // console.log(state.user)
    },[])


  return(
      <nav id="sidebar" className={`sidebar ${state.menu_box}`}>
          {/*Cards*/}
          {state.notify.length > 0&&state.notify.map(item=>{
             return <Draggable>
                         <div className='card-draggable ' style={{position:"absolute",backgroundColor:item.color?item.color:'#6610f2',color:'#fff'}}>
                            <div className='text-end font-weight-bold card-close' onClick={()=>recordCardDelete(item.text)}><span >x</span></div>
                            <p>{item.text}</p>
                            <p>{item.date}</p>
                         </div>
             </Draggable>
          })}
          {/*End Cards*/}
          <Link className="sidebar-brand title_font fw-bolder" to="/dashboard">

              <img src={Logo} width={30} title={''} alt={'t'} /> FOR PRINT PLUS
          </Link>
          <div className="sidebar-content">
              <div className="sidebar-user">
                  <img src="/img/avatars/avatar.png" className="img-fluid rounded-circle mb-2" alt="user"/>
                  <div className="fw-bold title_font">{state.user.name?state.user.name:'...'}</div>
                  <small className='text_font'>{translate('administrator')}</small>
              </div>
              <ul className="sidebar-nav title_font">
                  <li className="sidebar-header">
                      {translate('home')}
                  </li>
                  <li className="sidebar-item">
                      <NavLink className="sidebar-link" to="/dashboard">
                          <i className="align-middle me-2 fas fa-fw fa-home"></i> <span
                          className="align-middle">{translate('dashboard')}</span>
                      </NavLink>
                  </li>
                  <li className="sidebar-item">
                      <NavLink className="sidebar-link" to="menu">
                          <i className="align-middle me-2 fas fa-fw fa-bars"></i> <span
                          className="align-middle">{translate('menu')}</span>
                      </NavLink>
                  </li>
                  {/*<li className="sidebar-item">*/}
                  {/*    <a data-bs-target="#pages"  data-bs-toggle="collapse" className="sidebar-link collapsed">*/}
                  {/*        <i className="align-middle me-2 fas fa-fw  fa-sitemap"></i> <span*/}
                  {/*        className="align-middle">{translate('additional')}</span>*/}
                  {/*    </a>*/}
                  {/*    <ul id="pages" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">*/}
                  {/*        <li className="sidebar-item"><Link to={RouteLinks.realtor} className="sidebar-link" >{translate('realtor')}</Link></li>*/}
                  {/*        <li className="sidebar-item"><Link to={RouteLinks.position} className="sidebar-link" >{translate('position')}</Link></li>*/}
                  {/*        <li className="sidebar-item"><Link to={RouteLinks.employees} className="sidebar-link" >{translate('employees')}</Link></li>*/}
                  {/*    </ul>*/}
                  {/*</li>*/}
                  {/*<li className="sidebar-item">*/}
                  {/*    <a data-bs-target="#company"  data-bs-toggle="collapse" className="sidebar-link collapsed">*/}
                  {/*        <i className="align-middle me-2 fas fa-fw  fa-building"></i> <span*/}
                  {/*        className="align-middle">{translate('construction_company')}</span>*/}
                  {/*    </a>*/}
                  {/*    <ul id="company" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">*/}
                  {/*        <li className="sidebar-item"><Link to={RouteLinks.constructionCompany} className="sidebar-link" >{translate('addCompany')}</Link></li>*/}
                  {/*        <li className="sidebar-item"><Link to={RouteLinks.constructionCompanyPosition} className="sidebar-link" >{translate('position')}</Link></li>*/}
                  {/*        <li className="sidebar-item"><Link to={RouteLinks.constructionCompanyEmployees} className="sidebar-link" >{translate('employees')}</Link></li>*/}
                  {/*        <li className="sidebar-item"><Link to={RouteLinks.constructionCompanyProjects} className="sidebar-link" >{translate('projects')}</Link></li>*/}
                  {/*    </ul>*/}
                  {/*</li>*/}
                  <li className="sidebar-item">
                      <a data-bs-target="#page" data-bs-toggle="collapse" className="sidebar-link collapsed">
                          <i className="align-middle me-2 fas fa-fw fa-file"></i> <span
                          className="align-middle">{translate('page')}</span>
                      </a>
                      <ul id="page" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.createPage}><span>{translate('add')}</span></NavLink></li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.pages}><span>{translate('all')}</span></NavLink>  </li>
                      </ul>
                  </li>
                  <li className="sidebar-item">
                      <a data-bs-target="#category" data-bs-toggle="collapse" className="sidebar-link collapsed">
                          <i className="align-middle me-2 fas fa-fw fa-th"></i> <span
                          className="align-middle">კატეგორიები</span>
                      </a>
                      <ul id="category" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.createCategory}><span>{translate('add')}</span></NavLink></li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.categories}><span>{translate('all')}</span></NavLink>  </li>
                      </ul>
                  </li>

                  <li className="sidebar-item">
                      <a data-bs-target="#product" data-bs-toggle="collapse" className="sidebar-link collapsed">
                          <i className="align-middle me-2 fas fa-fw fa-cart-plus"></i> <span
                          className="align-middle">{translate('products')}</span>
                      </a>
                      <ul id="product" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.createProduct}><span>{translate('add')}</span></NavLink></li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.products}><span>{translate('all')}</span></NavLink>  </li>

                      </ul>
                  </li>
                  <li className="sidebar-item">
                      <a data-bs-target="#options" data-bs-toggle="collapse" className="sidebar-link collapsed">
                          <i className="align-middle me-2 fas fa-fw fa-list-ol"></i> <span
                          className="align-middle">{translate('options')}</span>
                      </a>
                      <ul id="options" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.colors}><span>{translate('colors')}</span></NavLink></li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.sizes}><span>{translate('sizes')}</span></NavLink>  </li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.materials}><span>{translate('materials')}</span></NavLink>  </li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.extras}><span>{translate('extras')}</span></NavLink>  </li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.printType}><span>{translate('printType')}</span></NavLink>  </li>

                      </ul>
                  </li>

                  <li className="sidebar-item">
                      <a data-bs-target="#content" data-bs-toggle="collapse" className="sidebar-link collapsed">
                          <i className="align-middle me-2 fas fa-fw fa-th-large"></i> <span
                          className="align-middle">{translate('content')}</span>
                      </a>
                      <ul id="content" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">
                          <li className="sidebar-item"><NavLink to={RouteLinks.sliders} className="sidebar-link" ><span>{translate('slider')}</span></NavLink></li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.posts}><span>{translate('article')}</span></NavLink>  </li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.services}><span>{translate('services')}</span></NavLink>  </li>
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.gallery}><span>{translate('gallery')}</span></NavLink>  </li>
                          {/*<li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.team}><span>{translate('team')}</span></NavLink>  </li>*/}

                      </ul>
                  </li>

                  <li className="sidebar-item">
                      <NavLink className="sidebar-link" to="media-files">
                          <i className="align-middle me-2 fas fa-fw fa-folder-open"></i> <span
                          className="align-middle">{translate('media')}</span>
                      </NavLink>
                  </li>
                  {/*/!*<li className="sidebar-item">*!/*/}
                  {/*/!*    <a data-bs-target="#auth" data-bs-toggle="collapse" className="sidebar-link collapsed">*!/*/}
                  {/*/!*        <i className="align-middle me-2 fas fa-fw fa-sign-in-alt"></i> <span*!/*/}
                  {/*/!*        className="align-middle">Auth</span>*!/*/}
                  {/*/!*    </a>*!/*/}
                  {/*/!*    <ul id="auth" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">*!/*/}
                  {/*/!*        <li className="sidebar-item"><a className="sidebar-link" href="pages-sign-in.html">Sign*!/*/}
                  {/*/!*            In</a></li>*!/*/}
                  {/*/!*        <li className="sidebar-item"><a className="sidebar-link" href="pages-sign-up.html">Sign*!/*/}
                  {/*/!*            Up</a></li>*!/*/}
                  {/*/!*        <li className="sidebar-item"><a className="sidebar-link" href="pages-reset-password.html">Reset*!/*/}
                  {/*/!*            Password</a></li>*!/*/}
                  {/*/!*        <li className="sidebar-item"><a className="sidebar-link" href="pages-404.html">404*!/*/}
                  {/*/!*            Page</a></li>*!/*/}
                  {/*/!*        <li className="sidebar-item"><a className="sidebar-link" href="pages-500.html">500*!/*/}
                  {/*/!*            Page</a></li>*!/*/}
                  {/*/!*    </ul>*!/*/}
                  {/*/!*</li>*!/*/}

                  {/*<li className="sidebar-header">*/}
                  {/*    ელ-კომერცია*/}
                  {/*</li>*/}
                  {/*<li className="sidebar-item">*/}
                  {/*    <a data-bs-target="#ui" data-bs-toggle="collapse" className="sidebar-link collapsed">*/}
                  {/*        <i className="align-middle me-2 fas fa-fw fa-cart-arrow-down"></i> <span className="align-middle">შეკვეთები</span>*/}
                  {/*    </a>*/}
                  {/*    <ul id="ui" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">*/}
                  {/*        <li className="sidebar-item"><Link className="sidebar-link" to="orders">ყველა </Link></li>*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="ui-buttons.html">დადასტურებული </a>*/}
                  {/*        </li>*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="ui-cards.html">მოლოდინში</a></li>*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="ui-general.html">წარუმატებელი </a>*/}
                  {/*        </li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link" href="ui-grid.html">Grid</a>*/}
                          {/*</li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link" href="ui-modals.html">Modals</a></li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link"*/}
                          {/*                                href="ui-offcanvas.html">Offcanvas</a></li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link"*/}
                          {/*                                href="ui-placeholders.html">Placeholders</a></li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link"*/}
                          {/*                                href="ui-notifications.html">Notifications</a></li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link" href="ui-tabs.html">Tabs</a>*/}
                          {/*</li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link"*/}
                          {/*                                href="ui-typography.html">Typography</a></li>*/}
                  {/*    </ul>*/}
                  {/*</li>*/}
                  {/*<li className="sidebar-item">*/}
                  {/*    <a data-bs-target="#charts" data-bs-toggle="collapse" className="sidebar-link collapsed">*/}
                  {/*        <i className="align-middle me-2 fas fa-fw fa-chart-pie"></i> <span*/}
                  {/*        className="align-middle">Rs.ge </span>*/}
                  {/*        /!*<span className="sidebar-badge badge rounded-pill bg-primary">Rs.ge</span>*!/*/}
                  {/*    </a>*/}
                  {/*    <ul id="charts" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link"*/}
                  {/*                                        href="charts-chartjs.html">ზედნადების ატვირთვა</a></li>*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link"*/}
                  {/*                                        href="charts-apexcharts.html">ფაქტურა</a></li>*/}
                  {/*    </ul>*/}
                  {/*</li>*/}

                  {/*<li className="sidebar-item">*/}
                  {/*    <a data-bs-target="#datatables" data-bs-toggle="collapse" className="sidebar-link collapsed">*/}
                  {/*        <i className="align-middle me-2 fas fa-fw fa-credit-card"></i> <span*/}
                  {/*        className="align-middle">გადახდები</span>*/}
                  {/*    </a>*/}
                  {/*    <ul id="datatables" className="sidebar-dropdown list-unstyled collapse "*/}
                  {/*        data-bs-parent="#sidebar">*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="tables-datatables-responsive.html">გადახდების ინტეგრაცია</a>*/}
                  {/*        </li>*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="tables-datatables-buttons.html">საიტზე მოქმედი გადახდები</a>*/}
                  {/*        </li>*/}

                  {/*    </ul>*/}

                  {/*</li>*/}
                  {/*<li className="sidebar-item">*/}
                  {/*    <a data-bs-target="#icons" data-bs-toggle="collapse" className="sidebar-link collapsed">*/}
                  {/*        <i className="align-middle me-2 fas fa-fw fa-file-excel"></i> <span*/}
                  {/*        className="align-middle">ექსპორტი</span>*/}
                  {/*    </a>*/}
                  {/*    <ul id="icons" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="icons-feather.html">შეკვეთები</a></li>*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="icons-ion.html">მომხმარებლები</a></li>*/}
                  {/*    </ul>*/}
                  {/*</li>*/}

                  <li className="sidebar-item">
                      <a data-bs-target="#forms" data-bs-toggle="collapse" className="sidebar-link collapsed">
                          <i className="align-middle me-2 fas fa-fw fa-user"></i> <span
                          className="align-middle">{translate('users')}</span>
                      </a>
                      <ul id="forms" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">
                          <li className="sidebar-item"><NavLink className="sidebar-link" to={RouteLinks.users}><span>{translate('all')}</span></NavLink></li>

                          {/*<li className="sidebar-item"><a className="sidebar-link" href="forms-basic-elements.html">სოციალური ქსელიდან</a></li>*/}
                          {/*<li className="sidebar-item"><a className="sidebar-link" href="forms-advanced-elements.html">შეკვეთებით</a></li>*/}

                      </ul>
                  </li>

                  <li className="sidebar-item">
                      <NavLink className="sidebar-link" to={RouteLinks.editSettings}>
                          <i className="align-middle me-2 fas fa-fw fa-map-marker-alt"></i> <span
                          className="align-middle">{translate('contact')}</span>
                      </NavLink>
                  </li>

                  <li className="sidebar-header">
                      {translate('settings_attachment')}
                  </li>
                  <li className="sidebar-item">
                      <NavLink className="sidebar-link" to={RouteLinks.lang}>
                          <i className="align-middle me-2 fas fa-fw fa-language"></i> <span
                          className="align-middle">{translate('language')}</span>
                      </NavLink>
                  </li>
                  <li className="sidebar-item">
                      <NavLink className="sidebar-link" to={RouteLinks.dictionary}>
                          <i className="align-middle me-2 fas fa-fw fa-book"></i> <span
                          className="align-middle">{translate('dictionary')}</span>
                      </NavLink>
                  </li>

                  {/*<li className="sidebar-item">*/}
                  {/*    <a data-bs-target="#layouts" data-bs-toggle="collapse" className="sidebar-link collapsed">*/}
                  {/*        <i className="align-middle me-2 fas fa-fw fa-desktop"></i> <span*/}
                  {/*        className="align-middle">{translate('site')}</span>*/}
                  {/*    </a>*/}
                  {/*    <ul id="layouts" className="sidebar-dropdown list-unstyled collapse " data-bs-parent="#sidebar">*/}
                  {/*        <li className="sidebar-item"><a className="sidebar-link" href="layouts-sidebar-left.html">ლოგო & სტატუსი </a></li>*/}
                  {/*    </ul>*/}
                  {/*</li>*/}
              </ul>
          </div>
      </nav>
  )
}

export default SidebarNav;