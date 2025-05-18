import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Button, TablePagination
} from '@mui/material';

import {
    BookControllerApi,
    BookWithOwnerDto,
    Configuration,
    GetAllBooksRequest,
    GetBooksByAuthorRequest
} from "../../../../../api/api8082";

// 🔍 Componetă de căutare după autor
function BookSearch({ onSearch }: { onSearch: (author: string) => void }) {
    const [author, setAuthor] = useState('');
    return (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <TextField
                label="Search by Author"
                variant="outlined"
                size="small"
                value={author}
                onChange={e => setAuthor(e.target.value)}
            />
            <Button variant="contained" onClick={() => onSearch(author.trim())}>
                Search
            </Button>
        </div>
    );
}

const configuration = new Configuration({
    basePath: 'http://localhost:8082',
    accessToken: () => localStorage.getItem('token') || '',
});
const bookApi = new BookControllerApi(configuration);

export default function BookTable() {
    const [books, setBooks] = useState<BookWithOwnerDto[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔁 Obține toate cărțile cu paginare
    const fetchBooks = async (pageNumber = 0, size = rowsPerPage) => {
        setLoading(true);
        setError(null);
        try {
            const request: GetAllBooksRequest = {
                page: pageNumber,
                size: size
            };
            const response = await bookApi.getAllBooks(request);
            if (response && Array.isArray(response.content)) {
                setBooks(response.content);
                setTotalCount(response.totalElements || 0);
            } else {
                setBooks([]);
                setTotalCount(0);
            }
        } catch (err: any) {
            console.error('Error fetching books:', err);
            setError(err.message || "Failed to fetch books.");
            setBooks([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchBooksByAuthor = async (author: string) => {
        if (!author) {
            fetchBooks(0);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const request: GetBooksByAuthorRequest = {
                author: author
            };
            const response = await bookApi.getBooksByAuthor(request);
            if (response && Array.isArray(response.content)) {
                setBooks(response.content);
                setTotalCount(response.totalElements || 0);
            } else {
                setBooks([]);
                setTotalCount(0);
            }
            setPage(0);
        } catch (err: any) {
            console.error('Error searching by author:', err);
            setError(err.message || "Author search failed.");
            setBooks([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks(page, rowsPerPage);
    }, [page, rowsPerPage]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSize = parseInt(event.target.value, 10);
        setRowsPerPage(newSize);
        setPage(0);
    };

    return (
        <>
            <BookSearch onSearch={fetchBooksByAuthor} />
            <Button 
                variant="outlined" 
                onClick={() => fetchBooks(0)} 
                style={{ marginBottom: 16 }}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Refresh Table'}
            </Button>

            {error && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    {error}
                </div>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Owner Email</TableCell>
                            <TableCell>Owner Username</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : books.length > 0 ? (
                            books.map((book, index) => (
                                <TableRow key={index}>
                                    <TableCell>{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.ownerEmail}</TableCell>
                                    <TableCell>{book.ownerUsername}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No books found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalCount}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    showFirstButton
                    showLastButton
                />
            </TableContainer>
        </>
    );
}
