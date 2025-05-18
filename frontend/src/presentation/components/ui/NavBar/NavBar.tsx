import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export function NavBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('token');

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'All Books', path: '/all-books' },
        { label: 'My Books', path: '/my-books' },
        { label: 'Users', path: '/users' },
        { label: 'Transactions', path: '/transactions' },
        { label: 'Feedback', path: '/feedback' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, mr: 4 }}
                    >
                        Book Exchange
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.path}
                                sx={{
                                    color: 'white',
                                    display: 'block',
                                    mx: 1,
                                    textDecoration: location.pathname === item.path ? 'underline' : 'none'
                                }}
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {isLoggedIn ? (
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <>
                                <Button color="inherit" onClick={() => navigate('/login')}>
                                    Login
                                </Button>
                                <Button color="inherit" onClick={() => navigate('/register')}>
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
} 