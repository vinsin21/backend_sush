# dams-backend

# Project Models Documentation

This documentation outlines the five main models used in the application, designed to be flexible and updatable based on the application's requirements. Each model is described with its fields, relationships, and purpose.

## Table of Contents

1. [UserModel](#usermodel)
2. [DocDetailModel](#docdetailmodel)
3. [TimeSlotModel](#timeslotmodel)
4. [BookingModel](#bookingmodel)
5. [PrescriptionModel](#prescriptionmodel)
6. [Additional Suggestions](#additional-suggestions)

## UserModel

Represents users with different roles in the system.

### Fields:

- **userId**: Unique identifier for the user.
- **name**: Name of the user.
- **email**: Email address of the user.
- **password**: Password for authentication.
- **otp**: Temporary OTP for verification.
- **role**: Role of the user. Possible values:
  - "USER"
  - "DOCTOR"
  - "ADMIN"

### Purpose:

This model is essential for handling authentication, authorization, and general user information across the application. The role field helps differentiate between different types of users and their access levels.

## DocDetailModel

Stores details specific to doctors.

### Fields:

- **docDetailId**: Unique identifier for the doctor's details.
- **userRef**: Reference to the user who is a doctor.
- **experience**: Number of years of experience.

### Purpose:

This model extends the user model specifically for doctors, providing additional details like experience. It helps in managing doctor-specific information that is not applicable to other user roles.

## TimeSlotModel

Manages the availability of doctors.

### Fields:

- **doctorRef**: Reference to the user who is a doctor.
- **availableFrom**: Date and time from which the doctor is available.
- **availableTo**: Date and time until which the doctor is available.
- **timeslots**: Array of time slots. Each time slot includes:
  - **from**: Start time of the time slot.
  - **to**: End time of the time slot.
  - **bookedByUser**: Reference to the user who booked the time slot.
- **sessionTimeInterval**: Duration of each session in minutes.

### Purpose:

This model helps in managing the availability and scheduling of doctor appointments. It allows for the creation of specific time slots that patients can book.

## BookingModel

Stores booking information.

### Fields:

- **bookingId**: Unique identifier for the booking.
- **customerRef**: Reference to the user who booked the appointment.
- **doctorRef**: Reference to the user who is a doctor.
- **fromTime**: Start time of the booking.
- **toTime**: End time of the booking.

### Purpose:

This model captures information about appointments booked by users with doctors. It links the user (customer) with the doctor and specifies the time period of the appointment.

## PrescriptionModel

Stores prescription details.

### Fields:

- **prescriptionId**: Unique identifier for the prescription.
- **customerRef**: Reference to the user who is the patient.
- **doctorRef**: Reference to the user who is the doctor.
- **prescription**: Detailed prescription text.

### Purpose:

This model is used to store medical prescriptions given by doctors to patients. It maintains a record of the prescribed medications or treatments, linking them to both the doctor and the patient.
