# Schema de Incapacidades Médicas

## Modelo de Datos (MongoDB/Mongoose)

```javascript
// models/incapacidad.model.js
import mongoose from 'mongoose';

const incapacidadSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cedulaPaciente: {
    type: String,
    required: true,
    trim: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  diasIncapacidad: {
    type: Number,
    required: true,
    min: 1
  },
  diagnostico: {
    type: String,
    required: true,
    trim: true
  },
  tipoIncapacidad: {
    type: String,
    enum: ['enfermedad_general', 'accidente_laboral', 'enfermedad_profesional', 'maternidad', 'otro'],
    default: 'enfermedad_general'
  },
  observaciones: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ['activa', 'finalizada', 'cancelada'],
    default: 'activa'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento
incapacidadSchema.index({ cedulaPaciente: 1 });
incapacidadSchema.index({ pacienteId: 1 });
incapacidadSchema.index({ fechaInicio: 1 });
incapacidadSchema.index({ estado: 1 });

// Validación personalizada para fechas
incapacidadSchema.pre('save', function(next) {
  if (this.fechaInicio >= this.fechaFin) {
    next(new Error('La fecha de inicio debe ser anterior a la fecha de fin'));
  }
  next();
});

export default mongoose.model('Incapacidad', incapacidadSchema);
```

## Controlador

```javascript
// controllers/incapacidad.controller.js
import Incapacidad from '../models/incapacidad.model.js';

// Crear nueva incapacidad
export const createIncapacidad = async (req, res) => {
  try {
    const incapacidad = new Incapacidad({
      ...req.body,
      creadoPor: req.user._id
    });
    
    const incapacidadGuardada = await incapacidad.save();
    res.status(201).json(incapacidadGuardada);
  } catch (error) {
    console.error('Error creando incapacidad:', error);
    res.status(400).json({ msg: error.message });
  }
};

// Obtener todas las incapacidades
export const getAllIncapacidades = async (req, res) => {
  try {
    const incapacidades = await Incapacidad.find()
      .populate('pacienteId', 'name cedula email')
      .populate('creadoPor', 'name')
      .sort({ fechaCreacion: -1 });
    
    res.json(incapacidades);
  } catch (error) {
    console.error('Error obteniendo incapacidades:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

// Obtener incapacidades por cédula del paciente
export const getIncapacidadesByCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    const incapacidades = await Incapacidad.find({ cedulaPaciente: cedula })
      .populate('pacienteId', 'name cedula email')
      .populate('creadoPor', 'name')
      .sort({ fechaCreacion: -1 });
    
    res.json(incapacidades);
  } catch (error) {
    console.error('Error obteniendo incapacidades por cédula:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

// Obtener incapacidad por ID
export const getIncapacidadById = async (req, res) => {
  try {
    const incapacidad = await Incapacidad.findById(req.params.id)
      .populate('pacienteId', 'name cedula email')
      .populate('creadoPor', 'name');
    
    if (!incapacidad) {
      return res.status(404).json({ msg: 'Incapacidad no encontrada' });
    }
    
    res.json(incapacidad);
  } catch (error) {
    console.error('Error obteniendo incapacidad:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

// Actualizar incapacidad
export const updateIncapacidad = async (req, res) => {
  try {
    const incapacidad = await Incapacidad.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fechaActualizacion: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!incapacidad) {
      return res.status(404).json({ msg: 'Incapacidad no encontrada' });
    }
    
    res.json(incapacidad);
  } catch (error) {
    console.error('Error actualizando incapacidad:', error);
    res.status(400).json({ msg: error.message });
  }
};

// Eliminar incapacidad
export const deleteIncapacidad = async (req, res) => {
  try {
    const incapacidad = await Incapacidad.findByIdAndDelete(req.params.id);
    
    if (!incapacidad) {
      return res.status(404).json({ msg: 'Incapacidad no encontrada' });
    }
    
    res.json({ msg: 'Incapacidad eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando incapacidad:', error);
    res.status(500).json({ msg: 'Error interno del servidor' });
  }
};
```

## Rutas

```javascript
// routes/incapacidad.routes.js
import express from 'express';
import { authUser } from '../middlewares/auth-user.middleware.js';
import {
  createIncapacidad,
  getAllIncapacidades,
  getIncapacidadesByCedula,
  getIncapacidadById,
  updateIncapacidad,
  deleteIncapacidad
} from '../controllers/incapacidad.controller.js';

const router = express.Router();

// Rutas protegidas con autenticación
router.post('/api/incapacidades', authUser, createIncapacidad);
router.get('/api/incapacidades', authUser, getAllIncapacidades);
router.get('/api/incapacidades/cedula/:cedula', authUser, getIncapacidadesByCedula);
router.get('/api/incapacidades/:id', authUser, getIncapacidadById);
router.patch('/api/incapacidades/:id', authUser, updateIncapacidad);
router.delete('/api/incapacidades/:id', authUser, deleteIncapacidad);

export default router;
```

## Integración en app.js

```javascript
// app.js (agregar esta línea)
import incapacidadRoutes from './routes/incapacidad.routes.js';

// ... otras importaciones y middleware

// Rutas
app.use(incapacidadRoutes);
```

## Validaciones Adicionales

```javascript
// Validaciones personalizadas que puedes agregar al schema
incapacidadSchema.pre('save', function(next) {
  // Validar que la fecha de inicio no sea en el futuro
  if (this.fechaInicio > new Date()) {
    next(new Error('La fecha de inicio no puede ser en el futuro'));
  }
  
  // Validar que la fecha de fin no sea anterior a la fecha de inicio
  if (this.fechaFin <= this.fechaInicio) {
    next(new Error('La fecha de fin debe ser posterior a la fecha de inicio'));
  }
  
  // Calcular días automáticamente si no se proporciona
  if (!this.diasIncapacidad) {
    const diffTime = Math.abs(this.fechaFin.getTime() - this.fechaInicio.getTime());
    this.diasIncapacidad = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  
  next();
});
```

## Uso en el Frontend

El frontend ya está configurado para usar estos endpoints. Los métodos principales son:

- `POST /api/incapacidades` - Crear incapacidad
- `GET /api/incapacidades/cedula/:cedula` - Obtener incapacidades por cédula
- `PATCH /api/incapacidades/:id` - Actualizar incapacidad
- `DELETE /api/incapacidades/:id` - Eliminar incapacidad

## Campos del Schema

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| pacienteId | ObjectId | Sí | ID del paciente (referencia a User) |
| cedulaPaciente | String | Sí | Cédula del paciente |
| fechaInicio | Date | Sí | Fecha de inicio de la incapacidad |
| fechaFin | Date | Sí | Fecha de fin de la incapacidad |
| diasIncapacidad | Number | Sí | Número de días de incapacidad |
| diagnostico | String | Sí | Diagnóstico médico |
| tipoIncapacidad | String | No | Tipo de incapacidad (enum) |
| observaciones | String | No | Observaciones adicionales |
| estado | String | No | Estado de la incapacidad |
| creadoPor | ObjectId | Sí | ID del médico que creó la incapacidad | 