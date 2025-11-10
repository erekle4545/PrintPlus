import { useState, useEffect } from 'react';
import useHttp from "../http/useHttp";

function useFetch(url,returnResponse, config) {
    let http = useHttp();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true)
        setData(null);
        setError(null);

        http.get(url)
            .then(res => {
                setLoading(false)
                if(res.status === 200){
                     setData(res.data[returnResponse]);
                }
            })
            .catch(err => {
                setLoading(false)
                setError('An error occurred. Awkward..')
            }).finally(() => {
                setLoading(false)
            });

    }, [url])
  //  const {data:CategoryOptions} = useFetch(`category/side` ,'data','data')

    return {data, loading, error}
}
export default useFetch;