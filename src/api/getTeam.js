import Airtable from 'airtable'
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base('app03n7sTByRoi7AM')

export const getTeam = () => {
  const teamId = localStorage.getItem('teamId')
  return new Promise((resolve, reject) => {
    base('Teams').find(teamId, function(err, record) {
      if (err) { 
        console.error(err)
        return reject(err)
      }
      console.log(record)
      return resolve(record)
    })
  })
}