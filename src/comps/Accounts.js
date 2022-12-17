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
import Enabler from './Enabler'
import AddAccount from './AddAccount'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import Tooltip from '@material-ui/core/Tooltip'
import Zoom from '@material-ui/core/Zoom'
import { connect } from 'react-redux'
import { loginUser, logoffUser } from '../redux'
import { isMobile } from 'react-device-detect'

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
    //maxHeight: 515,
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
    //height: "540px",
    maxHeight: isMobile ? 'calc(100vh - 16.3rem)' : 'calc(100vh - 13.3rem)',
    overflowY: 'scroll',
  },
  rowH: {
    maxWidth: isMobile ? '20vw' : '',
  },
  row: {
    maxWidth: isMobile ? '20vw' : '',
    wordWrap: 'break-word',
    userSelect: 'text',
  },
}))

let accounts = JSON.parse(localStorage.getItem('accounts')) || []
let timeout

const Accounts = props => {
  const classes = useStyles()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  const [changeAccounts, setAccounts] = React.useState(0)
  const [refresh, setRefresh] = React.useState(0)

  const updateAccounts = async () => {
    try {
      const response = await fetch('https://api.giona.tech/quorum/account/list', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          quorum: 'net',
        },
      })
      const json = await response.json()
      let newAccounts = []
      json.forEach((row, id) => {
        const found = accounts.find(found => found.account === row.account)
        const voto = props.ballot.contendenti.find(found => found.id === Number(row.vote))
        newAccounts.unshift({
          id: id,
          account: row.account,
          intern: row.intern,
          alias: found ? found.alias : '',
          enabled: row.right,
          voted: row.voted,
          vote: row.voted ? voto.nome : '',
        })
      })
      accounts = newAccounts
      localStorage.setItem('accounts', JSON.stringify(accounts))
      let freeVotes = 0
      json.forEach(row => {
        if (row.right && !row.voted) freeVotes += 1
      })
      props.onChangeVotes(freeVotes)
      // eslint-disable-next-line no-empty
    } catch (e) {}
    setAccounts(changeAccounts + 1)
  }
  useEffect(() => {
    updateAccounts()
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      setRefresh(refresh + 1)
    }, 7000)
  }, [refresh])

  useEffect(() => {
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCreate = (account, alias) => {
    const id = accounts.length
    accounts.unshift({
      id: id,
      account: account,
      intern: true,
      alias: alias,
      enabled: false,
      voted: false,
      vote: false,
    })
    setOpen(false)
    setRefresh(refresh + 1)
  }

  const handleChangeAccounts = async account => {
    accounts.map(row => {
      if (row.account === account) {
        row.enabled = true
      }
      return row
    })
    localStorage.setItem('accounts', JSON.stringify(accounts))
    setAccounts(changeAccounts + 1)
  }

  // const StyledTableRow = withStyles((theme) => ({
  //   root: {
  //     "&:nth-of-type(odd)": {
  //       //backgroundColor: theme.palette.action.hover,
  //     },
  //   },
  // }))(TableRow)

  return (
    <>
      {window.navigator.onLine && props.instanceOk && (
        <Zoom in={true} style={{ transitionDelay: '0ms' }}>
          <Fab color="secondary" aria-label="add" onClick={handleClickOpen} className={classes.fab}>
            <AddIcon />
          </Fab>
        </Zoom>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={fixedHeightPaper}>
            <React.Fragment>
              <div className={classes.table}>
                <Table stickyHeader size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow width="auto">
                      {!isMobile && <TableCell size="small">Id</TableCell>}
                      <TableCell className={classes.rowH} size="medium">
                        Account
                      </TableCell>
                      <TableCell className={classes.rowH} size="medium">
                        Alias
                      </TableCell>
                      <TableCell size="small" align="center">
                        Vote
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accounts.map((row, id) => (
                      <TableRow key={id}>
                        {!isMobile && <TableCell size="small">{row.id}</TableCell>}
                        <TableCell className={classes.row} size="medium">
                          {row.account}
                        </TableCell>
                        <TableCell className={classes.row} size="medium">
                          {row.intern ? (
                            row.alias
                          ) : (
                            <Tooltip title="From external node">
                              <ExitToAppIcon />
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell size="small" align="center">
                          <Enabler
                            key={id}
                            account={row.account}
                            enabled={row.enabled}
                            vote={row.vote}
                            isOpen={props.ballot.isOpen && window.navigator.onLine && props.instanceOk}
                            onEnabled={handleChangeAccounts}
                          />
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
      <AddAccount open={open} onClose={handleClose} onCreate={handleCreate} accounts={accounts} />
    </>
  )
}
const mapStateToProps = state => {
  return {
    logging: state.logging,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    loginUser: user => dispatch(loginUser(user)),
    logoffUser: () => dispatch(logoffUser()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Accounts)
