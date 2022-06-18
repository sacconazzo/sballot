import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from "@material-ui/lab/Alert"
import ScheduleIcon from "@material-ui/icons/Schedule"
import Tooltip from "@material-ui/core/Tooltip"
import CircularProgress from "@material-ui/core/CircularProgress"

const useStyles = makeStyles((theme) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}))

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export default function Enabler(props) {
  const classes = useStyles()
  const [loading, setLoading] = React.useState(false)
  const [log, setLog] = React.useState({ open: false })
  const [enabled, setEnabled] = React.useState(false)

  const enable = async () => {
    setLoading(true)
    const acc = {
      account: props.account,
    }
    try {
      const response = await fetch("https://api.giona.tech/quorum/ballot/add", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          quorum: "net",
        },
        body: JSON.stringify(acc),
      })
      if (response.status === 200) {
        const json = await response.json()
        setLog({ open: true, message: "Account enabled on block number " + json.blockNumber, type: "success" })
        props.onEnabled(props.account)
        setEnabled(true)
      } else {
        setLog({ open: true, message: "Error on enabling", type: "error" })
      }
    } catch (e) {
      setLog({ open: true, message: "Error on enabling", type: "error" })
    }
    setLoading(false)
  }

  return (
    <>
      <div className={classes.wrapper}>
        {props.enabled || enabled ? (
          <>
            {props.vote ? (
              props.vote
            ) : (
              <Tooltip title="Not yet voted">
                <ScheduleIcon color="secondary" />
              </Tooltip>
            )}
          </>
        ) : (
          <>
            {props.isOpen && (
              <Button disabled={loading} variant="contained" color="primary" onClick={enable}>
                Enable
              </Button>
            )}
          </>
        )}
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={log.open}
        onClose={() => setLog({ open: false })}
      >
        <Alert onClose={() => setLog({ open: false })} severity={log.type}>
          {log.message}
        </Alert>
      </Snackbar>
    </>
  )
}
