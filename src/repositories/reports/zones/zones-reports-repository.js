import { TopSalesZone } from '../../../models/reports/zones/top-sales-zone.js'
import { LeastSalesZone } from '../../../models/reports/zones/least-sales-zone.js'

export const retrieveTopSalesZone = async () => {
  try {
    return await TopSalesZone.findAll({
      attributes: [
        'zone_name',
        'total_sales',
        'total_sales_count'
      ]
    })
  } catch (error) {
    console.error('Error retrieving top sales zone:', error)
    throw error
  }
}

export const retrieveLeastSalesZone = async () => {
  try {
    return await LeastSalesZone.findAll({
      attributes: [
        'zone_name',
        'total_sales',
        'total_sales_count'
      ]
    })
  } catch (error) {
    console.error('Error retrieving least sales zone:', error)
    throw error
  }
}
