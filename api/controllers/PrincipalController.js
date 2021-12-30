/**
 * PrincipalController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  inicio: async (peticion, respuesta) => {
    let fotos = await Foto.find({activa: true})
    respuesta.view('pages/inicio', {fotos})
  },


};

