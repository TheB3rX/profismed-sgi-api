import { SalesItem } from '../../models/sales/sales-item.js'
import { Sales } from '../../models/sales/sales-model.js'
import { Product } from '../../models/products/product-model.js'
import { User } from '../../models/user/user-model.js'

/**
 * Guarda una nueva venta en la base de datos, incluyendo los elementos de la venta.
 *
 * @param {object} sale - Objeto que contiene los datos de la venta.
 * @param {number} sale.buyerId - ID del comprador.
 * @param {number} sale.sellerId - ID del vendedor.
 * @param {Array} sale.items - Lista de elementos de la venta, cada uno conteniendo información del producto.
 * @param {number} sale.items[].productId - ID del producto.
 * @param {number} sale.items[].productQuantity - Cantidad del producto en la venta.
 * @param {Date} sale.saleDate - Fecha de la venta.
 * @returns {Promise<boolean>} - Indica el éxito o fallo de la operación.
 */
export const saveSale = async (sale) => {
  const { buyerId, sellerId, items, saleDate } = sale
  let salesAmount = 0

  // Verificar que la venta tenga al menos un item
  if (!items || items.length === 0) {
    throw new Error('Sale must have at least one item')
  }

  // Verificar la existencia de comprador y vendedor
  const buyer = await User.findByPk(buyerId)
  const seller = await User.findByPk(sellerId)

  if (!buyer || !seller) {
    throw new Error('Buyer or seller not found')
  }
  if (buyer.roleId !== 3) {
    throw new Error('Invalid role for buyer')
  }

  if (seller.roleId !== 1 && seller.roleId !== 2) {
    throw new Error('Invalid role for seller')
  }

  if (buyerId === sellerId) {
    throw new Error('Buyer and seller cannot be the same user')
  }

  // Calcular el monto total de la venta y verificar stock de productos
  for (const item of items) {
    const { productId, productQuantity, unitPrice: itemUnitPrice } = item

    const product = await Product.findByPk(productId)
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`)
    }

    if (product.quantity < productQuantity) {
      throw new Error(`Not enough stock for product with ID ${productId}`)
    }

    const unitPrice = itemUnitPrice || product.productPrice
    const subtotal = productQuantity * unitPrice
    salesAmount += subtotal
  }

  // Crear la venta en la base de datos
  const newSale = await Sales.create({
    salesAmount,
    buyerId,
    sellerId,
    saleDate
  })

  // Guardar cada elemento de la venta y actualizar el stock del producto
  for (const item of items) {
    const { productId, productQuantity, unitPrice: itemUnitPrice } = item

    const product = await Product.findByPk(productId)
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`)
    }

    const unitPrice = itemUnitPrice || product.productPrice
    const subtotal = productQuantity * unitPrice

    await SalesItem.create({
      productId,
      productQuantity,
      unitPrice,
      subtotal,
      salesId: newSale.salesId
    })

    product.quantity -= productQuantity
    await product.save()
  }

  return true
}

/**
 * Recupera todas las ventas de la base de datos, incluyendo los elementos asociados a cada venta.
 *
 * @returns {Promise<object>} - Objeto que contiene todas las ventas, cada una con su lista de elementos.
 */
export const getSalesDb = async () => {
  try {
    const sales = await Sales.findAll()
    const salesWithItems = {}

    // Recuperar cada venta y sus elementos asociados
    for (const sale of sales) {
      const items = await SalesItem.findAll({
        where: {
          salesId: sale.salesId
        }
      })
      salesWithItems[sale.salesId] = {
        ...sale.dataValues,
        items
      }
    }
    return salesWithItems
  } catch (e) {
    console.error(e)
  }
}
