import Airtable from 'airtable'
const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE);

export const setFinishTime = (startTime, penalties) => {
  const teamId = localStorage.getItem('teamId')
  return new Promise((resolve, reject) => {
    const currentDate = new Date()
    const currentTime = currentDate.getTime()
    const score = (currentTime + penalties) - startTime
    const minutes = Math.floor(score / 60000)
    const seconds = ((score % 60000) / 1000).toFixed(0)
    base('Teams').update([
      {
        "id": teamId,
        "fields": {
          "finish-time": currentTime,
          "total-time": minutes + ":" + (seconds < 10 ? '0' : '') + seconds
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err);
        return reject(err)
      }
      return resolve(records)
    });
  })

}