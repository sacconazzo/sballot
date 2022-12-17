import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import FormHelperText from '@material-ui/core/FormHelperText'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import InputLabel from '@material-ui/core/InputLabel'
import MuiAlert from '@material-ui/lab/Alert'

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

export default function AddAccount(props) {
  const classes = useStyles()

  const [loader, setLoader] = React.useState(false)
  const [visible, setVisible] = React.useState(false)
  const [log, setLog] = React.useState({ open: false })
  const [form, setForm] = React.useState({
    password: '',
    repassword: '',
    alias: '',
  })

  const create = async () => {
    setLoader(true)
    const newAcc = {
      password: atob(form.password),
    }
    try {
      const response = await fetch('https://api.giona.tech/quorum/account/create', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          quorum: 'net',
        },
        body: JSON.stringify(newAcc),
      })
      const json = await response.json()
      setLog({ open: true, message: 'Account created successfully', type: 'success' })
      setForm({ alias: '', password: '', repassword: '' })
      props.onCreate(json, form.alias)
    } catch (e) {
      setLog({ open: true, message: 'Creation Error', type: 'error' })
    }
    setLoader(false)
  }

  const handleOnClose = () => {
    setForm({ alias: form.alias, password: '', repassword: '' })
    props.onClose()
  }

  const handleClickShowPassword = () => {
    setVisible(!visible)
  }

  const handleMouseDownPassword = event => {
    event.preventDefault()
  }

  return (
    <>
      <Dialog fullWidth open={props.open} onClose={handleOnClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create new account</DialogTitle>
        <DialogContent>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <TextField
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    if (form.password === form.repassword) create()
                  }
                }}
                id="standard-basic"
                value={form.alias}
                autoComplete="new-password"
                onChange={e => setForm({ alias: e.target.value, password: form.password, repassword: form.repassword })}
                label="Alias"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
              <Input
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    if (form.password === form.repassword) create()
                  }
                }}
                label="Password"
                value={atob(form.password)}
                autoComplete="new-password"
                className={classes.inputSecure}
                type={visible ? 'text' : 'password'}
                onChange={e => setForm({ alias: form.alias, password: btoa(e.target.value), repassword: form.repassword })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {visible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
              <Input
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    if (form.password === form.repassword) create()
                  }
                }}
                error={form.password !== form.repassword}
                label="Confirm password"
                value={atob(form.repassword)}
                autoComplete="new-password"
                className={classes.inputSecure}
                type={visible ? 'text' : 'password'}
                onChange={e => setForm({ alias: form.alias, password: form.password, repassword: btoa(e.target.value) })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {visible ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {form.password !== form.repassword && <FormHelperText id="standard-weight-helper-text">Password not equal</FormHelperText>}
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button onClick={create} disabled={loader || form.password !== form.repassword} variant="contained" color="primary">
              Create
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
