import useHttp from "../http/useHttp";

export const FetchQueryProduct = (id,searchState) => {
    const http = useHttp();
    return  http.get('home-production',{
        params:{
            keyword:searchState,
            category_id:id
        }
    }).then((res)=>{
        return res.data.data
    })
}