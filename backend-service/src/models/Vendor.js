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

  // Rating aggregated from client feedback
  rating: {
    average: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  
  // Timestamps
  lastActive: { type: Date, default: Date.now },
  profileCompletionDate: Date
}, { 
  timestamps: true 
})

// Indexes for better search performance
vendorSchema.index({ email: 1 }, { unique: true })
vendorSchema.index({ 'location.city': 1, 'location.state': 1 })
vendorSchema.index({ skills: 1 })
vendorSchema.index({ services: 1 })
vendorSchema.index({ isActive: 1, isVerified: 1 })
vendorSchema.index({ 'registration.completed': 1 })

// Virtual for profile completion percentage
vendorSchema.virtual('profileCompletionPercentage').get(function() {
  const totalFields = 15 // Reduced total fields based on actual registration
  let completedFields = 0
  
  // Basic info (Step 1)
  if (this.name) completedFields++
  if (this.email) completedFields++
  if (this.phone) completedFields++
  if (this.password) completedFields++
  if (this.vendorType) completedFields++
  
  // Skills (Step 2)
  if (this.skills && this.skills.length > 0) completedFields += 2
  
  // Services (Step 3)
  if (this.services && this.services.length > 0) completedFields += 2
  
  // Location (Step 4)
  if (this.location.city) completedFields++
  if (this.location.state) completedFields++
  if (this.location.country) completedFields++
  if (this.availabilityStatus) completedFields++
  
  // Portfolio (Step 5)
  if (this.portfolio && this.portfolio.length > 0) completedFields += 2
  if (this.profile.bio) completedFields++
  
  return Math.round((completedFields / totalFields) * 100)
})

// Method to check if profile is complete
vendorSchema.methods.isProfileCompleted = function() {
  return this.registration.completed && this.registration.step === 5
}

// Method to get next incomplete step
vendorSchema.methods.getNextIncompleteStep = function() {
  if (!this.name || !this.email || !this.phone || !this.password) return 1
  if (!this.skills || this.skills.length === 0) return 2
  if (!this.services || this.services.length === 0) return 3
  if (!this.location.city || !this.location.state) return 4
  if (!this.profile.bio) return 5
  return 0 // All complete
}

export default mongoose.model('Vendor', vendorSchema)


