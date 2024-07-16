const mongoose = require("mongoose");

const docDetailsSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
      max: 75,
    },
    professionalCertificates: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    primaryCare: [
      {
        type: String,
        enum: [
          "family-medicine",
          "internal-medicine",
          "pediatrics",
          "geriatrics",
        ],
        default: "family-medicine",
      },
    ],
    surgicalSpecialties: [
      {
        type: String,
        enum: [
          "general-surgery",
          "orthopedic-surgery",
          "neurosurgery",
          "cardiothoracic-surgery",
          "plastic-surgery",
          "urology",
        ],
        default: "general-surgery",
      },
    ],
    internalMedicineSubspecialties: [
      {
        type: String,
        enum: [
          "general",
          "cardiology",
          "endocrinology",
          "gastroenterology",
          "hematology",
          "infectious-disease",
          "nephrology",
          "rheumatology",
        ],
        default: "general",
      },
    ],
    diagnosticSpecialties: [
      {
        type: String,
        enum: ["radiology", "pathology", "laboratory-medicine"],
        default: "radiology",
      },
    ],
    preventiveMedicine: [
      {
        type: String,
        enum: ["public-health", "occupational-medicine", "preventive-medicine"],
        default: "public-health",
      },
    ],
    emergencyMedicine: [
      {
        type: String,
        enum: ["emergency-medicine"],
        default: "emergency-medicine",
      },
    ],
    specialtyAndSubspecialtyFields: [
      {
        type: String,
        enum: ["sports-medicine", "sleep-medicine", "pain-management"],
        default: "sports-medicine",
      },
    ],
    nonClinicalSpecialties: [
      {
        type: String,
        enum: [
          "medical-research",
          "medical-administration",
          "medical-education",
        ],
        default: "medical-research",
      },
    ],
    complementaryAndAlternativeMedicine: [
      {
        type: String,
        enum: ["integrative-medicine", "homeopathy"],
        default: "integrative-medicine",
      },
    ],
    specializedAreas: [
      {
        type: String,
        enum: ["genetics", "transplant-surgery"],
        default: "genetics",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocDetails", docDetailsSchema);
