import LayoutEffect from "@/components/LayoutEffect"
import SectionWrapper from "@/components/SectionWrapper"

const excelTemplateAdvantagesList = [
    {
      q: "What is the main advantage of using Excel Templates?",
      a: "The main advantage of using Excel Templates lies in providing a standardized format for data entry, analysis, and reporting. This ensures consistency across different users and departments.",
    },
    {
      q: "How do Excel Templates save time?",
      a: "Excel Templates save time by offering pre-designed structures for common tasks. Users don't need to create documents from scratch, especially for repetitive processes.",
    },
    {
      q: "Why do Excel Templates reduce errors?",
      a: "Standardized Excel Templates reduce the likelihood of errors, as users follow a predefined structure. This is crucial for critical calculations and reporting.",
    },
    {
      q: "In what way do Excel Templates enhance productivity?",
      a: "Excel Templates allow users to quickly populate data, enabling faster and more efficient completion of tasks. This is especially beneficial for tasks requiring periodic reporting.",
    },
    
    {
      q: "Why is a professional appearance important in Excel Templates?",
      a: "Excel Templates can be designed with a professional layout and formatting, enhancing the visual appeal of reports and presentations.",
    },
    {
      q: "What role does data validation play in Excel Templates?",
      a: "Excel Templates can include predefined data validation rules, ensuring that entered data meets specific criteria and maintaining data accuracy.",
    },
    {
      q: "How do Excel Templates improve data analysis?",
      a: "Excel Templates streamline data analysis by providing predefined structures and formulas, allowing users to perform consistent and accurate analyses.",
    },
    {
      q: "What is the impact of Excel Templates on decision-making?",
      a: "Excel Templates contribute to informed decision-making by presenting data in a structured and easily understandable format, aiding in the decision-making process.",
    },
    {
      q: "Can Excel Templates be customized for specific needs?",
      a: "Yes, Excel Templates are highly customizable, allowing users to tailor them to specific requirements, ensuring flexibility for various business processes.",
    },
    // Add more questions and answers as needed
  ];
  
  

const FAQs = () => (
    <SectionWrapper id="faqs">
        <div className="custom-screen text-gray-300">
            <div className="max-w-xl text-center xl:mx-auto">
                <h2 className="text-gray-50 text-3xl font-extrabold sm:text-4xl">
                    Everything you need to know
                </h2>
                <p className="mt-3">
                Using Excel templates and macros in advanced Excel provides several advantages, offering efficiency</p>
            </div>
            <div className='mt-12'>
                <LayoutEffect
                    className="duration-1000 delay-300"
                    isInviewState={{
                        trueState: "opacity-1",
                        falseState: "opacity-0 translate-y-12"
                    }}
                >
                    <ul className='space-y-8 gap-12 grid-cols-2 sm:grid sm:space-y-0 lg:grid-cols-3'>
                        {excelTemplateAdvantagesList.map((item, idx) => (
                            <li
                                key={idx}
                                className="space-y-3"
                            >
                                <summary
                                    className="flex items-center justify-between font-semibold text-gray-100">
                                    {item.q}
                                </summary>
                                <p
                                    dangerouslySetInnerHTML={{ __html: item.a }}
                                    className='leading-relaxed'>
                                </p>
                            </li>
                        ))}
                    </ul>
                </LayoutEffect>
            </div>
        </div>
    </SectionWrapper>
)

export default FAQs