import { Vendor } from '../models/index.js'

class LocationService {
  async searchLocations(query, limit = 10) {
    try {
      const locations = await Vendor.aggregate([
        { $match: { isActive: true } },
        { $group: { 
          _id: { 
            city: '$location.city', 
            state: '$location.state', 
            country: '$location.country' 
          },
          count: { $sum: 1 }
        }},
        { $match: { 
          '_id.city': { $regex: query, $options: 'i' } 
        }},
        { $sort: { count: -1 } },
        { $limit: limit }
      ])
      
      return locations.map(loc => ({
        city: loc._id.city,
        state: loc._id.state,
        country: loc._id.country,
        vendorCount: loc.count
      }))
    } catch (error) {
      console.error('Location search failed:', error)
      return []
    }
  }

  async getNearbyLocations(lat, lng, radius = 50, limit = 20) {
    try {
      const locations = await Vendor.aggregate([
        { $match: { isActive: true } },
        { $group: { 
          _id: { 
            city: '$location.city', 
            state: '$location.state', 
            country: '$location.country' 
          },
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: limit }
      ])
      
      return locations.map(loc => ({
        city: loc._id.city,
        state: loc._id.state,
        country: loc._id.country,
        vendorCount: loc.count
      }))
    } catch (error) {
      console.error('Nearby location search failed:', error)
      return []
    }
  }

  async getPopularCities(limit = 20) {
    try {
      const cities = await Vendor.aggregate([
        { $match: { isActive: true } },
        { $group: { 
          _id: { 
            city: '$location.city', 
            state: '$location.state', 
            country: '$location.country' 
          },
          count: { $sum: 1 }
        }},
        { $sort: { count: -1 } },
        { $limit: limit }
      ])
      
      return cities.map(city => ({
        city: city._id.city,
        state: city._id.state,
        country: city._id.country,
        vendorCount: city.count
      }))
    } catch (error) {
      console.error('Popular cities search failed:', error)
      return []
    }
  }
}

export default new LocationService() 