import Swal from "sweetalert2";

export const deleteAlert = (id, delfunction) => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success p-2 m-2',
            cancelButton: 'btn btn-danger p-2  m-2'
        },
        buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
        title: 'დარწმუნებული ხართ?',
        text: "თქვენ ვერ შეძლებთ ამ ობიექტის დაბრუნებას!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'დიახ',
        cancelButtonText: 'არა',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {

            return   delfunction(id)
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'გაუქმებულია',
                'მოთხოვნა წაშლის შესახებ გაუქმებულია',
                'error'
            )
        }
    })

};

export const errorAlerts = (status,statusText,messsage) => {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `Status Code: ${status} / Message: ${statusText}`,
        footer: `<strong>Warning :</strong>&nbsp;<div style="color:red;">${JSON.stringify(messsage)} </div>`
    })
}

export const successAlerts = (status,statusText,messsage) => {
    Swal.fire({
        icon: 'success',
        title: 'Done!',
        text: `Status Code: ${status} / Message: ${statusText}`,
        footer: `<strong>Success :</strong>&nbsp;<div style="color:green;">${JSON.stringify(messsage)} </div>`
    })
}




export const  leaveAlert = (switchLang,id,code,label)=>{

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success p-2 m-2',
                cancelButton: 'btn btn-danger p-2  m-2'
            },
            buttonsStyling: false
        })
          swalWithBootstrapButtons.fire({
            title: 'ნამდვიალდ გსურთ შეცვალოთ ენა?',
            text: "თქვენ ვერ შეძლებთ ამ ობიექტის დაბრუნებას!",
            icon: 'warning',
            input: 'checkbox',
            inputPlaceholder: 'აღარ მაჩვენო ეს შეტყობინება',
            showCancelButton: true,
            confirmButtonText: 'დიახ',
            cancelButtonText: 'არა',
            reverseButtons: true,
            inputValidator: (result) => {
                localStorage.setItem('sureAlert',result)
            }
        }).then((result) => {
            if (result.isConfirmed) {

                return   switchLang(id,code,label)
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {

            }
        })

};

