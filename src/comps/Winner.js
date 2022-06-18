import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Title from "./Title"

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
})

export default function Winners(props) {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Title>{props.ballot.isOpen ? "Winning" : "Winner"}</Title>
      <Typography color="textSecondary" variant="h4" className={classes.depositContext}>
        {props.ballot.title}
      </Typography>
      <Typography component="p" variant="h4">
        {props.ballot.vincente}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        {props.ballot.voti} votes
      </Typography>
    </React.Fragment>
  )
}
