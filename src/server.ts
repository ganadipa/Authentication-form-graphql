import express from 'express'


const app = express()
const PORT = 3055

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})