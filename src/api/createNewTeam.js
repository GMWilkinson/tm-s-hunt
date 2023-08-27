import Airtable from 'airtable'
const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE);

export const createNewTeam = (teamName) => {
  return new Promise((resolve, reject) => {
    const newTeam = []
    base('Teams').create([
      {
        "fields": {
          "Name": teamName,
          "current-question": 0,
          "penalties": 0,
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