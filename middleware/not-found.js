const notFound = (req, res) => res.status(404).send('Jobs API server is running, but route does not exist')

module.exports = notFound
