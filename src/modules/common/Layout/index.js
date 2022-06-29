// Imports
import React from 'react'
import Snackbar from '@mui/material/Snackbar';
import { IconButton, SnackbarContent, styled, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useDispatch, useSelector } from 'react-redux';
import { hideMessage } from 'setup/messageSlice';
// UI imports
import './style.css'

// App imports
import Header from 'modules/common/Header'
import Footer from 'modules/common/Footer'

const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
  '& .FuseMessage-content': {
    ...(variant === 'success' && {
      backgroundColor: '#43a047',
      color: '#FFFFFF',
    }),

    ...(variant === 'error' && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark),
    }),

    ...(variant === 'info' && {
      backgroundColor: '#1e88e5',
      color: '#FFFFFF',
    }),

    ...(variant === 'warning' && {
      backgroundColor: '#ffb300',
      color: '#FFFFFF',
    }),
  },
}));

// Component
const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.message.state);
  const options = useSelector((state) => state.message.options);

  const variantIcon = {
    success: 'check_circle',
    warning: 'warning',
    error: 'error_outline',
    info: 'info',
  };

  // render
  return (
    <div className='common-layout'>
      {/* header */}
      <Header />

      {/* content */}
      <main>{children}</main>

      {/* footer */}
      <Footer />
      <StyledSnackbar
        {...options}
        open={state}
        onClose={() => dispatch(hideMessage())}
        ContentProps={{
          variant: 'body2',
          headlineMapping: {
            body1: 'div',
            body2: 'div',
          },
        }}
      >
        <SnackbarContent
          className="FuseMessage-content"
          message={
            <div className="flex items-center">
              {/* {variantIcon[options.variant] && (
                <Icon color="inherit">{variantIcon[options.variant]}</Icon>
              )} */}
              <Typography className="mx-8">{options.message}</Typography>
            </div>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={() => dispatch(hideMessage())}
              size="large"
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </StyledSnackbar>
    </div>
  )
}

export default Layout
