import { Router } from 'express';
import prisma from '../prismaClient.js';

const router = Router();

// GET /productos - listar todos
router.get('/', async (req, res) => {
  try {
    const productos = await prisma.producto.findMany();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /productos/:id - obtener uno
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await prisma.producto.findUnique({
      where: { id: Number(id) },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// POST /productos - crear
router.post('/', async (req, res) => {
  try {
    const { nombre, categoria, precio, stock, descripcion } = req.body;

    if (!nombre || !categoria || precio === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (typeof precio !== 'number' || precio < 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'El stock debe ser un número positivo' });
    }

    const nuevoProducto = await prisma.producto.create({
      data: { nombre, categoria, precio, stock, descripcion },
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

// PUT /productos/:id - editar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, stock, descripcion } = req.body;

    const productoExistente = await prisma.producto.findUnique({
      where: { id: Number(id) },
    });

    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const productoActualizado = await prisma.producto.update({
      where: { id: Number(id) },
      data: { nombre, categoria, precio, stock, descripcion },
    });

    res.json(productoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// DELETE /productos/:id - eliminar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const productoExistente = await prisma.producto.findUnique({
      where: { id: Number(id) },
    });

    if (!productoExistente) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await prisma.producto.delete({
      where: { id: Number(id) },
    });

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default router;