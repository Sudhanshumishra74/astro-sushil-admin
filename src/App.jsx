import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/Layout";
// import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/auth/Login";
import AppToaster from "./components/common/AppToaster";
import ProfilePage from "./components/common/ProfilePage";
import ProductsPage from "./pages/products/ProductPage";
import BannersPage from "./pages/banners/Bannerpage";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import RequirePermission from "./routes/RequirePermission";
import Userlist from "./pages/users/Userlist";

import CourseList from "./pages/Course/Courselist";
import AddCourse from "./pages/Course/Addcourse";
import EditCourseWrapper from "./pages/Course/EditCourseWrapper";
import CategoryList from "./pages/category/Category";
import AddProduct from "./pages/products/Addproduct";
import EditProduct from "./pages/products/Editproduct";
import ViewProduct from "./pages/products/Viewproduct";
import BlogsPage from "./pages/Blogs/Blogspage";
import AddBlog from "./pages/Blogs/Addblog";
import EditBlog from "./pages/Blogs/Editblog";
import ViewBlog from "./pages/Blogs/Viewblog";
import Dashboard from "./pages/dashboard/Dashboardnew";
import ContactsPage from "./pages/cms/contact";
import TestimonialsPage from "./pages/cms/Testimonialspage";
import TransactionsPage from "./pages/cms/Transactionspage";
import GstReportPage from "./pages/cms/GstReportPage";
import WebsiteSettingsPage from "./pages/cms/Websitesettingspage";
import PrivacyPolicyPage from "./pages/cms/Privacypolicypage";
import TermsConditionsPage from "./pages/cms/Termsconditionspage";
import SeoPage from "./pages/cms/Seopage";
import ConsultationList from "./pages/Consultation/Consultationlist";
import SettingsPanel2 from "./pages/Setting/Settingspanel";
import BookingList from "./pages/Booking/Bookinglist";
import AvailabilitySettings from "./pages/Setting/Availabilitysettings";
import OrderDetail from "./pages/Orders/Orderdetail";
import OrderReports from "./pages/Orders/Orderreports";
import ReportOrders from "./pages/Reports/ReportOrders";
import CancellationRefundPolicy from "./pages/cms/CancellationRefundPolicy";
import ShippingDeliveryPolicy from "./pages/cms/ShippingDeliveryPolicy";
import ForgotPassword from "./pages/auth/ForgotPassword";
import FAQPage from "./pages/Faqpage/Faqpage";
import { Callender } from "./pages/Consultation/Calender";
import OrderList from "./pages/Orders/OrderList";
import ShippingPage from "./pages/Shippingpage/Shippingpage";
import MediaManager from "./pages/Media/Mediamanager";
import CouponList from "./pages/Coupons/Couponlist";
import ReportList from "./pages/Reports/ReportList";
import ReportForm from "./pages/Reports/ReportForm";
import RoleList from "./pages/Roles/Rolelist";
import StaffList from "./pages/Staff/Stafflist";
import AccessDenied from "./pages/errors/AccessDenied";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {/* Always reachable once logged in */}
            <Route path="403" element={<AccessDenied />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* Dashboard is never hard-guarded — it renders only the widgets
                the user has permission for, rather than 403ing on login. */}
            <Route index element={<Dashboard />} />

            <Route element={<RequirePermission permission="products.view" />}>
              <Route path="products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ViewProduct />} />
            </Route>
            <Route element={<RequirePermission permission="products.create" />}>
              <Route path="products/add" element={<AddProduct />} />
            </Route>
            <Route element={<RequirePermission permission="products.edit" />}>
              <Route path="products/edit/:id" element={<EditProduct />} />
            </Route>

            <Route element={<RequirePermission permission="blogs.view" />}>
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:id" element={<ViewBlog />} />
            </Route>
            <Route element={<RequirePermission permission="blogs.create" />}>
              <Route path="/blogs/add" element={<AddBlog />} />
            </Route>
            <Route element={<RequirePermission permission="blogs.edit" />}>
              <Route path="/blogs/edit/:id" element={<EditBlog />} />
            </Route>

            <Route element={<RequirePermission permission="banners.view" />}>
              <Route path="banners" element={<BannersPage />} />
            </Route>

            <Route element={<RequirePermission permission="orders.view" />}>
              <Route path="orders" element={<OrderList />} />
              <Route path="orders/:orderId" element={<OrderDetail />} />
            </Route>
            <Route element={<RequirePermission permission="orders.export" />}>
              <Route path="reports" element={<OrderReports />} />
            </Route>

            <Route element={<RequirePermission permission="reportOrders.view" />}>
              <Route path="report-orders" element={<ReportOrders />} />
            </Route>

            <Route element={<RequirePermission permission="transactions.view" />}>
              <Route path="transactions" element={<TransactionsPage />} />
            </Route>

            <Route element={<RequirePermission permission="gstReport.view" />}>
              <Route path="gst-report" element={<GstReportPage />} />
            </Route>

            <Route element={<RequirePermission permission="customers.view" />}>
              <Route path="customers" element={<Userlist />} />
            </Route>

            <Route element={<RequirePermission permission="courses.view" />}>
              <Route path="/courses" element={<CourseList />} />
              <Route path="/courses/edit/:id" element={<EditCourseWrapper />} />
            </Route>
            <Route element={<RequirePermission permission="courses.create" />}>
              <Route path="/courses/add" element={<AddCourse />} />
            </Route>

            <Route element={<RequirePermission permission="categories.view" />}>
              <Route path="/categories" element={<CategoryList />} />
            </Route>

            <Route element={<RequirePermission permission="contacts.view" />}>
              <Route path="/contacts" element={<ContactsPage />} />
            </Route>

            <Route element={<RequirePermission permission="testimonials.view" />}>
              <Route path="/testimonials" element={<TestimonialsPage />} />
            </Route>

            <Route element={<RequirePermission permission="consultations.view" />}>
              <Route path="/consultations" element={<ConsultationList />} />
            </Route>

            <Route element={<RequirePermission permission="bookings.view" />}>
              <Route path="/booking" element={<BookingList />} />
            </Route>

            <Route element={<RequirePermission permission="faqs.view" />}>
              <Route path="/faqs" element={<FAQPage />} />
            </Route>

            <Route element={<RequirePermission permission="orders.view" />}>
              <Route path="/shipping-delivery" element={<ShippingPage />} />
            </Route>

            <Route element={<RequirePermission permission="media.view" />}>
              <Route path="/media" element={<MediaManager />} />
            </Route>

            <Route element={<RequirePermission permission="coupons.view" />}>
              <Route path="/coupons" element={<CouponList />} />
            </Route>

            <Route element={<RequirePermission permission="pdfReports.view" />}>
              <Route path="/pdfreports" element={<ReportList />} />
            </Route>
            <Route element={<RequirePermission permission="pdfReports.create" />}>
              <Route path="/pdfreports/add" element={<ReportForm />} />
            </Route>
            <Route element={<RequirePermission permission="pdfReports.edit" />}>
              <Route path="/pdfreports/edit/:id" element={<ReportForm />} />
            </Route>

            <Route element={<RequirePermission permission="settings.view" />}>
              <Route path="/settings/website" element={<SettingsPanel2 />} />
            </Route>
            <Route element={<RequirePermission permission="availability.view" />}>
              <Route path="/global" element={<AvailabilitySettings />} />
              <Route path="/callender" element={<Callender />} />
            </Route>

            <Route element={<RequirePermission permission="settings.view" />}>
              <Route path="/settings/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/settings/terms-conditions" element={<TermsConditionsPage />} />
              <Route
                path="/settings/Cancellation-Refund-Policy"
                element={<CancellationRefundPolicy />}
              />
              <Route
                path="/settings/shipping-delivery-policy"
                element={<ShippingDeliveryPolicy />}
              />
            </Route>
            <Route element={<RequirePermission permission="seo.view" />}>
              <Route path="/settings/seo" element={<SeoPage />} />
            </Route>

            <Route element={<RequirePermission permission="roles.view" />}>
              <Route path="roles" element={<RoleList />} />
            </Route>
            <Route element={<RequirePermission permission="staff.view" />}>
              <Route path="staff" element={<StaffList />} />
            </Route>
          </Route>
        </Route>
      </Routes>
      <AppToaster />
    </BrowserRouter>
  );
}

export default App;
