const Regulations = () => {
  return (
    <section
      id="regulations"
      className="bg-white px-6 py-20 text-black lg:px-10 scroll-mt-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-bold text-black lg:text-5xl">
            Regulations
          </h2>
          <div className="mt-3 font-thin text-sm text-black/70 lg:text-base">
            <p className="divider divider-neutral">
              Key rules and submission requirements for ResFes 2026.
            </p>
          </div>
        </div>

        <div className="join join-vertical w-full rounded-2xl bg-white text-black shadow-xl">
          <div className="collapse collapse-arrow join-item border-b border-black/10 rounded-t-2xl">
            <input type="radio" name="regulations-accordion" defaultChecked />
            <div className="collapse-title text-xl font-bold">
              1. Team Composition &amp; Eligibility
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Each team has <strong>no more than three (03) members</strong>
                  , including the team leader (individual performance is also
                  accepted).
                </li>
                <li>
                  Team members might be from the same or different
                  disciplines/departments.
                </li>
                <li>
                  Each member can only register for{" "}
                  <strong>one (01) research team</strong> only.
                </li>
              </ul>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-b border-black/10">
            <input type="radio" name="regulations-accordion" />
            <div className="collapse-title text-xl font-bold">
              2. Submission Requirements
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Each research topic can be registered under{" "}
                  <strong>only one sub-committee</strong>. The Board of
                  Reviewers will check for similarity and eligibility of all
                  submissions.
                </li>
                <li>
                  The official language for both{" "}
                  <strong>oral and written presentations</strong> is{" "}
                  <strong>English</strong>.
                </li>
                <li>
                  All submitted papers must follow the{" "}
                  <strong>ResFes 2026 mandatory format</strong>. Submissions
                  that do not meet the requirements will be{" "}
                  <strong>disqualified</strong>.
                </li>
                <li>
                  Presentation slides can follow a{" "}
                  <strong>free-style format</strong>.
                </li>
                <li>Turnitin similarity must not exceed 25%</li>
                <li>
                  Research teams must check their plagiarism on Turnitin before
                  submission (if possible)
                </li>
                <li>
                  Teams whose similarity index exceeds 25% will be disqualified
                  for the Preliminary Round or The Finale.
                </li>
              </ul>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-b border-black/10">
            <input type="radio" name="regulations-accordion" />
            <div className="collapse-title text-xl font-bold">
              3. Competition Rounds
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <div className="space-y-6">
                <div>
                  <h4 className="text-base font-bold text-black">
                    Round 1: Preliminary Round (Online Mode)
                  </h4>
                  <ul className="mt-3 list-disc pl-5 space-y-2">
                    <li>
                      Each team must submit their Proposal via the registration
                      link
                    </li>
                    <li>
                      For the Proposal Template, please access the provided{" "}
                      <a
                        href="https://docs.google.com/document/d/1ZotIDMEigdV3vwdZ6xt8UvOqfnJ1x3KF/edit?usp=sharing&ouid=113520801588464821299&rtpof=true&sd=truee"
                        target="_blank"
                        className="link link-primary"
                      >
                        Template
                      </a>
                      .
                    </li>
                    <li>
                      All research teams must comply with and sign in the
                      commitment on responsible usage of AI in their Proposal.
                    </li>
                    <li>
                      Research proposal format:
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Language: English</li>
                        <li>Paper size: A4</li>
                        <li>Layout: Single column</li>
                        <li>Font: Times New Roman, size 11</li>
                        <li>
                          Maximum length: 10 pages (excluding references and
                          appendices)
                        </li>
                      </ul>
                    </li>
                    <li>
                      For citations and references, please refer to:
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>
                          IEEE style should be applied for Information
                          Technology. For more details, please visit{" "}
                          <a
                            href="https://owl.purdue.edu/owl/research_and_citation/ieee_style/index.html"
                            target="_blank"
                            className="link link-primary"
                          >
                            IEEE Style Guidelines
                          </a>
                          .
                        </li>
                        <li>
                          APA style should be applied for Business
                          Administration, Linguistics, Multimedia Communication,
                          and Digital Arts &amp; Design. For more details,
                          please visit{" "}
                          <a
                            href="https://owl.purdue.edu/owl/research_and_citation/apa_style/index.html"
                            target="_blank"
                            className="link link-primary"
                          >
                            APA Style Guidelines
                          </a>
                          .
                        </li>
                      </ul>
                    </li>
                    <li>
                      Research teams with the highest scores in each
                      sub-committee will advance to the Finale.
                    </li>
                    <li>
                      Presentation time per team: 20 minutes
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>10-minute presentation</li>
                        <li>10-minute Q&amp;A</li>
                      </ul>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-base font-bold text-black">
                    Round 2: The Finale (On-Site at FPT University, Can Tho
                    Campus, Vietnam)
                  </h4>
                  <ul className="mt-3 list-disc pl-5 space-y-2">
                    <li>
                      Finalist teams must prepare and submit:
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>Full research paper</li>
                        <li>Presentation slides (mandatory)</li>
                        <li>Other visual aids (optional)</li>
                      </ul>
                    </li>
                    <li>
                      Presentation time per team: 30 minutes
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        <li>10-minute presentation</li>
                        <li>20-minute Q&amp;A</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="collapse collapse-arrow join-item border-b border-black/10 rounded-b-2xl">
            <input type="radio" name="regulations-accordion" />
            <div className="collapse-title text-xl font-bold">
              4. Full Paper Submission Guidelines
            </div>
            <div className="collapse-content text-sm leading-7 text-black/80">
              <span className="block text-black/70">To be updated soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Regulations;
