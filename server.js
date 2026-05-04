require('dotenv').config({ path: './src/.env' })
const { connect } = require('mongoose')
const app= require('./src/app')
const connectedDb = require('./src/db/db')

connectedDb()

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})