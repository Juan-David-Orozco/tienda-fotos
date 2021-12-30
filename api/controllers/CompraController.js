/**
 * CompraController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  agregarCarroCompra: async (peticion, respuesta) => {
    const foto_id = peticion.params.fotoId;
    const cliente_id = peticion.session.cliente.id;
    let foto = await CarroCompra.findOne({foto: foto_id, cliente: cliente_id})
    if (foto) {
      peticion.addFlash('mensaje', 'La foto ya habia sido agregada al carro de compra')
    }
    else { 
      await CarroCompra.create({
        cliente: cliente_id,
        foto: foto_id
      })
      peticion.session.carroCompra = await CarroCompra.find({cliente: cliente_id})
      peticion.addFlash('mensaje', 'Foto agregada al carro de compra')
    }
    return respuesta.redirect("/")
  },

};

