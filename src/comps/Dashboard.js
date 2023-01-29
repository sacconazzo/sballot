/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import clsx from 'clsx'
import { Capacitor } from '@capacitor/core'
import { makeStyles, createTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { ThemeProvider } from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import List from '@material-ui/core/List'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Link from '@material-ui/core/Link'
import Toolbar from '@material-ui/core/Toolbar'
import Badge from '@material-ui/core/Badge'
import MenuIcon from '@material-ui/icons/Menu'
import HowToVoteIcon from '@material-ui/icons/HowToVote'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import Tooltip from '@material-ui/core/Tooltip'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Zoom from '@material-ui/core/Zoom'
import { useSelector, useDispatch } from 'react-redux'
import { loginUser } from '../redux'
import { isMobile, MobileView, BrowserView, isSafari } from 'react-device-detect'
import { MainListItems } from './listItems'
import Main from './Main'
import Accounts from './Accounts'
import Contracts from './Contracts'
import BallotIcon from '@material-ui/icons/Ballot'
import OfflineBoltTwoToneIcon from '@material-ui/icons/OfflineBoltTwoTone'
import Vote from './Vote'
import Loading from './Loading'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Based on own personal blockchain // Ethereum technology - Copyright © '}
      <Link color="inherit" href="https://giona.tech/">
        giona.tech
      </Link>
      {' 2020-'}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth = 240
//const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const useStyles = makeStyles(theme => ({
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.8em',
    },
    '*::-webkit-scrollbar-track': {
      //"-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      borderRadius: '5px',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(228,228,228,.3)',
      //outline: "1px solid slategrey",
      borderRadius: '5px',
    },
  },
  root: {
    display: 'flex',
    userSelect: 'none',
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    paddingTop: 'env(safe-area-inset-top)', // ios notch
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: isMobile ? 'calc(100vh - 55px)' : '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: Capacitor.getPlatform() === 'ios' ? theme.spacing(7) : theme.spacing(4),
    paddingBottom: isMobile ? theme.spacing(10) : theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  fixedHeightPlus: {
    height: 250,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  bottom: {
    position: 'fixed',
    bottom: '0',
    width: '100%',
    // paddingBottom: `env(safe-area-inset-bottom)`,
  },
}))

