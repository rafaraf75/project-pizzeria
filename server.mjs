import path from 'path';
import jsonServer from 'json-server';
import { env } from 'process';


const server = jsonServer.create();
const router = jsonServer.router(path.join('dist', 'db', 'app.json'));
const middlewares = jsonServer.defaults({
  static: 'dist',
  noCors: true
});

const port = env.PORT || 3131;

server.use(middlewares);
server.use(router);

server.listen(port);

export default server;
