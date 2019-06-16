var data = []
var schemas = []


// generate columns - sample: 1.000 columns
for (let i = 0; i < 1000; i++) {
  schemas.push({ name: `col_${i+1}`})
}

// generate rows - sample : 1.000 rows
var cellIndex = 0
for (let i = 0; i < 1000; i++) {
  data.push(schemas.map(col => ++cellIndex))
}

export const HARD_DATA = data
export const SCHEMA = schemas