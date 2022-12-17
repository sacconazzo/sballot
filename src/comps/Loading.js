import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles(theme => ({
  spinner: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  dialog: {
    width: 'auto',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}))

export default function Loading(props) {
  const classes = useStyles()

  const handleClose = () => {
    props.onClose()
  }

  if (props.instanceOk) props.onClose()

  return (
    <>
      <Dialog fullWidth open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.dialog} id="form-dialog-title">
          <div className={classes.spinner}>
            <div className={classes.wrapper}>{props.message}</div>
            <LinearProgress color="secondary" />
          </div>
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
