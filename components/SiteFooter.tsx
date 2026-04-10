export default function SiteFooter() {
  return (
    <footer className="footer footer-horizontal footer-center bg-black text-white rounded p-6 sm:p-10 ">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <aside>
        <p>Copyright © {new Date().getFullYear()} - All right reserved by The Shine Company</p>
      </aside>
    </footer>
  );
}
