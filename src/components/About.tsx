import React from "react";

const About = () => {
  return (
    <div>
      <div className="w-full bg-gray-100 py-16 md:py-16 lg:py-20  px-5 md:px-10 lg:px-64">
        <div className="flex flex-col items-start justify-center h-full w-full md:w-[50%] mb-8 md:mb-8 lg:mb-8 md:mr-20 lg:ml-20">
          <h1 className="text-[#111111] text-sm font-semibold pb-8 ">
            ABOUT US
          </h1>
          <p className="font-opensans font-bold text-[#111111] text-3xl md:text-4xl lg:text-4xl leading-relaxed mb-10 md:mb-4 lg:mb-4">
            We Believe that we can save science with you. Help in our Cause
          </p>
          <a
            href="#top"
            className=" flex items-center justify-center h-11 w-44 bg-red-700 transition ease-out duration-700 rounded text-white font-montserrat text-sm transform scale-100 hover:scale-110  "
          >
            {" "}
            Donate Now
          </a>
        </div>

        <div className="h-full w-full flex flex-col items-center justify-center">
          <div className="mb-16">
            <p className="font-montserrat text-[#111111]">
              We are an impact DAO (cyber-charity) that develops software for
              all scientists.
            </p>
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row items-top justify-between">
            <div className="flex flex-col items-start">
              <h1 className=" text-[#111111] font-opensans font-bold text-2xl pb-4 ">
                Request for Funding – Support Science DAO's Vision through
                Crypto Donations
              </h1>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                Science DAO is a <strong>crypto charity</strong> that invites
                you to join us in our mission to revolutionize the world of
                science through decentralized governance and innovative funding
                mechanisms. We are reaching out to the crypto community,
                individuals, and organizations alike, to contribute and donate
                crypto to our cause, fostering positive change and making a
                lasting impact on scientific research and discovery.
              </p>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                By choosing to <strong>donate to charity with crypto</strong>,
                you become an essential catalyst for progress and transformation
                within the scientific community. Science DAO understands the
                power of cryptocurrencies and their potential to revolutionize
                traditional funding models. Through your generous contributions,
                we can harness this disruptive technology to support
                groundbreaking projects, accelerate scientific publishing, and
                promote open-access principles.
              </p>
              <h1 className=" text-[#111111] font-opensans font-bold text-2xl pb-4 ">
                Why <em>Crypto Donation</em>?
              </h1>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                Donating crypto to charity provides several advantages that
                align perfectly with Science DAO's vision. Firstly, crypto
                donations offer a secure and transparent transaction process,
                ensuring that your contributions reach their intended
                destination swiftly and without intermediaries. This
                transparency builds trust and ensures accountability, assuring
                donors that their support directly impacts scientific endeavors.
              </p>
              <h1 className=" text-[#111111] font-opensans font-bold text-2xl pb-4 ">
                How Your Crypto Donation Supports Science DAO.
              </h1>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                Your valuable crypto donations to Science DAO enable us to fund
                projects that improve the global scientific publication system,
                driving progress and innovation in scientific research. By
                investing in software documentation, document generator tools,
                and technical writing software, we empower scientists and
                researchers to disseminate their knowledge more efficiently,
                making scientific articles accessible to a wider audience.
              </p>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                Moreover, your support allows us to advocate for open-source
                collaboration and open-access principles. Science DAO believes
                that by removing barriers to knowledge, we can catalyze
                breakthroughs and accelerate the pace of scientific discovery.
                With your generous crypto donation, we can actively fund
                initiatives that promote open-source development, encourage
                collaboration, and foster a culture of inclusivity within the
                scientific community.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <h1 className=" text-[#111111] font-opensans font-bold text-2xl pb-4 ">
                How to Donate Crypto to Science DAO.
              </h1>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                Making a crypto donation to Science DAO is a simple and seamless
                process. Visit our website, where you will find the necessary
                information and instructions to make your contribution securely.
                We accept Gnosis Xdai and Gnosis tokens as part of our crypto
                donations.
              </p>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                By embracing the power of crypto charity, we can collectively
                drive positive change in the scientific landscape. Your crypto
                donation to Science DAO supports our vision of transforming
                scientific publishing, empowering open-source collaboration, and
                advocating for open access.
              </p>
              <h1 className=" text-[#111111] font-opensans font-bold text-2xl pb-4 ">
                Join Us on this Journey
              </h1>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                Together, let us forge a future where scientific knowledge is
                freely accessible, where innovation knows no bounds, and where
                the collective wisdom of the scientific community fuels
                progress. Your crypto donation to Science DAO has the power to
                make a tangible difference in the lives of researchers,
                scientists, and the broader global community.
              </p>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                <strong>Donate crypto to charity</strong> of Science DAO today
                and become an integral part of our mission to shape the future
                of scientific research and discovery. Together, we can unlock
                the immense potential of decentralized governance and{" "}
                <strong>charity-crypto</strong>-powered philanthropy to create a
                brighter future for science.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
