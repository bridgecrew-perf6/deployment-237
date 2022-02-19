import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';

const LoginModal = ({
  open,
  handleClose,
  fWidth,
  mxWidth,
  children
}) => {
  return (
    <>
      <Dialog onClose={handleClose} open={open} fullWidth={fWidth} maxWidth={mxWidth}>
        {children}
      </Dialog>
    </>
  )
};

export default LoginModal;