import Airtable from 'airtable'

import { getAllTeams } from './getAllTeams'

const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE)

export const createNewTeam = async (teamName) => {
  const allTeams = await getAllTeams()

  const checkName = allTeams.filter((team) => team.fields.Name === teamName)
  if (checkName.length > 0) {
    localStorage.setItem('teamId', checkName[0].id)
    return 'exists'
  }
  return new Promise((resolve, reject) => {
    const newTeam = []
    base('Teams').create([
      {
        "fields": {
          "Name": teamName,
          "current-question": 0,
          "penalties": 0,
          "total-time": 'unset'
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err)
        return reject(err)
      }
      records.forEach(function (record) {
        newTeam.push(record)
      })
      localStorage.setItem('teamId', records[0].getId())
      return resolve(newTeam)
    })
  })

}