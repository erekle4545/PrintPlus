import React from "react";
import {Link} from "react-router-dom";

const LiveStep = (props) => {

  return(
      <>
          <div className="header">
              <h1 className="header-title">
                  {props.name}
              </h1>
              <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                      <li className="breadcrumb-item"><Link to="/dashboard">დეშბორდი</Link></li>
                      {/*<li className="breadcrumb-item"><Link to="/">{props.name}</Link></li>*/}
                      <li className="breadcrumb-item active" aria-current="page">{props.name}</li>
                  </ol>
              </nav>
          </div>
      </>
  )
}
export default LiveStep;