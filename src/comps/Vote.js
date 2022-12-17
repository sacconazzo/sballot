import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles(theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'auto',
  },
  formControl: {
    marginTop: theme.spacing(0),
    minWidth: 120,
    width: 'auto',
  },
  dialog: {
    width: 'auto',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export default function Vote(props) {
  const classes = useStyles()
  const [loader, setLoader] = React.useState(false)
  const [log, setLog] = React.useState({ open: false })
  const [form, setForm] = React.useState({
    account: '',
    password: '',
    select: 0,
  })

  const handleClose = () => {
    setForm({
      account: form.account,
      password: '',
      select: form.select,
    })
    props.onClose()
  }

  const create = async () => {
    setLoader(true)
    const data = {
      account: form.account,
      password: atob(form.password),
      id: form.select,
    }
    try {
      const response = await fetch('https://api.giona.tech/quorum/ballot/vote', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          quorum: 'net',
        },
        body: JSON.stringify(data),
      })
      const json = await response.json()
      if (response.status === 200) {
        setLog({
          open: true,
          message: 'Vote performed on block number ' + json.blockNumber,
          type: 'success',
        })
        props.onClose()
        setForm({
          account: '',
          password: '',
          select: 0,
        })
      } else {
        setLog({ open: true, message: json.error, type: 'error' })
      }
    } catch (e) {
      setLog({ open: true, message: e.message, type: 'error' })
    }
    setLoader(false)
  }

  return (
    <>
      <Dialog fullWidth open={props.open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className={classes.dialog} id="form-dialog-title">
          {props.ballot.title}
        </DialogTitle>
        <DialogContent>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <Select
                value={form.select}
                onChange={e =>
                  setForm({
                    account: form.account,
                    password: form.password,
                    select: e.target.value,
                  })
                }
              >
                {props.ballot.contendenti.map((row, id) => (
                  <MenuItem key={id} value={row.id}>
                    {row.nome}
                  </MenuItem>
                ))}
              </Select>
              {false && <FormHelperText>{props.ballot.title}</FormHelperText>}
              <TextField
                htmlFor="max-width"
                autoComplete="new-password"
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    create()
                  }
                }}
                value={form.account}
                onChange={e =>
                  setForm({
                    account: e.target.value,
                    password: form.password,
                    select: form.select,
                  })
                }
                label="Account"
              />
              <TextField
                autoComplete="new-password"
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    create()
                  }
                }}
                value={atob(form.password)}
                type="password"
                onChange={e =>
                  setForm({
                    account: form.account,
                    password: btoa(e.target.value),
                    select: form.select,
                  })
                }
                label="Password"
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button onClick={create} disabled={loader} variant="contained" color="primary">
              Vote
            </Button>
            {loader && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </DialogActions>
      </Dialog>
      <Snackbar autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={log.open} onClose={() => setLog({ open: false })}>
        <Alert onClose={() => setLog({ open: false })} severity={log.type}>
          {log.message}
        </Alert>
      </Snackbar>
    </>
  )
}
