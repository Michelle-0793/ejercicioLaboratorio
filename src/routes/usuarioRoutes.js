const express = require('express');
const router = express.Router();
const usuarioControllers = require("../controllers/usuarioControllers");

//crud.
router.get('/', usuarioControllers.getUsuarios);
router.post('/', usuarioControllers.postUsuario);
router.update('/', usuarioControllers.updateUsuario);
router.delete('/', usuarioControllers.deleteUsuario);
router.patch('/', usuarioControllers.patchUsuario)



module.exports = router;