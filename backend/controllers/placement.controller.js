import Placement from "../models/placement.model.js";

export const allDrives = async (req, res) => {
  try {
    const placements = await Placement.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All drives fetched successfully",
      flag: true,
      placements,
    });
  } catch (error) {
    console.log("error in allDrives controller", error);
    return res.status(500).json({
      message: "Internal server error while fetching drives",
      flag: false,
    });
  }
};

export const newDrives = async (req, res) => {
  try {
    const { year, companies } = req.body;

    if (!year || !companies || companies.length === 0) {
      return res.status(400).json({
        message: "year and at least one company are required",
        flag: false,
      });
    }

    let placement = await Placement.findOne({ year });

    if (placement) {
      placement.companies.push(...companies);
      await placement.save();
    } else {
      placement = new Placement({
        year,
        companies,
      });
      await placement.save();
    }

    return res.status(201).json({
      message: "Drive created successfully",
      flag: true,
      placement,
    });
  } catch (error) {
    console.log("error in newDrives controller", error);
    return res.status(500).json({
      message: "Internal server error while creating drive",
      flag: false,
    });
  }
};

export const editDrives = async (req, res) => {
  try {
    const { placementId, companyId, placementStatus } = req.body;

    if (!placementId || !companyId || !placementStatus) {
      return res.status(400).json({
        message: "placementId, companyId, and placementStatus are required",
        flag: false,
      });
    }

    const placement = await Placement.findByIdAndUpdate(
      placementId,
      { "companies.$[elem].placementStatus": placementStatus },
      {
        arrayFilters: [{ "elem._id": companyId }],
        new: true,
        runValidators: true,
      },
    );

    if (!placement) {
      return res.status(404).json({
        message: "Placement not found",
        flag: false,
      });
    }

    return res.status(200).json({
      message: "Drive status updated successfully",
      flag: true,
      placement,
    });
  } catch (error) {
    console.log("error in editDrives controller", error);
    return res.status(500).json({
      message: "Internal server error while editing drive",
      flag: false,
    });
  }
};

export const deleteDrives = async (req, res) => {
  try {
    const { placementId, companyId } = req.body;

    if (!placementId || !companyId) {
      return res.status(400).json({
        message: "placementId and companyId are required",
        flag: false,
      });
    }

    const placement = await Placement.findByIdAndUpdate(
      placementId,
      { $pull: { companies: { _id: companyId } } },
      { new: true },
    );

    if (!placement) {
      return res.status(404).json({
        message: "Placement not found",
        flag: false,
      });
    }

    return res.status(200).json({
      message: "Company deleted successfully",
      flag: true,
      placement,
    });
  } catch (error) {
    console.log("error in deleteDrives controller", error);
    return res.status(500).json({
      message: "Internal server error while deleting drive",
      flag: false,
    });
  }
};
