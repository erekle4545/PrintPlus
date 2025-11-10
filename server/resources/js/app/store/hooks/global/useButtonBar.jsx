import React from 'react';


const UseButtonBar = ({manualDisable}) => {

    return (
        <div className="row p-1">
            <div className='col-12 text-center align-middle'>
                <button disabled={manualDisable} title='შენახვა' type="submit" className="btn btn-primary p-2 button_font w-100">
                    <i className="fa fa-pay pr-2" aria-hidden="true"></i>&nbsp;&nbsp;
                    <span className='hidden_text_768'>გადახდა</span>
                </button>
            </div>
            {/*<div className='col-6 text-center align-middle'>*/}
            {/*    <button title='clear' type={'button'} className="btn btn-dark p-2 button_font "  onClick={resets}>*/}
            {/*        <i className="align-middle fas fa-fw   fa-eraser" aria-hidden="true"></i>*/}
            {/*        <span className='hidden_text_768'>{translate('delete',state.lang.code)}</span>*/}
            {/*    </button>*/}
            {/*</div>*/}
        </div>
    )
}

export default UseButtonBar;