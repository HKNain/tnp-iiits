import { model, Schema } from "mongoose";

const placementSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    companies: [
      {
        companyName: {
          type: String,
          required: true,
          maxlength: 50,
        },
        placementStatus: {
          type: String,
          enum: [
            "interested",
            "notInterested",
            "dataSent",
            "followUp",
            "shortListRecieved",
            "confirmed",
          ],
          default: "interested",
        },
        companyEmail: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
          match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
          ],
        },
      },
    ],
  },
  { timestamps: true },
);

const Placement = model("Placement", placementSchema);

export default Placement;
