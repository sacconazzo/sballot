import React from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Chart from './Chart'
import Winner from './Winner'
import Details from './Details'
import Stats from './Stats'

export default function Main(props) {
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper className={props.fixedHeightPaper}>
            <Winner ballot={props.ballot} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper className={props.fixedHeightPaper}>
            <Chart ballot={props.ballot} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <Paper className={props.fixedHeightPaperPlus}>
            <Stats stats={props.stats} statsChanged={props.statsChanged} ballot={props.ballot} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <Paper className={props.fixedHeightPaperPlus}>
            <Details ballot={props.ballot} />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}
