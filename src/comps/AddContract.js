import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import FormControl from '@material-ui/core/FormControl'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline'
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
    marginBottm: theme.spacing(1),
    minWidth: 120,
    width: 'auto',
  },
  formList: {
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

export default function AddContract(props) {
  const classes = useStyles()

  const [loader, setLoader] = useState(false)
  const [log, setLog] = useState({ open: false })
  const [contendenti, setForm] = useState([
    [Math.random(), ''],
    [Math.random(), ''],
  ])
  const [title, setTitle] = useState('')
  const [valid, setValid] = useState(false)

  const create = async () => {
    setLoader(true)
    const newCnt = {
      title: title,
      contendenti: contendenti.map(c => c[1]),
    }
    try {
      const response = await fetch('https://api.giona.tech/quorum/ballot/cnt/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          quorum: 'net',
        },
        body: JSON.stringify(newCnt),
      })
      const json = await response.json()
      setLog({ open: true, message: 'Contract created successfully', type: 'success' })
      setForm([
        [Math.random(), ''],
        [Math.random(), ''],
      ])
      setValid(false)
      props.onCreate(json)
    } catch (e) {
      setLog({ open: true, message: 'Creation Error', type: 'error' })
    }
    setLoader(false)
  }

  const handleOnClose = () => {
    props.onClose()
  }

  const handleMouseDown = event => {
    event.preventDefault()
  }

  const handleAdd = () => {
    setForm([...contendenti, [Math.random(), '']])
  }

  const handleRemove = id => {
    contendenti.splice(id, 1)
    setForm([...contendenti])
  }

  const checkEnter = e => {
    if (e.keyCode === 13) {
      if (valid()) create()
    }
  }

  const isValid = () => {
    if (!title) return false
    if (contendenti.length === 0) return false
    for (let i = 0; i < contendenti.length; i++) {
      if (!contendenti[i][1]) return false
    }
    return true
  }

  useEffect(() => {
    setValid(!loader && isValid())
  }, [title, contendenti])

  return (
    <>
      <Dialog fullWidth open={props.open} onClose={handleOnClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create new ballot contract</DialogTitle>
        <DialogContent>
          <form className={classes.form} noValidate>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="standard-adornment-password">Title</InputLabel>
              <Input
                onKeyDown={checkEnter}
                value={title}
                autoComplete="new-password"
                onChange={e => setTitle(e.target.value)}
                label="Title"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="remove option" onClick={() => handleAdd()} onMouseDown={handleMouseDown}>
                      <AddCircleIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {contendenti.map((row, id) => (
              <Option
                key={row[0].toString()}
                id={id}
                row={row[1]}
                classes={classes}
                onClick={() => handleRemove(id)}
                checkEnter={checkEnter}
                onMouseDown={handleMouseDown}
                onChange={val => {
                  contendenti[id][1] = val
                  setForm(contendenti)
                  setValid(!loader && isValid())
                }}
              />
            ))}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOnClose} color="primary">
            Cancel
          </Button>
          <div className={classes.wrapper}>
            <Button onClick={create} disabled={!valid} variant="contained" color="primary">
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

const Option = props => {
  const [value, setValue] = useState(props.row)
  return (
    <FormControl className={props.classes.formList}>
      <InputLabel htmlFor="standard-adornment-password">Option {props.id + 1}</InputLabel>
      <Input
        onKeyDown={props.checkEnter}
        label={'Option' + (props.id + 1)}
        value={value}
        type="text"
        onChange={e => {
          const val = e.target.value.replace(/[^\w\s]/gi, '').replace(/([0-9])/gi, '')
          setValue(val)
          props.onChange(val)
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="remove option" onClick={props.onClick} onMouseDown={props.handleMouseDown}>
              <RemoveCircleOutlineIcon color="secondary" />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}
