/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const path = require('path');
const fs = require('fs');

module.exports = {

  principal: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let fotos = await Foto.find().sort("id")
    respuesta.view('pages/admin/principal', {fotos})
  },

  inicioSesion: async (peticion, respuesta) => {
    respuesta.view('pages/admin/inicio_sesion')
  },

  procesarInicioSesion: async (peticion, respuesta) => {
    const email = peticion.body.email
    const contrasena = peticion.body.contrasena
    let admin = await Admin.findOne({ email: email, contrasena: contrasena});
    if (admin) {
      if(admin.activo) {
        peticion.session.admin = admin
        peticion.session.cliente = undefined
        peticion.addFlash('mensaje', 'Sesión de admin iniciada')
        return respuesta.redirect("/admin/principal");
      }
      else {
        peticion.addFlash('mensaje', 'Administrador desactivado')
        return respuesta.redirect("/admin/inicio-sesion");
      }
    }
    else {
      peticion.addFlash('mensaje', 'Email o contraseña invalidos')
      return respuesta.redirect("/admin/inicio-sesion");
    }
  },

  cerrarSesion: async (peticion, respuesta) => {
    peticion.session.admin = undefined;
    peticion.addFlash('mensaje', 'Sesión admin finalizada')
    return respuesta.redirect("/");
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

  agregarFoto: async (peticion, respuesta) => {
    respuesta.view('pages/admin/agregar_foto')
  },

  procesarAgregarFoto: async (peticion, respuesta) => {
    let foto = await Foto.create({
      titulo: peticion.body.titulo,
      activa: true
    }).fetch()
    peticion.file('foto').upload({}, async (error,archivos) => {
      if (archivos && archivos[0]) {
        let upload_path = archivos[0].fd
        let extension = path.extname(upload_path)
        await fs.createReadStream(upload_path).pipe(fs.createWriteStream(path.resolve(sails.config.appPath, `assets/images/fotos/${foto.id}${extension}`)))
        await Foto.update(
          {id: foto.id},
          {contenido: `${foto.id}${extension}`}
        )
        peticion.addFlash('mensaje', 'Foto agregada')
        return respuesta.redirect("/admin/principal")
      }
      peticion.addFlash('mensaje', 'No hay foto seleccionada')
      return respuesta.redirect("/admin/agregar-foto")
    })
  },

  clientes: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let clientes = await Cliente.find().sort("nombre")
    //sails.log.debug(clientes)
    respuesta.view('pages/admin/clientes', {clientes})
  },

  ordenesClientes: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let ordenes = await Orden.find({cliente: peticion.params.clienteId }).sort('id desc')
    //sails.log.debug(ordenes)
    respuesta.view('pages/admin/ordenes_clientes', { ordenes })
  },

  fotosOrdenes: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let elementos = await OrdenDetalle.find({orden: peticion.params.ordenId}).populate('foto')
    //sails.log.debug(elementos)
    respuesta.view('pages/admin/fotos_ordenes', { elementos })
  },

  desactivarCliente: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    await Cliente.update({id: peticion.params.clienteId}, {activo: false})
    peticion.addFlash('mensaje', 'Cliente desactivado')
    return respuesta.redirect("/admin/clientes")
  },

  activarCliente: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    await Cliente.update({id: peticion.params.clienteId}, {activo: true})
    peticion.addFlash('mensaje', 'Cliente activado')
    return respuesta.redirect("/admin/clientes")
  },

  administradores: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let administradores = await Admin.find().sort('id')
    respuesta.view('pages/admin/administradores', {administradores})
  },

  desactivarAdmin: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    const admin_id = peticion.session.admin.id
    if(admin_id == peticion.params.adminId){
      peticion.addFlash('mensaje', 'Un administrador no se puede desactivar a si mismo')
    }
    else{
      await Admin.update({id: peticion.params.adminId}, {activo: false})
      peticion.addFlash('mensaje', 'Administrador desactivado')
    }
    return respuesta.redirect("/admin/administradores")
  },

  activarAdmin: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    await Admin.update({id: peticion.params.adminId}, {activo: true})
    peticion.addFlash('mensaje', 'Administrador activado')
    return respuesta.redirect("/admin/administradores")
  },

  dashboard: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let totalClientes = await Cliente.count()
    let totalAdministradores = await Admin.count()
    let totalFotos = await Foto.count()
    let totalOrdenes = await Orden.count()
    let total = {
      Clientes: totalClientes,
      Administradores: totalAdministradores,
      Fotos: totalFotos,
      Ordenes: totalOrdenes
    }
    //sails.log.debug(total)
    respuesta.view('pages/admin/dashboard', {total})
  },

  ordenes: async (peticion, respuesta) => {
    if(!peticion.session || !peticion.session.admin){
      peticion.addFlash('mensaje', 'Sesión inválida')
      return respuesta.redirect("/admin/inicio-sesion")
    }
    let ord = await Orden.find().sort('fecha').populate('cliente')
    let ordOrd = []
    ordOrd = ord.sort((a,b) => {
      if(a.cliente.id > b.cliente.id) return 1;
      if(a.cliente.id < b.cliente.id) return -1;
      return 0;
    })
    let ordenes = []
    ultimoClienteId = undefined
    ordOrd.forEach((orden) => {
      if(orden.cliente.id != ultimoClienteId) {
        ultimoClienteId = orden.cliente.id
        ordenes.push({
          cliente_id: orden.cliente.id,
          cliente: orden.cliente.nombre,
          compras: [],
        })
      }
      ordenes[ordenes.length-1].compras.push({
        id: orden.id,
        fecha: orden.fecha,
        total: orden.total
      })
    })
    respuesta.view('pages/admin/ordenes', {ordenes})
  },

};