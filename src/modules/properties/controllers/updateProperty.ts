import { Request, Response } from "express";
import Property from "../../../models/property.model";
import { imageUpload, videoUpload } from "../../../middleware/upload";
import fs from "fs";
import path from "path";


export const updateProperty = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    imageUpload(req, res, async (err: any) => {
      if (err) return res.status(400).json({ success: false, message: err.message });

      videoUpload(req, res, async (err: any) => {
        if (err) return res.status(400).json({ success: false, message: err.message });

        const updateData = req.body;
        let imagePaths = existingProperty.images;
        let videoPath = existingProperty.videos;

        // ✅ Delete previous images if new images are uploaded
        if (Array.isArray(req.files) && req.files.length > 0) {
          imagePaths.forEach((img) => fs.unlinkSync(path.join(__dirname, "../../../", img)));
          imagePaths = (req.files as Express.Multer.File[]).map((file) => file.path);
        }

        // ✅ Delete previous video if a new video is uploaded
        if (req.file) {
          if (videoPath) fs.unlinkSync(path.join(__dirname, "../../../", videoPath));
          videoPath = req.file.path;
        }

        const updatedProperty = await Property.findByIdAndUpdate(id, {
          ...updateData,
          images: imagePaths,
          videos: videoPath,
          updatedAt: Date.now(),
        }, { new: true });

        return res.status(200).json({ success: true, message: "Property updated successfully", data: updatedProperty });
      });
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};