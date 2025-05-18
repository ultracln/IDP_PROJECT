import { useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import { AppRoute } from 'routes';
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from '@application/store';
import {IconButton, Typography, Box} from '@mui/material';
import { resetProfile } from '@application/state-slices';
import { useAppRouter } from '@infrastructure/hooks/useAppRouter';
import { NavbarLanguageSelector } from '@presentation/components/ui/NavbarLanguageSelector/NavbarLanguageSelector';
import { useOwnUserHasRole } from '@infrastructure/hooks/useOwnUser';
import { UserRoleEnum } from '@infrastructure/apis/client';
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    exp: number;
}

/**
 * This is the navigation menu that will stay at the top of the page.
 */
export const Navbar = () => {
  const {formatMessage} = useIntl();
  const {loggedIn} = useAppSelector(x => x.profileReducer);
  const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin);
  const dispatch = useAppDispatch();
  const {redirectToHome} = useAppRouter();

  const getUserEmail = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.sub;
    } catch (error) {
      return null;
    }
  };

  const userEmail = getUserEmail();
  const isAdminEmail = userEmail === 'admin@admin.com';

  const logout = useCallback(() => {
    dispatch(resetProfile());
    redirectToHome();
  }, [dispatch, redirectToHome]);

  const buttonStyle = {
    color: 'white',
    textTransform: 'none',
    minWidth: '100px',
    padding: '6px 16px'
  };

  return <>
    <div className="w-full top-0 z-50 fixed">
      <AppBar className="!bg-[#2c3e50]">
        <Toolbar sx={{ pl: 1 }}>
          <div className="flex items-center w-full gap-4">
            {/* Left section */}
            <div className="flex items-center gap-4">
              <Link to={AppRoute.Index}>
                <IconButton>
                  <HomeIcon style={{color: 'white'}} fontSize='large'/>
                </IconButton>
              </Link>

              {/* Login/Register buttons */}
              {!loggedIn && (
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    sx={{
                      ...buttonStyle,
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <Link style={{ color: 'white', textDecoration: 'none' }} to={AppRoute.Login}>
                      {formatMessage({ id: "globals.login" })}
                    </Link>
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      ...buttonStyle,
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <Link style={{ color: 'white', textDecoration: 'none' }} to={AppRoute.Register}>
                      {formatMessage({ id: "globals.register" })}
                    </Link>
                  </Button>
                </div>
              )}

              {/* Navigation Links */}
              <div className="flex gap-2">
                {loggedIn && (
                  <>
                    <Button color="inherit">
                      <Link style={{ color: 'white' }} to={AppRoute.Books}>
                        {formatMessage({ id: "globals.allBooks" })}
                      </Link>
                    </Button>
                    <Button color="inherit">
                      <Link style={{ color: 'white' }} to={AppRoute.MyBooks}>
                        {formatMessage({ id: "globals.myBooks" })}
                      </Link>
                    </Button>
                    <Button color="inherit">
                      <Link style={{ color: 'white' }} to={AppRoute.Transactions}>
                        {formatMessage({ id: "globals.transactions", defaultMessage: "Transactions" })}
                      </Link>
                    </Button>
                  </>
                )}
                <Button color="inherit">
                  <Link style={{ color: 'white' }} to={AppRoute.Feedback}>
                    {formatMessage({ id: "globals.feedback" })}
                  </Link>
                </Button>

                {isAdminEmail && (
                  <>
                    <Button color="inherit">
                      <Link style={{color: 'white'}} to={AppRoute.Users}>
                        {formatMessage({id: "globals.users"})}
                      </Link>
                    </Button>
                    <Button color="inherit">
                      <Link style={{color: 'white'}} to={AppRoute.Admin}>
                        {formatMessage({id: "globals.admin", defaultMessage: "Admin"})}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Right section - pushed to the right */}
            <div className="flex items-center gap-4 ml-auto">
              {loggedIn && (
                <>
                  <Typography variant="body2" style={{color: 'white'}}>
                    {userEmail}
                  </Typography>
                  <Button 
                    onClick={logout} 
                    variant="outlined"
                    sx={{
                      ...buttonStyle,
                      borderColor: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {formatMessage({id: "globals.logout"})}
                  </Button>
                </>
              )}
              <NavbarLanguageSelector/>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
    <div className="w-full top-0 z-49">
      <div className="min-h-20"/>
    </div>
  </>;
};