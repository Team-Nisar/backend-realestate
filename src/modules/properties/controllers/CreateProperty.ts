import { Request, Response } from "express";
import Property from "../../../models/property.model";
import { imageUpload, videoUpload } from "../../../middleware/upload";

// ✅ Create Property Controller
export const createProperty = async (req: Request, res: Response): Promise<any> => {
  try {
      const id = req.user?._id;
      const role = req.user?.role;
      if(!id && !role){
         return res.status(400).json({message: 'Something Wrong!'})
      }
    imageUpload(req, res, async (err: any) => {
      if (err) return res.status(400).json({ success: false, message: err.message });

      videoUpload(req, res, async (err: any) => {
        if (err) return res.status(400).json({ success: false, message: err.message });

        const {
          title, description, propertyType, price, location, area, features, amenities,
          nearby, owner, availability, legal, listingType, uploadedBy,
        } = req.body;

        if (!title || !description || !propertyType || !price || !location || !area || !features || !owner || !listingType || !uploadedBy) {
          return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const imagePaths = req.files ? (req.files as Express.Multer.File[]).map((file) => file.path) : [];
        const videoPath = req.file ? req.file.path : undefined;

        const newProperty = new Property({
          title,
          description,
          propertyType,
          price: { amount: price.amount, currency: price.currency || "INR", negotiable: price.negotiable || false },
          location,
          area,
          features,
          amenities: amenities || [],
          nearby: nearby || {},
          images: imagePaths,
          videos: videoPath ? videoPath : '',
          owner,
          availability,
          legal,
          listingType,
          uploadedBy:{
            _user: id,
            role: role
          },
          totalViews: 0,
          isHotSelling: false,
          isBlocked: false,
          isDeleted: false,
        });

        await newProperty.save();
        return res.status(201).json({ success: true, message: "Property created successfully", data: newProperty });
      });
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};