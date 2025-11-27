import React from "react";

const NotFound = () => {
  return(
      <div style={{marginTop:"20%"}}>
          <div className="row h-100">
              <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                  <div className="d-table-cell align-middle">

                      <div className="text-center">
                          <h1 className="display-1 fw-bold">404</h1>
                          <p className="h1">Page not found.</p>
                          <p className="h2 fw-normal mt-3 mb-4">The page you are looking for might have been
                              removed.</p>
                          {/*<a href="dashboard-default.html" className="btn btn-primary btn-lg">Return to website</a>*/}
                      </div>

                  </div>
              </div>
          </div>
      </div>
  )
}
export default NotFound;
