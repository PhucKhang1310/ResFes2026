type RegisterButtonsProps = {
  className?: string;
};

const fptRegisterUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLScEo6HgWxAHJbjeiE2MoVAMRfM1ltmtt3hTJZ0cza6Pz4F1HQ/viewform";
const nonFptRegisterUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLScZllL6Ewl8_tId9eMffO2UgYer41U3_6LjW0-SmYNVi2ocnw/viewform";

const RegisterButtons = ({ className = "" }: RegisterButtonsProps) => {
  return (
    <div className={`flex gap-5 ${className}`.trim()}>
      <a
        href={fptRegisterUrl}
        target="_blank"
        rel="noreferrer"
        className="btn mt-8 rounded-full border-0 bg-orange-600 px-8 text-white hover:bg-orange-600/90"
      >
        Register FPTers
      </a>
      <a
        href={nonFptRegisterUrl}
        target="_blank"
        rel="noreferrer"
        className="btn btn-outline mt-8 rounded-full bg-transparent px-8 text-white hover:bg-white hover:text-black"
      >
        Register Non-FPTers
      </a>
    </div>
  );
};

export default RegisterButtons;
