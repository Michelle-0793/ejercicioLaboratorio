//Importación del fs
const fs = require('fs').promises;
const path = require('path');

//importación del archivo json
const archivoJson = path.join(__dirname, 'Usuarios.json');

///////////////////////////////  LEER EL ARCHIVO JSON  ///////////////////////////////
const leerJson = async () => {
  try {
      const data = await fs.readFile(archivoJson, 'utf8');
      return JSON.parse(data); //Convertir a JSON
  } catch (err) {
      console.error("Error al leer el archivo JSON", err);
      throw err; //Propagar el error para que sea capturado en el controlador
  }
};

///////////////////////////////  ESCRIBIR EL ARCHIVO JSON  ///////////////////////////////
const escribirJson = async (usuarios) => {
  try {
      await fs.writeFile(archivoJson, JSON.stringify(usuarios, null, 2), 'utf8');
      console.log("El archivo JSON ha sido modificado con éxito");
  } catch (err) {
      console.error("Error al escribir en el archivo JSON", err);
      throw err; //Propagar el error para que sea capturado en el constralador
  }
};

///////////////////////////////////////// GET /////////////////////////////////////////
  const getUsuarios = async (req, res) => {
    try {
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  };
  

///////////////////////////////////////// POST /////////////////////////////////////////
  const postUsuario = async (req, res) => {
    try {
      const { nombre, correo, cuentaIban, montoDisponible} = req.body;

      //Validar errores de sintáxis o falta de dato
      if (!nombre || !correo || !cuentaIban || !montoDisponible) {
        return res.status(400).json({ message: "Existe un error de sintáxis o falta algún atributo: 'nombre', 'descripcion', 'precio' o 'cantidadDisponible'." });
      }
  
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON

      //Agregar el nuevo producto
      const nuevoUsuario = {
        id: usuarios[usuarios.length -1].id + 1,
        nombre,
        correo,
        cuentaIban,
        montoDisponible
      };
  
      //Enviar el nuevo producto a la lista de usuarios
      usuarios.push(nuevoUsuario);

      //Y lo envío al JSON:
      await escribirJson (usuarios); 
      res.status(201).json(nuevoUsuario);

    //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error al agregar producto", error });
    }
  };
  

///////////////////////////////////////// PUT /////////////////////////////////////////
const updateUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, correo, cuentaIban, montoDisponible } = req.body;
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON
      const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(id));

      //Validar errores de sintáxis o falta de dato
      if (!nombre || !descripcion || !precio || !cantidadDisponible) {
        return res.status(400).json({ message: "Existe un error de sintáxis o falta algún atributo: 'nombre', 'descripcion', 'precio' o 'cantidadDisponible'." });
      }
  
      if (nombre) {
        usuarios[usuarioIndex].nombre = nombre;
      }
      if (descripcion) {
        usuarios[usuarioIndex].descripcion = descripcion;
      }
      if (precio) {
        usuarios[usuarioIndex].precio = precio;
      }
      if (cantidadDisponible) {
        usuarios[usuarioIndex].cantidadDisponible = cantidadDisponible;
      }
  
      await escribirJson (usuarios); //Envío el usuario actualizado al Json
      res.status(200).json({ message: "Usuario actualizado con éxito", usuario: usuarios[usuarioIndex] });
    
      //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };
  
///////////////////////////////////////// DELETE /////////////////////////////////////////
const deleteUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const usuarios = await leerJson(); //Traer los usuarios desde el JSON
      const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(id));
  
      //Validar que el usuario esté disponible
      if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      //Eliminar de la lista de usuarios
      usuarios.splice(usuarioIndex, 1);

      //Eliminar del archivo usuarios.json
      await escribirJson (usuarios); 

      res.status(200).json({ message: "Usuario eliminado correctamente." });

    //Capturar errores
    } catch (error) {
      res.status(500).json({ message: "Error interno del servidor", error });
    }
  };


///////////////Patch de Usuarios/////////////////////////////////////////////
  const patchUsuario = async (req, res) =>{
    try {
        const id = parseInt(req.params.id);
        const usuarios = await leerJson(); //Traer los usuarios desde el JSON
        const usuario= usuarios.find(item => item.id === id);
        const index= usuarios.indexOf(usuario)

        //////Object.assign(target, source(s))////////////////
        Object.assign(usuario, req.body); 
        usuarios[index]=usuario; 
        await escribirJson (usuarios); //Envío el usuario actualizado al Json
    } catch (error) {
        res.status(500).json({mensaje:'error interno en el servidor'})
    }
}

////////////// Get usuario by ID///////////////////////////////////

const getUsuarioById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const usuarios = await leerJson(); //Traer los usuarios desde el JSON
        const usuario= usuarios.find(item => item.id === id);
        // Envía la respuesta en formato JSON con el usuario
        res.json(usuario);
    } catch (error) {
        // Si ocurre un error, envía una respuesta con el estado 500 y un mensaje de error
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
};

  module.exports = {
    getUsuarios,
    postUsuario, 
    updateUsuario,
    deleteUsuario, 
    patchUsuario, 
    getUsuarioById
  };