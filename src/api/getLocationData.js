import Airtable from 'airtable';
var base = new Airtable({apiKey: process.env.REACT_APP_AIRTABLE_API_KEY}).base('app03n7sTByRoi7AM');

export const getLocationData = () => {
  return new Promise((resolve, reject) => {
    const locations = []
    base('Locations').select({
      maxRecords: 20,
      view: "Grid view"
  }).eachPage(function page(records, fetchNextPage) {
      records.forEach(function(record) {
          console.log('Retrieved', record);
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
