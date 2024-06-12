const SectionWrapper = ({ children, ...props }) => (
    <section {...props} className={`py-8 lg:py-6 ${props.className || ""}`}>
        {children}
    </section>
)

export default SectionWrapper