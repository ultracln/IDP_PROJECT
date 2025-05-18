import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Typography,
    Box,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment } from "react";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Configuration } from '../../api/api8082/runtime';
import { BookControllerApi, BookWithOwnerDto } from '../../api/api8082';

export const AllBooks = () => {
    const [allBooks, setAllBooks] = useState<BookWithOwnerDto[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [authorSearch, setAuthorSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const configuration = new Configuration({
        basePath: 'http://localhost:8082',
        accessToken: () => localStorage.getItem('token') || '',
    });

    const bookApi = new BookControllerApi(configuration);

    const fetchBooks = async (searchAuthor: string = '') => {
        try {
            const response = searchAuthor
                ? await bookApi.getBooksByAuthor({ author: searchAuthor })
                : await bookApi.getAllBooks();

            setAllBooks(response || []);
        } catch (error) {
            console.error('Error fetching books:', error);
            setAllBooks([]);
        }
    };

    useEffect(() => {
        if (isSearching) {
            fetchBooks(authorSearch);
        } else {
            fetchBooks();
        }
    }, [isSearching, authorSearch]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleAuthorSearch = () => {
        setIsSearching(!!authorSearch);
        setPage(0);
    };

    const clearSearch = () => {
        setAuthorSearch('');
        setIsSearching(false);
        setPage(0);
    };

    // Client-side pagination
    const paginatedBooks = allBooks.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <Fragment>
            <Seo title="BookSwap | Books" />
            <WebsiteLayout>
                <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
                    <ContentCard>
                        <Container maxWidth="lg">
                            <Box sx={{ mt: 4, mb: 4 }}>
                                <Typography variant="h4" component="h1" gutterBottom>
                                    Available Books for Exchange
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                    <TextField
                                        label="Search by Author"
                                        variant="outlined"
                                        value={authorSearch}
                                        onChange={(e) => setAuthorSearch(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleAuthorSearch();
                                            }
                                        }}
                                        fullWidth
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {authorSearch && (
                                                        <IconButton onClick={clearSearch} edge="end">
                                                            <ClearIcon />
                                                        </IconButton>
                                                    )}
                                                    <IconButton onClick={handleAuthorSearch} edge="end">
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Author</TableCell>
                                            <TableCell>Owner</TableCell>
                                            <TableCell>Owner Email</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedBooks.length > 0 ? (
                                            paginatedBooks.map((book) => (
                                                <TableRow key={book.title}>
                                                    <TableCell>{book.title}</TableCell>
                                                    <TableCell>{book.author}</TableCell>
                                                    <TableCell>{book.ownerUsername}</TableCell>
                                                    <TableCell>{book.ownerEmail}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    <Typography variant="body1" sx={{ py: 2 }}>
                                                        {isSearching
                                                            ? `No books found by author "${authorSearch}"`
                                                            : 'No books available'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={allBooks.length}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25]}
                                />
                            </TableContainer>
                        </Container>
                    </ContentCard>
                </Box>
            </WebsiteLayout>
        </Fragment>
    );
};
