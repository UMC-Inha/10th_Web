import { useState, useEffect } from "react";
import { loadMovieData } from "../apis/movie";
import type { Movies } from "../types/Movies";

export const useMovieData = (category: string | undefined) => {
    const [movies, setMovies] = useState<Movies[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(0);

    useEffect(() => {
        setPage(1);
    }, [category]);

    useEffect(() => {
        const fetchMovie = async () => {
            setIsLoading(true);
            try {
                const data = await loadMovieData(category, page);
                setMaxPage(data.total_pages);
                setMovies(data.results);
                setIsError(false);
            } catch {
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovie();
    }, [page, category]);

    const nextPage = () => {
        if (page < maxPage) setPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    return { movies, isLoading, isError, page, maxPage, nextPage, prevPage };
};