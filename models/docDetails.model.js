const mongoose = require("mongoose");

const docDetailsSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    detailsId: {
      type: String,
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
          "NULL",
        ],
        default: "NULL",
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
          "NULL",
        ],
        default: "NULL",
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
          "NULL",
        ],
        default: "NULL",
      },
    ],
    diagnosticSpecialties: [
      {
        type: String,
        enum: ["radiology", "pathology", "laboratory-medicine", "NULL"],
        default: "NULL",
      },
    ],
    preventiveMedicine: [
      {
        type: String,
        enum: [
          "public-health",
          "occupational-medicine",
          "preventive-medicine",
          "NULL",
        ],
        default: "NULL",
      },
    ],
    emergencyMedicine: [
      {
        type: String,
        enum: ["emergency-medicine", "NULL"],
        default: "NULL",
      },
    ],
    specialtyAndSubspecialtyFields: [
      {
        type: String,
        enum: ["sports-medicine", "sleep-medicine", "pain-management", "NULL"],
        default: "NULL",
      },
    ],
    nonClinicalSpecialties: [
      {
        type: String,
        enum: [
          "medical-research",
          "medical-administration",
          "medical-education",
          "NULL",
        ],
        default: "NULL",
      },
    ],
    complementaryAndAlternativeMedicine: [
      {
        type: String,
        enum: ["integrative-medicine", "homeopathy", "NULL"],
        default: "NULL",
      },
    ],
    specializedAreas: [
      {
        type: String,
        enum: [
          "genetics",
          "cardio-vascular",
          "orthopedics",
          "homeopathy",
          "nureo-surgery",
          "transplant-surgery",
          "ear-nose-throat",
          "NULL",
        ],
        default: "NULL",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DocDetails", docDetailsSchema);
