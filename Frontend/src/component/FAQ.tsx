import React, { useEffect } from "react";
import { FaRobot, FaCreditCard, FaPaintBrush, FaTruck } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const FaqSection = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const faqsLeft = [
    {
      icon: <FaRobot className="text-xl md:text-2xl" />,
      question: "How do I access AI?",
      answer: (
        <>
          Subscribe to our plans to unlock <strong>AI-powered</strong> tools,
          personalized recommendations, real-time assistance, and exclusive{" "}
          <strong>Customization</strong> mode to design your experience.
        </>
      ),
      delay: 300,
    },
    {
      icon: <FaCreditCard className="text-xl md:text-2xl" />,
      question: "How do I find my purchase history?",
      answer: (
        <>
          Log in and go to your account or purchase history page. View past
          purchases or orders and click to see more details.
        </>
      ),
      delay: 400,
    },
  ];

  const faqsRight = [
    {
      icon: <FaPaintBrush className="text-xl md:text-2xl" />,
      question: "What is Customization mode?",
      answer: (
        <>
          <strong>Customization</strong> mode lets you design your own jersey
          with colors, logos, and patterns of your choice. An active
          subscription is required to access this feature and unlock all premium
          design options.
        </>
      ),
      delay: 300,
    },
    {
      icon: <FaTruck className="text-xl md:text-2xl" />,
      question: "How long will my order take?",
      answer: (
        <>
          Delivery times depend on your location: <strong>Asia</strong> 5
          business days, <strong>Europe</strong> 7–10 days,{" "}
          <strong>North America</strong> 6–8 days, and other regions 10–15 days.
        </>
      ),
      delay: 400,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 md:py-24 pb-24 relative">
      <div className="text-center mb-12">
        <h2
          className="text-3xl md:text-4xl heading-shadow mb-4 font-sans font-bold text-gray-800 max-w-[90%] md:max-w-[450px] mx-auto"
          data-aos="zoom-in"
        >
          Common Questions About Our Services
        </h2>
        <p
          className="text-sm md:text-base lg:text-lg max-w-[90%] md:max-w-[650px] mx-auto text-gray-700"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          Find quick answers to the questions we receive most often from our
          users here to help you easily get started.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-12">
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-purple-300 transform -translate-x-1/2"></div>

        <div className="space-y-8 w-full text-center md:text-left md:pr-6 md:ml-auto md:max-w-[500px]">
          {faqsLeft.map((faq, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start gap-4"
              data-aos="zoom-in"
              data-aos-delay={faq.delay}
            >
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-purple-200 text-purple-500 rounded-full flex items-center justify-center">
                {faq.icon}
              </div>
              <div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-[20px] font-bold text-[#7f3ddb] leading-6 md:leading-5 faq-title">
                  {faq.question}
                </h3>
                <p className="faq-text text-gray-700 text-sm md:text-base w-full">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-8 w-full text-center md:text-left md:pl-6 md:mr-auto md:max-w-[480px]">
          {faqsRight.map((faq, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start gap-4"
              data-aos="zoom-in"
              data-aos-delay={faq.delay}
            >
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-purple-200 text-purple-500 rounded-full flex items-center justify-center">
                {faq.icon}
              </div>
              <div>
                <h3 className="mb-2 md:mb-3 text-lg md:text-[20px] font-bold text-[#7f3ddb] leading-6 md:leading-5 faq-title">
                  {faq.question}
                </h3>
                <p className="faq-text text-gray-700 text-sm md:text-base w-full">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-12 px-4 md:px-0">
        <p className="bg-[#f1e6fa] faq-text inline-block px-6 py-3 rounded-full text-gray-700 text-md md:text-md border border-zinc-200 shadow-lg max-w-full break-words">
          Didn’t find the answer you’re looking for?{" "}
          <Link
            to="/contact"
            className="text-purple-600 font-semibold inline-flex items-center gap-2 hover:text-purple-800 hover:scale-105 transition-all duration-300"
          >
            CONTACT SUPPORT
          </Link>
        </p>
      </div>

      <style>{`
.heading-shadow {
  text-shadow: 2px 2px 6px rgba(72, 75, 200, 0.6);
}

@media (min-width: 768px) and (max-width: 1024px) {
  section {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  h2 {
    font-size: 2.25rem;
    max-width: 500px;
  }

  .faq-title {
    font-size: 18px;
    line-height: 1.4;
  }

  .faq-text {
    font-size: 15px;
    line-height: 1.6;
  }

  .faq-icon {
    width: 52px;
    height: 52px;
  }

  .faq-text.inline-block {
    font-size: 15px;
    padding: 12px 20px;
  }
}
`}</style>
    </section>
  );
};

export default FaqSection;
