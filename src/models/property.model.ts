import mongoose, { Document, Schema } from "mongoose";

// ✅ Define Interface for Property Document
export interface IProperty extends Document {
  title: string;
  description: string;
  propertyType: "Apartment" | "Villa" | "Independent House" | "Plot" | "Commercial" | "Office Space" | "Flat" | "Building" | "Duplex";
  price: {
    amount: number;
    currency?: string;
    negotiable?: boolean;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  };
  area: {
    size: number;
    unit?: string;
    carpetArea?: number;
    builtUpArea?: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    balconies?: number;
    furnishedStatus: "Unfurnished" | "Semi-Furnished" | "Fully Furnished";
    parking?: {
      available: boolean;
      type?: "Open" | "Covered";
    };
    floorNumber: number;
    totalFloors: number;
    facing?: "North" | "South" | "East" | "West" | "North-East" | "North-West" | "South-East" | "South-West";
  };
  amenities?: string[];
  nearby?: {
    hospitals?: string[];
    schools?: string[];
    malls?: string[];
    transport?: string[];
  };
  images?: string[];
  videos?: string;
  owner: {
    name: string;
    contactNumber: string;
    email?: string;
    userType: "Owner" | "Agent" | "Builder";
    agencyName?: string;
  };
  availability: {
    status?: "Available" | "Sold" | "Rented";
    possessionDate?: Date;
  };
  legal?: {
    approvalStatus?: "Approved" | "Pending" | "Rejected";
  };
  listingType: "Sale" | "Rent";
  uploadedBy:{
   _user: Schema.Types.ObjectId;
   role: string;
  }
  totalViews: number;
  isHotSelling: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  listedAt?: Date;
  updatedAt?: Date;
}

// ✅ Define Schema
const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "Independent House", "Plot", "Commercial", "Office Space", "Flat", "Building", "Duplex"],
      required: true,
    },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      negotiable: { type: Boolean, default: false },
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    area: {
      size: { type: Number, required: true },
      unit: { type: String, default: "sq.ft" },
      carpetArea: { type: Number },
      builtUpArea: { type: Number },
    },
    features: {
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
      balconies: { type: Number, default: 0 },
      furnishedStatus: {
        type: String,
        enum: ["Unfurnished", "Semi-Furnished", "Fully Furnished"],
        required: true,
      },
      parking: {
        available: { type: Boolean, default: false },
        type: { type: String, enum: ["Open", "Covered"], default: "Open" },
      },
      floorNumber: { type: Number, required: true },
      totalFloors: { type: Number, required: true },
      facing: {
        type: String,
        enum: ["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"],
      },
    },
    amenities: {
      type: [String],
      enum: [
    "Lift", "Gym", "Swimming Pool", "Security", "Power Backup",
    "Clubhouse", "Children's Play Area", "Park", "Gas Pipeline", "WiFi",
    "CCTV", "Rainwater Harvesting", "Fire Safety", "Jogging Track", 
    "Tennis Court", "Basketball Court", "Badminton Court", "Cricket Pitch", 
    "Amphitheater", "Yoga Room", "Spa", "Salon", "Indoor Games", 
    "Library", "Business Center", "Banquet Hall", "Guest Rooms", 
    "ATM", "Grocery Store", "Medical Facility", "Intercom", "Car Wash Area", 
    "EV Charging Station", "Barbecue Area", "Community Hall", "Temple", 
    "School Inside Premises", "Pet Friendly", "Laundry Service", "Water Softener",
    "24/7 Water Supply", "Solar Panels", "Waste Disposal", "Covered Parking"
  ],
      default: [],
    },
    nearby: {
      hospitals: { type: [String], default: [] },
      schools: { type: [String], default: [] },
      malls: { type: [String], default: [] },
      transport: { type: [String], default: [] },
    },
    images: { type: [String], default: [] }, // Array of image URLs
    videos: { type: String, default: '' }, // Video tour links
    owner: {
      name: { type: String, required: true },
      contactNumber: { type: String, required: true },
      email: { type: String },
      userType: {
        type: String,
        enum: ["Owner", "Agent", "Builder"],
        required: true,
      },
      agencyName: { type: String },
    },
    availability: {
      status: {
        type: String,
        enum: ["Available", "Sold", "Rented"],
        default: "Available",
      },
      possessionDate: { type: Date },
    },
    legal: {
      approvalStatus: {
        type: String,
        enum: ["Approved", "Pending", "Rejected"],
        default: "Pending",
      },
    },
    listingType: {
      type: String,
      enum: ["Sale", "Rent"],
      required: true,
    },
    uploadedBy:{
      _user:{
         type: Schema.Types.ObjectId,
         ref: "user"
      },
      role:{
         type: String,
      }
    },
    totalViews: {type: Number, default: 0},
    isHotSelling: {type: Boolean, default: false},
    isBlocked: {type: Boolean, default: false},
    isDeleted: {type: Boolean, default: false},
    listedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Create Model
const Property = mongoose.model<IProperty>("Property", PropertySchema);
export default Property;
