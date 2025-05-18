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
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
} from '@mui/material';
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment } from "react";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Configuration } from '../../api/api8082/runtime';
import { BookControllerApi, Book, BookDto } from '../../api/api8082';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    email: string;
    exp: number;
}

interface BookFormData {
    title: string;
    author: string;
}

interface BookDialogProps {
    open: boolean;
    book?: Book;
    onClose: () => void;
    onSave: (bookData: BookFormData) => void;
}

const initialFormData: BookFormData = {
    title: '',
    author: '',
};

function BookDialog({ open, book, onClose, onSave }: BookDialogProps) {
    const [formData, setFormData] = useState<BookFormData>(initialFormData);

    useEffect(() => {
        if (book?.title && book?.author) {
            setFormData({
                title: book.title,
                author: book.author,
            });
        } else {
            setFormData(initialFormData);
        }
    }, [book]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{book ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        name="title"
                        label="Title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        name="author"
                        label="Author"
                        value={formData.author}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={handleSubmit} 
                    color="primary" 
                    variant="contained"
                    disabled={!formData.title || !formData.author}
                >
                    {book ? 'Save Changes' : 'Add Book'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export const MyBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

    const configuration = new Configuration({
        basePath: 'http://localhost:8082',
        accessToken: () => localStorage.getItem('token') || '',
    });

    const bookApi = new BookControllerApi(configuration);

    const getUserEmailFromToken = (): string | null => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            return decoded.sub;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const fetchMyBooks = async () => {
        try {
            const response = await bookApi.getAllBooks();
            const userEmail = getUserEmailFromToken();
            
            if (!userEmail) {
                console.error('No user email found in token');
                setBooks([]);
                return;
            }

            const userBooks = response.filter(book => 
                book.ownerEmail === userEmail && 
                book.title && 
                book.author
            );
            setBooks(userBooks);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        }
    };

    const handleAddBook = async (bookData: BookFormData) => {
        try {
            const bookDto: BookDto = {
                title: bookData.title,
                author: bookData.author
            };
            await bookApi.addBook({ bookDto });
            fetchMyBooks();
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleEditBook = async (bookData: BookFormData) => {
        if (!selectedBook?.title) return;

        try {
            await bookApi.deleteBookByTitle({ title: selectedBook.title });
            const bookDto: BookDto = {
                title: bookData.title,
                author: bookData.author
            };
            await bookApi.addBook({ bookDto });
            fetchMyBooks();
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const handleDeleteBook = async () => {
        if (!bookToDelete?.title) return;

        try {
            await bookApi.deleteBookByTitle({ title: bookToDelete.title });
            setBooks(books.filter(book => book.title !== bookToDelete.title));
            setDeleteDialogOpen(false);
            setBookToDelete(null);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const openAddDialog = () => {
        setSelectedBook(undefined);
        setDialogOpen(true);
    };

    const openEditDialog = (book: Book) => {
        if (book.title && book.author) {
            setSelectedBook(book);
            setDialogOpen(true);
        }
    };

    const openDeleteDialog = (book: Book) => {
        if (book.title) {
            setBookToDelete(book);
            setDeleteDialogOpen(true);
        }
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedBook(undefined);
    };

    const handleDialogSave = (bookData: BookFormData) => {
        if (selectedBook) {
            handleEditBook(bookData);
        } else {
            handleAddBook(bookData);
        }
    };

    return (
        <Fragment>
            <Seo title="BookSwap | My Books" />
            <WebsiteLayout>
                <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
                    <ContentCard>
                        <Container maxWidth="lg">
                            <Box sx={{ mt: 4, mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h4" component="h1">
                                        My Books
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={openAddDialog}
                                    >
                                        Add New Book
                                    </Button>
                                </Box>

                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Author</TableCell>
                                                <TableCell align="right">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {books.length > 0 ? (
                                                books.map((book) => (
                                                    <TableRow key={book.title}>
                                                        <TableCell>{book.title}</TableCell>
                                                        <TableCell>{book.author}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => openEditDialog(book)}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => openDeleteDialog(book)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        <Typography variant="body1" sx={{ py: 2 }}>
                                                            You haven't added any books yet
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Container>
                    </ContentCard>
                </Box>
            </WebsiteLayout>

            <BookDialog
                open={dialogOpen}
                book={selectedBook}
                onClose={handleDialogClose}
                onSave={handleDialogSave}
            />

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete "{bookToDelete?.title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteBook} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
