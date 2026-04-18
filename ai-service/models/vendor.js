import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  bio: { type: String, maxlength: 1000 },
  website: String
})

const locationSchema = new mongoose.Schema({
  country: { type: String, required: true, default: 'India' },
  state: { type: String, required: true },
  city: { type: String, required: true },
  timezone: String
})

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' },
  yearsOfExperience: Number
})

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  minPrice: Number,
  maxPrice: Number,
  currency: { type: String, default: 'INR' },
  duration: String
})

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  projectUrl: String,
  technologies: [String],
  client: String,
  completedDate: Date
})

const vendorSchema = new mongoose.Schema({
  // Step 1: Basic Information (from VendorRegistrationPage)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  vendorType: { type: String, enum: ['individual', 'agency', 'startup', 'Individual', 'Company'], default: 'individual' },
  
  // Step 2: Skills (from VendorSkillsPage)
  skills: [skillSchema],
  
  // Step 3: Services (from VendorServicesPage)
  services: [serviceSchema],
  
  // Step 4: Portfolio (from VendorProjectsPage)
  portfolio: [portfolioItemSchema],
  
  // Step 5: Location & Availability (from VendorRegistrationPage + VendorAvailabilityPage)
  location: { type: locationSchema, required: true },
  availability: { type: String, enum: ['immediate', 'within_week', 'within_month', 'custom'], default: 'immediate' },
  availabilityStatus: { type: String, enum: ['available', 'busy', 'limited', 'unavailable'], default: 'available' },
  responseTime: String,
  workingHours: String,
  
  // Profile (from VendorRegistrationPage + VendorPreviewPage)
  profile: { type: profileSchema, default: {} },
  
  // Registration Status
  registration: {
    step: { type: Number, default: 1, min: 1, max: 5 },
    completed: { type: Boolean, default: false },
    lastCompletedStep: { type: Number, default: 0 }
  },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },
  
  // Timestamps
  lastActive: { type: Date, default: Date.now },
  profileCompletionDate: Date
}, { 
  timestamps: true 
})

// Indexes for better search performance
vendorSchema.index({ 'location.city': 1, 'location.state': 1 })
vendorSchema.index({ skills: 1 })
vendorSchema.index({ services: 1 })
vendorSchema.index({ isActive: 1, isVerified: 1 })
vendorSchema.index({ 'registration.completed': 1 })

export default mongoose.model('Vendor', vendorSchema)