let user = {
  user: 'quorum',
  password: 'net',
  logged: false,
}
const login = async () => {
  if (!user.logged) {
    await fetch('https://api.giona.tech/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    user.logged = true
  }
}

let ballot = JSON.parse(localStorage.getItem('ballot')) || {
  title: '...',
  vincente: '...',
  votes: 0,
  tot: 0,
  contendenti: [],
}

let stats = JSON.parse(localStorage.getItem('stats')) || []

let freeVotes = 0

export default function Dashboard() {
  let prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  if (window.navigator.userAgent.includes('AndroidDarkMode')) {
    prefersDarkMode = true
  }
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  )
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  const statsChanged = (newStats, _freeVotes) => {
    stats = newStats
    localStorage.setItem('stats', JSON.stringify(stats))
    freeVotes = _freeVotes
  }

  const votesChanged = _freeVotes => {
    freeVotes = _freeVotes
  }

  const [loaded, setLoaded] = React.useState(0)
  const [instanceOk, setInstanceOk] = React.useState(false)
  const [loadingRate, setLoadingRate] = React.useState(1)
  const setInstance = bool => {
    setInstanceOk(bool)
  }
  const [refresh, setRefresh] = React.useState(0)
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!isSafari) await login()
        const response = await fetch('https://api.giona.tech/quorum/ballot', {
          method: 'GET',
          credentials: 'include',
          headers: {
            quorum: 'net',
          },
        })
        const json = await response.json()
        if (response.status !== 200 && json.loading) setLoadingRate(json.loading)
        if (ballot !== json) {
          json.contendenti.sort((a, b) => b.voti - a.voti)
          ballot = json
          ballot.tot = 0
          ballot.contendenti.forEach(row => {
            row.voti = Number(row.voti)
            ballot.tot += row.voti
          })
          ballot.contendenti.map(row => {
            if (row.voti / ballot.tot >= 0.1) row.perc = Math.round((row.voti / ballot.tot) * 100, 2) + '%'
            return row
          })
          localStorage.setItem('ballot', JSON.stringify(ballot))
          setLoaded(loaded + 1)
          setInstance(true)
        }
      } catch (e) {
        setInstance(false)
      }
      setTimeout(() => {
        setRefresh(refresh + 1)
      }, 5000)
    }
    fetchData()
  }, [refresh])

  const [selected, setSelected] = React.useState('1')

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  const fixedHeightPaperPlus = clsx(classes.paper, classes.fixedHeightPlus)

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <BrowserView>
              <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
                <MenuIcon />
              </IconButton>
            </BrowserView>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              sBallottaggio
            </Typography>
            <IconVotes ballot={ballot} instanceStatus={{ instanceOk, loadingRate }} free={freeVotes} />
          </Toolbar>
        </AppBar>
        {!isMobile && (
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open.drawer}
          >
            <div className={classes.toolbarIcon}>
              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            <List>
              <MainListItems
                selected={selected}
                setSelected={view => {
                  setSelected(view)
                }}
              />
            </List>
          </Drawer>
        )}
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {selected === '1' && <Main ballot={ballot} stats={stats} statsChanged={statsChanged} fixedHeightPaper={fixedHeightPaper} fixedHeightPaperPlus={fixedHeightPaperPlus} classes={classes} />}
            {selected === '2' && <Accounts ballot={ballot} instanceOk={instanceOk} onChangeVotes={votesChanged} fixedHeightPaper={fixedHeightPaper} classes={classes} />}
            {selected === '3' && <Contracts ballot={ballot} instanceOk={instanceOk} fixedHeightPaper={fixedHeightPaper} classes={classes} />}
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
          <MobileView>
            <Box boxShadow={3} position="absolute" className={classes.bottom}>
              <BottomNavigation showLabels value={Number(selected) - 1} onChange={(event, next) => setSelected((next + 1).toString())}>
                <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
                <BottomNavigationAction label="Accounts" icon={<PeopleIcon />} />
                <BottomNavigationAction label="Ballots" icon={<BallotIcon />} />
              </BottomNavigation>
            </Box>
          </MobileView>
        </main>
      </div>
      {false && (
        <Backdrop className={classes.backdrop} open={ballot.title === '...'}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </ThemeProvider>
  )
}

function IconVotes(props) {
  const classes = useStyles()
  const logged = useSelector(state => state.logging)
  const dispatch = useDispatch()
  const [vote, setVote] = React.useState(false)
  const [loading, setloading] = React.useState(ballot.title === '...')
  const loadingMessage = 'Blockchain node is starting... please wait'
  const handleOpen = () => {
    setVote(true)
  }
  return (
    <>
      {false && (
        <Button variant="contained" color="primary" onClick={() => dispatch(loginUser('pino'))}>
          User {logged.user}
        </Button>
      )}
      {window.navigator.onLine && props.instanceStatus.instanceOk && (
        <Zoom in={props.ballot.isOpen}>
          <Tooltip title="Send Your Votation" aria-label="add">
            <IconButton color="inherit" onClick={handleOpen}>
              <Badge badgeContent={props.free} color="secondary">
                <HowToVoteIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Zoom>
      )}
      {window.navigator.onLine && !props.instanceStatus.instanceOk && (
        <Zoom in={true}>
          <Tooltip title={loadingMessage} aria-label="add">
            <div className={classes.spinner} onClick={() => setloading(true)}>
              <CircularProgress color="secondary" />
            </div>
          </Tooltip>
        </Zoom>
      )}
      {!window.navigator.onLine && (
        <Zoom in={true}>
          <Tooltip title="offline" aria-label="add">
            <OfflineBoltTwoToneIcon />
          </Tooltip>
        </Zoom>
      )}
      <Vote ballot={props.ballot} open={vote} onClose={() => setVote(false)} />
      <Loading ballot={props.ballot} instanceStatus={props.instanceStatus} open={loading} message={loadingMessage} onClose={() => setloading(false)} />
    </>
  )
}
