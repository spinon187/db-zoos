const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());
const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  },
}
// endpoints here

const db = knex(knexConfig);

const errors = {
  '19': 'Another record with that value exists',
};

server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos);
  }
  catch(error) {
    res.status(500).json(error);
  }
})

server.post('/api/zoos', async (req, res) => {
  try {
    const id = await db('zoos').insert(req.body);

    const zoo = await db('zoos')
      .where({id})
      .first();
    res.status(201).json(zoo);
  }
  catch(error){
    const message = errors[error.errorno] || 'Error';
    res.status(500).json({message, error});
  }
})

server.get('/api/zoos/:id', async (req, res) => {
  const id = req.params.id

  try {
    const zoo = await db('zoos')
      .where({id})
      .first();
    res.status(200).json(zoo);
  }
  catch {
    res.status(500).json(error);
  }
})



const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
