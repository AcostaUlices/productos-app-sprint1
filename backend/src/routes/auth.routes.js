import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';
import ValidationError from '../errors/ValidationError.js';
import UnauthorizedError from '../errors/UnauthorizedError.js';
import ConflictError from '../errors/ConflictError.js';

const router = Router();

// POST /auth/register
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    throw new ValidationError('Nombre, email y contraseña son obligatorios');
  }

  if (password.length < 6) {
    throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
  }

  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExistente) {
    throw new ConflictError('Ya existe un usuario registrado con ese email');
  }

  // Hashear la contraseña antes de guardarla (HU5)
  const passwordHasheada = await bcrypt.hash(password, 10);

  const nuevoUsuario = await prisma.usuario.create({
    data: {
      nombre,
      email,
      password: passwordHasheada,
    },
  });

  // No devolvemos la contraseña en la respuesta, ni siquiera hasheada
  res.status(201).json({
    id: nuevoUsuario.id,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    rol: nuevoUsuario.rol,
  });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email y contraseña son obligatorios');
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new UnauthorizedError('Email o contraseña incorrectos');
  }

  // Comparamos la contraseña ingresada contra el hash guardado
  const passwordValida = await bcrypt.compare(password, usuario.password);

  if (!passwordValida) {
    throw new UnauthorizedError('Email o contraseña incorrectos');
  }

  // Generamos el token, incluyendo datos útiles para identificarlo después
  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.status(200).json({
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    },
  });
});

export default router;