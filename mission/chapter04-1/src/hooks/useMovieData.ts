import { useState, useEffect } from "react";
import { loadMovieData } from "../apis/movie";
import { useCustomFetch } from "./useCustomFetch";

export const useMovieData = (category: string | undefined) => {
    const [page, setPage] = useState<number>(1);
    const stringCategory = JSON.stringify(category)

    useEffect(() => {
        setPage(1);
    }, [stringCategory]);

    const {data, isError, isLoading} = useCustomFetch(loadMovieData, [category, page])
    const movies = data?.results || [];
    const maxPage = data?.total_pages || 0;

    const nextPage = () => {
        if (page < maxPage) setPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    return { movies, isLoading, isError, page, maxPage, nextPage, prevPage };
};