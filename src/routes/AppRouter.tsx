import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import LibraryApp from '../LibraryApp';
import PublicHomePage from '../pages/PublicHomePage';
import { AccountBoundary, AdminGuard } from '../components/AccountBoundary';
import AdminLayout from '../layouts/AdminLayout';
import AdminPage from '../pages/AdminPage';
import { memberRoutes, adminRoutes } from './paths';
import PublicCollectionPage from '../pages/PublicCollectionPage';
import PublicBookPage from '../pages/PublicBookPage';
import ContentLandingPage from '../pages/ContentLandingPage';
import AdminContentPage from '../pages/AdminContentPage';
import ContentDetailPage from '../pages/ContentDetailPage';
export default function AppRouter() {
 return <BrowserRouter><Routes>
   <Route path="/" element={<PublicHomePage />} />
   <Route path="/koleksi" element={<PublicCollectionPage />} />
   <Route path="/koleksi/:bookSlug" element={<PublicBookPage />} />
   <Route path="/artikel" element={<ContentLandingPage type="artikel" />} />
   <Route path="/artikel/:contentSlug" element={<ContentDetailPage type="artikel" />} />
   <Route path="/pengumuman" element={<ContentLandingPage type="pengumuman" />} />
   <Route path="/pengumuman/:contentSlug" element={<ContentDetailPage type="pengumuman" />} />
   <Route path="/kreasi" element={<ContentLandingPage type="kreasi" />} />
   <Route path="/kreasi/:contentSlug" element={<ContentDetailPage type="kreasi" />} />
   <Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} />
   <Route path="/app" element={<AccountBoundary />} />
   <Route path="/app/:username" element={<AccountBoundary />}>
     {memberRoutes.map(path => <Route key={path} path={path} element={<LibraryApp />} />)}
     <Route element={<AdminGuard />}><Route element={<AdminLayout />}>
       <Route path="unggah-artikel" element={<AdminContentPage />} />
       {adminRoutes.filter(([path, , superOnly]) => !superOnly && path !== 'unggah-artikel').map(([path]) => <Route key={path} path={path} element={<AdminPage />} />)}
       <Route element={<AdminGuard superOnly />}>{adminRoutes.filter(([, , superOnly]) => superOnly).map(([path]) => <Route key={path} path={path} element={<AdminPage />} />)}</Route>
     </Route></Route>
   </Route>
   <Route path="*" element={<div className="p-8"><h1>Halaman tidak ditemukan</h1><Link to="/app">Kembali ke aplikasi</Link></div>} />
 </Routes></BrowserRouter>;
}
