const Regulations = () => {
  return (
    <section
      id="regulations"
      className="bg-amber-50 px-6 py-20 text-black lg:px-10 scroll-mt-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-black lg:text-5xl">
            Regulations
          </h2>
          <div className="mt-3 font-thin text-sm text-black/70 lg:text-base">
            <p className="divider divider-neutral">
              Official rules and submission requirements for SRC 2026 (FPTU
              HCMC).
            </p>
          </div>
        </div>

        <div className="join join-vertical w-full rounded-2xl bg-amber-50 text-black shadow-xl">
          <div className="collapse collapse-arrow join-item border-b border-black/10 rounded-t-2xl">
            <input type="radio" name="regulations-accordion" defaultChecked />
            <div className="collapse-title text-xl font-bold">
              1. Eligible Participants
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Students from all majors at{" "}
                  <strong>FPT University HCMC</strong> are eligible.
                </li>
                <li>
                  The competition includes 5 sub-committees:
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>
                      Information Technology, Semiconductor IC and Digital
                      Automotive
                    </li>
                    <li>Graphic Design &amp; Multimedia Communication</li>
                    <li>Economics &amp; Business Administration</li>
                    <li>English Language</li>
                    <li>Japanese Language</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-b border-black/10">
            <input type="radio" name="regulations-accordion" />
            <div className="collapse-title text-xl font-bold">
              2. General Rules
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Teams can register as{" "}
                  <strong>individuals or groups (max 3 members/group)</strong>.
                </li>
                <li>
                  Each student can join up to <strong>2 research topics</strong>
                  .
                </li>
                <li>
                  Each topic can only join <strong>one sub-committee</strong>.
                </li>
                <li>
                  Topics that previously won awards at SRC or other FPTU HCMC
                  scientific research competitions are{" "}
                  <strong>not accepted</strong>.
                </li>
                <li>
                  There is normally <strong>no preliminary round</strong>; teams
                  that submit full papers on time can present directly at the
                  Final Round.
                </li>
                <li>
                  A preliminary screening round may be organized for any
                  sub-committee with{" "}
                  <strong>more than 25 registered topics</strong>.
                </li>
                <li>
                  Evaluation councils and rankings are established only for
                  sub-committees with <strong>at least 6 topics</strong>.
                </li>
                <li>
                  If a sub-committee has 4-5 topics, one council may still be
                  formed but only <strong>one award</strong> will be granted.
                </li>
                <li>
                  Teams must present at the Final Round and attend the closing
                  ceremony where results are announced.
                </li>
              </ul>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-b border-black/10 rounded-b-2xl">
            <input type="radio" name="regulations-accordion" />
            <div className="collapse-title text-xl font-bold">
              3. Submission Requirements
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Teams submit a <strong>full research paper</strong>.
                </li>
                <li>
                  Use IEEE/IEEE Word template, single-column format, maximum 10
                  A4 pages (excluding References and Appendices).
                </li>
                <li>
                  Citation style:
                  <ul className="mt-2 list-disc pl-5 space-y-1">
                    <li>
                      IEEE for Information Technology:{" "}
                      <a
                        href="https://libguides.murdoch.edu.au/IEEE/home"
                        target="_blank"
                        rel="noreferrer"
                        className="link link-primary"
                      >
                        Reference
                      </a>
                    </li>
                    <li>
                      APA for Economics, Languages, Multimedia Communication and
                      Digital Art/Design:{" "}
                      <a
                        href="https://libguides.murdoch.edu.au/APA/all"
                        target="_blank"
                        rel="noreferrer"
                        className="link link-primary"
                      >
                        Reference
                      </a>
                    </li>
                  </ul>
                </li>
                <li>Prepare presentation slides for the Final Round.</li>
                <li>
                  Presentation language (written and oral): English, or Japanese
                  for the Japanese Language sub-committee.
                </li>
                <li>
                  Full paper writing instructions: available in the official
                  guideline ("Xem tai day").
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Regulations;
