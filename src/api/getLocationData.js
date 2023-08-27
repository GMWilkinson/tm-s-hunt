import Airtable from 'airtable';
const base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base(process.env.REACT_APP_AIRTABLE_BASE);

export const getLocationData = () => {
  return new Promise((resolve, reject) => {
    const locations = []
    base('Locations').select({
      maxRecords: 20,
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          locations.push(record)
      })
      fetchNextPage()
  
  }, function done(err) {
      if (err) { 
        return reject(err) 
      }
      return resolve(locations)
  })
  })
}
