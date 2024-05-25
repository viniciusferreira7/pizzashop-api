import Elysia from 'elysia';

const app = new Elysia().get('/', () => {
  return 'Hello word'
})

app.listen(3333, () => {
  console.log('🔥 HTTP server running!')
})