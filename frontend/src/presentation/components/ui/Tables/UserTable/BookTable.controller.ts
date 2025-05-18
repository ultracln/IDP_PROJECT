import { useCallback, useEffect, useState } from "react";
import { BookControllerApi, BookWithOwnerDto
} from "../../../../../api/api8082";
import { useIntl } from "react-intl";

// Instanță API
const bookApi = new BookControllerApi();

export const useBookTableController = () => {
    const { formatMessage } = useIntl();

    const [allBooks, setAllBooks] = useState<BookWithOwnerDto[]>([]);
    const [pagedData, setPagedData] = useState<{
        data: BookWithOwnerDto[],
        page: number,
        pageSize: number,
        totalCount: number
    } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const books = await bookApi.getAllBooks();
            setAllBooks(books);
        } catch (err) {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const paginate = useCallback(() => {
        const start = page * pageSize;
        const end = start + pageSize;
        const data = allBooks.slice(start, end);
        setPagedData({
            data,
            page: page + 1,
            pageSize,
            totalCount: allBooks.length
        });
    }, [allBooks, page, pageSize]);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    useEffect(() => {
        paginate();
    }, [allBooks, page, pageSize, paginate]);

    const handleChangePage = (_: any, newPage: number) => setPage(newPage);
    const handleChangePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const remove = async (title: string) => {
        await bookApi.deleteBookByTitle({ title });
        fetchBooks();
    };

    const tryReload = () => fetchBooks();

    const labelDisplay = ({ from, to, count }: { from: number, to: number, count: number }) =>
        `${from}-${to} ${formatMessage({ id: "labels.of" })} ${count}`;

    return {
        handleChangePage,
        handleChangePageSize,
        pagedData,
        isLoading,
        isError,
        tryReload,
        remove,
        labelDisplay,
    };
};
