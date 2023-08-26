import Airtable from 'airtable'
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base('app03n7sTByRoi7AM');

export const updateCurrentQuestion = (index) => {
  const teamId = localStorage.getItem('teamId')
  return new Promise((resolve, reject) => {
    base('Teams').update([
      {
        "id": teamId,
        "fields": {
          "current-question": index
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