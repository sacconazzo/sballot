import React, { useEffect } from 'react'
import { BarChart, Bar, XAxis, ResponsiveContainer, LabelList } from 'recharts'
import { isMobile } from 'react-device-detect'
import Title from './Title'

let timeout

export default function Stats(props) {
  const [stats, setStats] = React.useState(props.stats)
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
      let newStats = [
        {
          val: 0,
          descr: '',
          perc: '',
        },
        {
          val: 0,
          descr: '',
          perc: '',
        },
        {
          val: 0,
          descr: '',
          perc: '',
        },
      ]
      json.forEach(row => {
        newStats[0].val += 1
        if (row.right) newStats[1].val += 1
        if (row.voted) newStats[2].val += 1
      })
      newStats[0].descr = `Accounts (${newStats[0].val})`
      newStats[1].descr = `Subscribed (${newStats[1].val})`
      newStats[2].descr = `Voted (${newStats[2].val})`
      if (newStats[2].val / newStats[0].val >= 0.1) newStats[1].perc = `${Math.round((newStats[1].val / newStats[0].val) * 100, 2)}%`
      if (newStats[2].val / newStats[0].val >= 0.1) newStats[2].perc = `${Math.round((newStats[2].val / newStats[1].val) * 100, 2)}%`
      if (isMobile) newStats.splice(0, 1)
      setStats(newStats)
      let freeVotes = 0
      json.forEach(row => {
        if (row.right && !row.voted) freeVotes += 1
      })
      props.statsChanged(newStats, freeVotes)
    } catch (e) {}
  }

  useEffect(() => {
    updateAccounts()
    timeout = setTimeout(() => {
      setRefresh(refresh + 1)
    }, 7000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh])

  useEffect(() => {
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <React.Fragment>
      <Title>Stats</Title>
      <ResponsiveContainer>
        <BarChart data={stats}>
          <Bar dataKey="val" fill="#8884d8">
            <LabelList dataKey="perc" fill="#282740" position="center" />
          </Bar>
          <XAxis dataKey="descr" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}
