const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
	//Revisar si hay errores
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errores: errors.array() });
	}

	try {
		//Extraer el poruyecto y comprobar que existe
		const { proyecto } = req.body;

		const existeProyecto = await Proyecto.findById(proyecto);

		if (!existeProyecto) {
			return res.status(404).json({ msg: 'Proyecto no encontrado' });
		}

		//Revisar si el proyecto actual pertenece al usuario autenticado
		//Verificar el creador del proyecto
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
		}

		//Crear la tarea

		const tarea = new Tarea(req.body);
		tarea.save();
		res.json(tarea);
	} catch (error) {
		console.log(error);
		res.status(500).send('Hubo un error en el servidor');
	}
};

//obtener tareas
exports.obtenerTareas = async (req, res) => {
	try {
		//Extraer el poruyecto y comprobar que existe
		const { proyecto } = req.query;

		const existeProyecto = await Proyecto.findById(proyecto);

		if (!existeProyecto) {
			res.status(404).json({ msg: 'Proyecto no encontrado' });
			return;
		}

		//Revisar si el proyecto actual pertenece al usuario autenticado
		//Verificar el creador del proyecto

		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
			return;
		}
		// Obtener las tareas por proyecto
		const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
		res.json({ tareas });
		return;
	} catch (error) {
		console.log(error);
		res.status(500).send('Error en el servidor');
	}
};

//Actualizar estado de la tarea
exports.actualizarTarea = async (req, res) => {
	try {
		//Extraer el poruyecto y comprobar que existe
		const { proyecto, nombre, estado } = req.body;

		//Buscar la tarea a editar
		let tarea = await Tarea.findById(req.params.id);

		if (!tarea) {
			return res.status(404).json({ msg: 'Tarea no existe' });
			return;
		}

		//Extraer proyecto para saber si la persona que esta editando es el creador
		const existeProyecto = await Proyecto.findById(proyecto);
		if (!existeProyecto) {
			return res.status(404).json({ msg: 'Proyecto asociado a la tarea no encotrado' });
			return;
		}

		//Revisar si el proyecto actual pertenece al usuario autenticado
		//Verificar el creador del proyecto
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: 'No autorizado' });
			return;
		}

		//Crear un objeto con la nueva informacion
		const nuevaTarea = {};

		nuevaTarea.nombre = nombre;
		nuevaTarea.estado = estado;

		// actualizar la tarea
		tarea = await Tarea.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevaTarea }, { new: true });
		res.json(tarea);
		return;
	} catch (error) {
		console.log(error);
		res.status(500).send('Hubo un error');
	}
};

//Eliminnar una tarea

exports.eliminarTarea = async (req, res) => {
	try {
		//Extraer el poruyecto y comprobar que existe
		const { proyecto } = req.query;

		//Revisar el id
		let tarea = await Tarea.findById(req.params.id);
		//Si el poryecto existe o no
		if (!tarea) {
			return res.status(404).json({ msg: 'Tarea no encontrado' });
		}

		//Verificar el creador del proyecto
		if (tarea.proyecto.toString() !== proyecto) {
			return res.status(401).json({ msg: 'No autorizado' });
		}
		//Eliminar el proyecto
		await Tarea.findOneAndRemove({ _id: req.params.id });
		return res.json({ msg: 'Tarea Eliminada' });
	} catch (error) {
		console.log(error);
		res.status(500).send('Error en el servidor');
	}
};
