import {
  FaChartLine,
  FaFilm,
  FaLanguage,
  FaLaptopCode,
  FaPalette,
} from "react-icons/fa6";
import { useRef, useState } from "react";

const ResearchFields = () => {
  const [activeField, setActiveField] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleAccordionChange = (index: number) => {
    setActiveField(index);

    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        top: index * carouselRef.current.clientHeight,
        behavior: "smooth",
      });
    }
  };

  const handleCarouselScroll = () => {
    if (!carouselRef.current) {
      return;
    }

    const index = Math.round(
      carouselRef.current.scrollTop / carouselRef.current.clientHeight
    );

    if (index !== activeField) {
      setActiveField(index);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-10 pb-20 bg-black">
      <span className="mt-20 font-extrabold text-sm text-white flex gap-3">
        <svg
          viewBox="0 0 292.828 292.828"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
        >
          <polygon
            points="256.756,99.709 256.74,231.242 25.509,0 0,25.509 231.247,256.756 99.709,256.756 99.709,292.828 292.828,292.828 292.828,99.709"
            fill="#ffffff"
          />
        </svg>
        RESEARCH FIELDS
      </span>
      <div className="flex gap-10 mt-10 items-center">
        <div className="flex flex-1 justify-center w-3/4 h-full">
          <div className="join join-vertical bg-white rounded-2xl text-black">
            <div className="collapse collapse-arrow join-item border-base-300 border rounded-t-2xl">
              <input
                type="radio"
                name="research-fields-accordion"
                checked={activeField === 0}
                onChange={() => handleAccordionChange(0)}
              />
              <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none">
                <FaLaptopCode className="shrink-0 text-xl translate-y-px" />
                <span>Information Technology</span>
              </div>
              <div className="collapse-content font-thin">
                <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
                  <li>Automotive Technology</li>
                  <li>Artificial Intelligence</li>
                  <li>Software Engineering</li>
                  <li>Information System</li>
                  <li>Information Assurance</li>
                  <li>Applied Data Science</li>
                  <li>IC Design</li>
                  <li>Other related fields</li>
                </ul>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input
                type="radio"
                name="research-fields-accordion"
                checked={activeField === 1}
                onChange={() => handleAccordionChange(1)}
              />
              <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none">
                <FaPalette className="shrink-0 text-xl translate-y-px" />
                <span>Digital Art and Design</span>
              </div>
              <div className="collapse-content font-thin">
                <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
                  <li>Digital Art and Design</li>
                  <li>Graphic Design</li>
                  <li>Other related fields</li>
                </ul>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input
                type="radio"
                name="research-fields-accordion"
                checked={activeField === 2}
                onChange={() => handleAccordionChange(2)}
              />
              <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none">
                <FaFilm className="shrink-0 text-xl translate-y-px" />
                <span>Communication Technology</span>
              </div>
              <div className="collapse-content font-thin">
                <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
                  <li>Multimedia Communication</li>
                  <li>Public Relations</li>
                  <li>Integrated Marketing Communication</li>
                  <li>Brand Communication</li>
                  <li>Other related fields</li>
                </ul>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border">
              <input
                type="radio"
                name="research-fields-accordion"
                checked={activeField === 3}
                onChange={() => handleAccordionChange(3)}
              />
              <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none">
                <FaChartLine className="shrink-0 text-xl translate-y-px" />
                <span>Business Administration</span>
              </div>
              <div className="collapse-content font-thin">
                <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
                  <li>Marketing</li>
                  <li>International Business</li>
                  <li>Business Administration</li>
                  <li>Business Analytics</li>
                  <li>Logistics & Global Supply Chain Management</li>
                  <li>Fin-Tech</li>
                  <li>Law</li>
                  <li>Eco-Law</li>
                  <li>Other related fields</li>
                </ul>
              </div>
            </div>
            <div className="collapse collapse-arrow join-item border-base-300 border rounded-b-2xl">
              <input
                type="radio"
                name="research-fields-accordion"
                checked={activeField === 4}
                onChange={() => handleAccordionChange(4)}
              />
              <div className="collapse-title flex items-center gap-2 font-semibold text-xl leading-none">
                <FaLanguage className="shrink-0 text-xl translate-y-px" />
                <span>Linguistics</span>
              </div>
              <div className="collapse-content font-thin">
                <ul className="list-disc pl-5 whitespace-normal wrap-break-word">
                  <li>English</li>
                  <li>Korean</li>
                  <li>Chinese</li>
                  <li>Other related fields</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div
            ref={carouselRef}
            className="carousel carousel-vertical rounded-box h-[50vh]"
            onScroll={handleCarouselScroll}
          >
            <div className="carousel-item h-full">
              <div className="card w-[40vw] bg-black border-2 rounded-2xl">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">
                      Information Technology: Experimenting with Emerging
                      Technologies
                    </h2>
                  </div>
                  <ul className="flex flex-col mt-6 pl-5 font-thin text-lg gap-2 list-disc">
                    <h2 className="-ml-5 font-bold">What you'll do:</h2>
                    <li>
                      <span>
                        Student-led AI and data science research driven by
                        real-world problems
                      </span>
                    </li>
                    <li>
                      Prototyping intelligent applications through
                      research-based experimentation
                    </li>
                    <li>Cybersecurity experiments and ethical hacking labs</li>
                    <li>
                      IoT and edge AI systems developed through inquiry-based
                      learning
                    </li>
                    <li>Safe, responsible, and explainable AI research</li>
                    <li>
                      Quantum Machine Learning exploration through simulation
                      and hybrid models
                    </li>
                    <li>
                      Research-based design and evaluation of digital and
                      AI-oriented chips
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="carousel-item h-full">
              <div className="card w-[40vw] bg-black border-2 rounded-2xl">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">
                      Digital Art & Design: Design Thinking Informed by Research
                    </h2>
                  </div>
                  <ul className="flex flex-col mt-6 pl-5 font-thin text-lg gap-2 list-disc">
                    <li>Research-driven visual communication design</li>
                    <li>Human-AI co-creation in design studios</li>
                    <li>User-experience testing and evidence-based design</li>
                    <li>Cultural research in visual identity creation</li>
                    <li>Sustainable design experiments</li>
                    <li>Data, measurement in Design</li>
                    <li>
                      Emerging modalities and embodied experience (e.g. VR, XR,
                      ...)
                    </li>
                    <li>Service Design</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="carousel-item h-full">
              <div className="card w-[40vw] bg-black border-2 rounded-2xl">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">
                      Business Administration: Business Insight through Inquiry
                    </h2>
                  </div>
                  <ul className="flex flex-col mt-6 pl-5 font-thin text-lg gap-2 list-disc">
                    <li>Student research on digital business models</li>
                    <li>Data-driven market analysis projects</li>
                    <li>Startup experiments and lean validation research</li>
                    <li>Consumer behavior investigation</li>
                    <li>ESG and sustainability strategy research</li>
                    <li>Policy makers and economic developments</li>
                    <li>
                      Policy makers and ESG/Environmental/Green practices -
                      drivers and consequences
                    </li>
                    <li>
                      Stock market exchanges: implications for the authority
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="carousel-item h-full">
              <div className="card w-[40vw] bg-black border-2 rounded-2xl">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">
                      Communication Technology: Exploring Media Innovation
                    </h2>
                  </div>
                  <ul className="flex flex-col mt-6 pl-5 font-thin text-lg gap-2 list-disc">
                    <li>
                      Interactive & Immersive Storytelling (AR/VR, 360-degree
                      video, interactive narratives)
                    </li>
                    <li>Short-form Visual Communication</li>
                    <li>
                      AI-mediated Multimedia Communication (AI-generated
                      content, Human vs. AI communicator)
                    </li>
                    <li>Ethical & Responsible Multimedia Communication</li>
                    <li>Fake News, Visual Misinformation & Deepfakes</li>
                    <li>
                      CSR & Sustainability Communication in Multimedia Contexts
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="carousel-item h-full">
              <div className="card w-[40vw] bg-black border-2 rounded-2xl">
                <div className="card-body">
                  <div className="flex justify-between">
                    <h2 className="text-3xl font-bold">
                      Linguistics: Discovering Language through Inquiry
                    </h2>
                  </div>
                  <ul className="flex flex-col mt-6 pl-5 font-thin text-lg gap-2 list-disc">
                    <li>Corpus-based language research projects</li>
                    <li>Comparative linguistics</li>
                    <li>AI-assisted language learning experiments</li>
                    <li>Discourse analysis in digital communication</li>
                    <li>Translation studies using real datasets</li>
                    <li>Language and culture research in global contexts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResearchFields;
