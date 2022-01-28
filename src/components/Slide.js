const Slide = ({ children, id, className }) => {
    return <div id={id} className={"pointer-events-none h-full w-full " + className}>
        {children}
    </div>
}

export default Slide;