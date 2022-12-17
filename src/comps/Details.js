import React from 'react'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Title from './Title'

const useStyles = makeStyles(theme => ({
  table: {
    display: 'block',
    //height: "540px",
    overflowY: 'scroll',
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
}))

export default function Details(props) {
  const classes = useStyles()
  return (
    <React.Fragment>
      <Title>Details</Title>
      <div className={classes.table}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Votes ({props.ballot.tot})</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.ballot.contendenti.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.nome}</TableCell>
                <TableCell align="right">{row.voti}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className={classes.seeMore}>
        <Link color="primary" href="https://cakeshop.giona.tech" target="_blank">
          Cakeshop
        </Link>
        <Typography component="body1" color="primary">
          {' // '}
        </Typography>
        <Link color="primary" href="https://quorumscan.giona.tech" target="_blank">
          BlockChain Explorer
        </Link>
      </div>
    </React.Fragment>
  )
}
