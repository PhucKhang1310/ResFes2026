import { FaEnvelope, FaFacebookF, FaPhone } from "react-icons/fa6";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <div
      id="footer"
      className="flex flex-col items-center bg-neutral scroll-mt-24"
    >
      <footer className="w-2/3 footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
        <aside>
          <img src={logo} className="w-1/3" />
          <div className="mt-3 font-bold text-2xl">
            Think bigger
            <p className="font-thin"> Build Smarter</p>
            <p className="text-4xl mt-3 font-medium">Join ResFes</p>
            <br />
            <div className="flex gap-5">
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScEo6HgWxAHJbjeiE2MoVAMRfM1ltmtt3hTJZ0cza6Pz4F1HQ/viewform"
                target="_blank"
                rel="noreferrer"
                className="btn mt-2 rounded-full border-0 bg-orange-600 px-8 text-white hover:bg-orange-600/90"
              >
                Register FPTers
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLScZllL6Ewl8_tId9eMffO2UgYer41U3_6LjW0-SmYNVi2ocnw/viewform"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline mt-2 rounded-full bg-transparent px-8 text-white hover:bg-amber-50 hover:text-black"
              >
                Register Non-FPTers
              </a>
            </div>
          </div>
        </aside>
        <nav className="justify-self-end">
          <h6 className="footer-title">Contact Us</h6>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.facebook.com/fpt.resfes"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition hover:text-orange-500"
            >
              <FaFacebookF className="text-lg" />
              <span>Follow us on Facebook</span>
            </a>
            <a
              href="mailto:resfes@fe.edu.vn"
              className="flex items-center gap-3 transition hover:text-orange-500"
            >
              <FaEnvelope className="text-lg" />
              <span>resfes@fe.edu.vn</span>
            </a>
            <a
              href="tel:+842465549806"
              className="flex items-center gap-3 transition hover:text-orange-500"
            >
              <FaPhone className="text-lg" />
              <span>(+84) 246.654.9806</span>
            </a>
          </div>
        </nav>
      </footer>
      <div className="flex w-full justify-center">
        <div className="divider w-2/3" />
      </div>
      <p className="font-thin opacity-40 text-sm pb-1">
        © 2026 Research Festival
      </p>
      <p className="font-thin opacity-40 text-sm pb-20">All rights reserved</p>
    </div>
  );
};
export default Footer;
