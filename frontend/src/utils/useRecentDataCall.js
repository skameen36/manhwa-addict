import React, { useEffect, useState } from "react";

const useFetchRecent = (apiUrl) => {
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(apiUrl);
                const jsonData = await response.json();
                setData(jsonData);
                console.log('Data fetched:', jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again later.');
                setData([]);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    return { data, loading, error };

}

export default useFetchRecent;