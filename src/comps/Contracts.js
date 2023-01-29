import React, { useEffect } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Radio from '@material-ui/core/Radio'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import LockIcon from '@material-ui/icons/Lock'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import Zoom from '@material-ui/core/Zoom'
import { isMobile } from 'react-device-detect'
import AddContract from './AddContract'

const useStyles = makeStyles(theme => ({
  depositContext: {
    flex: 1,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    minHeight: 140,
  },
  fab: {
    zIndex: 1,
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    marginBottom: isMobile ? '55px' : '0px',
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  table: {
    display: 'block',
    maxHeight: isMobile ? 'calc(100vh - 20.5rem)' : 'calc(100vh - 13.3rem)',
    overflowY: 'scroll',
  },
  rowH: {
    maxWidth: isMobile ? '20vw' : '',
  },
  row: {
    maxWidth: isMobile ? '20vw' : '',
    wordWrap: 'normal',
  },
}))

let contracts = JSON.parse(localStorage.getItem('contracts')) || []
let timeout

export default function Contracts(props) {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const [changeContracts, setContracts] = React.useState(0)
  const [refresh, setRefresh] = React.useState(0)

  const [add, setOpenAdd] = React.useState(false)
  const handleClickAdd = () => {
    setOpenAdd(true)
  }
  const handleClose = () => {
    setOpenAdd(false)
  }

  const handleCreate = cnt => {
    contracts.push(cnt)
    setOpenAdd(false)
    setRefresh(refresh + 1)
  }

  const updateContracts = async () => {
    try {
      const response = await fetch('https://api.giona.tech/quorum/ballot/cnt', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          quorum: 'net',
        },
      })
      const cts = await response.json()
      cts.map(row => {
        row.selected = row.id === props.ballot.id
        return row
      })
      contracts = cts
      localStorage.setItem('contracts', JSON.stringify(contracts))
      // eslint-disable-next-line no-empty
    } catch (e) {}
    setContracts(changeContracts + 1)
  }
  useEffect(() => {
    updateContracts()
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      setRefresh(refresh + 1)
    }, 10000)
  }, [refresh])

  useEffect(() => {
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const handleChangeContract = async (checked, id) => {
    if (!checked) return
    setLoading(true)
    try {
      const cnt = {
        contract: id,
      }
      await fetch('https://api.giona.tech/quorum/ballot/cnt/change', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          quorum: 'net',
        },
        body: JSON.stringify(cnt),
      })
      contracts.map(row => {
        row.selected = row.id === id
        return row
      })
      localStorage.setItem('contracts', JSON.stringify(contracts))
      setContracts(changeContracts + 1)
      // eslint-disable-next-line no-empty
    } catch (e) {}
    setLoading(false)
  }

  const [loading, setLoading] = React.useState(false)

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <React.Fragment>
              <div className={classes.table}>
                <Table stickyHeader size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow width="auto">
                      <TableCell size="small" align="center">
                        Active
                      </TableCell>
                      {!isMobile && (
                        <TableCell className={classes.rowH} size="medium">
                          Contract
                        </TableCell>
                      )}
                      <TableCell className={classes.rowH} size="medium">
                        Title
                      </TableCell>
                      <TableCell size="small" align="center">
                        Votation
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contracts.map((row, id) => (
                      <TableRow key={id}>
                        <TableCell size="small" align="center">
                          <Radio checked={row.selected} disabled={loading} onChange={e => handleChangeContract(e.target.checked, row.id)} />
                        </TableCell>
                        {!isMobile && (
                          <TableCell className={classes.row} size="medium">
                            {row.id}
                          </TableCell>
                        )}
                        <TableCell className={classes.row} size="medium">
                          {row.title}
                        </TableCell>
                        <TableCell align="center" size="small">
                          <Tooltip title={row.isOpen ? 'Votation open' : 'Votation is being closed'}>{row.isOpen ? <LockOpenIcon color="secondary" /> : <LockIcon color="primary" />}</Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </React.Fragment>
          </Paper>
        </Grid>
      </Grid>
      {window.navigator.onLine && props.instanceOk && (
        <Zoom in={true} style={{ transitionDelay: '0ms' }}>
          <Fab color="secondary" aria-label="add" onClick={handleClickAdd} className={classes.fab}>
            <AddIcon />
          </Fab>
        </Zoom>
      )}
      <AddContract open={add} onClose={handleClose} onCreate={handleCreate} />
    </>
  )
}
