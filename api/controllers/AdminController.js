/**
 * SesionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path');
const fs = require('fs');

module.exports = {

  inicioSesion: async (peticion, respuesta) => {
    respuesta.view('pages/admin/inicio_sesion')
  },

  procesarInicioSesion: async (peticion, respuesta) => {
    const email = peticion.body.email
    const contrasena = peticion.body.contrasena
    let admin = await Admin.findOne({ email: email, contrasena: contrasena});
    if (admin) {
      peticion.session.admin = admin
      peticion.session.cliente = undefined
      peticion.addFlash('mensaje', 'Sesión de admin iniciada')
      return respuesta.redirect("/admin/principal");
    }
    else {
      peticion.addFlash('mensaje', 'Email o contraseña invalidos')
      return respuesta.redirect("/admin/inicio-sesion");
    }
  },

  principal: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let fotos = await Foto.find()
    respuesta.view('pages/admin/principal', {fotos})
  },

  clientes: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let clientes = await Cliente.find()
    respuesta.view('pages/admin/clientes', {clientes})
  },

  ordenesClientes: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let ordenes = await Orden.find({cliente: peticion.params.clienteId })
    sails.log.debug(ordenes)
    return respuesta.view('pages/admin/ordenes_clientes', { ordenes })
    //if (!ordenCliente) {
    //  return respuesta.redirect("/admin/clientes")
    //}
  },

  cerrarSesion: async (peticion, respuesta) => {
    peticion.session.admin = undefined;
    peticion.addFlash('mensaje', 'Sesión admin finalizada')
    return respuesta.redirect("/");
  },

  agregarFoto: async (peticion, respuesta) => {
    respuesta.view('pages/admin/agregar_foto')
  },

  procesarAgregarFoto: async (peticion, respuesta) => {
    let foto = await Foto.create({
      titulo: peticion.body.titulo,
      activa: false
    }).fetch()
    peticion.file('foto').upload({}, async (error,archivos) => {

      if (archivos && archivos[0]) {
        let upload_path = archivos[0].fd
        let extension = path.extname(upload_path)

        await fs.createReadStream(upload_path).pipe(fs.createWriteStream(path.resolve(sails.config.appPath, `assets/images/fotos/${foto.id}${extension}`)))
        await Foto.update(
          {id: foto.id},
          {contenido: `${foto.id}${extension}`, activa: true}
        )
        peticion.addFlash('mensaje', 'Foto agregada')
        return respuesta.redirect("/admin/principal")
      }
      peticion.addFlash('mensaje', 'No hay foto seleccionada')
      return respuesta.redirect("/admin/agregar-foto")

    })
  },

  desactivarFoto: async (peticion, respuesta) => {
    await Foto.update({id: peticion.params.fotoId}, {activa: false})
    peticion.addFlash('mensaje', 'Foto desactivada')
    return respuesta.redirect("/admin/principal")
  },

  activarFoto: async (peticion, respuesta) => {
    await Foto.update({id: peticion.params.fotoId}, {activa: true})
    peticion.addFlash('mensaje', 'Foto activada')
    return respuesta.redirect("/admin/principal")
  },

};