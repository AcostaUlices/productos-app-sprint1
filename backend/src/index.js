import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/productos', productosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});