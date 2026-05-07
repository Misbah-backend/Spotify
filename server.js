// Load environment variables from the project .env file.
require('dotenv').config({ path: './src/.env', override: true })

// Import the Express app and the database connection helper.
const app = require('./src/app')
const connectedDb = require('./src/db/db')

// Connect to MongoDB before handling requests.
connectedDb()

// Start the server on port 3000.
app.listen(3000, () => {
    console.log('Server is running on port 3000')
})