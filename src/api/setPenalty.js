import Airtable from 'airtable'
const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE)

export const setPenalty = (newValue) => {
  const teamId = localStorage.getItem('teamId')
  return new Promise((resolve, reject) => {
    base('Teams').update([
      {
        "id": teamId,
        "fields": {
          "penalties": newValue
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err);
        return reject(err)
      }
      return resolve()
    });
  })

}