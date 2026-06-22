import { Router } from 'express';
import prisma from '../prismaClient.js';
import ValidationError from '../errors/ValidationError.js';
import NotFoundError from '../errors/NotFoundError.js';

const router = Router();

// Función auxiliar para validar los datos del producto
function validarProducto(data, esEdicion = false) {
  const { nombre, categoria, precio, stock } = data;

  if (!esEdicion) {
    // En creación, los campos obligatorios deben venir sí o sí
    if (!nombre || !categoria || precio === undefined || stock === undefined) {
      throw new ValidationError('Faltan campos obligatorios: nombre, categoria, precio y stock son requeridos');
    }
  }

  if (nombre !== undefined && typeof nombre !== 'string') {
    throw new ValidationError('El nombre debe ser un texto');
  }

  if (nombre !== undefined && nombre.trim() === '') {
    throw new ValidationError('El nombre no puede estar vacío');
  }

  if (categoria !== undefined && typeof categoria !== 'string') {
    throw new ValidationError('La categoría debe ser un texto');
  }

  if (precio !== undefined) {
    if (typeof precio !== 'number' || isNaN(precio)) {
      throw new ValidationError('El precio debe ser un número');
    }
    if (precio <= 0) {
      throw new ValidationError('El precio debe ser un valor positivo');
    }
  }

  if (stock !== undefined) {
    if (typeof stock !== 'number' || isNaN(stock)) {
      throw new ValidationError('El stock debe ser un número');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new ValidationError('El stock debe ser un número entero positivo');
    }
  }
}

// GET /productos - listar todos
router.get('/', async (req, res) => {
  const productos = await prisma.producto.findMany();
  res.json(productos);
});

// GET /productos/:id - obtener uno
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) },
  });

  if (!producto) {
    throw new NotFoundError('Producto no encontrado');
  }

  res.json(producto);
});

// POST /productos - crear
router.post('/', async (req, res) => {
  const { nombre, categoria, precio, stock, descripcion } = req.body;

  validarProducto(req.body);

  const nuevoProducto = await prisma.producto.create({
    data: { nombre, categoria, precio, stock, descripcion },
  });

  res.status(201).json(nuevoProducto);
});

// PUT /productos/:id - editar
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock, descripcion } = req.body;

  const productoExistente = await prisma.producto.findUnique({
    where: { id: Number(id) },
  });

  if (!productoExistente) {
    throw new NotFoundError('Producto no encontrado');
  }

  validarProducto(req.body, true);

  const productoActualizado = await prisma.producto.update({
    where: { id: Number(id) },
    data: { nombre, categoria, precio, stock, descripcion },
  });

  res.json(productoActualizado);
});

// DELETE /productos/:id - eliminar
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const productoExistente = await prisma.producto.findUnique({
    where: { id: Number(id) },
  });

  if (!productoExistente) {
    throw new NotFoundError('Producto no encontrado');
  }

  await prisma.producto.delete({
    where: { id: Number(id) },
  });

  res.json({ mensaje: 'Producto eliminado correctamente' });
});

export default router;