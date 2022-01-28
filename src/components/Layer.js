const Layer = ({ children, id, className }) => {
    return <div id={id} className={"pointer-events-none flex h-full w-full absolute " + className}>
        {children}
    </div>
}

export default Layer;