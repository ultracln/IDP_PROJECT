import React, { useState, useEffect, useCallback } from 'react';
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
    Typography,
    Box,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Checkbox,
    Divider,
    IconButton,
    TextField,
    InputAdornment,
} from '@mui/material';
import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment } from "react";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Configuration } from '../../api/api8082/runtime';
import { BookControllerApi, BookWithOwnerDto, OfferDto, OfferControllerApi } from '../../api/api8082';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    exp: number;
}

interface StatusUpdateDialogProps {
    open: boolean;
    offer: OfferDto | null;
    onClose: () => void;
    onConfirm: (status: string) => void;
}

interface ExchangeDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (wantedBooks: BookWithOwnerDto[], offeredBooks: BookWithOwnerDto[]) => void;
    availableBooks: BookWithOwnerDto[];
    myBooks: BookWithOwnerDto[];
}

function ExchangeDialog({ open, onClose, onConfirm, availableBooks, myBooks }: ExchangeDialogProps) {
    const [selectedWantedBooks, setSelectedWantedBooks] = useState<BookWithOwnerDto[]>([]);
    const [selectedOfferedBooks, setSelectedOfferedBooks] = useState<BookWithOwnerDto[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleWantedBookToggle = (book: BookWithOwnerDto) => {
        setSelectedWantedBooks(prev => {
            const isSelected = prev.some(b => b.title === book.title);
            if (isSelected) {
                return prev.filter(b => b.title !== book.title);
            } else {
                return [...prev, book];
            }
        });
    };

    const handleOfferedBookToggle = (book: BookWithOwnerDto) => {
        setSelectedOfferedBooks(prev => {
            const isSelected = prev.some(b => b.title === book.title);
            if (isSelected) {
                return prev.filter(b => b.title !== book.title);
            } else {
                return [...prev, book];
            }
        });
    };

    const handleConfirm = () => {
        onConfirm(selectedWantedBooks, selectedOfferedBooks);
        setSelectedWantedBooks([]);
        setSelectedOfferedBooks([]);
        setSearchQuery('');
        onClose();
    };

    const filteredAvailableBooks = availableBooks.filter(book => {
        const searchLower = searchQuery.toLowerCase();
        return (
            book.title?.toLowerCase().includes(searchLower) ||
            book.author?.toLowerCase().includes(searchLower) ||
            book.ownerEmail?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Book Exchange</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Books You Want
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search by title, author, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="small"
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: searchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            onClick={() => setSearchQuery('')}
                                            size="small"
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <List
                            sx={{
                                maxHeight: 400,
                                overflow: 'auto',
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {filteredAvailableBooks.length > 0 ? (
                                filteredAvailableBooks.map((book) => (
                                    <ListItem key={book.title} divider>
                                        <ListItemText
                                            primary={book.title}
                                            secondary={`by ${book.author} (Email: ${book.ownerEmail})`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                onChange={() => handleWantedBookToggle(book)}
                                                checked={selectedWantedBooks.some(b => b.title === book.title)}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText
                                        primary={searchQuery ? "No books found matching your search" : "No books available"}
                                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Books You'll Give
                        </Typography>
                        <List
                            sx={{
                                maxHeight: 400,
                                overflow: 'auto',
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            {myBooks.length > 0 ? (
                                myBooks.map((book) => (
                                    <ListItem key={book.title} divider>
                                        <ListItemText
                                            primary={book.title}
                                            secondary={`by ${book.author}`}
                                        />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                onChange={() => handleOfferedBookToggle(book)}
                                                checked={selectedOfferedBooks.some(b => b.title === book.title)}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText
                                        primary="You don't have any books to offer"
                                        sx={{ textAlign: 'center', color: 'text.secondary' }}
                                    />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleConfirm}
                    color="primary"
                    variant="contained"
                    disabled={selectedWantedBooks.length === 0 || selectedOfferedBooks.length === 0}
                >
                    Create Exchange
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function StatusUpdateDialog({ open, offer, onClose, onConfirm }: StatusUpdateDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Update Offer Status</DialogTitle>
            <DialogContent>
                <Typography>
                    Update status for offer: {offer?.id}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button onClick={() => onConfirm('ACCEPTED')} color="primary" variant="contained">
                        Accept
                    </Button>
                    <Button onClick={() => onConfirm('REJECTED')} color="error" variant="contained">
                        Reject
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'warning';
        case 'ACCEPTED':
            return 'info';
        case 'COMPLETED':
            return 'success';
        case 'REJECTED':
            return 'error';
        default:
            return 'default';
    }
};

export const UserTransactions = () => {
    const [offers, setOffers] = useState<OfferDto[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalElements, setTotalElements] = useState(0);
    const [statusDialog, setStatusDialog] = useState<{ open: boolean; offer: OfferDto | null }>({
        open: false,
        offer: null
    });
    const [exchangeDialog, setExchangeDialog] = useState(false);
    const [availableBooks, setAvailableBooks] = useState<BookWithOwnerDto[]>([]);
    const [myBooks, setMyBooks] = useState<BookWithOwnerDto[]>([]);

    const configuration = new Configuration({
        basePath: 'http://localhost:8082',
        accessToken: async () => localStorage.getItem('token') || '',
    });

    const bookApi = new BookControllerApi(configuration);
    const offerApi = new OfferControllerApi(configuration);

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

    const userEmail = getUserEmailFromToken();

    const fetchOffers = async () => {
        try {
            const response = await offerApi.getAllUserOffers();
            // Sort offers in reverse order (newest first)
            const sortedOffers = [...(response || [])].reverse();
            setOffers(sortedOffers);
            setTotalElements(response?.length || 0);
        } catch (error) {
            console.error('Error fetching offers:', error);
            setOffers([]);
            setTotalElements(0);
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await bookApi.getAllBooks();
            const userEmail = getUserEmailFromToken();
            
            if (!userEmail) {
                console.error('No user email found in token');
                setAvailableBooks([]);
                setMyBooks([]);
                return;
            }

            // Filter books that belong to other users
            setAvailableBooks(response.filter(book => 
                book.ownerEmail !== userEmail && 
                book.title && 
                book.author
            ));

            // Filter books that belong to the current user
            setMyBooks(response.filter(book => 
                book.ownerEmail === userEmail && 
                book.title && 
                book.author
            ));
        } catch (error) {
            console.error('Error fetching books:', error);
            setAvailableBooks([]);
            setMyBooks([]);
        }
    };

    const handleExchangeConfirm = async (wantedBooks: BookWithOwnerDto[], offeredBooks: BookWithOwnerDto[]) => {
        try {
            // Create the offer
            await offerApi.createOfferFromAuthenticatedUser({
                createOfferFromContextDto: {
                    requestedBookTitles: wantedBooks.map(b => b.title || ''),
                    offeredBookTitles: offeredBooks.map(b => b.title || ''),
                    receiverEmail: wantedBooks[0]?.ownerEmail || '' // Use receiverEmail instead of receiverId
                }
            });

            // After successful offer creation, refresh both offers and books
            await Promise.all([
                fetchOffers(),
                fetchBooks()
            ]);

            // Close the exchange dialog
            setExchangeDialog(false);
        } catch (error) {
            console.error('Error creating offer:', error);
            // You might want to show an error message to the user here
        }
    };

    const handleStatusConfirm = async (newStatus: string) => {
        if (!statusDialog.offer?.id) return;

        try {
            await offerApi.respondToOffer({
                id: statusDialog.offer.id,
                status: newStatus
            });
            
            // Refresh both offers and books after status change
            await Promise.all([
                fetchOffers(),
                fetchBooks()
            ]);

            setStatusDialog({ open: false, offer: null });
        } catch (error) {
            console.error('Error updating offer status:', error);
        }
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Get current page items
    const getCurrentPageItems = () => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return offers.slice(startIndex, endIndex);
    };

    useEffect(() => {
        fetchOffers();
        fetchBooks();
    }, [page, rowsPerPage]);

    return (
        <Fragment>
            <Seo title="BookSwap | Book Offers" />
            <WebsiteLayout>
                <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
                    <ContentCard>
                        <Container maxWidth="lg">
                            <Box sx={{ mt: 4, mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                    <Box>
                                        <Typography variant="h4" component="h1">
                                            Book Exchange Offers
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                                            When you receive an offer, the books will be shown from your perspective:
                                            books you'll receive vs books you'll give.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<RefreshIcon />}
                                            onClick={() => {
                                                fetchOffers();
                                                fetchBooks();
                                            }}
                                        >
                                            Refresh
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AddIcon />}
                                            onClick={() => setExchangeDialog(true)}
                                        >
                                            New Exchange
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Books to Receive
                                            </TableCell>
                                            <TableCell>
                                                Books to Give
                                            </TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getCurrentPageItems().length > 0 ? (
                                            getCurrentPageItems().map((offer) => (
                                                <TableRow key={offer.id}>
                                                    <TableCell>
                                                        {offer.receiverEmail === userEmail ? 
                                                            offer.offeredBookTitles?.join(', ') :
                                                            offer.requestedBookTitles?.join(', ')}
                                                    </TableCell>
                                                    <TableCell>
                                                        {offer.receiverEmail === userEmail ? 
                                                            offer.requestedBookTitles?.join(', ') :
                                                            offer.offeredBookTitles?.join(', ')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={offer.status}
                                                            color={getStatusColor(offer.status || '')}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            {offer.status === 'PENDING' && 
                                                             offer.receiverEmail === userEmail && (
                                                                <Button
                                                                    size="small"
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => setStatusDialog({ open: true, offer })}
                                                                >
                                                                    RESPOND
                                                                </Button>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    <Typography variant="body1" sx={{ py: 2 }}>
                                                        No offers found
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={offers.length}
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
            <StatusUpdateDialog
                open={statusDialog.open}
                offer={statusDialog.offer}
                onClose={() => setStatusDialog({ open: false, offer: null })}
                onConfirm={handleStatusConfirm}
            />
            <ExchangeDialog
                open={exchangeDialog}
                onClose={() => setExchangeDialog(false)}
                onConfirm={handleExchangeConfirm}
                availableBooks={availableBooks}
                myBooks={myBooks}
            />
        </Fragment>
    );
};