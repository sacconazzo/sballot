import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import DashboardIcon from '@material-ui/icons/Dashboard'
import PeopleIcon from '@material-ui/icons/People'
import BallotIcon from '@material-ui/icons/Ballot'
import AssignmentIcon from '@material-ui/icons/Assignment'

export const MainListItems = props => {
  return (
    <div>
      <ListItem button selected={props.selected === '1'} onClick={() => props.setSelected('1')}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItem>
      <ListItem button selected={props.selected === '2'} onClick={() => props.setSelected('2')}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Accounts" />
      </ListItem>
      <ListItem button selected={props.selected === '3'} onClick={() => props.setSelected('3')}>
        <ListItemIcon>
          <BallotIcon />
        </ListItemIcon>
        <ListItemText primary="Ballots" />
      </ListItem>
    </div>
  )
}

export const SecondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
)
