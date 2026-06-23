import { Router } from 'express';
import prisma from '../prismaClient.js';
import ValidationError from '../errors/ValidationError.js';
import NotFoundError from '../errors/NotFoundError.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = Router();

const ROLES_VALIDOS = ['ADMIN', 'USUARIO', 'SUPERADMIN'];
const ROLES_ASIGNABLES = ['ADMIN', 'USUARIO'];

// GET /usuarios - listar todos (solo SUPERADMIN)
router.get('/', authMiddleware, roleMiddleware(['SUPERADMIN']), async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nombre: true, email: true, rol: true, creadoEn: true },
    // 'select' excluye el campo password de la respuesta, por seguridad
  });
  res.json(usuarios);
});

// PUT /usuarios/:id/rol - cambiar el rol de un usuario (solo SUPERADMIN)
router.put('/:id/rol', authMiddleware, roleMiddleware(['SUPERADMIN']), async (req, res) => {
  const { id } = req.params;
  const { rol } = req.body;

  if (!rol || !ROLES_ASIGNABLES.includes(rol)) {
    throw new ValidationError(`El rol debe ser uno de: ${ROLES_ASIGNABLES.join(', ')}`);
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { id: Number(id) },
  });

  if (!usuarioExistente) {
    throw new NotFoundError('Usuario no encontrado');
  }

  // Nadie puede modificar el rol de un SUPERADMIN (ni a sí mismo ni a otro)
  if (usuarioExistente.rol === 'SUPERADMIN') {
    throw new ValidationError('No se puede modificar el rol de un SUPERADMIN');
  }

  const usuarioActualizado = await prisma.usuario.update({
    where: { id: Number(id) },
    data: { rol },
    select: { id: true, nombre: true, email: true, rol: true },
  });

  res.json(usuarioActualizado);
});

// DELETE /usuarios/:id - eliminar usuario (solo SUPERADMIN)
router.delete('/:id', authMiddleware, roleMiddleware(['SUPERADMIN']), async (req, res) => {
  const { id } = req.params;

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { id: Number(id) },
  });

  if (!usuarioExistente) {
    throw new NotFoundError('Usuario no encontrado');
  }

  if (usuarioExistente.rol === 'SUPERADMIN') {
    throw new ValidationError('No se puede eliminar a un usuario SUPERADMIN');
  }

  await prisma.usuario.delete({
    where: { id: Number(id) },
  });

  res.json({ mensaje: 'Usuario eliminado correctamente' });
});

export default router;