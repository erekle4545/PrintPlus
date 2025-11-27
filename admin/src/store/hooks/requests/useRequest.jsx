import { useState, useEffect } from 'react';
import useHttp from "../http/useHttp";

function useRequest(url,httpData,httpMethod) {
    let http = useHttp();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true)
        setData(null);
        setError(null);

        http[httpMethod](url,{httpData})
            .then(res => {
                setLoading(false)
                if(res.status === 200){
                    res.data.data && setData(res.data.data);
                }
            })
            .catch(err => {
                setLoading(false)
                setError('An error occurred. Awkward..')
            }).finally(() => {
            setLoading(false)
        });

    }, [url])

    return {data, loading, error}
}
export default useRequest;