interface BtnProp{
    label:string,
    onClick: () => void
    className:string
}

const Button = ({label, onClick, className}:BtnProp) => {
    return(
        <button className={className} onClick={onClick}>{label}</button>
    )
}

export default Button