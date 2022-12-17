import React from 'react'
import { BarChart, Bar, XAxis, ResponsiveContainer, LabelList } from 'recharts'
import { isMobile } from 'react-device-detect'
import Title from './Title'

export default function Chart(props) {
  const data = Object.assign([], props.ballot.contendenti)
  if (isMobile) data.splice(3)
  return (
    <React.Fragment>
      <Title>Situation</Title>
      <ResponsiveContainer>
        <BarChart data={data}>
          <Bar dataKey="voti" fill="#8884d8">
            <LabelList dataKey="perc" fill="#282740" position="center" />
          </Bar>
          <XAxis dataKey="nome" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  )
}
