export default function SiteFooter() {
  return (
    <footer className="w-full footer footer-horizontal footer-center bg-black/55 text-white p-6 backdrop-blur-sm sm:p-10 ">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        
      </nav>
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by The Shine Company</p>
      </aside>
    </footer>
  );
}
