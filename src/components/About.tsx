import React from "react";

const About = () => {
  return (
    <div>
      <div className=" flex flex-col-reverse md:flex-row-reverse lg:flex-row items-center justify-between h-full md:h-full lg:h-screen w-full bg-gray-100 py-16 md:py-16 lg:py-20  px-5 md:px-10 lg:px-64">
        <div className=" h-full w-full flex flex-col items-center justify-center">
          <div className="mb-16">
            <p className="font-montserrat text-[#111111]">
              We are an impact DAO (cyber-charity) that develops software for all scientists.
            </p>
          </div>
          <div className="flex flex-col md:flex-row lg:flex-row items-center justify-between">
            <div className="flex flex-col items-start">
              <h1 className=" text-[#111111] font-opensans font-bold text-2xl pb-4 ">
                Our Mission
              </h1>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                {" "}
                We write software for science of the future.
                We enter into the epoch of decentralized science, with scientific grants on blockchain.
              </p>
            </div>
            <div className="flex flex-col items-start">
              <h1 className=" text-[#111111] font-opensans font-bold text-2xl pb-4 ">
                Our Vision
              </h1>
              <p className="font-montserrat text-[#111111] text-sm leading-7 mr-2">
                Every scientist (PhD and not) should receive a just and big salary in cryptocurrency.
                Basic science needs to be supported. Scientific publications need to be advertised.
              </p>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-start justify-center h-full w-full mb-8 md:mb-0 lg:mb-0 md:mr-20 lg:ml-20">
          <h1 className="text-[#111111] text-sm font-semibold pb-8 ">
            ABOUT US
          </h1>
          <p className="font-opensans font-bold text-[#111111] text-3xl md:text-4xl lg:text-4xl leading-relaxed mb-10 md:mb-24 lg:mb-24 ">
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
      </div>
    </div>
  );
};

export default About;
