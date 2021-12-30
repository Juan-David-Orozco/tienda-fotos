/**
 * SesionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  registro: async (peticion, respuesta) => {
    respuesta.view('pages/registro')
  },

  procesarRegistro: async (peticion, respuesta) => {

    let cliente = await Cliente.findOne({ email: peticion.body.email });
    sails.log.debug(cliente)
    if (cliente) {
      peticion.addFlash('mensaje', 'Email duplicado')
      return respuesta.redirect("/registro");
    }
    else{
      let cliente = await Cliente.create({
        email: peticion.body.email,
        nombre: peticion.body.nombre,
        contrasena: peticion.body.contrasena
      })
      peticion.session.cliente = cliente;
      sails.log.debug(peticion.session.cliente)
      peticion.addFlash('mensaje', 'Cliente registrado')
      return respuesta.redirect("/");
    }

  },

  inicioSesion: async (peticion, respuesta) => {
    respuesta.view('pages/inicio_sesion')
  },

  procesarInicioSesion: async (peticion, respuesta) => {
    const email = peticion.body.email
    const contrasena = peticion.body.contrasena
    let cliente = await Cliente.findOne({ email: email, contrasena: contrasena});
    if (cliente) {
      peticion.session.cliente = cliente; // Se guarda el cliente en el objeto session (express)
      sails.log.debug(cliente)
      let carroCompra = await CarroCompra.find({cliente: cliente.id})
      peticion.session.carroCompra = carroCompra
      peticion.addFlash('mensaje', 'Sesión iniciada')
      return respuesta.redirect("/");
    }
    else {
      peticion.addFlash('mensaje', 'Email o contraseña invalido')
      return respuesta.redirect("/inicio-sesion");
    }
  },

  cerrarSesion: async (peticion, respuesta) => {
    peticion.session.cliente = undefined;
    peticion.addFlash('mensaje', 'Sesión finalizada')
    return respuesta.redirect("/");
  },

};

