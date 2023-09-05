import Airtable from 'airtable';
const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE);

export const getAllTeams = () => {
  return new Promise((resolve, reject) => {
    const teams = []
    base('Teams').select({
      maxRecords: 20,
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          teams.push(record)
      })
      fetchNextPage()
  
  }, function done(err) {
      if (err) { 
        return reject(err) 
      }
      return resolve(teams)
  })
  })
}
