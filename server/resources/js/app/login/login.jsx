import React, {useEffect,useContext,useState} from 'react';
// import http from "../../store/hooks/useHttp";
import {useForm} from "react-hook-form";
import {useAlert,types} from "react-alert";
import {Context} from "../store/context/context";
import {useLocation, useNavigate} from "react-router-dom";
import useHttp from "../store/hooks/http/useHttp";

const Login = () => {

    const http = useHttp();
    // states & context
    const {state,dispatch} = useContext(Context);
    const [loginState,setLoginState] = useState({})
    const [loginStateErrors,setLoginStateErrors] = useState({
        email:null,
        password:null,
        message:null,
        error:null
    })
    // Form Data
    const {
        register,
        handleSubmit,
        formState:{errors},
    }=useForm();
    // End form
    const alert = useAlert();
    let navigate  = useNavigate();
    let location = useLocation();
    // Check Login
    const checkAuth = (data) => {

        http.post("login",data).then((response)=>{
            if(response.status === 200 ){

                    dispatch({type: 'AUTH', payload:true});
                    dispatch({type: "USER",payload: response.data.user});
                    alert.success('ავტორიზაცია წარმატებით განხორციელდა');
                    localStorage.setItem('token',response.data.token);
                    dispatch({type: 'ACCESS_TOKEN', payload:response.data.token});
                    navigate('/dashboard')

            }else{
                alert.error('ავტორიზაცია ვერ განხორციელდა');
                setLoginState({
                    text:'ელ-ფოსტა ან პაროლი არასწორია'
                })
            }

        }).catch(err => {
            setLoginStateErrors(
                {
                    email:err.response.data.errors?err.response.data.errors.email:null,
                    password:err.response.data.errors?err.response.data.errors.password:null,
                    message:err.response.data.message?err.response.data.message:err.response.data.error,
                }
            )
            console.log(err.response)
        });
    }

    // language



    useEffect(()=>{

        if(location.pathname === '/login' && state.auth === true){
            navigate('/dashboard')
        }
    },[])
  return (
      <>
          <main className="main h-100 w-100">
              <div className="container h-100">
                  <div className="row h-100 mt-5" >
                      <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                          <div className="d-table-cell align-middle">

                              <div className="text-center mt-4 ">
                                  {/*<h1 className="h2 title_font">MY SOFT</h1>*/}
                                  {/*<p className="lead title_text">*/}
                                  {/*   ყველა უფლება დაცულია*/}
                                  {/*</p>*/}
                              </div>

                              <div className="card">
                                  <div className="card-body">
                                      <div className="m-sm-4">
                                          <div className="text-center">
                                              <h1 className="h2 title_font">ავტორიზაცია</h1>
                                              {loginStateErrors.message && <p style={{color:"red"}}>{loginStateErrors.message}</p>}
                                          </div>
                                              {loginState.text &&  <small><p>{loginState.text}</p></small>}
                                          <form onSubmit={handleSubmit(checkAuth)}>
                                              <div className="mb-3 title_font">
                                                  <label>ელ-ფოსტა</label>
                                                  <input className="form-control form-control-lg text_font" type="email"
                                                         name="email" placeholder='შეიყვანეთ ელ-ფოსტა'
                                                         {...register('email', {
                                                             required:'ველის შევსება აუცილებელია',
                                                             pattern: /^\S+@\S+$/i,
                                                         })}
                                                  />
                                                  <small>
                                                  {errors.email && <p style={{color:"red"}}>გთხოვთ შეიყვანოთ ელ-ფოსტა</p>}
                                                      {loginStateErrors.email && <p style={{color:"red"}}>ელ-ფოსტა ვერ მოიძებნა</p>}
                                                  </small>
                                              </div>
                                              <div className="mb-3 title_font">
                                                  <label>პაროლი</label>
                                                  <input placeholder='შეიყვანეთ პაროლი' className="form-control form-control-lg text_font" type="password" {...register('password', {
                                                      required:'პაროლის შეყვანა აუცილებელია',
                                                      minLength: {
                                                          value: 8,
                                                          message: 'პაროლი უნდ იყოს ან აღემატებოდეს 8 სიმბოლოს'
                                                      }
                                                  })}/>
                                                  <small>
                                                  {errors.password && <p className='' style={{color:"red"}}>{errors.password.message}</p>}
                                                   {loginStateErrors.password && <p style={{color:"red"}}>პაროლი არ ემთხვევა</p>}
                                                  </small>
                                              </div>
                                              <div>
                                                  <div className="form-check align-items-center">
                                                      <input id="customControlInline" type="checkbox" style={{backgroundColor:'#000'}}
                                                             className="form-check-input"
                                                             name="remember"
                                                             {...register('remember',{
                                                                 value:1
                                                             })}
                                                              />
                                                          <label className="form-check-label text-small text_font"  htmlFor="customControlInline">დაიმახსოვრე პაროლი</label>
                                                  </div>
                                              </div>
                                              <div className="text-center mt-3">
                                                  <button type="submit" className="btn btn-lg btn-warning title_font" >შესვლა</button>
                                              </div>
                                          </form>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </main>
      </>
  )
}
export default Login;
