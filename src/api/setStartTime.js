import Airtable from 'airtable'
const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE)

export const setStartTime = () => {
  const teamId = localStorage.getItem('teamId')
  return new Promise((resolve, reject) => {
    const currentDate = new Date()
    const currentTime = currentDate.getTime()
    base('Teams').update([
      {
        "id": teamId,
        "fields": {
          "start-time": currentTime
        }
      }
    ], function(err, records) {
      if (err) {
        return reject(err)
      }
      console.log(records)
      return resolve(records)
    });
  })

}