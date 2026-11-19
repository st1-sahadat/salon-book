<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

Layout & Page Structure
Navbar
Logo / Name: SalonBook
Public Routes
Home
Browse Services
Sign In
Sign Up
Authenticated Routes
Home
Salon Details Page
Dashboard (based on user role)
Profile Dropdown
User Name
Dashboard
Logout
Navbar content must update immediately after authentication state changes.
Footer
Must contain:
Logo and Short Description
Important Navigation Links
Salon Contact Information
Salon Address and Opening Hours
Social Media Links
Copyright Information
Main Pages
Public
Home
Browse Services
Sign In
Sign Up
Private
Salon Details Page (redirect to Sign In if unauthenticated)
Dashboard
Customer Dashboard
Overview
My Appointments
My Profile
Admin Dashboard
Overview
Manage Services
Add/Update Service
Manage Appointments
Manage Users
Transactions
My Profile
Users must not be able to access another role's dashboard by manually changing the URL.
Home Page
Banner Section
Include:
Title
Short Description
CTA Button (Explore Salon Services)
Salon-Themed Background Image
Dynamic Section 1
Featured Salon Services
Show at least 6 services from the database. Display only active services.
Card Data:
Service Image
Service Name
Category
Price
Duration
Short Description
View Details Button
Dynamic Section 2
Salon Service Categories
Display service categories. Users should be able to explore services by category.
Categories Examples:
Haircut & Styling
Hair Coloring
Hair Treatment
Facial & Skincare
Makeup
Manicure & Pedicure
Spa & Massage
Additional Sections
Implement extra 1 static/dynamic section on your own idea. You can take inspiration from similar websites.
Browse Services Page
Public page where customers can explore available salon services. Users can browse services without logging in.
Display active services from the database in a responsive card layout.
Card Data:
Service Image
Service Name
Category
Price
Duration
Short Description
View Details Button
Search & Filter & Sorting
Search Services by Name
Category-Based Filtering
Sort Services by Price 
Service Details Page (Protected)
Dynamic route:
/services/[id]
Display:
Service Name
Service Image
Category
Description
Price
Estimated Duration
Appointment Booking Option
Rules:
Customers must be authenticated to submit appointment requests.
Admins cannot submit customer appointment requests.
Invalid service IDs should show an appropriate error message.
Only active services are available for appointment booking.



Authentication System
Use Better Auth.
Sign Up
Fields:
Full Name
Email
Password
Profile Image (Upload Image/ Image URL)
Password Rules:
Minimum 6 characters
One uppercase letter
One lowercase letter
Features:
Email and Password Registration
Google Authentication
Success and Error Messages
Redirect to the appropriate page after registration
Security Note: Admin accounts must not be created through public registration. Admin access must be assigned securely.
Sign In
Fields:
Email
Password
Features:
Credential Login
Google Login
Success and Error Messages
After Login:
Redirect users according to their roles
Protected Routes
Protect all dashboard routes
Only Admin can access the Admin Dashboard
Only Customers can access the Customer Dashboard
Unauthenticated users must be redirected to the Sign In page
Blocked users must not access protected platform features
Role verification must also be implemented on the server. Hiding dashboard links on the frontend is not sufficient.
Dashboard Structure
Create a separate dashboard layout with a sidebar and main content area. Navigation must be based on the authenticated user's role.
Customer Dashboard
Dashboard Overview
Show:
Total Appointment Requests
Pending Appointments
Confirmed Appointments
Cancelled Appointments
My Appointments
Show all appointment requests submitted by the logged-in customer.
Show:
Service Name and Image
Service Category
Appointment Date
Appointment Time
Service Price
Appointment Status
Payment Status
Appointment Request Date
Customer can:
View Appointment Details
Cancel Pending Appointment Requests
Pay for Confirmed Appointments
View Payment Status

Rules:
Customers can only view their own appointments.
Customers cannot cancel an already confirmed or cancelled appointment.
Customers cannot pay for cancelled or pending appointments.
My Profile
Update profile information. See Profile Management section.
Admin Dashboard
Overview
Show:
Total Registered Customers
Total Active Services
Total Appointment Requests
Pending Appointments
Confirmed Appointments
Total Successful Payments
Manage Services
Admin can:
View All Services
Add New Services
Update Service Information
Delete Services
Activate or Deactivate Services
Only active services should be visible on the public Browse Services page and available for booking.

<!-- END:nextjs-agent-rules -->